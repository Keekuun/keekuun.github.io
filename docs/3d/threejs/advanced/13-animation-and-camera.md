---
title: 13 · 动画与运镜
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Animation
---

# 13 · 动画与运镜

> glTF 骨骼/变形动画、AnimationMixer，以及相机 flyTo 与 GSAP 运镜。

---

## 目录

- [适用场景](#适用场景)
- [AnimationMixer 基础](#animationmixer-基础)
- [多 clip 切换](#多-clip-切换)
- [相机 flyTo](#相机-flyto)
- [GSAP 与属性补间](#gsap-与属性补间)
- [与 OrbitControls 协作](#与-orbitcontrols-协作)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 需求 | 方案 |
|------|------|
| 模型自带开门/运转动画 | AnimationMixer + glTF clips |
| 镜头飞到某设备 | flyTo 插值 position + target |
| 产品页 idle 旋转 | OrbitControls.autoRotate 或 Rig rotation |
| 配置器换部件过渡 | GSAP tween scale/position |
| 孪生状态切换颜色 | GSAP emissive / material（非骨骼） |

---

## AnimationMixer 基础

```js
let mixer;
let clock = new THREE.Clock();

loader.load('/models/robot.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
  const clip = gltf.animations[0];
  const action = mixer.clipAction(clip);
  action.play();
});

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  mixer?.update(delta);
  controls.update();
  renderer.render(scene, camera);
}
```

**delta 必传**：`mixer.update(delta)` 用真实时间推进，与帧率无关。

---

## 多 clip 切换

```js
const actions = {};
gltf.animations.forEach((clip) => {
  actions[clip.name] = mixer.clipAction(clip);
});

function playClip(name, fade = 0.3) {
  const next = actions[name];
  if (!next) return;
  const prev = Object.values(actions).find((a) => a.isRunning());
  if (prev) prev.fadeOut(fade);
  next.reset().fadeIn(fade).play();
}

playClip('DoorOpen');
```

`loop: THREE.LoopOnce` + `clampWhenFinished: true` 用于单次动画（开门停住）。

---

## 相机 flyTo

```js
function flyTo(camera, controls, targetPos, targetLookAt, duration, onDone) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const start = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = t * t * (3 - 2 * t); // smoothstep
    camera.position.lerpVectors(startPos, targetPos, ease);
    controls.target.lerpVectors(startTarget, targetLookAt, ease);
    controls.update();
    if (t < 1) requestAnimationFrame(tick);
    else onDone?.();
  }
  requestAnimationFrame(tick);
}

flyTo(
  camera,
  controls,
  new THREE.Vector3(2, 1, 4),
  new THREE.Vector3(0, 0.5, 0),
  1200
);
```

孪生：点击设备列表 → flyTo 该设备包围盒中心。

---

## GSAP 与属性补间

```js
import gsap from 'gsap';

gsap.to(mesh.rotation, { y: Math.PI * 2, duration: 2, ease: 'power2.inOut' });
gsap.to(mesh.material, { emissiveIntensity: 1, duration: 0.5, yoyo: true, repeat: 3 });
```

GSAP 适合 **非骨骼** 属性；骨骼动画仍用 Mixer。

---

## 与 OrbitControls 协作

- flyTo 期间：`controls.enabled = false`，结束再开
- autoRotate：`controls.autoRotate = true`，用户 drag 时暂停（OrbitControls 默认行为）
- Mixer 与 Controls 同在 animate 更新

---

## 练习

1. 加载带动画的 glTF，列出所有 clip 名并逐个播放。
2. 实现 `playClip(name)` 带 crossFade。
3. 点击 mesh 后 flyTo 该物体。
4. GSAP 实现告警 emissive 闪烁 3 次。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[12 · 后处理](./12-post-processing.md)
- 下一篇：[14 · 大场景加载](./14-large-scene-loading.md)
