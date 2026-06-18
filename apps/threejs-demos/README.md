# Three.js Demos

配合博客 `docs/3d/threejs/practices` 的可运行示例。

## 运行

```bash
pnpm --dir apps/threejs-demos install
pnpm --dir apps/threejs-demos dev
```

浏览器打开 http://localhost:5173

## 构建

```bash
pnpm --dir apps/threejs-demos build
pnpm --dir apps/threejs-demos preview
```

## 目录

```
apps/threejs-demos/
├── index.html
├── shared/           # createScene、loadModel、pick、lights…
├── labs/             # 01–10 微实验 + WebGPU
├── advanced/         # 进阶 11 / 12 / 16 Demo
└── portfolio/        # P1–P4 作品集
```

## 与文档对应

| Demo | 文档 |
|------|------|
| labs/01-echarts-vs-three | [01 从大屏到 3D](../../docs/3d/threejs/01-from-dashboard-to-3d.md) |
| labs/02-first-scene | [02 第一个场景](../../docs/3d/threejs/02-first-scene.md) |
| labs/03-solar-system | [03 场景图](../../docs/3d/threejs/03-scene-graph-and-coordinates.md) |
| labs/04-camera-fov | [04 相机](../../docs/3d/threejs/04-camera.md) |
| labs/05-materials | [05 几何与材质](../../docs/3d/threejs/05-geometry-and-material.md) |
| labs/06-lights-shadows | [06 光与阴影](../../docs/3d/threejs/06-lights-and-shadows.md) |
| labs/07-gltf-loader | [07 glTF](../../docs/3d/threejs/07-load-gltf.md) |
| labs/08-interaction | [08 交互](../../docs/3d/threejs/08-interaction.md) |
| labs/09-dispose-stats | [09 性能](../../docs/3d/threejs/09-performance-and-dispose.md) |
| labs/10-scene-module | [10 进项目](../../docs/3d/threejs/10-project-integration.md) |
| advanced/11-hdri | [11 HDRI](../../docs/3d/threejs/advanced/11-hdri-and-environment.md) |
| advanced/12-outline | [12 后处理](../../docs/3d/threejs/advanced/12-post-processing.md) |
| advanced/12-bloom | [12 Bloom](../../docs/3d/threejs/advanced/12-post-processing.md) |
| advanced/13-animation | [13 动画](../../docs/3d/threejs/advanced/13-animation-and-camera.md) |
| advanced/16-shader | [16 Shader](../../docs/3d/threejs/advanced/16-custom-shader.md) |
| advanced/17-gis | [17 GIS](../../docs/3d/threejs/advanced/17-gis-coordinates.md) |
| advanced/18-tres | [18 TresJS](../../docs/3d/threejs/advanced/18-r3f-tres.md) |
| advanced/18-r3f | [18 R3F](../../docs/3d/threejs/advanced/18-r3f-tres.md) |
| portfolio/p1 | [作品集 P1](../../docs/3d/threejs/practices/02-portfolio-projects.md) |
| portfolio/p2 | [作品集 P2](../../docs/3d/threejs/practices/02-portfolio-projects.md) |
| portfolio/p3 | [作品集 P3](../../docs/3d/threejs/practices/02-portfolio-projects.md) |
| portfolio/p4 | [作品集 P4](../../docs/3d/threejs/practices/02-portfolio-projects.md) |

模型与 HDR 通过 **jsDelivr CDN** 按需加载（不进 Git 仓库）：

| 资源 | CDN 来源 |
|------|----------|
| DamagedHelmet / Duck / Fox | [Khronos glTF-Sample-Models](https://github.com/KhronosGroup/glTF-Sample-Models) |
| venice HDR | [three.js examples](https://github.com/mrdoob/three.js) |

配置见 `shared/constants.js`。离线开发可将模型放到 `public/models/` 并改路径。

## 性能面板

所有通过 `createScene()` 创建的 Demo 默认在 canvas **左下角** 有 **Perf** 按钮，展开后可看：

| 指标 | 说明 |
|------|------|
| FPS | 近 0.5s 滑动平均 |
| 帧时 | 单帧耗时（ms） |
| 三角面 | `renderer.info.render.triangles` |
| Draw | draw call 次数 |
| DPR | 当前像素比 |
| 预算 | 50fps / 30fps 档位提示 |

关闭：`createScene(container, { perfHud: false })`

评估标准与打分表见 [03 · 3D 项目评估标准](../../docs/3d/threejs/practices/03-project-evaluation.md)。
