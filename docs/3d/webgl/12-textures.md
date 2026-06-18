---
title: 12 · 纹理映射
date: 2026-06-15
isComment: true
categories:
- WebGL
- 3D
tags:
- WebGL
- Texture
- UV
- Tutorial
---

# 12 · 纹理映射

> 给 3D 立方体贴图：UV 坐标、纹理参数、在着色器里采样——搞懂 Three.js 贴图翻转与模糊从哪来。

---

## 目录

- [适用场景](#适用场景)
- [UV 坐标](#uv-坐标)
- [创建纹理](#创建纹理)
- [着色器采样](#着色器采样)
- [纹理参数](#纹理参数)
- [加载图片](#加载图片)
- [与 Three.js 对照](#与-threejs-对照)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

- glTF 模型贴图显示错误、上下颠倒
- 贴图近处清晰远处马赛克——filter / mipmap
- 自定义 Shader 里读 `map` 采样

---

## UV 坐标

纹理坐标 **UV** 范围通常是 0～1，与顶点一一对应：

```
(0,1) ---- (1,1)
  |          |
  |   图片    |
  |          |
(0,0) ---- (1,0)
```

立方体每个面需要 4 个顶点的 UV（配合索引 6 索引/面）：

```js
const uvs = [
  // front face
  0, 0,  1, 0,  1, 1,  0, 1,
  // ... 其余 5 面
];
```

`a_texcoord` 经 varying 传给片段着色器。

---

## 创建纹理

```js
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

// 1×1 蓝色占位，避免采样未初始化纹理（黑块）
gl.texImage2D(
  gl.TEXTURE_2D, 0, gl.RGBA,
  1, 1, 0,
  gl.RGBA, gl.UNSIGNED_BYTE,
  new Uint8Array([0, 0, 255, 255])
);

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
```

---

## 着色器采样

```glsl
// 顶点
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  v_texcoord = a_texcoord;
}

// 片段
precision mediump float;
uniform sampler2D u_texture;
varying vec2 v_texcoord;
void main() {
  gl_FragColor = texture2D(u_texture, v_texcoord);
}
```

绑定纹理单元（[04](./04.md) 讲过）：

```js
const unit = 0;
gl.activeTexture(gl.TEXTURE0 + unit);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.uniform1i(gl.getUniformLocation(program, 'u_texture'), unit);
```

---

## 纹理参数

| 参数 | 常用值 | 效果 |
|------|--------|------|
| `TEXTURE_WRAP_S/T` | `REPEAT` / `CLAMP_TO_EDGE` | 超出 0～1 时重复或夹边 |
| `TEXTURE_MIN_FILTER` | `LINEAR_MIPMAP_LINEAR` | 缩小时用 mipmap 抗锯齿 |
| `TEXTURE_MAG_FILTER` | `LINEAR` | 放大时线性插值 |

生成 mipmap：

```js
gl.generateMipmap(gl.TEXTURE_2D);
// MIN_FILTER 需设为 LINEAR_MIPMAP_LINEAR 等
```

非 2 的幂尺寸图片（WebGL1）只能用 `CLAMP_TO_EDGE` + 非 mipmap filter，否则报错。

---

## 加载图片

```js
const image = new Image();
image.crossOrigin = 'anonymous';
image.src = '/textures/crate.jpg';
image.onload = () => {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // 常见：翻转 Y 对齐 OpenGL
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  render(); // 触发重绘
};
```

`UNPACK_FLIP_Y_WEBGL` 与 Three.js `texture.flipY` 对应——glTF 通常 `flipY = false`。

---

## 与 Three.js 对照

| WebGL | Three.js |
|-------|----------|
| `a_texcoord` | `geometry.attributes.uv` |
| `texture2D(u_texture, v_uv)` | `map` 采样 |
| `UNPACK_FLIP_Y_WEBGL` | `texture.flipY` |
| `CLAMP_TO_EDGE` | `ClampToEdgeWrapping` |
| `generateMipmap` | `renderer` 自动处理 |

贴图上下颠倒：先试 `flipY`，再查 UV 导出工具（Blender glTF 导出选项）。

---

## 练习

1. 同一立方体：三面贴图、三面纯色，理解 attribute 组合。
2. `WRAP_S = REPEAT`，UV 设为 0～2，看重叠。
3. `NEAREST` vs `LINEAR` 放大贴图对比像素感。
4. Three.js `TextureLoader` 加载同一张图，对比 flipY 开/关。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[11 · 深度与面剔除](./11-depth-and-culling.md)
- 下一篇：[13 · 光照模型](./13-lighting.md)
