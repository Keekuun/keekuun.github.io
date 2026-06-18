---
title: 16 · 调试与工具
date: 2026-06-15
isComment: true
categories:
- WebGL
- 3D
tags:
- WebGL
- Debugging
- Tutorial
---

# 16 · 调试与工具

> 着色器编译失败、黑屏、/context lost——WebGL 日常排错清单与工具。

---

## 目录

- [适用场景](#适用场景)
- [着色器编译错误](#着色器编译错误)
- [黑屏 checklist](#黑屏-checklist)
- [Spector.js](#spectorjs)
- [Context Lost](#context-lost)
- [性能粗查](#性能粗查)
- [与 Three.js 对照](#与-threejs-对照)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

- `createShader` 没报错但画面全黑
- 生产环境偶发 WebGL 不可用
- 优化前需要知道瓶颈在 CPU 还是 GPU

---

## 着色器编译错误

**永远检查 compile 和 link 状态**（[01](./01.md) 模板）：

```js
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    const lines = source.split('\n').map((l, i) => `${i + 1}: ${l}`).join('\n');
    console.error('Shader compile error:\n', log, '\n', lines);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
```

常见错误：

| 报错关键词 | 原因 |
|------------|------|
| `undefined variable` | varying/uniform 名拼错、未声明 |
| `cannot convert` | 类型不匹配，`vec3` 赋给 `vec4` |
| `precision` | 片段着色器未写 `precision mediump float` |
| `loop index` | WebGL1 循环变量必须是常量 |

Link 失败常因 **顶点/片段 varying 类型不一致**。

---

## 黑屏 checklist

按顺序查（与 Three.js [02 黑屏](../threejs/02-first-scene.md) 对应）：

| # | 检查项 | WebGL 操作 |
|---|--------|------------|
| 1 | Context 拿到没 | `getContext('webgl')` 非 null |
| 2 | Canvas 尺寸 | `canvas.width/height` 非 0 |
| 3 | clear 颜色 | 是否被 `clearColor(0,0,0,1)` 盖住 |
| 4 | 深度 | 物体在 near/far 外；未 clear depth |
| 5 | 面剔除 | 顶点 winding 反了，正面被 cull |
| 6 | Program | `useProgram` 是否当前帧调用 |
| 7 | Attribute | `enableVertexAttribArray` + 正确 buffer |
| 8 | Uniform | 矩阵 NaN、未 upload |
| 9 | 视口 | `viewport` 与 canvas 尺寸一致 |
| 10 | 纹理 | 未初始化纹理采样全黑 |

调试技巧：**片段着色器强制纯色** `gl_FragColor = vec4(1,0,0,1)`，有红色说明管线通，问题在 uniform/矩阵。

---

## Spector.js

[Chrome 扩展 Spector.js](https://spector.babylonjs.com/) 可捕获一帧内所有 WebGL 调用：

- 每次 draw 用的 Program、纹理、Buffer
- Framebuffer 切换
- Uniform 实际值

用法：Capture → 看 `Commands` 列表 → 点开某次 `drawElements` 看 attachment。

Three.js 场景同样可抓——看底层替你在干什么。

---

## Context Lost

移动端切后台、GPU 驱动重置会导致 **WebGL context lost**：

```js
canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  cancelAnimationFrame(animId);
});

canvas.addEventListener('webglcontextrestored', () => {
  initGL(); // 重新创建 buffer、texture、program
  render();
});
```

Three.js：

```js
renderer.domElement.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
});
```

丢失后必须 **重建所有 GPU 资源**，不能复用旧 handle。

---

## 性能粗查

| 工具 | 看什么 |
|------|--------|
| Chrome Performance | CPU `requestAnimationFrame` 耗时 |
| `renderer.info`（Three） | draw calls、 triangles |
| Spector | 重复 `useProgram`、过大 texture |
| `gl.getParameter(gl.MAX_TEXTURE_SIZE)` | 设备上限 |

WebGL1 阶段优化优先级：

1. 减少 draw call（[14](./14-multiple-objects.md)）
2. 纹理尺寸、mipmap
3. 离屏 FBO 分辨率（[15](./15-framebuffer.md)）
4. 再考虑 WebGL2 实例化

---

## 与 Three.js 对照

| 问题 | WebGL 查 | Three.js 查 |
|------|----------|-------------|
| 全黑 | 强制红色 fragment | `MeshBasicMaterial` 排除光照 |
| 编译错误 | `getShaderInfoLog` | `onCompile`（ShaderMaterial） |
| 贴图 | 纹理 unit、flipY | `material.map`、encoding |
| 性能 | draw 次数 | `renderer.info` |

---

## 练习

1. 故意删掉片段着色器 `precision`，看编译 log。
2. 用 Spector 抓一帧 09 立方体，数 `drawElements` 次数。
3. 写 `logGLState(gl)` 打印 `CURRENT_PROGRAM`、`ARRAY_BUFFER_BINDING`。
4. 模拟 context lost：`WEBGL_lose_context` 扩展 `loseContext()`（Chrome 可用）。

```js
const ext = gl.getExtension('WEBGL_lose_context');
// ext.loseContext();  // 测试恢复逻辑
```

---

## 导航

- [系列目录](./README.md)
- 上一篇：[15 · 渲染到纹理 FBO](./15-framebuffer.md)
- 下一阶段：[WebGL2 系列目录](./webgl2/README.md)
