---
title: AI 业务前端面试题（个人定制）
date: 2025-11-21
sidebar: auto
categories:
  - 面试
  - AI
tags:
  - React
  - Next.js
  - DevOps
  - Flutter
  - UniApp
---

> 针对「4 年海外/国内社交直播混合 H5、官网与运营后台、React + Next.js + TS、Docker/K8s、Nginx/CDN、Sentry/友盟、AI 全栈平台、Flutter、UniApp」经历量身定制。

## 1. 混合容器适配与 WebView 策略
- **问题**：海外社交直播与国内社交 H5 在混合容器上有哪些关键差异？如何确保直播互动场景下的高频渲染与 JSBridge 调用稳定？
- **答案**：海外版本多接入 Google/Facebook 登录、推送、内购，需要在 WebView 层处理第三方 SDK 权限及 GDPR/CCPA 隐私弹窗；国内需对接微信/支付宝、审核内容合规。高频互动采用批量消息合并 + requestAnimationFrame 节流，将抽奖/点赞动效放在原生层或 WebGL Canvas；JSBridge 统一封装 Promise 化接口，增加序列化队列与超时兜底，弱网场景下启用离线缓存和幂等签名防止重复下单。

## 2. Next.js 渲染策略在直播/运营后台落地
- **问题**：如何在直播周边工具或运营后台中组合 CSR/SSR/SSG/ISR，既保证首屏又保持数据新鲜？
- **答案**：默认使用服务端组件生成 SSG 页面（运营日报、模板库），通过 `revalidate` 将热区数据 30s 刷新；用户态仪表盘使用 `cookies()` + `cache: 'no-store'` 强制 SSR，结合 Edge Runtime 缩短 TTFB；高交互模块拆成 `'use client'` 的孤岛组件，利用 Suspense + streaming 让服务端先输出骨架，客户端再 Hydrate WebSocket 数据。

## 3. AI 对话与 Prompt 管理
- **问题**：在自建 Next.js AI 平台中，如何管理 Prompt、会话上下文、积分扣费并防止刷量？
- **答案**：设计 `conversations` + `messages` + `prompt_templates` 表，通过 Server Actions 写入并返回会话 ID；上下文采用 token 计数（如 tiktoken）按阈值裁剪，把系统/用户/助手消息拼接；积分扣费使用事务：写入 `credits_ledger` + `usage_log`，失败时回滚；请求侧校验 session、HMAC 签名、防重放；对频繁失败请求触发灰度降级或机器人验证。

## 4. AI 流式响应与性能
- **问题**：如何在 Next.js 中实现大模型流式输出并控制超时与并发？
- **答案**：使用 `app/api/chat/route.ts` 返回 `ReadableStream`，后端转发到模型服务；前端通过 `fetch` + `ReadableStreamDefaultReader` 渐进渲染；K8s 层对推理服务设置 P95 超时和熔断，Next.js 端配置 `AbortController` + 重试，配合队列（如 Redis stream）限制同时生成数量，超限时排队提示。

## 5. DevOps：容器与弹性
- **问题**：直播或 AI 大促时如何利用 Docker + K8s 保证弹性和部署速度？
- **答案**：镜像拆分基础层（node runtime + pnpm 缓存）与业务层，使用 BuildKit/Cache Mount 降低构建时间；K8s HPA 基于自定义指标（接口 QPS、token 消耗）扩容；利用 Argo Rollouts 做分批灰度 + 自动回滚；静态内容放入 CDN，接口通过 API Gateway 动态路由至最近 Region，流量突增时使用临时节点组。

## 6. 观测：Sentry + 友盟
- **问题**：如何将 Sentry、友盟、业务埋点联动，快速定位线上问题？
- **答案**：Sentry 负责技术栈异常，绑定 release + Git commit；友盟负责运营事件和用户画像。两者通过会话 ID、userId 打通，在异常发生时回溯用户路径；面板展示关键漏斗（直播间进入 → 付费礼物 → AI 助理使用）。同时在 Sentry beforeSend hook 中脱敏，友盟自定义事件上报环境/版本，确保问题能复现。

## 7. 官网与 SEO/性能优化
- **问题**：多语言官网 + CDN 发布时，如何兼顾 SEO、LCP 与灰度？
- **答案**：Next.js 生成多语言 SSG，利用 `next-intl` 和静态 JSON；部署时 CDN 以路径区分语言并配置 `Accept-Language` 回源；关键资源使用 Preload + Font Display swap；图片通过 `next/image` + WebP + CDN 自适应；灰度发布借助 CDN 版本号和 cookie 标记，只让 5% 测试用户命中新版本，监控 LCP/Sentry 指标后再全量。

## 8. Flutter 混合项目
- **问题**：两个 Flutter 应用在原生壳内如何优化首屏与内存？
- **答案**：采用 Flutter 模块嵌入（add-to-app），提前预热 FlutterEngine 并在首页保持缓存；资源采用 deferred components 分包；长列表使用 `AutomaticKeepAliveClientMixin` + `SliverList`；对 GPU 纹理做尺寸压缩，结合 DevTools 跟踪 Raster/CPU，用 `image_cache.maximumSizeBytes` 控制缓存；埋点记录 Dart VM crash 并上报 Sentry。

## 9. UniApp 小程序上线实践
- **问题**：从立项到上线的关键步骤有哪些？如何把 Web 端逻辑迁移？
- **答案**：定义跨端接口层，将 Web 端业务服务抽象成 REST/GraphQL；UniApp 侧通过 `uni.request` + 拦截器统一签名；利用分包降低首包体积，上线前通过微信自动化测试脚本跑冒烟；对接云函数实现安全校验；上线后借助「小程序 · 数据助手」监控留存，与友盟埋点同步。

## 10. 跨团队协作与指标驱动
- **问题**：在 AI 业务中，如何与算法/产品协作并以指标驱动迭代？
- **答案**：与算法协定 Prompt schema（system/user/vars），建立线上实验平台记录模型版本、温度、TopP；产品侧确定业务指标（AI 会话数、积分收入、转化率），前端在 Admin 中提供可视化报表和 Prompt 管理界面；通过 Feature Flag 控制 A/B，结合埋点分析 DAU、留存、响应耗时，按指标调整模型或 UI 流程。

## 11. 流式渲染/分片加载/Web Worker/缓存实作
- **问题**：如何把流式渲染、分片加载、Web Worker、缓存策略落到可复用代码？
- **答案**：
  1. **流式渲染**：在客户端通过原生 `ReadableStream` 持续读取响应并写入 Zustand store，流式组件仅渲染最新切片。

```ts
const controller = new AbortController();
export async function streamLLM({ url, onChunk }: StreamOptions) {
  const response = await fetch(url, { signal: controller.signal });
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  while (reader) {
    const { value, done } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}
```

  前端调用时结合 `useEffect` 与 `AbortController` 控制生命周期，异常时触发回退提示。

```tsx
const { text, append } = useChatStore();
useEffect(() => {
  streamLLM({ url: '/api/chat', onChunk: append }).catch(handleError);
  return () => controller.abort();
}, []);
```

  2. **分片加载**：Next.js 利用模板分段与 `dynamic(() => import('./TokenChart'), { ssr: false, loading: Skeleton })` 将大图表按路由段切分；配合 `parallel routes` 让主上下文先响应，图表 Ready 后再 Hydrate。
  3. **Web Worker**：将高开销 JSON 解析或向量相似度计算丢给 Worker，主线程仅处理 UI。

```ts
self.onmessage = async ({ data }) => {
  const { query, embeddings } = data;
  const result = embeddings.map((item) => cosine(query, item));
  self.postMessage(result);
};
```

```tsx
const worker = useMemo(() => new Worker(new URL('./vector-worker.ts', import.meta.url)), []);
worker.postMessage({ queryEmbedding, embeddings });
worker.onmessage = ({ data }) => setSimilarities(data);
```

  4. **缓存策略**：结合浏览器 Cache Storage + SWR，将模型静态参数与最近一次响应缓存，既降低 API 压力也提升离线体验。

```ts
const cacheName = 'ai-chat-cache-v1';
export async function cacheResponse(key: string, response: Response) {
  const cache = await caches.open(cacheName);
  await cache.put(key, response.clone());
}
export async function getCachedResponse(key: string) {
  const cache = await caches.open(cacheName);
  return cache.match(key);
}
```

  在组件中先 `await getCachedResponse` 回显历史，再 fallback 到实时流式请求，并在成功后 `cacheResponse`。命中规则配合模型版本/Prompt Hash，确保数据一致性。

## 12. 安全合规与内容审查
- **问题**：面向海外及国内的 AI/直播业务，如何在前端与 BFF 层兼顾合规、风控与用户体验？
- **答案**：将 PII/敏感字段在客户端输入层就做分类标注，传输前使用 AES-GCM + 后端公钥加密关键字段；依据地区加载不同隐私策略（GDPR/DSA/国内备案），通过 Feature Flag 控制是否展示数据收集弹窗。BFF 层引入内容审查流水线：文本/音视频先经第三方审核（AWS Comprehend、阿里云内容安全），若延迟过高则先返回占位提示并在审查通过后触发二次推送。所有请求附带 deviceId + riskToken，异常提示会同时写入审计日志与 Sentry Breadcrumb，确保问题可追踪。

## 13. 成本控制与多模型路由
- **问题**：如何在 AI 平台中用前端/服务端协作的方式降低 token 成本并保障可用性？
- **答案**：在前端侧根据用户套餐与问题复杂度选择模型档位（fast/balanced/quality），通过提示工程将系统指令限制回复长度；BFF 层维护路由表，将低优先级流量路由到开源模型或自建推理服务，高优先级走商业模型。请求入口实现 Token Budgeting，中途若超限则截断上下文并提示；对热门提问采用向量检索 + cache key（`model+promptHash`）命中命令缓存，命中后直接返回，未命中才继续调用模型，结合云账单与 Grafana 看板定期回顾成本。

## 14. 评测与回归基线
- **问题**：AI 体验上线前如何做自动化评测，避免模型/Prompt 回归？
- **答案**：沉淀金标数据集（真实匿名问题 + 预期回答 + 评分标准），在 CI 中运行 Eval Pipeline：Next.js Server Action 触发脚本，调用模型产出回应，使用 LLM-as-a-judge 或规则打分（准确率、一致性、毒性）。结果写入 `eval_runs` 表，通过 Admin 面板可视化对比不同 Prompt/模型版本；若低于阈值自动阻断发布。前端在本地 Storybook 里集成 Mock Eval，帮助产品提前感受回答质量。

## 15. AI 交互与多模态体验
- **问题**：当 AI 平台需要支持文本、图片、语音多模态时，前端如何设计一致的交互与降级？
- **答案**：抽象统一消息协议 `{type:'text'|'image'|'audio', payload, status}`，React 组件按类型渲染；上传前使用 WebAssembly 压缩图片、`MediaRecorder` 采集音频并在 Worker 中转码。流式回答按片段标注来源（文本 token、Base64 图片块），让 UI 可渐进展示。若模型暂不支持某模态，前端检测 `capability manifest` 自动隐藏入口并提示排期；低性能设备自动降级为纯文本模式并关闭实时转录。

## 16. 视频生成类 AI 业务前端角色与 BFF 协作
- **问题**：在视频生成 AI 产品中，前端扮演哪些关键角色？若需要通过 BFF 聚合接口，前端/BFF 分别要关注什么？
- **答案**：
  - **前端职责**：
    1. 引导式工作流：模板选择 → Prompt/素材上传 → 参数（时长、风格、帧率）校验 → 渲染队列提交。
    2. 任务状态与可视化：实时展示排队/渲染/失败状态，支持进度条、关键帧缩略图、流式日志（如关键提示词、推理阶段）。
    3. 预览与转码：前端利用 `MediaSource Extensions` / `FFmpeg.wasm` 生成低码率预览，允许区块播放、帧间对比。
    4. 资源治理：在浏览器端限制上传文件大小、分辨率与编解码格式，提前压缩，降低推理成本。
  - **BFF 接入关注点**：
    1. **任务幂等**：前端提交时带上 `clientRequestId`，BFF 校验避免重复扣费。
    2. **长任务反馈**：BFF 以 WebSocket/SSE 推送状态；前端需要断线重连、回放历史状态，保证 UI 不丢任务。
    3. **分片上传与访问控制**：BFF 聚合对象存储（COS/S3）上传凭证，前端按照分片列表上传并回调合并。
    4. **成本与配额**：BFF 负责对接积分/算力配额，返回剩余额度；前端根据响应选择是否降级模型（如 720p → 480p）。
    5. **日志与调试**：BFF 提供任务日志查询接口，前端在 UI 中展示渲染节点、GPU 类型、耗时，方便用户/运营定位问题。
- **可能被问到**：
  1. 如何处理 2 分钟以上的视频生成任务的 UI 反馈，避免用户离开？（答：多通道提示+渐进式缩略图+邮件/站内信，前端维护本地任务列表）
  2. 前端如何与 BFF 协作保证大文件上传性能与安全？（答：分片 + 断点续传 + STS 临时凭证 + Hash 校验）
  3. 视频预览如何做到多码率和版本对比？（答：使用 `MediaSource` 拼接多码率流、Service Worker 缓存片段、UI 支持帧同步对比）
  4. 任务失败后如何提示并允许重试？（答：BFF 返回错误分类，前端根据 `recoverable` 字段展示「立即重试/复制参数」按钮，并记录日志 ID 供客服排查）

## 17. 面向中小企业的低成本流程编排
- **问题**：AI 视频业务要帮助中小企业降低生成成本并简化操作，需要哪些技术与业务细节支撑流程编排？
- **答案**：
  1. **模版化流程引擎**：在前端提供 BPMN/节点式编排 UI（如 React Flow、LogicFlow），让运营拖拽「脚本生成 → 配音 → 素材合成 → 渲染导出」节点，底层由 BFF 解析成可执行 DAG，支持保存为 Preset。
  2. **多租户与成本感知**：在 BFF 层记录每个节点的GPU/推理成本，前端实时展示预估消耗（token、积分、渲染时长），并提供「低成本模式」（降分辨率、压缩帧率、合并批量任务）。
  3. **素材资产管理**：集成对象存储、版权校验与自动字幕/Logo 叠加，确保中小企业能快速复用品牌资产；前端需支持批量上传、AI 清晰度增强、背景替换等一键能力。
  4. **自动化质量校验**：流程节点输出后触发 AI 质检（镜头稳定、文案敏感词、语速），BFF 返回评分与建议；前端给出可视化提示并允许一键修复或回滚至某个节点。
  5. **协同与版本控制**：为运营/设计/审核等不同角色提供权限与版本化时间线，同步记录「谁修改了模板/Prompt」，方便追溯。
  6. **多渠道发布**：流程末尾预置「一键发至 TikTok/抖音/YouTube/官网」动作，封装各平台 API，前端负责 OAuth 状态、草稿箱管理，减少重复上传。
  7. **商业化支持**：内置套餐、积分、发票导出与对账接口，前端展示成本报表；同时提供 API/SDK 供中小企业在自有官网嵌入生成流程。
- **面试可能追问**：
  - 如何把拖拽式流程与后端 DAG 保持一致且易于扩展？（可答：使用 JSON DSL + 版本管理，前端校验必需字段，BFF 映射到 Airflow/Temporal 等编排器）
  - 中小企业普遍缺少设计能力，如何让生成视频更易用？（可答：提供脚本模版、AI 文案建议、品牌一键换色/字体、场景推荐）
  - 成本展示如何做到实时、可信？（可答：BFF 汇总每个节点的历史均值成本 + 实时账单 API，前端用 Sparklines 展示趋势并给出降级建议）


## 使用建议
- 每道题都准备「背景 → 动机 → 技术方案 → 指标成效」闭环。
- 结合项目截图、监控面板或代码片段，形成可展示的 Portfolio。


