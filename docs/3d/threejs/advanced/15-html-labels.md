---
title: 15 · HTML 标注融合
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- CSS2D
---

# 15 · HTML 标注融合

> 孪生热点、设备名称与数值：CSS2DRenderer 与手动投影两种方案。

---

## 目录

- [适用场景](#适用场景)
- [方案对比](#方案对比)
- [CSS2DRenderer](#css2drenderer)
- [手动投影 DOM](#手动投影-dom)
- [遮挡与可见性](#遮挡与可见性)
- [与 Vue 组件结合](#与-vue-组件结合)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 需求 | 推荐 |
|------|------|
| 设备名 + 实时数值 | CSS2D 或投影 DOM |
| 可点击 Tooltip | DOM `pointer-events: auto` |
| 纯 3D 文字 | TextGeometry / troika-three-text（性能差） |
| 上千标签 | 聚合/只显示视锥内 + 距离过滤 |

孪生页 **几乎必做**；产品页热点说明同样适用。

---

## 方案对比

| | CSS2DRenderer | 手动 project + absolute DOM |
|--|---------------|----------------------------|
| 实现 | 官方 addon，自动同步 | 自己算 x/y |
| 层级 | 独立 renderer.domElement 叠 canvas | 单容器 absolute |
| 性能 | 标签多时一般 | 可批量优化 |
| 推荐 | 标签 < 50 | 大屏自定义 UI 多 |

---

## CSS2DRenderer

```js
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(width, height);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

const div = document.createElement('div');
div.className = 'label';
div.textContent = '泵 #001 · 32℃';
const label = new CSS2DObject(div);
mesh.add(label); // 跟随 mesh 世界位置

function animate() {
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
```

```css
.label {
  padding: 4px 8px;
  background: rgba(0,0,0,.75);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
}
```

resize 时 **两个 renderer 都要 setSize**。

---

## 手动投影 DOM

```js
const labels = [{ id: 'p1', el: document.getElementById('l1'), object: mesh1 }];

function updateLabels(camera, width, height) {
  labels.forEach(({ el, object }) => {
    const pos = object.getWorldPosition(_v);
    pos.project(camera);
    if (pos.z > 1) {
      el.style.display = 'none';
      return;
    }
    el.style.display = 'block';
    el.style.transform = `translate(-50%,-100%) translate(${
      (pos.x * 0.5 + 0.5) * width
    }px, ${(-pos.y * 0.5 + 0.5) * height}px)`;
  });
}
```

适合标签 DOM 已在 Vue 模板里渲染的情况。

---

## 遮挡与可见性

CSS2D **不自动遮挡**（永远在上层）。若要「被墙挡住不显示」：

1. 相机到标签 **Raycaster** 检测中间 mesh
2. 或用 CSS3DRenderer（少见）

```js
function isOccluded(from, to, scene) {
  raycaster.set(from, to.clone().sub(from).normalize());
  const dist = from.distanceTo(to);
  const hits = raycaster.intersectObjects(scene.children, true);
  return hits.length && hits[0].distance < dist - 0.01;
}
```

---

## 与 Vue 组件结合

```vue
<div ref="host" class="viewer">
  <div ref="canvasHost" />
  <Teleport to="host">
    <div
      v-for="t in tags"
      :key="t.id"
      class="tag"
      :style="t.screenStyle"
    >{{ t.text }}</div>
  </Teleport>
</div>
```

store 更新设备数据 → 计算 `screenStyle` → `updateLabels` 在 rAF 里跑。

---

## 练习

1. CSS2DObject 钉在立方体上，移动 cube 观察跟随。
2. 手动 project 实现同样效果，对比代码量。
3. 标签在相机背后时隐藏（z > 1）。
4. WebSocket  mock 数据更新标签文字。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[14 · 大场景加载](./14-large-scene-loading.md)
- 下一篇：[16 · 自定义 Shader](./16-custom-shader.md)
