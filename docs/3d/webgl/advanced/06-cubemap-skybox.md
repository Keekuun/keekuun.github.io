---
title: 进阶 · 环境 Cubemap 与天空盒
date: 2026-06-15
isComment: true
categories:
- WebGL
- Advanced
tags:
- WebGL
- Cubemap
- IBL
---

# 进阶 · 环境 Cubemap 与天空盒

> Demo：[14-skybox](http://localhost:5173/examples/14-skybox/) · 程序化 Cubemap + 场景立方体  
> 理解 HDRI / 环境反射的底层；对接 Three.js [11 HDRI](../../threejs/advanced/11-hdri-and-environment.md)。

---

## Cubemap 是什么

6 张面贴图组成 **立方体环境**：+X、-X、+Y、-Y、+Z、-Z。

```js
const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
const faces = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, /* ... */];
for (let i = 0; i < 6; i++) {
  gl.texImage2D(faces[i], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
}
gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
```

---

## 天空盒渲染

技巧：渲染时 **去掉平移**，只保留旋转，盒子永远在相机内：

```glsl
// 顶点
vec4 pos = u_viewRot * vec4(a_position, 1.0);
gl_Position = (pos.xyww); // z = w，深度为最远

// 片段
gl_FragColor = textureCube(u_skybox, a_position);
```

`gl_Position = pos.xyww` 使深度为 1.0，配合 `depthFunc = LEQUAL`。

---

## 环境反射（简化）

反射方向：`R = reflect(-V, N)`

```glsl
vec3 envColor = textureCube(u_envMap, reflect(-viewDir, normal)).rgb;
vec3 col = mix(diffuse, envColor, metallic);
```

完整 PBR 用 **PMREM** 预滤波 mip 链（Three.js `PMREMGenerator`）。

---

## Three.js 对照

```js
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
const hdr = await rgbeLoader.loadAsync('/hdr/studio.hdr');
hdr.mapping = THREE.EquirectangularReflectionMapping;
const envMap = pmrem.fromEquirectangular(hdr).texture;
scene.environment = envMap;
scene.background = envMap;
```

`scene.environment` 供 `MeshStandardMaterial` IBL 采样。

---

## 练习

1. 运行 Demo，观察相机绕场景旋转时天空与立方体。
2. 注释掉 `viewRot[12/13/14] = 0`，看天空盒平移错位。
3. 换 `createGradientCubemap` 六面颜色，自定义「假 HDR」。
4. Three.js：`scene.background = cubeTexture` 对比。

---

## 导航

- [进阶目录](./README.md)
- 上一篇：[05 后处理](./05-post-processing.md)
- 下一篇：[07 法线贴图](./07-normal-mapping.md)
