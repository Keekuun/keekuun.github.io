---
title: 15 · 渲染到纹理 FBO
date: 2026-06-15
isComment: true
categories:
- WebGL
- 3D
tags:
- WebGL
- Framebuffer
- Tutorial
---

# 15 · 渲染到纹理 FBO

> 离屏渲染：把场景画到纹理上，再贴到屏幕——后处理与 `WebGLRenderTarget` 的底层原理。

---

## 目录

- [适用场景](#适用场景)
- [Framebuffer 概念](#framebuffer-概念)
- [创建 FBO](#创建-fbo)
- [渲染流程](#渲染流程)
- [镜子示例思路](#镜子示例思路)
- [与 Three.js 对照](#与-threejs-对照)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

- Three.js `EffectComposer`、选中描边、辉光（进阶 [12 · 后处理](../threejs/advanced/12-post-processing.md)）
- 小地图、监控画面「渲染到贴图」
- 动态反射（简化版镜子）

默认 WebGL 画到 **canvas 默认 framebuffer**（屏幕）。FBO 让你画到 **纹理 + 深度 renderbuffer**。

---

## Framebuffer 概念

```
正常：  Program → 默认 FBO → 屏幕
离屏：  Program → 自定义 FBO → colorTexture（可再采样）
                              → depthRenderbuffer
```

FBO 本身不可见，必须 **attach** 颜色附件（纹理或 renderbuffer）和深度附件。

---

## 创建 FBO

```js
function createFramebuffer(gl, width, height) {
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

  // 颜色附件：纹理
  const colorTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, colorTex);
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA,
    width, height, 0,
    gl.RGBA, gl.UNSIGNED_BYTE, null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D, colorTex, 0
  );

  // 深度附件
  const depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER, depthBuffer
  );

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error('Framebuffer incomplete: ' + status);
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { framebuffer: fb, texture: colorTex, depthBuffer };
}
```

---

## 渲染流程

每帧两 pass：

```js
const target = createFramebuffer(gl, canvas.width, canvas.height);

function render() {
  // Pass 1：场景 → 纹理
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawScene(viewProjection); // 立方体等同 09–14

  // Pass 2：全屏四边形，采样 target.texture 画到屏幕
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);
  drawFullscreenQuad(target.texture); // 正交投影 + 简单 texture2D shader
}
```

全屏 quad 顶点（NDC -1～1）：

```js
const quad = new Float32Array([
  -1, -1, 0, 0,
   1, -1, 1, 0,
  -1,  1, 0, 1,
  -1,  1, 0, 1,
   1, -1, 1, 0,
   1,  1, 1, 1,
]);
```

片段着色器 `gl_FragColor = texture2D(u_texture, v_uv)`。

---

## 镜子示例思路

1. 复制相机矩阵，沿镜面平面 **反射** 位置与 up 向量（翻转一个轴）。
2. Pass1 用反射相机渲染到 FBO。
3. Pass2 把 FBO 纹理贴到镜面四边形上。

完整数学较长，可先掌握「双 pass + 采样纹理」再扩展。Three.js `Reflector` 内部类似。

---

## 与 Three.js 对照

| WebGL | Three.js |
|-------|----------|
| `createFramebuffer` + color texture | `WebGLRenderTarget` |
| Pass1 离屏 + Pass2 全屏 | `EffectComposer` + `RenderPass` |
| `bindFramebuffer(null)` | render 回屏幕 |
| 多 color attachment | MRT（WebGL2 [04](./webgl2/04-3d-textures-and-mrt.md)） |

```js
const rt = new THREE.WebGLRenderTarget(w, h);
renderer.setRenderTarget(rt);
renderer.render(scene, camera);
renderer.setRenderTarget(null);
// rt.texture 传给后处理 shader
```

---

## 练习

1. Pass2 里对纹理做灰度：`dot(color.rgb, vec3(0.299, 0.587, 0.114))`——最小后处理。
2. 改 FBO 分辨率为 canvas 一半，看性能与清晰度。
3. FBO 未完成时 `checkFramebufferStatus` 返回值查 [07 · API](./07.md)。
4. Three.js `WebGLRenderTarget` + `ShaderMaterial` 实现同样双 pass。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[14 · 多物体与多 Program](./14-multiple-objects.md)
- 下一篇：[16 · 调试与工具](./16-debugging.md)
