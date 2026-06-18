---
title: 01 · 按章微实验
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Practice
---

# 01 · 按章微实验

> 配合 [基础 01–10](../README.md) 与 [进阶 11–19](../advanced/README.md) 的**小实验**。每个实验 1～3 小时，单独一个 `labs/xx-名称/` 目录，能 `pnpm dev` 打开即算完成。

---

## 适用场景

- 刚读完某一章，**立刻动手**巩固
- 作品集开做前，把 Orbit、Raycaster、dispose 等肌肉记忆练熟
- 面试前快速复习：每个实验对应一个可讲述的技术点

---

## 通用验收（每个微实验）

- [ ] 独立 HTML/JS 或 Vite 子目录，不依赖复制粘贴整章代码
- [ ] 控制台无报错；路由切换或刷新后无 WebGL context 泄漏（DevTools → Memory 粗看）
- [ ] 在 README 或文件头注释：**对应章节链接 + 本实验验证的一点**

---

## 基础篇 · 01–10

### 01 · 从传统前端到 3D

| # | 实验 | 目标 | 验收 |
|---|------|------|------|
| 1.1 | 对比页 | 左 ECharts 折线，右 Three 空场景 + 网格 | 同一页面两个 canvas，互不影响 resize |
| 1.2 | 概念图 | 用 Mermaid 或手绘拍屏：DOM → Renderer → WebGL | 能口述数据流（不要求写代码） |

---

### 02 · 第一个场景

教程：[02-first-scene.md](../02-first-scene.md)

| # | 实验 | 目标 | 验收 |
|---|------|------|------|
| 2.1 | 旋转立方体 | Scene / Camera / Renderer / Mesh / loop | 60fps 旋转，resize 不变形 |
| 2.2 | DPR 对比 | `setPixelRatio(1)` vs `min(devicePixelRatio, 2)` | Performance 里 GPU 时间有差异 |
| 2.3 | 按需渲染 | 无动画时停 loop，鼠标按下才 render | CPU 占用明显下降 |
| 2.4 | 透明背景 | `alpha: true` + CSS 渐变底 | 3D 浮在网页背景上 |

---

### 03 · 场景图与坐标

教程：[03-scene-graph-and-coordinates.md](../03-scene-graph-and-coordinates.md)

| # | 实验 | 目标 | 验收 |
|---|------|------|------|
| 3.1 | 太阳系简化 | Sun 父节点 + Earth 子节点自转公转 | 子节点绕父节点转，不是绕世界原点 |
| 3.2 | 本地 vs 世界 | `getWorldPosition` 打印父子坐标 | 控制台输出符合预期 |
| 3.3 | 轴辅助 | `AxesHelper` + `GridHelper` | 能指出 X/Y/Z 分别朝哪 |

---

### 04 · 相机

教程：[04-camera.md](../04-camera.md)

| # | 实验 | 目标 | 验收 |
|---|------|------|------|
| 4.1 | FOV 滑块 | `gui` 或 range input 改 FOV | 物体大小随 FOV 变化 |
| 4.2 | 裁剪面 | near/far 极端值导致闪烁或消失 | 能解释 z-fighting 与 near 过小 |
| 4.3 | fitCameraToObject | 加载任意物体后自动框选 | 物体完整出现在视锥内 |

---

### 05 · 几何与材质

教程：[05-geometry-and-material.md](../05-geometry-and-material.md)

| # | 实验 | 目标 | 验收 |
|---|------|------|------|
| 5.1 | 材质画廊 | 同一 Box 切换 Basic / Lambert / Standard | 侧光下 Standard 有高光 |
| 5.2 | wireframe 调试 | `material.wireframe = true` | 排查法线、面朝向问题 |
| 5.3 | 顶点色 | `BufferGeometry` + `color` attribute | 渐变立方体 |

---

### 06 · 光与阴影

教程：[06-lights-and-shadows.md](../06-lights-and-shadows.md)

| # | 实验 | 目标 | 验收 |
|---|------|------|------|
| 6.1 | 三点布光 | key / fill / rim 三盏 DirectionalLight | 产品感明显优于单光 |
| 6.2 | 阴影开关 | `castShadow` + `receiveShadow` + mapSize | 地面有清晰阴影 |
| 6.3 | 无阴影孪生光 | 大场景只用 Ambient + Hemisphere | 帧率对比 6.2 |

---

### 07 · 加载 glTF

教程：[07-load-gltf.md](../07-load-gltf.md)

| # | 实验 | 目标 | 验收 |
|---|------|------|------|
| 7.1 | 加载 Duck / DamagedHelmet | GLTFLoader + LoadingManager 进度条 | 进度 0→100%，失败有 UI 提示 |
| 7.2 | Draco | 同一模型普通 glb vs Draco | 体积与解码时间对比写进注释 |
| 7.3 | 归一化 | 任意模型 `normalize` 到单位盒 + 居中 | 相机 fit 一次成功 |

**→ 做到 7.1 即可启动 [作品集 P1](./02-portfolio-projects.md#p1-产品-3d-展示器)。**

---

### 08 · 交互

教程：[08-interaction.md](../08-interaction.md)

| # | 实验 | 目标 | 验收 |
|---|------|------|------|
| 8.1 | Orbit 预设 | min/max distance、阻尼、autoRotate | 产品展示 vs 孪生漫游两套 preset |
| 8.2 | 点击拾取 | Raycaster + 鼠标 click | 点击 mesh 变 emissive 高亮 |
| 8.3 | 悬停 cursor | mousemove 拾取改 `cursor: pointer` | 只对可交互物体生效 |
| 8.4 | 面板联动 | 点击后在 DOM 侧栏显示 `userData.id` | 3D 与 HTML 分工清晰 |

---

### 09 · 性能与释放

教程：[09-performance-and-dispose.md](../09-performance-and-dispose.md)

| # | 实验 | 目标 | 验收 |
|---|------|------|------|
| 9.1 | dispose 前后 | 反复 load/unload 同一 glb 10 次 | Memory 不持续爬升 |
| 9.2 | Stats.js | 显示 FPS + MS | 移动端 DPR cap 到 1.5 |
| 9.3 | 实例化对比 | 1000 立方体：1000 Mesh vs InstancedMesh | draw call 数量差异（Spector.js 可选） |

---

### 10 · 进项目

教程：[10-project-integration.md](../10-project-integration.md)

| # | 实验 | 目标 | 验收 |
|---|------|------|------|
| 10.1 | createScene 模块 | 抽出 `shared/createScene.js` | 业务 `main.js` 不超过 50 行 |
| 10.2 | Vue 挂载 | `onMounted` 创建 / `onUnmounted` destroy | 路由离开再回来无重复 canvas |
| 10.3 | 错误边界 | 模型 404 时 UI 降级 | 不白屏、不 uncaught |

---

## 进阶篇 · 11–19（选做）

每块选 **1～2 个** 做即可，优先和作品集方向一致。

| 章 | 教程 | 推荐实验 | Demo |
|----|------|----------|------|
| 11 HDRI | [11](../advanced/11-hdri-and-environment.md) | DamagedHelmet + HDR；对比无 HDRI | `advanced/11-hdri` |
| 12 后处理 | [12](../advanced/12-post-processing.md) | Outline / Bloom | `advanced/12-outline` · `12-bloom` |
| 13 动画 | [13](../advanced/13-animation-and-camera.md) | Mixer + flyTo | `advanced/13-animation` |
| 14 大场景 | [14](../advanced/14-large-scene-loading.md) | 分区 load/unload | `portfolio/p2` |
| 15 标注 | [15](../advanced/15-html-labels.md) | CSS2D 标签 | `portfolio/p2` |
| 16 Shader | [16](../advanced/16-custom-shader.md) | 热力 / 流动管线 | `advanced/16-shader` |
| 17 GIS | [17](../advanced/17-gis-coordinates.md) | 经纬度落点 | `advanced/17-gis` |
| 18 R3F/Tres | [18](../advanced/18-r3f-tres.md) | Vue Tres / React R3F | `advanced/18-tres` · `18-r3f` |
| 19 WebGPU | [19](../advanced/19-webgpu.md) | WebGL vs WebGPU | `labs/11-webgpu-renderer` |

运行：`pnpm threejs:dev` → 首页 **进阶 · Advanced** 区块。

WebGL ↔ Three.js 并排对照：[03-webgl-threejs-crosswalk](../../webgl/practices/03-webgl-threejs-crosswalk.md)

---

## WebGL 辅线（排错用）

配合 [WebGL 系列](../../webgl/README.md) 与 [webgl-demos](../../../apps/webgl-demos/README.md)：

| 建议顺序 | Demo | 解决什么问题 |
|----------|------|--------------|
| 1 | 07-orbit-camera | 理解 view / projection 矩阵 |
| 2 | 10-picking | 理解 Raycaster 底层 |
| 3 | 06-lit-cube | 材质发黑、法线错误 |
| 4 | 12-shader-gradient | 进阶 Shader 热身 |

---

## 导航

- [实践导读](./README.md)
- [02 · 作品集项目](./02-portfolio-projects.md)
- [基础系列目录](../README.md)
