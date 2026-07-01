import fs from 'node:fs';
import path from 'node:path';

const AI_DIR = path.resolve('docs/ai');
const AI_LAB_BASE = 'https://ai.zkkysqs.top';

function extractTitle(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const titleLine = match[1].split('\n').find((line) => line.startsWith('title:'));
  if (!titleLine) return null;
  return titleLine.replace(/^title:\s*/, '').trim();
}

function toTargetUrl(relativePath) {
  const withoutExt = relativePath.replace(/\.md$/, '');
  if (withoutExt === 'README') return `${AI_LAB_BASE}/`;
  if (withoutExt.endsWith('/README')) {
    const dir = withoutExt.slice(0, -'/README'.length);
    return `${AI_LAB_BASE}/${dir}/`;
  }
  return `${AI_LAB_BASE}/${withoutExt}`;
}

function walk(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full, rel));
    else if (entry.name.endsWith('.md')) files.push({ rel, full });
  }
  return files;
}

function buildStub(title, targetUrl) {
  return `---
title: ${title}
description: 本篇已迁移至 AI Lab（ai.zkkysqs.top）
date: 2026-07-01
categories:
- AI
tags:
- 已迁移
head:
  - - meta
    - http-equiv: refresh
      content: 3;url=${targetUrl}
---

# 内容已迁移

本篇完整内容已迁至 **[AI Lab](${AI_LAB_BASE})**。

👉 [立即前往阅读](${targetUrl})

约 3 秒后自动跳转…

---

> AI 系列笔记与项目统一收录于 [${AI_LAB_BASE}](${AI_LAB_BASE})
`;
}

const files = walk(AI_DIR);
for (const { rel, full } of files) {
  const original = fs.readFileSync(full, 'utf8');
  const title = extractTitle(original) || 'AI 笔记（已迁移）';
  const targetUrl = toTargetUrl(rel);
  fs.writeFileSync(full, buildStub(title, targetUrl), 'utf8');
  console.log(`${rel} -> ${targetUrl}`);
}

console.log(`\nWrote ${files.length} migration stubs.`);
