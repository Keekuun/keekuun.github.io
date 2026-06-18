---
title: 18 · R3F / Tres 工程实战
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- React
- Vue
- R3F
- TresJS
---

# 18 · R3F / Tres 工程实战

> 在 React / Vue 3 中用声明式语法组织 Three 场景，并与 store 同步。

---

## 目录

- [适用场景](#适用场景)
- [何时仍用 vanilla](#何时仍用-vanilla)
- [React Three Fiber 结构](#react-three-fiber-结构)
- [drei 常用组件](#drei-常用组件)
- [TresJS 结构](#tresjs-结构)
- [与 store 同步](#与-store-同步)
- [dispose 与性能](#dispose-与性能)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 情况 | 建议 |
|------|------|
| 单页一个 model-viewer | vanilla + [10 封装](../10-project-integration.md) 足够 |
| React 里 3+ 3D 组件、状态交叉 | **R3F** |
| Vue 3 深度 3D | **TresJS** |
| 后处理、drei 辅助器多 | R3F 生态 |
| 团队不熟 React/Vue | 先 vanilla |

---

## 何时仍用 vanilla

- 排查黑屏 / 内存泄漏时，R3F 多一层抽象
- 极致 bundle 控制的小 H5
- 已有成熟 vanilla 模块，仅缺 UI 框架壳

框架 **不会自动** 帮你 dispose 业务加载的 glTF；仍须理解 [09 性能](../09-performance-and-dispose.md)。

---

## React Three Fiber 结构

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export function Viewer({ modelUrl }) {
  return (
    <Canvas camera={{ position: [0, 1, 5], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={['#111827']} />
      <Environment files="/hdr/studio_1k.hdr" />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <Suspense fallback={null}>
        <Model url={modelUrl} />
      </Suspense>
      <OrbitControls makeDefault enableDamping />
    </Canvas>
  );
}
```

`Canvas` 内部创建 renderer/scene/camera/loop，等价于 [10](../10-project-integration.md) 的 `createScene`。

---

## drei 常用组件

| 组件 | 作用 |
|------|------|
| `useGLTF` | 加载 + cache |
| `Environment` | HDRI（见 [11](./11-hdri-and-environment.md)） |
| `OrbitControls` | 交互 |
| `Html` | DOM 标注（见 [15](./15-html-labels.md)） |
| `Center` | 模型居中 |
| `Bounds` | 自适应相机 |

```jsx
import { Center, Bounds } from '@react-three/drei';

<Bounds fit clip observe margin={1.2}>
  <Center>
    <Model url={url} />
  </Center>
</Bounds>
```

---

## TresJS 结构

```vue
<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, GLTFModel, Environment } from '@tresjs/cientos';
</script>

<template>
  <TresCanvas window-size clear-color="#111827">
    <TresPerspectiveCamera :position="[0, 1, 5]" />
    <OrbitControls make-default />
    <Environment files="/hdr/studio_1k.hdr" />
    <Suspense>
      <GLTFModel path="/models/product.glb" />
    </Suspense>
  </TresCanvas>
</template>
```

与 R3F 概念一一对应：`TresCanvas` ≈ `Canvas`，cientos ≈ drei。

---

## 与 store 同步

```jsx
// Zustand / Redux
const alarmIds = useStore((s) => s.alarmIds);

function Device({ id, meshRef }) {
  const isAlarm = alarmIds.includes(id);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.material.emissive.set(isAlarm ? 0xff0000 : 0x000000);
    }
  });
  return <mesh ref={meshRef} ... />;
}
```

Vue 用 `watch(alarmIds, () => updateEmissive())` + ref 拿 mesh。

**原则**：业务 state 在 store；3D 层只 **读 state 改 material/visible**。

---

## dispose 与性能

```jsx
// useGLTF 缓存
useGLTF.preload('/models/a.glb');

// 卸载时清除 cache（少见）
useGLTF.clear('/models/a.glb');
```

R3F `dpr={[1, 2]}` 等价 cap pixelRatio。移动端关 `Environment` 高分辨率 HDR。

---

## 练习

1. R3F 或 Tres 复现 [02 第一个场景](../02-first-scene.md) 旋转立方体。
2. 加载 glTF + Environment + OrbitControls。
3. store 驱动某 mesh visible 切换。
4. 对比 vanilla 与 R3F 同场景 bundle 体积（build analyze）。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[17 · GIS 融合](./17-gis-coordinates.md)
- 下一篇：[19 · WebGPU](./19-webgpu.md)
