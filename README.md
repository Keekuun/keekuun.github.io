# keekuun's blog

[![Build and Deploy](https://github.com/Keekuun/keekuun.github.io/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/Keekuun/keekuun.github.io/actions/workflows/deploy.yml)
[![Open in GitHub](https://img.shields.io/github/last-commit/Keekuun/keekuun.github.io)](https://github.com/Keekuun/keekuun.github.io)

> 博客首页：https://blog.zkkysqs.top/  
> AI 笔记站：https://ai.zkkysqs.top/  
> 3D 笔记站：https://3d.zkkysqs.top/  
> 主站旧 `/ai/*`、`/3d/*` 链接需在 Cloudflare 配 301，见 [infra/cloudflare/blog-migration-redirects.md](infra/cloudflare/blog-migration-redirects.md)。  
> 本地开发：`pnpm install` → `pnpm docs:dev`；构建：`pnpm docs:build`。

### 博客知识库检索（RAG · Upstash + DeepSeek）

- 索引：`tools/rag`（Embedding 默认硅基流动 `BAAI/bge-m3`）
- 检索站：`apps/kb-search`（对话 DeepSeek，部署 Vercel）
- 说明见 [tools/rag/README.md](tools/rag/README.md)、[apps/kb-search/README.md](apps/kb-search/README.md)

![keekuun's GitHub stats](https://github-readme-stats.vercel.app/api?username=Keekuun&show_icons=true&theme=tokyonight&count_private=true&hide=contribs,prs)

[![keekuun's Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=keekuun&theme=tokyonight)](https://github.com/anuraghazra/github-readme-stats)
