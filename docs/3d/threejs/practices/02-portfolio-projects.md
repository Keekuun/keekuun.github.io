---
title: 02 · 作品集项目
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Portfolio
- Practice
---

# 02 · 作品集项目

> 四个完整项目规格：**功能清单、目录结构、验收标准、简历怎么写**。做到 P1 +（P2 或 P3）+ 框架重写一版，即可支撑 Web 3D / 孪生 / 大屏方向的前端面试。

---

## 目录

- [适用场景](#适用场景)
- [P1 · 产品 3D 展示器](#p1-产品-3d-展示器)
- [P2 · 分区孪生场景](#p2-分区孪生场景)
- [P3 · 大屏 + 3D 孪生块](#p3-大屏--3d-孪生块)
- [P4 · 3D 配置器（选做）](#p4-3d-配置器选做)
- [项目 README 模板](#项目-readme-模板)
- [上线自检](#上线自检)
- [简历与面试话术](#简历与面试话术)
- [导航](#导航)

---

## 适用场景

| 项目 | 优先推荐给 |
|------|------------|
| P1 | 所有方向（**必做**） |
| P2 | 数字孪生、园区、工厂、智慧城市 |
| P3 | 有大屏 / ECharts 经验、可视化前端 |
| P4 | 电商 3D、汽车/家具配置器 |

---

## P1 · 产品 3D 展示器

**对标岗位**：产品官网 3D、设备展示、简单 AR 预览页。

**对应教程**：[06 光](../06-lights-and-shadows.md) · [07 glTF](../07-load-gltf.md) · [08 交互](../08-interaction.md) · [11 HDRI](../advanced/11-hdri-and-environment.md) · [工程 04](../engineering/04-asset-pipeline.md)

### 功能清单

| 模块 | 要求 |
|------|------|
| 模型加载 | 至少 1 个 PBR glTF（推荐 DamagedHelmet 或自建模型） |
| 进度 | 加载百分比 + 失败重试 |
| 相机 | OrbitControls，阻尼、距离限制、双击 fit |
| 光照 | HDRI 环境光 **或** 三点布光二选一 |
| 交互 | 点击部件高亮（emissive / Outline 二选一） |
| 信息面板 | DOM 侧栏：名称、尺寸（可 mock）、描述 |
| 性能 | `dispose` 完整；DPR `min(devicePixelRatio, 2)` |
| 响应式 | 手机竖屏可用，帧率 &gt; 30 |

### 推荐目录

```
portfolio/p1-product-viewer/
├── index.html
├── main.js                 # 入口 &lt; 80 行
├── three/
│   ├── createScene.js
│   ├── loadModel.js
│   ├── lights.js
│   ├── pick.js
│   └── dispose.js
├── ui/
│   └── panel.js            # DOM 侧栏
└── public/
    ├── models/
    └── hdr/
```

### 验收标准（打勾再写进简历）

- [ ] 首屏加载时间 &lt; 5s（4G 节流可 &lt; 8s，DevTools Network 截图）
- [ ] 切换模型（≥2 个 glb）无内存泄漏
- [ ] 点击 ≥3 个可识别部件，面板内容联动
- [ ] README 含：架构图、截图、本地/在线地址
- [ ] **加分**：Draco 压缩对比表；暗色 / 亮色 UI 主题

### 扩展（进阶）

- [12 后处理](../advanced/12-post-processing.md)：选中 Outline
- [13 动画](../advanced/13-animation-and-camera.md)：相机 flyTo 预设视角

---

## P2 · 分区孪生场景

**对标岗位**：园区孪生、工厂产线、能源站、楼宇外立面。

**对应教程**：[14 大场景](../advanced/14-large-scene-loading.md) · [15 标注](../advanced/15-html-labels.md) · [工程 01](../engineering/01-why-not-raw-threejs.md) · [05 数据](../engineering/05-data-and-state.md)

### 功能清单

| 模块 | 要求 |
|------|------|
| 分区 | ≥3 个 zone（如 A/B/C 栋），**按需** load/unload glb |
| 导航 | 左侧列表或地图热点切换 zone |
| 拾取 | 点击设备 / 楼栋，高亮 + 右侧详情 |
| 标注 | CSS2D 标签 ≥5 个，随相机缩放可选隐藏 |
| 数据 | mock WebSocket 或 `setInterval` 改设备状态（正常/告警/离线） |
| 状态映射 | color / emissive / 标签文案随数据变 |
| 性能 | 同时可见三角面 &lt; 50 万（或 README 说明预算） |
| 架构 | 业务不 `import three`；`three/` 为引擎层 |

### 场景资源策略

没有真实园区模型时，可以：

1. **Blender** 建 3 个简单区块（Box + 不同颜色 + 命名 `zone-a`）
2. 用 [Khronos DamagedHelmet + 多个立方体](https://github.com/KhronosGroup/glTF-Sample-Models) 模拟「设备点」
3. 参考 [工程 07 · three-vue-tres](../engineering/07-open-source-reference.md) 的分区思路

### 推荐目录

```
portfolio/p2-twin-zone/
├── src/
│   ├── main.js
│   ├── store.js            # 设备状态 Map（或 Pinia mock）
│   ├── three/
│   │   ├── SceneManager.js # 生命周期
│   │   ├── ZoneLoader.js   # load/unload + dispose
│   │   ├── PickService.js
│   │   └── LabelLayer.js   # CSS2DRenderer
│   └── ui/
│       ├── ZoneList.js
│       └── DevicePanel.js
└── public/zones/
    ├── zone-a.glb
    ├── zone-b.glb
    └── zone-c.glb
```

### 验收标准

- [ ] 切换 zone 时旧分区 **dispose** 干净（重复 10 次 Memory 稳定）
- [ ] 数据变 → 3D 颜色/标签 **1 秒内**更新
- [ ] 标注不遮挡严重（近裁剪或 scale 随距离）
- [ ] README 画分层图（业务 → viewer → engine → three）
- [ ] **加分**：告警设备相机 flyTo；[17 GIS](../advanced/17-gis-coordinates.md) 底图对齐

---

## P3 · 大屏 + 3D 孪生块

**对标岗位**：可视化大屏、指挥中心、与 ECharts 并存的 3D 模块。

**对应教程**：[10 进项目](../10-project-integration.md) · [工程 05](../engineering/05-data-and-state.md) · [16 Shader](../advanced/16-custom-shader.md)（可选热力）

### 功能清单

| 模块 | 要求 |
|------|------|
| 布局 | 1920×1080 设计稿缩放；左 3D 右图表 **或** 上 3D 下图表 |
| 3D 块 | 简化园区 / 设备组，orbit 受限（防误操作） |
| 图表 | ECharts ≥2 个（折线 + 饼图 / 柱状） |
| 联动 | 点击 3D 设备 → 图表筛该设备；点击图表 → 3D 高亮 |
| 数据 | 统一 `dataService` mock；3D 与图表读同一份 store |
| 主题 | 深色大屏风；3D 与图表色板一致 |
| 性能 | 3D 可 **按需渲染**（数据不变时不刷满 60fps） |

### 布局示意

```
┌─────────────────────────────────────┐
│  标题                    时间 天气   │
├──────────────┬──────────────────────┤
│              │   ECharts 折线        │
│   3D 孪生    ├──────────────────────┤
│   canvas     │   ECharts 柱状/饼图   │
│              │   KPI 数字卡片        │
└──────────────┴──────────────────────┘
```

### 推荐栈

- **Vue 3 + Vite + ECharts + 自研 viewer**（和现有前端经验一致）
- 3D 封装为 `TwinCanvas.vue`，props：`deviceStates`、`selectedId`、`@pick`

### 验收标准

- [ ] 3D 与图表 **双向联动** 至少 1 条完整链路
- [ ] 窗口 resize / 大屏 scale 下 3D 与图表都不糊、不裁切
- [ ] `onUnmounted` 销毁 ECharts + Three，路由切换无泄漏
- [ ] 录屏 30s 展示联动（面试可直接播）
- [ ] **加分**：Shader 热力地面；WebSocket mock 实时跳动

---

## P4 · 3D 配置器（选做）

**对标岗位**：汽车 / 家具 / 鞋类 3D 配置、电商 SKU 切换。

**对应教程**：[11 HDRI](../advanced/11-hdri-and-environment.md) · [13 动画](../advanced/13-animation-and-camera.md) · [18 R3F/Tres](../advanced/18-r3f-tres.md)

### 功能清单

| 模块 | 要求 |
|------|------|
| 变体 | ≥3 种颜色 **或** ≥2 个可切换部件（轮毂/材质） |
| UI | 色块 / 下拉切换，切换 &lt; 500ms 反馈 |
| 展示 | HDRI + 地面反射（可选） |
| 动画 | 切换时相机轻微运镜或部件 fade |
| 导出 | 截图 `renderer.domElement.toDataURL` 或「当前配置 JSON」 |

### 模型来源

- 单 glTF 多 material variant
- 或多个 glb 同拓扑不同贴图，运行时 swap
- 参考 [model-viewer](../engineering/07-open-source-reference.md) 的 AR 思路（可选 `<model-viewer>` 对比页）

### 验收标准

- [ ] 配置状态可序列化为 JSON 并还原
- [ ] 移动端可 rotate，UI 不挡 canvas
- [ ] README 对比：自研 vs model-viewer 适用边界

---

## 项目 README 模板

每个 `portfolio/pX-*/README.md` 建议包含：

```markdown
# 项目名称

一句话：Vue3 + Three.js 产品 3D 展示，支持 glTF 加载与部件拾取。

## 在线 Demo
https://...

## 截图
（3 张：全貌 / 交互 / 移动端）

## 技术栈
- Three.js r17x · Vite · Vue 3
- GLTFLoader + Draco · RGBELoader

## 架构
（贴分层图或 mermaid）

## 性能
| 指标 | 数值 |
|------|------|
| 模型面数 | 12万 |
| 首屏 LCP | 3.2s |
| 桌面 FPS | 60 |
| 移动端 FPS | 35 (DPR 1.5) |

## 本地运行
pnpm install && pnpm dev

## 对应学习笔记
- [07 glTF](../docs/3d/threejs/07-load-gltf.md)
```

---

## 上线自检

部署前对照 [工程 06 · 质量与交付](../engineering/06-quality-and-delivery.md) 与 [03 · 3D 项目评估标准](./03-project-evaluation.md)：

| 检查项 | P1 | P2 | P3 | P4 |
|--------|:--:|:--:|:--:|:--:|
| 生产 build 无 console.error | ✓ | ✓ | ✓ | ✓ |
| 404 / 模型失败有 UI | ✓ | ✓ | ✓ | ✓ |
| dispose / 路由卸载 | ✓ | ✓ | ✓ | ✓ |
| 移动端抽测 | ✓ | ✓ | ✓ | ✓ |
| README + 在线链接 | ✓ | ✓ | ✓ | ✓ |
| 30s 演示录屏 | ✓ | ✓ | ✓ | 选 |

---

## 简历与面试话术

### 项目描述示例（P2）

> **园区数字孪生 Web 前端** · Vue3 + 自研 3D 引擎层  
> - 分区 glTF 按需加载，切换园区 unload 旧资源，内存稳定  
> - CSS2D 设备标注 + Raycaster 拾取，WebSocket mock 驱动告警态  
> - 三角面预算 50 万内，桌面 60fps / 移动端 30fps+

### 面试常问 → 用哪个作品答

| 问题 | 用项目 |
|------|--------|
| 怎么组织 Three 和业务代码？ | P2 分层图 |
| 模型加载慢怎么办？ | P1 Draco + 进度条 |
| 内存泄漏怎么查？ | P1/P2 反复 load/unload |
| 和大屏图表怎么协作？ | P3 联动 store |
| 为什么不用纯 Three 写业务？ | [工程 01](../engineering/01-why-not-raw-threejs.md) + P2 目录 |

---

## 建议时间线

| 周 | 产出 |
|----|------|
| 1–2 | P1 MVP（加载 + orbit + 点击） |
| 3 | P1 打磨（HDRI、dispose、部署） |
| 4–5 | P2 或 P3 主线 |
| 6 | 用 Tres/R3F 重写 P1 |
| 7 | README、录屏、GitHub 主页整理 |

---

## 导航

- [实践导读](./README.md)
- [01 · 按章微实验](./01-micro-labs-by-chapter.md)
- [03 · 3D 项目评估标准](./03-project-evaluation.md)
- [10 · 进项目](../10-project-integration.md)
- [工程实践](../engineering/README.md)
