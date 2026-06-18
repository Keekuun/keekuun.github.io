#!/usr/bin/env node
/**
 * 本地 Eval：对 golden.json 批量跑 RAG / Agent，关键词断言。
 * 用法：pnpm eval（需先 pnpm dev 或设 EVAL_BASE_URL）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const goldenPath = path.join(__dirname, "../eval/golden.json");
const baseUrl = process.env.EVAL_BASE_URL || "http://localhost:3010";
const password = process.env.BLOG_ASSISTANT_PASSWORD || process.env.KB_SEARCH_PASSWORD || "";

const cases = JSON.parse(fs.readFileSync(goldenPath, "utf8"));

function headers() {
  const h = { "Content-Type": "application/json" };
  if (password) {
    h["x-blog-assistant-password"] = password;
  }
  return h;
}

async function consumeSse(res) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let text = "";
  const tools = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const evt = JSON.parse(line.slice(6));
      if (evt.type === "token") text += evt.content;
      if (evt.type === "tool_start") tools.push(evt.name);
    }
  }
  return { text, tools };
}

async function runCase(item) {
  const endpoint =
    item.mode === "rag" ? "/api/rag/chat" : "/api/agent/chat";
  const body =
    item.mode === "rag"
      ? { query: item.message }
      : { message: item.message, threadId: crypto.randomUUID() };

  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return { id: item.id, pass: false, reason: `HTTP ${res.status}: ${err}` };
  }

  let answer = "";
  let tools = [];

  if (res.headers.get("content-type")?.includes("json")) {
    const data = await res.json();
    answer = data.answer || "";
  } else {
    const out = await consumeSse(res);
    answer = out.text;
    tools = out.tools;
  }

  const lower = answer.toLowerCase();
  const missing = (item.must_include || []).filter(
    (kw) => !answer.includes(kw) && !lower.includes(kw.toLowerCase())
  );

  if (missing.length > 0) {
    return {
      id: item.id,
      pass: false,
      reason: `缺少关键词: ${missing.join(", ")}`,
      answer: answer.slice(0, 200),
    };
  }

  if (item.should_call_tool && !tools.includes(item.should_call_tool)) {
    return {
      id: item.id,
      pass: false,
      reason: `未调用 Tool: ${item.should_call_tool}（实际: ${tools.join(",") || "无"}）`,
      answer: answer.slice(0, 200),
    };
  }

  return { id: item.id, pass: true };
}

console.log(`Eval base: ${baseUrl}`);
console.log(`Cases: ${cases.length}\n`);

const results = [];
for (const item of cases) {
  process.stdout.write(`· ${item.id} … `);
  try {
    const result = await runCase(item);
    results.push(result);
    console.log(result.pass ? "PASS" : `FAIL (${result.reason})`);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    results.push({ id: item.id, pass: false, reason });
    console.log(`FAIL (${reason})`);
  }
}

const passed = results.filter((r) => r.pass).length;
const threshold = Number(process.env.EVAL_PASS_THRESHOLD) || 0.8;
const rate = passed / results.length;

console.log(`\n通过 ${passed}/${results.length}（${(rate * 100).toFixed(0)}%）`);
console.log(`阈值 ${(threshold * 100).toFixed(0)}%`);

if (rate < threshold) {
  process.exit(1);
}
