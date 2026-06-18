---
title: WebGL2 · 04 3D 纹理与 MRT
date: 2026-06-15
isComment: true
categories:
- WebGL2
tags:
- WebGL2
- MRT
- Tutorial
---

# WebGL2 · 04 3D 纹理与 MRT

> Demo：[22-webgl2-mrt](http://localhost:5173/examples/22-webgl2-mrt/) — 双 MRT 写 albedo + normal，Pass2 延迟光照。按 **M** 预览 G-Buffer。  
> 体积数据与多渲染目标——医学可视化、G-Buffer 延迟渲染的 WebGL2 基础。

---

## 3D 纹理

二维纹理是 `[width × height]`；**3D 纹理**是 `[width × height × depth]` 体素块。

```js
const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_3D, tex);
gl.texImage3D(
  gl.TEXTURE_3D,
  0, gl.RGBA,
  width, height, depth,
  0,
  gl.RGBA, gl.UNSIGNED_BYTE,
  data
);
gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
```

着色器：

```glsl
uniform sampler3D u_volume;
// ...
vec4 sample = texture(u_volume, vec3(u, v, w)); // w 为深度层 0~1
```

用途：CT/MRI 体绘制、云、噪声体积。Three.js `Data3DTexture`。

---

## 2D 纹理数组

`TEXTURE_2D_ARRAY`：多张同尺寸 2D 图叠在一起，shader 用 `vec3(uv, layerIndex)` 采样。适合纹理图集、地形 splat、多帧动画。

---

## MRT（Multiple Render Targets）

一次 fragment 输出 **多个颜色附件**：

```glsl
#version 300 es
layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outNormal;
layout(location = 2) out vec4 outPosition;

void main() {
  outColor = vec4(/* albedo */);
  outNormal = vec4(normalize(v_normal), 1.0);
  outPosition = vec4(v_worldPos, 1.0);
}
```

Framebuffer 挂载：

```js
gl.drawBuffers([
  gl.COLOR_ATTACHMENT0,
  gl.COLOR_ATTACHMENT1,
  gl.COLOR_ATTACHMENT2,
]);
// framebufferTexture2D 分别绑 tex0, tex1, tex2
```

Pass2 延迟光照只读 G-Buffer 纹理，不算复杂光照。

Demo [22-webgl2-mrt](http://localhost:5173/examples/22-webgl2-mrt/) 流程：

```
Pass1（MRT FBO）→ outAlbedo + outNormal
Pass2（屏幕）  → 采样两纹理，directional light
```

`shared/gl-utils.js` 提供 `createMRTFBO(gl, w, h, count)` 封装 `drawBuffers`。

Three.js 原生 MRT 支持有限，复杂后处理常用多 pass RenderTarget 代替；读引擎源码或自写 pass 时会见到。

---

## 与 [15 · FBO](../15-framebuffer.md) 的关系

WebGL1 FBO 通常 **一个** `COLOR_ATTACHMENT0`。WebGL2 MRT 扩展为多个 color attachment + `drawBuffers`。

---

## 练习

1. 创建 8×8×8 纯色 3D 纹理，FS 按 z 切片显示（扫 `w` uniform）。
2. 双 MRT：outColor + outNormal，Pass2 用法线着灰度。
3. 查 Three.js `Data3DTexture` 示例（官网 examples）。

---

## 导航

- [WebGL2 目录](./README.md)
- 上一篇：[03 · 实例化](./03-instancing.md)
- 下一阶段：[WebGPU 前瞻](../webgpu/README.md)
