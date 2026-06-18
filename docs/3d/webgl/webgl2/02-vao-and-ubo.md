---
title: WebGL2 · 02 VAO 与 UBO
date: 2026-06-15
isComment: true
categories:
- WebGL2
tags:
- WebGL2
- VAO
- UBO
- Tutorial
---

# WebGL2 · 02 VAO 与 UBO

> Demo：[18-webgl2-vao](http://localhost:5173/examples/18-webgl2-vao/) · VAO  
> Demo：[20-webgl2-ubo](http://localhost:5173/examples/20-webgl2-ubo/) · UBO 共享 ViewProjection  
> 顶点数组对象保存 attribute 绑定；Uniform Buffer Object 批量传 uniform——Three.js 底层的两个性能关键。

---

## VAO（Vertex Array Object）

WebGL1 每帧都要：

```js
gl.bindBuffer(ARRAY_BUFFER, posBuf);
gl.vertexAttribPointer(...);
gl.enableVertexAttribArray(posLoc);
// 每个 attribute 重复一遍
```

WebGL2：**绑定状态录进 VAO**，切换物体只 `bindVertexArray`：

```js
function createVAO(gl, program, buffers) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.enableVertexAttribArray(buffers.positionLoc);
  gl.vertexAttribPointer(buffers.positionLoc, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.enableVertexAttribArray(buffers.colorLoc);
  gl.vertexAttribPointer(buffers.colorLoc, 4, gl.FLOAT, false, 0, 0);

  if (buffers.index) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
  }

  gl.bindVertexArray(null);
  return vao;
}

// 绘制
gl.bindVertexArray(cubeVAO);
gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
gl.bindVertexArray(null);
```

多 mesh 多 VAO，同 mesh 不同 matrix 仍多次 draw（实例化见 [03](./03-instancing.md)）。

---

## UBO（Uniform Buffer Object）

全局变量太多时，逐个 `uniformMatrix4fv` 慢。UBO 把 uniform 块放进 buffer，多个 Program 可 **绑定同一 UBO**。

GLSL：

```glsl
uniform SceneBlock {
  mat4 projection;
  mat4 view;
  vec3 lightDirection;
};
```

注意：UBO 内字段有 **std140 对齐规则**（vec3 后可能 padding）。生产环境常用 [twgl](https://twgljs.org/) 或手写 offset。

JS 概要：

```js
const blockIndex = gl.getUniformBlockIndex(program, 'SceneBlock');
gl.uniformBlockBinding(program, blockIndex, 0); // binding point 0

const ubo = gl.createBuffer();
gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
gl.bufferData(gl.UNIFORM_BUFFER, data, gl.DYNAMIC_DRAW);
gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo);
```

每帧只更新 buffer 内容，不必对每个 uniform 调 `gl.uniform*`。

---

## 与 Three.js

- `WebGLBindingStates` 内部维护 VAO per geometry + program
- 多 material 共享的 camera/light uniform 可走 UBO（版本随 three.js 演进）

读源码关键词：`WebGLVertexArrayObjects`、`WebGLUniformBufferObjects`。

---

## 练习

1. 给两个立方体各建 VAO，切换绘制只改 matrix。
2. 用 UBO 传 `projection + view`，运行 [20-webgl2-ubo](http://localhost:5173/examples/20-webgl2-ubo/) 对照源码。
3. Spector 对比 WebGL1 与 VAO 版本的 API 调用次数。

---

## 导航

- [WebGL2 目录](./README.md)
- 上一篇：[01 · GLSL 300 es](./01-glsl-300-es.md)
- 下一篇：[03 · 实例化](./03-instancing.md)
