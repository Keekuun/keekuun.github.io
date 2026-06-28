/** setup-env 写入 .env.local 时使用的带备注模板 */

export function buildEnvLocalContent(next) {
  return `# blog-assistant 本地生产环境（勿提交 Git）
# 由 pnpm blog-assistant:setup-env 生成/合并，可手工编辑
# 填好「必填」4 项后: pnpm blog-assistant:check-env && pnpm blog-assistant:dev

# ========== 必填：真实 AI + 向量检索 ==========

# Upstash Vector REST 地址（console.upstash.com → Vector → REST API）
UPSTASH_VECTOR_REST_URL=${next.UPSTASH_VECTOR_REST_URL || ""}

# Upstash Vector REST Token（与 kb-search / tools/rag 共用）
UPSTASH_VECTOR_REST_TOKEN=${next.UPSTASH_VECTOR_REST_TOKEN || ""}

# DeepSeek API Key（platform.deepseek.com → Agent/RAG 对话）
DEEPSEEK_API_KEY=${next.DEEPSEEK_API_KEY || ""}

# 硅基流动 API Key（cloud.siliconflow.cn → 检索 Embedding，不能用 DeepSeek Key）
SILICONFLOW_API_KEY=${next.SILICONFLOW_API_KEY || ""}

# ========== 模型与博客地址 ==========

# DeepSeek OpenAI 兼容接口根地址
DEEPSEEK_BASE_URL=${next.DEEPSEEK_BASE_URL}

# 对话模型名
DEEPSEEK_CHAT_MODEL=${next.DEEPSEEK_CHAT_MODEL}

# Embedding 服务地址
EMBEDDING_BASE_URL=${next.EMBEDDING_BASE_URL}

# Embedding 模型（须与 Upstash Index 维度一致，bge-m3=1024 维）
EMBEDDING_MODEL=${next.EMBEDDING_MODEL}

# 博客根 URL，引用卡片跳转用（会暴露到浏览器）
NEXT_PUBLIC_BLOG_BASE_URL=${next.NEXT_PUBLIC_BLOG_BASE_URL}

# ========== 生产行为 ==========

# 0=关闭演示模式，走真实 LLM/向量库；1=强制演示；不填=开发无 Key 时自动演示
BLOG_ASSISTANT_DEMO=${next.BLOG_ASSISTANT_DEMO}

# ========== 可选：模拟线上访问门控 ==========

# 访问密码（设后需在页面「高级」或请求头 x-blog-assistant-password 填写）
# BLOG_ASSISTANT_PASSWORD=${next.BLOG_ASSISTANT_PASSWORD || ""}

# 设密码时访客每日免费次数；0=访客完全不可用
# BLOG_ASSISTANT_DAILY_LIMIT=20

# ========== 可选：Neon Postgres checkpoint ==========

# Agent 多轮 checkpoint + 侧栏会话；不填则用 MemorySaver
# DATABASE_URL=${next.DATABASE_URL || ""}

# 连接池大小，默认 10
# DATABASE_POOL_MAX=10

# ========== 可选：Upstash Redis 准确限流（Vercel 多实例）==========

# UPSTASH_REDIS_REST_URL=${next.UPSTASH_REDIS_REST_URL || ""}
# UPSTASH_REDIS_REST_TOKEN=${next.UPSTASH_REDIS_REST_TOKEN || ""}

# ========== 可选：LangSmith Trace ==========

# 是否开启 Trace
# LANGCHAIN_TRACING_V2=true

# LangSmith API Key
# LANGCHAIN_API_KEY=

# LangSmith 项目名
# LANGCHAIN_PROJECT=blog-assistant

# ========== 可选：Eval 脚本 ==========

# 被测服务地址
# EVAL_BASE_URL=http://localhost:3010

# golden 通过率阈值 0～1
# EVAL_PASS_THRESHOLD=0.8

# ========== Agent / RAG 调优（与生产默认一致）==========

# 意图路由：rules | auto | llm
AGENT_LLM_ROUTER=auto

# 检索重排序：1 开 0 关
RAG_RERANK=1

# HyDE 假设文档检索：off | auto | on
RAG_HYDE=auto

# ReAct 最大步数，默认 15
# AGENT_RECURSION_LIMIT=15
`;
}
