# WebGL Demos

配合博客 `docs/3d/webgl` 的可运行示例集合。

## 运行

```bash
# 在仓库根目录
pnpm --dir apps/webgl-demos install
pnpm --dir apps/webgl-demos dev
```

浏览器打开 http://localhost:5173 ，从首页进入各示例。

## 构建

```bash
pnpm --dir apps/webgl-demos build
pnpm --dir apps/webgl-demos preview
```

## 目录

```
apps/webgl-demos/
├── index.html          # 示例导航页
├── shared/
│   ├── gl-utils.js     # 着色器、缓冲、立方体几何
│   ├── m4.js           # 矩阵（精简版 m4）
│   └── demo.css        # 示例页样式
└── examples/
    ├── 01-triangle/
    ├── 02-cube-rotate/
    └── ...
```

## 与文档对应

| Demo | 文档 |
|------|------|
| 01-triangle | [01 基础概念](../../docs/3d/webgl/01.md) |
| 02-cube-rotate | [09 矩阵与 3D](../../docs/3d/webgl/09-matrices-and-3d.md) |
| 03-cube-indexed | [10 索引缓冲](../../docs/3d/webgl/10-index-buffer.md) |
| 04-depth-cubes | [11 深度与剔除](../../docs/3d/webgl/11-depth-and-culling.md) |
| 05-textured-cube | [12 纹理](../../docs/3d/webgl/12-textures.md) |
| 06-lit-cube | [13 光照](../../docs/3d/webgl/13-lighting.md) |
| 07-orbit-camera | [实践 02 轨道相机](../../docs/3d/webgl/practices/02-orbit-camera.md) |
| 08-fbo-grayscale | [15 FBO](../../docs/3d/webgl/15-framebuffer.md) |
| 09-instancing | [WebGL2 03 实例化](../../docs/3d/webgl/webgl2/03-instancing.md) |
| 10-picking | [进阶 01 拾取](../../docs/3d/webgl/advanced/01-picking.md) |
| 11-particles | [进阶 02 粒子](../../docs/3d/webgl/advanced/02-particles.md) |
| 12-shader-gradient | [进阶 03 热力 Shader](../../docs/3d/webgl/advanced/03-heatmap-shader.md) |
| 13-shadow-mapping | [进阶 04 阴影贴图](../../docs/3d/webgl/advanced/04-shadow-mapping.md) |
| 14-skybox | [进阶 06 Cubemap](../../docs/3d/webgl/advanced/06-cubemap-skybox.md) |
| 15-blur-post | [进阶 05 后处理链](../../docs/3d/webgl/advanced/05-post-processing.md) |
| 16-normal-map | [进阶 07 法线贴图](../../docs/3d/webgl/advanced/07-normal-mapping.md) |
| 17-bloom-post | [进阶 08 Bloom](../../docs/3d/webgl/advanced/08-bloom.md) |
| 18-webgl2-vao | [WebGL2 02 VAO](../../docs/3d/webgl/webgl2/02-vao-and-ubo.md) |
| 19-webgpu-triangle | [WebGPU 01 三角形](../../docs/3d/webgl/webgpu/01-first-triangle.md) |
| 20-webgl2-ubo | [WebGL2 02 UBO](../../docs/3d/webgl/webgl2/02-vao-and-ubo.md) |
| 21-webgpu-compute | [WebGPU 02 Compute 粒子](../../docs/3d/webgl/webgpu/02-compute-particles.md) |
| 22-webgl2-mrt | [WebGL2 04 MRT G-Buffer](../../docs/3d/webgl/webgl2/04-3d-textures-and-mrt.md) |

与 Three.js Demo 对照见 [03-webgl-threejs-crosswalk](../../docs/3d/webgl/practices/03-webgl-threejs-crosswalk.md)。
