# GitHub AI 流行库

> 持续更新的 GitHub 开源 AI 项目索引，按品类归类。每条包含英文简介与中文说明，便于快速选型。
>
> **最近更新：2026-05-21** · 趋势与周榜以 **2026 年** 为主（含 2026 年 5 月 9–15 日 GitHub 周增星 Top 20）

---

## 2026 年 5 月周榜热点（2026-05-09 ~ 2026-05-15）

本周 GitHub AI 相关仓库增速极快，**Agent Skills** 与 **Claude Code 工具链** 占 Top 20 约四成。下表按单周涨星排序，便于对照「此刻」社区在追什么。

| 排名 | 仓库 | 周涨星 | 一句话 |
|------|------|--------|--------|
| 1 | [mattpocock/skills](https://github.com/mattpocock/skills) | +1,618 | 工程向 Claude Code Skills（TDD、护栏、调试） |
| 2 | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | +1,332 | 可长期成长的记忆型 Agent（2026-02 大版本） |
| 3 | [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | +1,117 | Karpathy 式 AI 工程工作流 Skills 化 |
| 4 | [anthropics/financial-services](https://github.com/anthropics/financial-services) | +1,075 | Anthropic 金融领域 Agent 工具包 |
| 5 | [obra/superpowers](https://github.com/obra/superpowers) | +951 | Claude Code 能力增强与超能力脚本集 |
| 6 | [Hmbown/DeepSeek-TUI](https://github.com/Hmbown/DeepSeek-TUI) | +881 | DeepSeek 终端 TUI 客户端 |
| 7 | [farion1231/cc-switch](https://github.com/farion1231/cc-switch) | +866 | Claude Code 多环境/配置快速切换 |
| 8 | [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | +858 | Claude Code 技巧与资源整合 |
| 9 | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | +840 | Google 工程师整理的 Agent Skills |
| 10 | [github/spec-kit](https://github.com/github/spec-kit) | +736 | 规格驱动开发（反「氛围编程」） |
| 11 | [datawhalechina/hello-agents](https://github.com/datawhalechina/hello-agents) | +652 | 中文社区 Agent 入门与实战教程 |
| 12 | [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | +637 | 面向 Agent 的 design.md / 设计文档规范 |
| 13 | [tinyhumansai/openhuman](https://github.com/tinyhumansai/openhuman) | +629 | 开源「数字人」/ 虚拟人相关栈 |
| 14 | [garrytan/gstack](https://github.com/garrytan/gstack) | +588 | YC 系 AI 创业/工程资源栈 |
| 15 | [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | +502 | Agent 工作流与自动化相关项目 |
| 16 | [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | +497 | 多 Agent 金融交易研究与模拟 |
| 17 | [anthropics/skills](https://github.com/anthropics/skills) | +439 | Anthropic 官方 Skills 框架 |
| 18 | [anomalyco/opencode](https://github.com/anomalyco/opencode) | +430 | 开源终端 AI 编码 Agent |
| 19 | [bytedance/UI-TARS-desktop](https://github.com/bytedance/UI-TARS-desktop) | +428 | 视觉 GUI 桌面操作 Agent |
| 20 | [yikart/AiToEarn](https://github.com/yikart/AiToEarn) | +415 | AI 辅助内容创作与变现工具链 |

**2026 上半年宏观方向**：Skills 工程化 · MCP 成为 IDE 标配 · 规格驱动开发替代纯 Prompt  vibe coding · 垂直领域 Agent（金融、交易、设计文档）· 轻量本机 Agent（NanoBot 等）· 新一代开源权重（GLM-5 等）。

---

## LLM 应用框架

+ [LangChain](https://github.com/langchain-ai/langchain)

Build context-aware reasoning applications with composable chains, tools, and integrations.

用于构建上下文感知应用的组件库，支持链式调用、工具集成与多模型对接。

+ [LangGraph](https://github.com/langchain-ai/langgraph)

Low-level orchestration framework for building durable, stateful multi-agent workflows.

面向多 Agent、有状态工作流的编排框架，适合复杂 Agent 流水线。

+ [LlamaIndex](https://github.com/run-llama/llama_index)

Data framework for LLM applications: ingestion, indexing, retrieval, and agents.

面向 LLM 的数据框架，覆盖文档摄入、索引、检索与 Agent 能力。

+ [Haystack](https://github.com/deepset-ai/haystack)

End-to-end NLP framework for production-ready search, QA, and RAG pipelines.

生产级 NLP / RAG 流水线框架，适合搜索与问答场景。

+ [Semantic Kernel](https://github.com/microsoft/semantic-kernel)

SDK for integrating LLMs into conventional programming languages (.NET, Python, Java).

微软出品的 LLM 编排 SDK，便于把大模型嵌入现有业务代码。

+ [txtai](https://github.com/neuml/txtai)

All-in-one embeddings database for semantic search, RAG, and agent workflows.

一体化语义搜索与 RAG 框架，集成向量索引、LLM 流水线与 Agent。

+ [RAGFlow](https://github.com/infiniflow/ragflow)

Open-source RAG engine with deep document understanding and agentic workflows.

开源 RAG 引擎，强调深度文档解析与可落地的 Agent 工作流。

+ [Dify](https://github.com/langgenius/dify)

LLM app development platform with visual workflow, RAG, agents, and observability.

可视化 LLM 应用开发平台，集成工作流、RAG、Agent 与可观测性。

+ [Onyx](https://github.com/onyx-dot-app/onyx)

Open-source Gen-AI platform with connectors, agents, deep research, and enterprise search.

开源企业级 GenAI 平台，支持多数据源连接器、Agent 与深度检索。

---

## AI Agent 框架

+ [OpenAI Agents SDK](https://github.com/openai/openai-agents-python)

Lightweight multi-agent framework with handoffs, guardrails, and tracing.

OpenAI 官方轻量多 Agent SDK，支持任务交接、护栏与链路追踪。

+ [AutoGen](https://github.com/microsoft/autogen)

Multi-agent conversation framework for building collaborative AI systems.

微软多 Agent 对话框架，适合协作式任务分解与自动化。

+ [CrewAI](https://github.com/crewAIInc/crewAI)

Framework for orchestrating role-playing autonomous AI agents.

角色扮演式多 Agent 编排框架，强调分工协作。

+ [Pydantic AI](https://github.com/pydantic/pydantic-ai)

Type-safe Python agent framework built on Pydantic and structured outputs.

基于 Pydantic 的类型安全 Agent 框架，强调结构化输出。

+ [Agno](https://github.com/agno-agi/agno)

Full-stack framework for building multi-agent systems with memory and tools.

全栈多 Agent 框架，内置记忆、工具与生产部署能力。

+ [Smolagents](https://github.com/huggingface/smolagents)

Minimalist agent library where agents write Python code to call tools.

Hugging Face 极简 Agent 库，Agent 通过编写 Python 代码调用工具。

+ [OpenHands](https://github.com/All-Hands-AI/OpenHands)

AI software engineer agent that can modify code, run commands, and browse the web.

开源 AI 软件工程师 Agent，可改代码、跑命令、浏览网页。

+ [GPT Researcher](https://github.com/assafelovic/gpt-researcher)

Autonomous research agent that browses the web and produces cited reports.

自主调研 Agent，自动浏览网页并生成带引用的研究报告。

+ [Hermes Agent](https://github.com/NousResearch/hermes-agent)

Agent that grows with you — memory, skills, and long-horizon tasks (major 2026 releases).

可成长的个人 Agent，强调记忆、技能与长程任务（2026-02 起大版本迭代，周榜常居前）。

+ [NanoBot](https://github.com/HKUDS/nanobot)

Ultra-lightweight personal AI agent: chat channels, memory, MCP, minimal deploy.

港大团队超轻量个人 Agent（聊天渠道、记忆、MCP），2026 年 star 增速极快。

+ [Strands Agents SDK](https://github.com/strands-agents/sdk-python)

Model-driven agent SDK from AWS with tools, memory, and multi-agent patterns.

AWS 推出的模型驱动 Agent SDK，支持工具、记忆与多 Agent 模式。

+ [MetaGPT](https://github.com/geekan/MetaGPT)

Multi-agent framework that simulates a software company (PM, architect, engineer).

模拟软件公司角色的多 Agent 框架（产品、架构、开发等）。

+ [SuperAGI](https://github.com/TransformerOptimus/SuperAGI)

Dev-first autonomous AI agent framework with GUI and marketplace.

面向开发者的自主 Agent 平台，带 GUI 与插件市场。

---

## 垂直领域 Agent（2026）

+ [TradingAgents](https://github.com/TauricResearch/TradingAgents)

Multi-agent framework for financial trading research and simulation.

多 Agent 金融交易研究与模拟框架（2026-05 周榜）。

+ [AiToEarn](https://github.com/yikart/AiToEarn)

AI-assisted content creation and monetization workflow tools.

AI 辅助创作与变现工作流（2026-05 新上榜）。

+ [OpenHuman](https://github.com/tinyhumansai/openhuman)

Open-source stack for digital humans / virtual presenters.

开源数字人 / 虚拟主播相关技术栈。

---

## Agent Skills / 编码助手生态（2026 热门）

+ [Anthropic Skills](https://github.com/anthropics/skills)

Official skills framework for Claude — reusable workflows and tool patterns.

Anthropic 官方 Skills 框架，可复用工作流与工具模式。

+ [Matt Pocock Skills](https://github.com/mattpocock/skills)

Real engineering skills for Claude Code: TDD, guardrails, debugging.

面向真实工程的 Claude Code Skills（TDD、护栏、调试等）。

+ [Agent Skills (Addy Osmani)](https://github.com/addyosmani/agent-skills)

Curated agent skills collection by Google engineer Addy Osmani.

Google 工程师整理的 Agent Skills 合集。

+ [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills)

Agent skills maintained by the Vercel team for coding agents.

Vercel 团队维护的编码 Agent Skills。

+ [Awesome Claude Skills](https://github.com/ComposioHQ/awesome-claude-skills)

Community-curated list of Claude / coding agent skills.

社区精选 Claude / 编码 Agent Skills 列表。

+ [GitHub Spec Kit](https://github.com/github/spec-kit)

Toolkit for spec-driven development with AI coding agents.

GitHub 出品的规格驱动开发工具包，配合 AI 编码 Agent 使用。

+ [Continue](https://github.com/continuedev/continue)

Open-source AI code assistant IDE extension with custom models and context.

开源 IDE AI 编程助手，支持自定义模型与上下文。

+ [Aider](https://github.com/Aider-AI/aider)

AI pair programming in your terminal — edits whole repos via git.

终端里的 AI 结对编程，通过 git 批量修改整个仓库。

+ [OpenCode](https://github.com/anomalyco/opencode)

Open-source AI coding agent for the terminal.

开源终端 AI 编码 Agent。

+ [UI-TARS Desktop](https://github.com/bytedance/UI-TARS-desktop)

GUI agent that operates desktop applications via vision and action.

字节跳动 GUI Agent，通过视觉理解操作桌面应用。

+ [Cline](https://github.com/cline/cline)

Autonomous coding agent in VS Code with MCP and browser use.

VS Code 自主编码 Agent，支持 MCP 与浏览器操作。

+ [Andrej Karpathy Skills](https://github.com/multica-ai/andrej-karpathy-skills)

Karpathy-style AI engineering workflows packaged as agent skills.

将 Karpathy 的 AI 工程实践（训练、复现、LLM 用法）封装为 Agent Skills。

+ [Anthropic Financial Services](https://github.com/anthropics/financial-services)

Domain toolkit for compliance-aware finance agents on Claude.

Anthropic 官方金融垂直 Agent 工具包（合规、风控、文档审计等）。

+ [Superpowers (obra)](https://github.com/obra/superpowers)

Power-user scripts and workflows extending Claude Code capabilities.

Claude Code 增强脚本与工作流合集（社区周榜 2026-05 Top 5）。

+ [cc-switch](https://github.com/farion1231/cc-switch)

Switch between Claude Code environments, API keys, and project configs.

Claude Code 多环境/多项目配置一键切换（2026-05 新上榜）。

+ [Everything Claude Code](https://github.com/affaan-m/everything-claude-code)

Curated tips, workflows, and integrations for Claude Code power users.

Claude Code 进阶资源大全（技巧、集成、社区实践）。

+ [DeepSeek TUI](https://github.com/Hmbown/DeepSeek-TUI)

Terminal UI client for chatting with DeepSeek models locally or via API.

DeepSeek 终端 TUI 客户端（2026-05 周榜热门）。

+ [Hello Agents](https://github.com/datawhalechina/hello-agents)

Chinese community courseware and demos for learning AI agents.

Datawhale 中文 Agent 教程与实战仓库（2026 社区热度高）。

+ [awesome-design-md](https://github.com/VoltAgent/awesome-design-md)

Conventions and templates for design.md files consumed by coding agents.

面向编码 Agent 的 design.md 规范与模板合集。

---

## MCP（Model Context Protocol）

+ [MCP Servers](https://github.com/modelcontextprotocol/servers)

Reference implementations of MCP servers (filesystem, git, memory, etc.).

MCP 官方参考 Server 实现（文件系统、Git、记忆等）。

+ [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)

Python SDK for building MCP clients and servers.

构建 MCP 客户端/服务端的 Python SDK。

+ [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

TypeScript SDK for MCP integrations in Node and browsers.

TypeScript 版 MCP SDK，适用于 Node 与前端。

+ [FastMCP](https://github.com/jlowin/fastmcp)

Pythonic framework for building MCP servers quickly.

快速构建 MCP Server 的 Python 框架。

---

## Python — 数据 / 自动化 / 爬虫

+ [PandasAI](https://github.com/sinaptik-ai/pandas-ai)

Chat with your database or datalake (SQL, CSV, parquet) using LLMs and RAG.

和数据（SQL、CSV、parquet）对话，用 LLM + RAG 做自然语言分析。

+ [Browser-use](https://github.com/browser-use/browser-use)

Enable AI agents to control your browser for automation and scraping.

让 AI Agent 控制浏览器，完成自动化与采集任务。

+ [Crawl4AI](https://github.com/unclecode/crawl4ai)

Open-source LLM-friendly web crawler for RAG and agent pipelines.

面向 LLM / RAG 的开源网页爬虫，输出结构化可索引内容。

+ [Firecrawl](https://github.com/mendableai/firecrawl)

API service that turns websites into LLM-ready markdown.

将网站转为 LLM 友好 Markdown 的爬取 API 服务。

+ [ScrapeGraphAI](https://github.com/ScrapeGraphAI/ScrapeGraphAI)

LLM-powered scraping pipelines built as directed graphs.

基于 LLM 的图式爬虫流水线，用有向图描述抓取逻辑。

+ [Jupyter AI](https://github.com/jupyterlab/jupyter-ai)

Generative AI extension for JupyterLab notebooks.

JupyterLab 的生成式 AI 扩展，在 Notebook 内对话与生成代码。

+ [LiteLLM](https://github.com/BerriAI/litellm)

Unified API to call 100+ LLMs (OpenAI, Anthropic, Bedrock, Ollama, etc.).

统一调用 100+ 大模型的 Python SDK，便于切换供应商。

+ [Instructor](https://github.com/567-labs/instructor)

Structured outputs from LLMs using Pydantic models.

用 Pydantic 从 LLM 提取结构化 JSON / 对象。

+ [DSPy](https://github.com/stanfordnlp/dspy)

Framework for programming — not prompting — language models.

用「编程」而非手工 Prompt 来优化 LM 流水线（斯坦福）。

---

## JavaScript / TypeScript

+ [Vercel AI SDK](https://github.com/vercel/ai)

TypeScript toolkit for AI apps: streaming, tools, agents, and multi-provider.

Vercel 出品的 TS AI 工具包，支持流式、工具调用与多模型。

+ [Mastra](https://github.com/mastra-ai/mastra)

Opinionated TypeScript framework: workflows, agents, RAG, evals.

有主见的 TS AI 框架：工作流、Agent、RAG、评估一体化。

+ [LLM Scraper](https://github.com/mishushakov/llm-scraper)

Extract structured data from any webpage using LLMs.

用 LLM 从任意网页提取结构化数据的 TS 库。

+ [LangChain.js](https://github.com/langchain-ai/langchainjs)

JavaScript/TypeScript port of LangChain for Node and browsers.

LangChain 的 JS/TS 版本，适用于 Node 与浏览器。

+ [Assistant UI](https://github.com/assistant-ui/assistant-ui)

React components for AI chat interfaces (streaming, tools, threads).

React AI 聊天 UI 组件库，支持流式、工具与多轮会话。

+ [Flowise](https://github.com/FlowiseAI/Flowise)

Drag-and-drop UI to build LLM flows and agents on LangChain.

拖拽式可视化构建 LangChain 流程与 Agent。

+ [Bolt.new](https://github.com/stackblitz/bolt.new)

AI full-stack web app generator in the browser (StackBlitz).

浏览器内 AI 全栈应用生成器（StackBlitz 生态）。

---

## 本地推理 / 模型服务

+ [Ollama](https://github.com/ollama/ollama)

Run open-weight LLMs locally with one command.

一条命令在本地运行开源大模型。

+ [llama.cpp](https://github.com/ggml-org/llama.cpp)

C/C++ inference for LLaMA and compatible models on CPU/GPU.

高效 C++ 本地推理，支持 CPU/GPU 与多种开源权重。

+ [vLLM](https://github.com/vllm-project/vllm)

High-throughput LLM serving with PagedAttention.

高吞吐 LLM 推理服务，PagedAttention 优化显存。

+ [text-generation-inference](https://github.com/huggingface/text-generation-inference)

Hugging Face production LLM server (TGI).

Hugging Face 生产级 LLM 推理服务（TGI）。

+ [LocalAI](https://github.com/mudler/LocalAI)

OpenAI-compatible local API for many model backends.

兼容 OpenAI API 的本地多后端推理网关。

+ [LM Studio](https://github.com/lmstudio-ai/lmstudio-python)

Python SDK and ecosystem around LM Studio local models.

LM Studio 本地模型相关的 Python SDK 与生态。

+ [SGLang](https://github.com/sgl-project/sglang)

Fast structured generation and serving for LLMs.

面向结构化生成的高性能 LLM 推理框架。

---

## 微调 / 训练 / ML 基础设施

+ [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory)

Unified fine-tuning of 100+ LLMs (LoRA, QLoRA, full, etc.).

百款大模型统一微调工具（LoRA、QLoRA、全参等）。

+ [Unsloth](https://github.com/unslothai/unsloth)

2–5x faster fine-tuning with less VRAM for Llama, Mistral, etc.

更快、更省显存的大模型微调库。

+ [Axolotl](https://github.com/OpenAccess-AI-Collective/axolotl)

Tool for fine-tuning open models with YAML configs.

YAML 配置驱动的开源模型微调工具。

+ [Transformers](https://github.com/huggingface/transformers)

State-of-the-art ML models for PyTorch, JAX, and TensorFlow.

Hugging Face 核心模型库，覆盖 NLP、视觉、语音等。

+ [PyTorch Lightning](https://github.com/Lightning-AI/pytorch-lightning)

High-level PyTorch training framework with less boilerplate.

简化 PyTorch 训练流程的高层框架。

+ [Ray](https://github.com/ray-project/ray)

Distributed AI compute: Train, Tune, Serve, RLlib, Data.

分布式 AI 计算引擎（训练、调参、服务、强化学习）。

+ [DeepSpeed](https://github.com/microsoft/DeepSpeed)

Deep learning optimization library for large-scale training.

微软大模型训练优化库（ZeRO、推理加速等）。

+ [nanoGPT](https://github.com/karpathy/nanoGPT)

Minimal GPT training code for education and experimentation.

Karpathy 极简 GPT 训练代码，适合学习与实验。

---

## RAG / 向量数据库 / 检索

+ [Chroma](https://github.com/chroma-core/chroma)

Embedding database for AI applications.

面向 AI 应用的嵌入式向量数据库。

+ [Qdrant](https://github.com/qdrant/qdrant)

Vector similarity search engine with filtering and hybrid search.

向量搜索引擎，支持过滤与混合检索。

+ [Milvus](https://github.com/milvus-io/milvus)

Cloud-native vector database for billion-scale vectors.

云原生向量库，支持十亿级向量规模。

+ [Weaviate](https://github.com/weaviate/weaviate)

Vector database with modular ML integrations and GraphQL API.

模块化向量数据库，带 GraphQL 与混合搜索。

+ [pgvector](https://github.com/pgvector/pgvector)

Postgres extension for vector similarity search.

PostgreSQL 向量扩展，在现有 PG 上做语义检索。

+ [LanceDB](https://github.com/lancedb/lancedb)

Serverless vector database built on Lance columnar format.

基于 Lance 列存的无服务器向量库。

+ [LlamaParse](https://github.com/run-llama/llama_parse)

Document parsing API optimized for RAG (LlamaIndex ecosystem).

面向 RAG 的文档解析服务（LlamaIndex 生态）。

+ [Embedchain](https://github.com/embedchain/embedchain)

Framework to create RAG apps from your data in few lines.

几行代码把私有数据变成 RAG 应用的框架。

---

## 评估 / 可观测性 / 安全

+ [Langfuse](https://github.com/langfuse/langfuse)

Open-source LLM engineering platform: tracing, evals, prompts.

开源 LLM 工程平台：链路追踪、评估、Prompt 管理。

+ [Phoenix (Arize)](https://github.com/Arize-ai/phoenix)

LLM observability, evals, and embeddings analysis.

LLM 可观测性与评估，支持嵌入分析与调试。

+ [OpenLLMetry](https://github.com/traceloop/openllmetry)

OpenTelemetry-based observability for LLM applications.

基于 OpenTelemetry 的 LLM 应用可观测性。

+ [Ragas](https://github.com/explodinggradients/ragas)

Evaluation framework for RAG pipelines.

RAG 流水线专用评估框架（忠实度、相关性等）。

+ [DeepEval](https://github.com/confident-ai/deepeval)

Unit testing framework for LLM outputs.

LLM 输出的单元测试与回归评估框架。

+ [Guardrails AI](https://github.com/guardrails-ai/guardrails)

Validate and structure LLM outputs with rules and validators.

用规则与校验器约束、结构化 LLM 输出。

+ [LlamaGuard](https://github.com/meta-llama/PurpleLlama)

Meta safety models and benchmarks for LLM content moderation.

Meta 出品的内容安全模型与评测（Purple Llama）。

---

## 语音（TTS / STT / 克隆）

+ [MockingBird](https://github.com/babysor/MockingBird)

Clone a voice in 5 seconds to generate arbitrary speech in real-time.

AI 拟声：5 秒内克隆声音并实时生成任意语音。

+ [EmotiVoice](https://github.com/netease-youdao/EmotiVoice)

Open-source TTS with 2000+ voices and emotional synthesis (EN/ZH).

网易有道开源 TTS，2000+ 音色，支持中英文情感合成。

+ [Coqui TTS](https://github.com/idiap/coqui-ai-TTS)

Deep learning toolkit for text-to-speech research and production.

深度学习 TTS 工具包，适合研究与生产部署。

+ [OpenVoice](https://github.com/myshell-ai/OpenVoice)

Instant voice cloning with tone and style control.

即时声音克隆，可调节语气与风格。

+ [Whisper](https://github.com/openai/whisper)

Robust speech recognition model trained on diverse audio.

OpenAI 鲁棒语音识别模型，多语言转写。

+ [faster-whisper](https://github.com/SYSTRAN/faster-whisper)

Faster Whisper transcription using CTranslate2.

基于 CTranslate2 的 Whisper 加速实现。

+ [FunASR](https://github.com/modelscope/FunASR)

Fundamental speech recognition toolkit from Alibaba ModelScope.

阿里 ModelScope 语音识别工具包，覆盖 ASR、标点等。

+ [Bark](https://github.com/suno-ai/bark)

Generative text-to-audio model (speech, music, effects).

生成式文本转音频（语音、音乐、音效）。

---

## 图像 / 视频 / 多模态生成

+ [Step-Video-T2V](https://github.com/stepfun-ai/Step-Video-T2V)

Text-to-video generation model and tooling from StepFun.

阶跃星辰文本生成视频模型与工具。

+ [ComfyUI](https://github.com/comfyanonymous/ComfyUI)

Node-based GUI for Stable Diffusion and generative workflows.

节点式 Stable Diffusion 工作流 GUI，生态插件极多。

+ [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)

Full-featured web UI for Stable Diffusion image generation.

Stable Diffusion 经典 Web 界面，功能全面。

+ [Fooocus](https://github.com/lllyasviel/Fooocus)

Simplified SDXL interface focused on quality and ease of use.

简化版 SDXL 界面，强调出图质量与易用性。

+ [Diffusers](https://github.com/huggingface/diffusers)

Modular diffusion models library from Hugging Face.

Hugging Face 模块化扩散模型库（图像、视频等）。

+ [Wan2.1](https://github.com/Wan-Video/Wan2.1)

Open large-scale video generation foundation model.

开源大规模视频生成基础模型。

+ [FLUX](https://github.com/black-forest-labs/flux)

State-of-the-art text-to-image diffusion models (BFL).

Black Forest Labs 高质量文生图扩散模型。

+ [LLaVA](https://github.com/haotian-liu/LLaVA)

Large language and vision assistant — multimodal chat.

视觉语言多模态对话模型（图像理解 + 文本）。

+ [Qwen-VL](https://github.com/QwenLM/Qwen-VL)

Alibaba vision-language models for image understanding and OCR.

阿里视觉语言模型，擅长图像理解与 OCR。

+ [InternVL](https://github.com/OpenGVLab/InternVL)

Open multimodal large models for vision-language tasks.

OpenGVLab 开源多模态大模型系列。

+ [HiDream-O1-Image](https://github.com/HiDream-ai/HiDream-O1-Image)

Unified image foundation model: T2I, editing, personalization up to 2048².

统一图像基础模型（文生图、编辑、个性化，最高 2048²，2026 新开源热点）。

---

## 计算机视觉 / OCR / 文档

+ [Ultralytics YOLO](https://github.com/ultralytics/ultralytics)

YOLO object detection, segmentation, and pose estimation.

YOLO 目标检测、分割与姿态估计统一实现。

+ [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)

Multilingual OCR and document parsing toolkit.

百度飞桨多语言 OCR 与文档解析工具包。

+ [MinerU](https://github.com/opendatalab/MinerU)

PDF/document parsing for high-quality LLM ingestion.

高质量 PDF / 文档解析，面向 LLM 知识库构建。

+ [Docling](https://github.com/docling-project/docling)

IBM document conversion for AI pipelines (PDF, DOCX, etc.).

IBM 文档转换库，将 PDF/Office 转为 AI 可用结构。

+ [LayoutLM](https://github.com/microsoft/unilm)

Document AI models for layout understanding (Microsoft UniLM).

微软文档版面理解模型（表单、票据等）。

---

## Rust / Go / 其他语言

+ [Tabby](https://github.com/TabbyML/tabby)

Self-hosted AI coding assistant (Rust), OpenAI-compatible API.

自托管 AI 编程助手（Rust），兼容 OpenAI API。

+ [Burn](https://github.com/tracel-ai/burn)

Flexible deep learning framework in Rust.

Rust 深度学习框架，强调灵活与类型安全。

+ [LangChainGo](https://github.com/tmc/langchaingo)

Go port of LangChain concepts for LLM apps.

LangChain 概念的 Go 语言实现。

+ [Ollama Go client](https://github.com/ollama/ollama/tree/main/api)

Official patterns for calling Ollama from Go services.

从 Go 服务调用 Ollama 的官方 API 模式。

---

## 开源大模型权重（选摘，侧重 2026）

+ [GLM-5](https://github.com/zai-org/GLM-5)

2026 flagship open model for agentic engineering and long-horizon systems (744B MoE).

智谱 2026 旗舰开源模型，面向系统工程与长程 Agent（稀疏 MoE，Apache 2.0）。

+ [DeepSeek-R1](https://github.com/deepseek-ai/DeepSeek-R1)

Open reasoning model with RL training pipeline and distilled smaller variants.

DeepSeek 开源推理模型 R1 系列，含蒸馏小模型与完整技术报告。

+ [Open R1](https://github.com/huggingface/open-r1)

Hugging Face open reproduction of the DeepSeek-R1 training pipeline.

Hugging Face 对 DeepSeek-R1 训练流程的完全开源复现。

+ [Llama](https://github.com/meta-llama/llama)

Meta open-weight large language models.

Meta 开源大语言模型系列。

+ [Qwen](https://github.com/QwenLM/Qwen)

Alibaba Tongyi Qwen LLM family.

阿里通义千问大模型系列。

+ [DeepSeek](https://github.com/deepseek-ai/DeepSeek-V3)

DeepSeek open models for coding and reasoning.

DeepSeek 开源模型，擅长代码与推理。

+ [Mistral](https://github.com/mistralai/mistral-src)

Mistral AI model implementations and examples.

Mistral 模型实现与示例代码。

+ [Gemma](https://github.com/google-gemma/gemma)

Google Gemma open models for research and apps.

Google Gemma 开源小模型系列。

+ [Phi](https://github.com/microsoft/PhiCookBook)

Microsoft Phi small language models cookbook.

微软 Phi 小模型教程与示例合集。

---

## 精选合集 / 发现站

+ [Awesome LLM Apps](https://github.com/Shubhamsaboo/awesome-llm-apps)

Curated LLM apps with RAG and agents (OpenAI, Anthropic, local models).

精选 LLM 应用合集，涵盖 RAG、Agent，支持商用与本地模型。

+ [Awesome AI Agents](https://github.com/e2b-dev/awesome-ai-agents)

List of AI agents, frameworks, and autonomous agent projects.

AI Agent 与自主 Agent 项目精选列表。

+ [Awesome LLM](https://github.com/Hannibal046/Awesome-LLM)

Papers, tools, and resources for large language models.

大语言模型论文、工具与资源大全。

+ [Awesome Generative AI](https://github.com/filipecalegario/awesome-generative-ai)

Tools, models, and apps for generative AI across modalities.

生成式 AI 全模态工具与模型合集。

+ [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)

Community list of MCP servers for Claude, Cursor, etc.

社区维护的 MCP Server 大全。

+ [Papers With Code](https://github.com/paperswithcode/paperswithcode)

Links ML papers with official code implementations.

论文与官方代码实现对照索引。

+ [ai-find](https://ai-find.cn/)

AI Find | 发现 AI 好工具（中文导航站）。

中文 AI 工具发现与导航站。

---

## 趋势速览（2026，更新于 2026-05-21）

| 时间线 | 方向 | 代表项目 | 说明 |
|--------|------|----------|------|
| **2026 Q2 当周** | Agent Skills 爆发 | [mattpocock/skills](https://github.com/mattpocock/skills)、[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | 把专家工作流写成可安装 Skills，周涨星千级 |
| **2026 Q2 当周** | Claude Code 工具链 | [farion1231/cc-switch](https://github.com/farion1231/cc-switch)、[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | 配置切换、资源整合，生态进入「工具成熟期」 |
| **2026 Q2 当周** | 规格驱动开发 | [github/spec-kit](https://github.com/github/spec-kit) | 用 Spec → Plan → Task 约束 AI，替代无结构 vibe coding |
| **2026 全年** | 记忆型 / 轻量 Agent | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)、[HKUDS/nanobot](https://github.com/HKUDS/nanobot) | 长期记忆 + 本机/多渠道部署成为个人 Agent 主流形态 |
| **2026 全年** | 垂直领域 Agent | [anthropics/financial-services](https://github.com/anthropics/financial-services)、[TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | 金融合规、交易模拟等场景专用工具包 |
| **2026 全年** | 新一代开源权重 | [zai-org/GLM-5](https://github.com/zai-org/GLM-5)、[deepseek-ai/DeepSeek-R1](https://github.com/deepseek-ai/DeepSeek-R1) | 更大 MoE / 推理链开源，服务 Agent 与系统工程 |
| **持续** | MCP 生态 | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | Cursor、Claude Code、Cline 等默认接入方式 |
| **持续** | 本地推理 | [ollama/ollama](https://github.com/ollama/ollama)、[ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp) | 隐私与成本下的本机/边缘部署 |
| **持续** | GUI / 浏览器 Agent | [browser-use/browser-use](https://github.com/browser-use/browser-use)、[bytedance/UI-TARS-desktop](https://github.com/bytedance/UI-TARS-desktop) | 视觉理解 + UI 操作自动化 |
| **持续** | RAG 生产化 | [infiniflow/ragflow](https://github.com/infiniflow/ragflow)、[onyx-dot-app/onyx](https://github.com/onyx-dot-app/onyx) | 深度文档解析 + 企业检索 |
| **2026 新兴** | 统一图像基础模型 | [HiDream-ai/HiDream-O1-Image](https://github.com/HiDream-ai/HiDream-O1-Image) | 文生图 / 编辑 / 个性化一体，高分辨率 |

### 与 2024–2025 的差异（便于选型）

- **2024–2025**：拼 Prompt、单轮 Chat、AutoGPT 式「全自动」演示居多。
- **2026**：拼 **Skills + MCP + Spec**、有状态 Agent、垂直工具包；开源模型向 **Agentic Engineering / 长程任务** 对齐（如 GLM-5、R1 系）。

---

*最后更新：2026-05-21。周榜数据参考 2026-05-09 ~ 2026-05-15 GitHub 周增星统计；发现优质仓库欢迎提 PR。*
