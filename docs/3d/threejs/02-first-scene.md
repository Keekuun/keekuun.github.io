---
title: 02 · 第一个 Three.js 场景
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- WebGL
- Tutorial
---

# 02 · 第一个 Three.js 场景

> 跑通旋转立方体，并理解 Renderer 配置、render loop 与 resize 在工程里何时必须做。

---

## 目录

- [适用场景](#适用场景)
- [搭建项目](#搭建项目)
- [完整代码](#完整代码)
- [Renderer 深度配置](#renderer-深度配置)
- [render loop 与 Clock](#render-loop-与-clock)
- [resize 与 DPR](#resize-与-dpr)
- [黑屏排查](#黑屏排查)
- [与 ECharts 对照](#与-echarts-对照)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

本章的「最小四件套」适用于：

- **技术验证 / POC**：确认浏览器 WebGL 可用、模型路径正确
- **Loading 占位**：模型下载前先显示简单几何体，避免白屏
- **单元调试**： isolate 相机、材质问题，排除 glTF 干扰
- **教学基线**：后续所有章节都在此基础上叠加

不适用于：直接上线的产品展示（至少需要 [06 光](./06-lights-and-shadows.md)、[07 glTF](./07-load-gltf.md)、[08 交互](./08-interaction.md)）。

---

## 搭建项目

```bash
pnpm create vite three-demo --template vanilla
cd three-demo
pnpm add three
pnpm dev
```

`index.html` 全屏容器（canvas 父元素 **必须有宽高**）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>first-scene</title>
    <style>
      * { margin: 0; box-sizing: border-box; }
      #app { width: 100vw; height: 100vh; overflow: hidden; }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

---

## 完整代码

```js
import * as THREE from 'three';

const container = document.querySelector('#app');
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111827);

const camera = new THREE.PerspectiveCamera(
  60,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);
camera.position.set(2, 2, 3);
camera.lookAt(0, 0, 0);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x22c55e });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  cube.rotation.x += delta * 0.8;
  cube.rotation.y += delta * 1.2;
  renderer.render(scene, camera);
}
animate();

function onResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', onResize);
```

---

## Renderer 深度配置

| 选项 | 作用 | 工程建议 |
|------|------|----------|
| `antialias` | MSAA 抗锯齿 | 桌面开；低端移动可关 |
| `alpha: true` | canvas 透明背景 | 3D 叠在 2D UI 上时用 |
| `powerPreference` | GPU 选型提示 | `'high-performance'` 或 `'low-power'` |
| `preserveDrawingBuffer` | 保留帧缓冲 | 截图、`<canvas>.toDataURL` 时需要 |
| `outputColorSpace` | 输出色彩空间 | **必须** `SRGBColorSpace`，否则颜色偏 |

```js
// 3D canvas 叠在大屏 UI 上
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0); // 完全透明
```

**多 canvas 注意**：每个 `WebGLRenderer` 占一个 WebGL context；移动端 context 数量有限（通常 8–16），大屏多 3D 区块要考虑合并或懒加载。

---

## render loop 与 Clock

```js
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta(); // 秒，上一帧间隔
  cube.rotation.y += delta;       // 帧率无关的旋转速度
  renderer.render(scene, camera);
}
```

**为何用 delta**：`rotation += 0.01` 在 60fps 和 120fps 下转速不同；产品页动画、相机运镜应 **与时间绑定**，而非与帧数绑定。

**何时可以不 loop**：

- 静态产品图：render 一次即可（仍须至少 call 一次 `render`）
- 按需渲染：`controls.addEventListener('change', render)`，用户不动就不画——省 GPU，适合配置器

```js
// 按需渲染模式（OrbitControls 场景常见）
controls.addEventListener('change', () => renderer.render(scene, camera));
renderer.render(scene, camera); // 初始一帧
```

---

## resize 与 DPR

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

Retina 屏 DPR=3 时，全 DPR 意味着 9 倍像素填充，移动端必卡。**工业项目常用 cap 为 2**。

resize 三步缺一不可：

```js
camera.aspect = w / h;
camera.updateProjectionMatrix(); // 只改 aspect 不够，须更新投影矩阵
renderer.setSize(w, h);
```

大屏侧边栏折叠导致容器宽度变化时，应用 `ResizeObserver` 而非仅 `window.resize`：

```js
new ResizeObserver(onResize).observe(container);
```

---

## 黑屏排查

| 顺序 | 检查项 | 深层原因 |
|------|--------|----------|
| 1 | Console 报错 | import 路径、WebGL 不支持 |
| 2 | canvas 在 DOM 中 | 未 appendChild |
| 3 | 相机位置 | 与物体重叠；far 太小物体被裁 |
| 4 | scene.add | 对象未进场景图 |
| 5 | 容器 0×0 | flex 子项未设 min-height |
| 6 | 材质 | Standard 无灯；Basic 才有色 |
| 7 | context 丢失 | 移动端切后台过久，需监听 `webglcontextlost` |

```js
renderer.domElement.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  cancelAnimationFrame(animationId);
});
```

---

## 与 ECharts 对照

| Three.js | ECharts |
|----------|---------|
| `WebGLRenderer` + 挂 DOM | `echarts.init(dom)` |
| `scene.add` | `setOption` |
| 每帧 / 按需 `render` | 数据驱动重绘 |
| `ResizeObserver` + setSize | `chart.resize()` |

业务架构：**框架管数据和 DOM 布局，Three 只管 canvas 容器**——与大屏单独 div 挂图表相同。

---

## 练习

1. 改 `powerPreference`、关 `antialias`，用 Performance 面板对比 GPU 时间。
2. 实现 **按需渲染**：只有鼠标拖动 OrbitControls 时才 render（需先加 [08](./08-interaction.md) 的 controls，或手动改 rotation 触发）。
3. 用 `ResizeObserver` 替换 `window.resize`。
4. `alpha: true` 让 3D 浮在彩色 CSS 背景上。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[01 · 从传统前端到 Web 3D](./01-from-dashboard-to-3d.md)
- 下一篇：[03 · 场景图与坐标](./03-scene-graph-and-coordinates.md)
