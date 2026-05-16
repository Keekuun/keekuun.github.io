#!/bin/bash

# Skills 批量安装脚本
set -e

echo "========================================="
echo "开始批量安装 Skills"
echo "========================================="

# 前端开发 - React/Next.js
echo "📦 安装前端开发 Skills..."
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y
npx skills add wshobson/agents@nextjs-app-router-patterns -g -y
npx skills add wshobson/agents@typescript-advanced-types -g -y

# Tailwind CSS
echo "📦 安装 Tailwind CSS Skills..."
npx skills add josiahsiegel/claude-plugin-marketplace@tailwindcss-advanced-layouts -g -y
npx skills add josiahsiegel/claude-plugin-marketplace@tailwindcss-animations -g -y
npx skills add josiahsiegel/claude-plugin-marketplace@tailwindcss-mobile-first -g -y

# 后端开发 - Go
echo "📦 安装后端开发 Skills..."
npx skills add manutej/luxor-claude-marketplace@golang-backend-development -g -y

# API 设计
echo "📦 安装 API 设计 Skills..."
npx skills add supercent-io/skills-template@api-design -g -y
npx skills add manutej/luxor-claude-marketplace@rest-api-design-patterns -g -y

# 数据库
echo "📦 安装数据库 Skills..."
npx skills add supercent-io/skills-template@database-schema-design -g -y
npx skills add neondatabase/agent-skills@neon-postgres -g -y
npx skills add wshobson/agents@database-migration -g -y

# 测试
echo "📦 安装测试 Skills..."
npx skills add anthropics/skills@webapp-testing -g -y
npx skills add supercent-io/skills-template@backend-testing -g -y
npx skills add supercent-io/skills-template@testing-strategies -g -y
npx skills add wshobson/agents@e2e-testing-patterns -g -y

# 部署与容器化
echo "📦 安装部署 Skills..."
npx skills add pluginagentmarketplace/custom-plugin-nodejs@docker-deployment -g -y

# UI/UX 设计
echo "📦 安装 UI/UX Skills..."
npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y
npx skills add supercent-io/skills-template@ui-component-patterns -g -y
npx skills add supercent-io/skills-template@design-system-patterns -g -y
npx skills add supercent-io/skills-template@responsive-design -g -y

# AI Agent 开发
echo "📦 安装 AI Agent Skills..."
npx skills add anthropics/skills@mcp-builder -g -y
npx skills add anthropics/skills@skill-creator -g -y

# 工程化与工作流
echo "📦 安装工程化 Skills..."
npx skills add obra/superpowers@test-driven-development -g -y

echo ""
echo "========================================="
echo "✅ 所有 Skills 安装完成！"
echo "========================================="
echo ""
echo "查看已安装的 Skills:"
npx skills ls -g
