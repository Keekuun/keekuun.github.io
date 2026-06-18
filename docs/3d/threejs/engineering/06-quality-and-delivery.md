---
title: 工程 06 · 质量与交付
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Engineering
- DevOps
---

# 工程 06 · 质量与交付

> 性能预算、CI 校验、监控与上线清单——工业项目交付的最后一公里。

---

## 目录

- [适用场景](#适用场景)
- [性能预算](#性能预算)
- [自动化检测](#自动化检测)
- [视觉回归](#视觉回归)
- [运行时监控](#运行时监控)
- [上线检查清单](#上线检查清单)
- [故障 playbook](#故障-playbook)
- [导航](#导航)

---

## 适用场景

- 甲方验收 FPS / 加载时间
- 长期运维孪生大屏
- 多环境发布（dev/staging/prod）

---

## 性能预算

项目启动时 **书面约定**：

| 指标 | 桌面 | 移动 |
|------|------|------|
| 首屏可交互（LCP 含 3D） | < 3s | < 5s |
| 稳态 FPS | ≥ 55 | ≥ 28 |
| 单模型 glb | < 15MB | < 8MB |
| draw calls | < 200 | < 80 |
| 内存（离开页后） | 回落，无 context 泄漏 | 同左 |

开发期用 `renderer.info` + Chrome Performance 抽样（见 [09 性能](../09-performance-and-dispose.md)）。**完整评估维度与打分表**见 [实践 03 · 3D 项目评估标准](../practices/03-project-evaluation.md)。

---

## 自动化检测

**CI pipeline 示例**：

```yaml
# .github/workflows/3d-assets.yml
- name: Validate glTF
  run: npx gltf-validator models/**/*.glb
- name: Size budget
  run: node scripts/check-glb-size.js --max-mb 15
- name: Lint 3d-core
  run: pnpm --filter @corp/3d-core test
```

**单元测试**（3d-core）：

- `normalizeModel` 包围盒中心
- `dispose` 后 geometries 计数为 0（mock renderer）
- id registry 映射

**E2E**（Playwright，可选）：

- 打开产品页，canvas 存在，无 console error
- 截图对比 baseline（见下）

---

## 视觉回归

对 **固定相机 + 固定模型** 截图：

```js
await page.goto('/product');
await page.waitForSelector('canvas');
expect(await page.screenshot()).toMatchSnapshot();
```

Three 轻微抗锯齿差异会导致 flake；固定 `setPixelRatio(1)`、关 animation 再截。

---

## 运行时监控

生产可选上报：

```ts
sceneManager.on('error', (e) => report({ type: '3d_load_fail', url, message: e.message }));
sceneManager.on('ready', (meta) => report({ type: '3d_ready', loadMs: meta.loadMs, triangles: meta.triangles }));
```

大屏值班看：**加载失败率、平均 loadMs、WebGL context lost 次数**。

---

## 上线检查清单

- [ ] 全路由离开 `dispose` 验证通过
- [ ] 弱网 / 404 模型有 UI 提示
- [ ] CSP 允许 wasm（Draco）与 CDN 域名
- [ ] mobile 档位关 shadow / bloom（见 [12 后处理](../advanced/12-post-processing.md)）
- [ ] three 版本 monorepo 统一
- [ ] 资源 URL 走环境变量
- [ ] 无调试 Helper/Stats 残留
- [ ] 美术验收签字 + gltf-validator CI 绿

---

## 故障 playbook

| 现象 | 先查 |
|------|------|
| 越用越卡 | dispose / 重复 load 未 unload |
| 生产全黑、本地正常 | CDN CORS、路径、https 混合内容 |
| 换模型后崩 | material 共享未 clone |
| iOS 闪退 | 内存、贴图过大、context 过多 |
| 数据不对 | registry 映射表，非 Three bug |

---

## 导航

- [工程目录](./README.md)
- 上一篇：[05 · 数据驱动与状态](./05-data-and-state.md)
- 下一篇：[07 · 开源项目参考](./07-open-source-reference.md)
- 评估标准：[实践 03 · 3D 项目评估标准](../practices/03-project-evaluation.md)
