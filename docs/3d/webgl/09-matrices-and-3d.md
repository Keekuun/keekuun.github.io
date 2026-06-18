---
title: 09 · 矩阵与 3D 空间
date: 2026-06-15
isComment: true
categories:
- WebGL
- 3D
tags:
- WebGL
- MVP
- Tutorial
---

# 09 · 矩阵与 3D 空间

> 从 2D 裁剪空间进入真正的 3D：理解 MVP 变换，画出第一个可旋转的 3D 立方体。

---

## 目录

- [适用场景](#适用场景)
- [坐标空间一览](#坐标空间一览)
- [MVP 是什么](#mvp-是什么)
- [搭建项目](#搭建项目)
- [可运行 Demo](#可运行-demo)
- [顶点着色器](#顶点着色器)
- [完整代码](#完整代码)
- [与 Three.js 对照](#与-threejs-对照)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

- Three.js 里改 `camera.position` / `mesh.rotation` 不知道在改什么
- 自定义 `ShaderMaterial` 需要传 `projectionMatrix`、`modelViewMatrix`
- 物体变形、远近不对——多半是矩阵或 FOV 问题

01–08 只在 **2D 裁剪空间**（-1～1）画三角形；从本篇起进入 **3D 世界空间**。

---

## 坐标空间一览

```
局部空间 (Local)
    ↓ Model 矩阵
世界空间 (World)
    ↓ View 矩阵（相机）
相机/观察空间 (Camera)
    ↓ Projection 矩阵
裁剪空间 (Clip)  ← gl_Position 在这里
    ↓ 透视除法 + viewport
屏幕空间 (Screen)
```

WebGL 只要求顶点着色器输出 **裁剪空间** 的 `gl_Position`；前面三个矩阵在 JS 里乘好，作为 Uniform 传入。

---

## MVP 是什么

| 矩阵 | 作用 | Three.js 对应 |
|------|------|---------------|
| **Model** | 物体平移/旋转/缩放 | `mesh.matrixWorld` |
| **View** | 相机看向场景 | `camera.matrixWorldInverse` |
| **Projection** | 透视或正交 | `camera.projectionMatrix` |

常见组合：

```glsl
// 顶点着色器
uniform mat4 u_matrix;  // projection * view * model（JS 侧预先相乘）

void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
}
```

透视投影让远处物体变小；正交投影（工程图）远近一样大。产品展示多用 **透视**。

---

## 搭建项目

### 方式 A · 本仓库 Demo（推荐）

```bash
pnpm --dir apps/webgl-demos install
pnpm webgl:dev
```

浏览器打开 http://localhost:5173/examples/02-cube-rotate/ ，对照 `examples/02-cube-rotate/main.js` 阅读。

### 方式 B · 新建 Vite 项目

```bash
pnpm create vite webgl-cube --template vanilla
cd webgl-cube
pnpm dev
```

`index.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>webgl-cube</title>
  <style>
    * { margin: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #111; }
    canvas { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script type="module" src="/main.js"></script>
</body>
</html>
```

从 [webglfundamentals](https://webglfundamentals.org/webgl/resources/webgl-utils.js) 和 [m4.js](https://webglfundamentals.org/3rdparty/m4.js) 下载到 `public/`，或直接使用本仓库 `apps/webgl-demos/shared/` 下的同名模块。

---

## 可运行 Demo

| 项 | 链接 |
|----|------|
| 旋转立方体 | http://localhost:5173/examples/02-cube-rotate/ |
| 索引版 | http://localhost:5173/examples/03-cube-indexed/ |
| 源码 | `apps/webgl-demos/examples/02-cube-rotate/main.js` |

下文完整代码与 Demo 逻辑一致，可二选一阅读。

---

## 顶点着色器

```glsl
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}
```

片段着色器沿用 [04 · 片段着色器](./04.md) 的 `varying` 传色即可。

---

## 完整代码

立方体 8 个顶点 × 6 面 × 2 三角形 = 36 顶点（先不优化索引，10 篇再改 `drawElements`）：

```js
// main.js — 依赖 public/webgl-utils.js 与 public/m4.js（script 引入或复制函数）

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }
  return program;
}

const vsSource = `
attribute vec4 a_position;
attribute vec4 a_color;
uniform mat4 u_matrix;
varying vec4 v_color;
void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}
`;

const fsSource = `
precision mediump float;
varying vec4 v_color;
void main() {
  gl_FragColor = v_color;
}
`;

// 立方体顶点（每面 2 三角形，共 36 点）
const CUBE_POSITIONS = [
  // front
  -1, -1,  1,   1, -1,  1,   1,  1,  1,
  -1, -1,  1,   1,  1,  1,  -1,  1,  1,
  // back
  -1, -1, -1,  -1,  1, -1,   1,  1, -1,
  -1, -1, -1,   1,  1, -1,   1, -1, -1,
  // top
  -1,  1, -1,  -1,  1,  1,   1,  1,  1,
  -1,  1, -1,   1,  1,  1,   1,  1, -1,
  // bottom
  -1, -1, -1,   1, -1, -1,   1, -1,  1,
  -1, -1, -1,   1, -1,  1,  -1, -1,  1,
  // right
   1, -1, -1,   1,  1, -1,   1,  1,  1,
   1, -1, -1,   1,  1,  1,   1, -1,  1,
  // left
  -1, -1, -1,  -1, -1,  1,  -1,  1,  1,
  -1, -1, -1,  -1,  1,  1,  -1,  1, -1,
];

const CUBE_COLORS = [];
const FACE_COLORS = [
  [1, 0, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1],
  [1, 1, 0, 1], [0, 1, 1, 1], [1, 0, 1, 1],
];
for (const c of FACE_COLORS) {
  for (let i = 0; i < 6; i++) CUBE_COLORS.push(...c);
}

function resizeCanvasToDisplaySize(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.floor(canvas.clientWidth * dpr);
  const h = Math.floor(canvas.clientHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    return true;
  }
  return false;
}

function main() {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    alert('WebGL not supported');
    return;
  }

  const program = createProgram(gl, vsSource, fsSource);
  const positionLoc = gl.getAttribLocation(program, 'a_position');
  const colorLoc = gl.getAttribLocation(program, 'a_color');
  const matrixLoc = gl.getUniformLocation(program, 'u_matrix');

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(CUBE_POSITIONS), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(CUBE_COLORS), gl.STATIC_DRAW);

  const fieldOfViewRadians = (60 * Math.PI) / 180;
  const cameraTarget = [0, 0, 0];
  const cameraUp = [0, 1, 0];
  let cameraPosition = [0, 0, 4];
  let rotation = 0;

  function render(time) {
    time *= 0.001;
    rotation = time;

    if (resizeCanvasToDisplaySize(canvas)) {
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    gl.clearColor(0.1, 0.1, 0.12, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    // position
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

    // color
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(colorLoc);
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);

    const aspect = canvas.clientWidth / canvas.clientHeight;
    const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 0.1, 100);
    const viewMatrix = m4.lookAt(cameraPosition, cameraTarget, cameraUp);
    const modelMatrix = m4.yRotation(rotation);
    const matrix = m4.multiply(projectionMatrix, viewMatrix);
    const finalMatrix = m4.multiply(matrix, modelMatrix);

    gl.uniformMatrix4fv(matrixLoc, false, finalMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
```

`index.html` 在 `main.js` 前引入 m4：

```html
<script src="/m4.js"></script>
```

> **注意**：本篇暂未开深度测试，立方体各面会「穿透」叠在一起。下一篇 [11 · 深度与面剔除](./11-depth-and-culling.md) 解决；也可先跳到 10 用索引缓冲减少顶点。

---

## 与 Three.js 对照

| WebGL 手写 | Three.js |
|------------|----------|
| `m4.perspective(fov, aspect, near, far)` | `PerspectiveCamera(fov, aspect, near, far)` |
| `m4.lookAt(eye, target, up)` | `camera.lookAt(target)` |
| `m4.yRotation(rad)` | `mesh.rotation.y = rad` |
| `u_matrix` 一次传入 | 内部 `projectionMatrix * modelViewMatrix` |
| `gl.drawArrays(TRIANGLES, 0, 36)` | `renderer.render(scene, camera)` |

Three.js [04 · 相机](../threejs/04-camera.md) 里的 FOV、near/far 裁剪，对应这里的 `perspective` 第三、四个参数。

---

## 练习

1. 把 FOV 改成 `30` 和 `120`，观察立方体大小变化。
2. 把 `cameraPosition` 的 z 改成 `1`（进入立方体内部）——会怎样？（配合 11 深度测试后再试一次。）
3. 只改 `modelMatrix`：叠加 `m4.xRotation(time * 0.7)` 做双轴旋转。
4. 对比 Three.js 同场景：用 `Mesh` + `BoxGeometry` + `MeshBasicMaterial({ vertexColors: true })` 看 API 替你做掉了哪些矩阵工作。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[08 · Canvas 交互](./08.md)
- 下一篇：[10 · 索引缓冲](./10-index-buffer.md)
