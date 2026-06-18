---
title: 12 · 后处理 EffectComposer
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- PostProcessing
---

# 12 · 后处理 EffectComposer

> 用 EffectComposer 实现选中描边、辉光（Bloom）、FXAA，以及移动端降级策略。

---

## 目录

- [适用场景](#适用场景)
- [后处理链路原理](#后处理链路原理)
- [基础 Composer 搭建](#基础-composer-搭建)
- [OutlinePass 选中描边](#outlinepass-选中描边)
- [UnrealBloomPass 辉光](#unrealbloombpass-辉光)
- [移动端降级](#移动端降级)
- [完整示例骨架](#完整示例骨架)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 需求 | Pass | 移动端 |
|------|------|--------|
| 点击部件高亮描边 | OutlinePass | 可保留，降分辨率 |
| 告警设备发光 | UnrealBloomPass | 建议关或弱强度 |
| 产品页「光晕」 | Bloom + 低 threshold | 桌面开 |
| 锯齿明显 | FXAA / SMAA | FXAA 较轻 |
| 孪生大屏性能优先 | 不用后处理 | — |

后处理 = **额外全屏绘制**，每加一个 Pass 多一次 framebuffer 读写，须 Profile 后再上生产。

---

## 后处理链路原理

```
Scene → RenderPass → [OutlinePass] → [BloomPass] → [OutputPass] → canvas
```

正常 `renderer.render` 直接画到屏幕；Composer 先画到 **离屏 RenderTarget**，再经 Pass 链处理。理解这点有助于排查「画面全黑 / 糊」——常是 Pass 顺序或 size 未同步 resize。

---

## 基础 Composer 搭建

```js
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new OutputPass());

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  composer.render(); // 替代 renderer.render
}

function onResize(w, h) {
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h); // 必须同步
}
```

---

## OutlinePass 选中描边

```js
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
);
outlinePass.edgeStrength = 3;
outlinePass.edgeGlow = 0.5;
outlinePass.edgeThickness = 1;
outlinePass.visibleEdgeColor.set(0x00ff88);
outlinePass.hiddenEdgeColor.set(0x004422);
composer.addPass(outlinePass);

// Raycaster 选中后
outlinePass.selectedObjects = [hitMesh];
```

`selectedObjects` 数组替换即切换高亮目标。hiddenEdge 控制被遮挡部分的描边颜色。

---

## UnrealBloomPass 辉光

```js
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.8,  // strength
  0.4,  // radius
  0.85  // threshold，高于此亮度才发光
);
composer.addPass(bloomPass);
```

配合 **高 emissive** 材质或告警色：

```js
mesh.material.emissive.set(0xff0000);
mesh.material.emissiveIntensity = 2;
```

threshold 越高，只有很亮的区域 bloom。

---

## 移动端降级

```js
const isMobile = matchMedia('(max-width: 768px)').matches;

function createComposer() {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  if (!isMobile) {
    composer.addPass(bloomPass);
    composer.addPass(outlinePass);
  }
  composer.addPass(new OutputPass());
  return composer;
}
```

或动态：`composer.passes.forEach(p => p.enabled = false)` 关闭 bloom。

---

## 完整示例骨架

```js
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(outlinePass);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  composer.render();
}
```

Pass 顺序：Render → 效果 → Output。Bloom 一般在 Outline 之后或之前视效果调整。

---

## 练习

1. 选中 mesh 切换 OutlinePass.selectedObjects。
2. 告警 mesh 开 emissive + Bloom，调 threshold。
3. resize 时 composer.setSize，观察不设置时的拉伸 bug。
4. 移动端 mock 关闭 bloom，对比 FPS。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[11 · HDRI](./11-hdri-and-environment.md)
- 下一篇：[13 · 动画与运镜](./13-animation-and-camera.md)
