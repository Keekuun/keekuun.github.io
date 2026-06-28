import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { classifyIntent, type QueryIntent } from "@/lib/agent/router";

const intentSchema = z.object({
  intent: z.enum(["blog", "wiki", "chat"]),
  reason: z.string().optional(),
});

function createRouterModel() {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 DEEPSEEK_API_KEY");
  }
  return new ChatOpenAI({
    apiKey,
    model:
      process.env.DEEPSEEK_CHAT_MODEL ||
      process.env.OPENAI_CHAT_MODEL ||
      "deepseek-chat",
    temperature: 0,
    configuration: {
      baseURL:
        process.env.DEEPSEEK_BASE_URL ||
        process.env.OPENAI_BASE_URL ||
        "https://api.deepseek.com",
    },
  }).withStructuredOutput(intentSchema);
}

function getRouterMode(): "rules" | "auto" | "llm" {
  const mode = (process.env.AGENT_LLM_ROUTER || "auto").trim().toLowerCase();
  if (mode === "1" || mode === "true" || mode === "llm") return "llm";
  if (mode === "0" || mode === "false" || mode === "rules") return "rules";
  return "auto";
}

function isAmbiguous(ruleIntent: QueryIntent, text: string): boolean {
  const q = text.trim();
  if (!q) return false;
  if (ruleIntent === "chat" && (/[?？]/.test(q) || q.length > 12)) return true;
  if (ruleIntent === "blog" && /维基|wikipedia/i.test(q) && !/langchain|langgraph|博客|本站/i.test(q)) {
    return true;
  }
  return false;
}

async function classifyIntentWithLlm(text: string): Promise<QueryIntent> {
  const model = createRouterModel();
  const result = await model.invoke(
    `你是博客 AI 助手的路由器。根据用户问题选择意图：
- blog：问本站文章、系列教程、LangChain/LangGraph/Mastra、部署、Eval 等
- wiki：通用计算机/科学概念，需维基百科补充
- chat：打招呼、感谢、问助手能做什么等闲聊

用户问题：${text}`
  );
  return result.intent;
}

/** 规则 + 可选 LLM 结构化路由（LC16 withStructuredOutput） */
export async function resolveIntent(text: string): Promise<QueryIntent> {
  const ruleIntent = classifyIntent(text);
  const mode = getRouterMode();

  if (mode === "rules") return ruleIntent;
  if (mode === "llm") {
    try {
      return await classifyIntentWithLlm(text);
    } catch {
      return ruleIntent;
    }
  }

  if (!isAmbiguous(ruleIntent, text)) return ruleIntent;

  try {
    return await classifyIntentWithLlm(text);
  } catch {
    return ruleIntent;
  }
}

export function getRouterModeLabel(): "rules" | "auto" | "llm" {
  return getRouterMode();
}
