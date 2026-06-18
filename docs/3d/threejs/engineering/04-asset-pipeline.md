---
title: 工程 04 · 资源管线
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Engineering
- glTF
---

# 工程 04 · 资源管线

> 美术 → glTF → CDN → 运行时加载；团队协作的 **规范比代码更重要**。

---

## 目录

- [适用场景](#适用场景)
- [管线总览](#管线总览)
- [导出规范（给美术）](#导出规范给美术)
- [构建与优化](#构建与优化)
- [CDN 与版本](#cdn-与版本)
- [运行时加载策略](#运行时加载策略)
- [验收清单](#验收清单)
- [导航](#导航)

---

## 适用场景

任何 **外部模型进浏览器** 的项目：产品、孪生、展厅。  
没有规范时，80% 联调时间在修「模型黑、巨大、命名乱、贴图 404」。

---

## 管线总览

```
Blender / Max / CAD
    ↓ 导出 glb（规范检查）
gltf-transform / gltf-pipeline（CI）
    ↓ Draco / 纹理压缩 / 重命名
对象存储 CDN（带 hash 或版本目录）
    ↓
前端 AssetLoader（LoadingManager + 缓存）
    ↓
normalizeModel → scene
```

前端不背锅 **导出错误**；要有 **入库前校验**。

---

## 导出规范（给美术）

文档化并签字确认：

| 项 | 要求 |
|----|------|
| 格式 | `.glb` 优先 |
| 坐标 | Y-up，Apply Scale/Rotation |
| 单位 | 米（或全项目统一 mm + 前端 scale） |
| 面数 | 单模型预算（如移动端 10 万三角） |
| 命名 | 英文 `Part_Door_LF`，可交互件必命名 |
| 材质 | PBR Metallic-Roughness，贴图 2 的幂 |
| 动画 | clip 命名语义化 `DoorOpen` |

提供 [glTF Viewer](https://gltf-viewer.donmccurdy.com/) 自检链接。

---

## 构建与优化

CI 步骤（示例）：

```bash
# @gltf-transform/cli
gltf-transform optimize input.glb output.glb --compress draco
gltf-transform resize input.glb output.glb --width 1024
```

| 手段 | 作用 |
|------|------|
| Draco | 减 geometry 体积 |
| KTX2/Basis | GPU 友好贴图 |
| 合并 draw call | 静态件 merge（见 [05 几何](../05-geometry-and-material.md)） |
| LOD | 多文件 `product_lod0.glb` |

产物上传 CDN，**不提交 git**（大文件用 Git LFS 或纯 CDN）。

---

## CDN 与版本

```
https://cdn.example.com/3d/products/car-v2/a8f3.glb
                              ↑ 业务版本  ↑ 内容 hash
```

- 接口下发 `modelUrl`，不写死前端
- 换模型 **改 URL**，利用 CDN 缓存
- 环境隔离：`dev / staging / prod` 桶或路径前缀

---

## 运行时加载策略

引擎层 `AssetLoader`：

```ts
class AssetLoader {
  private cache = new Map<string, Promise<Group>>();
  async load(url: string, onProgress?: (p: number) => void) {
    if (this.cache.has(url)) return this.cache.get(url)!;
    const p = this.loadInternal(url, onProgress);
    this.cache.set(url, p);
    return p;
  }
  unload(url: string) { /* dispose + delete cache */ }
}
```

孪生分区加载见 [14 大场景](../advanced/14-large-scene-loading.md)。

---

## 验收清单

入库前自动化 + 人工：

- [ ] gltf-validator 无 error
- [ ] 文件大小 < 预算
- [ ] 在标准 viewer 中材质正常
- [ ] 命名表与 BIM 设备 id 映射表齐全
- [ ] 移动端抽样帧率可接受

---

## 导航

- [工程目录](./README.md)
- 上一篇：[03 · 目录与模块边界](./03-project-structure.md)
- 下一篇：[05 · 数据驱动与状态](./05-data-and-state.md)
