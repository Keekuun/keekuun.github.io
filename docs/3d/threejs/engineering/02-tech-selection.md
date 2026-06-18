---
title: 工程 02 · 技术选型
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Engineering
---

# 工程 02 · 技术选型

> 自研引擎层、R3F/Tres、商业 SDK 怎么选；没有银弹，按团队和项目定。

---

## 目录

- [适用场景](#适用场景)
- [四种主流方案](#四种主流方案)
- [决策矩阵](#决策矩阵)
- [推荐组合（国内常见）](#推荐组合国内常见)
- [版本锁定](#版本锁定)
- [开源项目怎么选](#开源项目怎么选)
- [导航](#导航)

---

## 适用场景

选型发生在 **架构设计阶段**，早于具体页面开发。错误选型代价：

- 纯 Three 堆业务 → 维护地狱
- 强行 R3F 团队不会 React → 招聘/培训成本
- 商业 SDK 定制不足 → 二次开发仍要写 Shader

---

## 四种主流方案

### A · 自研引擎层 + Three.js（最常见）

```
@corp/3d-core（封装 Three）
    ↑
Vue/React 组件 ModelViewer
```

**优点**：完全可控、包体可压、与现有栈一致  
**缺点**：引擎层要自己维护  
**适合**：孪生、产品页、长期迭代、有 3D 专项前端

### B · React Three Fiber + drei

**优点**：生态 rich、声明式、社区方案多  
**缺点**：绑定 React；dispose 仍要懂  
**适合**：React 技术栈、组件化 3D 多

### C · TresJS + cientos（Vue 3）

**优点**：Vue 声明式 3D  
**缺点**：生态小于 R3F  
**适合**：Vue 3 主力、3D 模块适中

### D · 商业 / 平台 SDK

例：部分 CAD/BIM 厂商 Web 控件、Sketchfab 嵌入等。

**优点**：开箱、合规  
**缺点**： license、定制、数据出境  
**适合**：甲方指定、快速嵌入、定制需求少

---

## 决策矩阵

| 因素 | 自研引擎 | R3F/Tres | 商业 SDK |
|------|----------|----------|----------|
| 团队栈 | 任意 | React / Vue | 任意 |
| 定制深度 | 高 | 高 | 低–中 |
| 上手速度 | 中 | 中（需学框架） | 快 |
| 长期成本 | 引擎人力 | 框架升级 | 授权费 |
| 包体控制 | 好 | 中 | 差 |

**没有「大厂都用 R3F」**：很多团队是 **Vue + 自研 viewer**，Three 锁在 package 里。

---

## 推荐组合（国内常见）

| 项目 | 推荐 |
|------|------|
| Vue 产品 3D 官网 | Tres **或** 自研 `@corp/3d-vue` |
| React 配置器 | R3F + drei |
| 大屏 + 小块 3D | 自研轻量 viewer（按需 render） |
| 数字孪生（重 GIS） | Cesium 主 + Three overlay **或** 纯 Three 引擎 |
| 多产品线 | monorepo `@corp/3d-core` + 各端 thin wrapper |

学习路径：基础 [01–10](../README.md) 懂 Three → [18 R3F/Tres](../advanced/18-r3f-tres.md) 若选框架 → 本系列定包结构。

---

## 版本锁定

```json
{
  "dependencies": {
    "three": "0.169.0"
  },
  "pnpm": {
    "overrides": {
      "three": "0.169.0"
    }
  }
}
```

monorepo 内 **全仓库一个 three 版本**，避免多实例、材质不兼容。升级 three 走 **专门 PR + 视觉回归**。

---

## 开源项目怎么选

| 需求 | 参考项目 | 说明 |
|------|----------|------|
| 仅展示 glb + AR | [google/model-viewer](https://github.com/google/model-viewer) | 不必上 Three 引擎层 |
| React SPA 多 3D 页 | [pmndrs/react-three-next](https://github.com/pmndrs/react-three-next) | 持久 Canvas |
| React 全家桶 | [pmndrs/create](https://github.com/pmndrs/create) | `npm create @react-three --drei --zustand` |
| Vue 孪生底座 | [three-vue-tres](https://github.com/hawk86104/three-vue-tres) | 国内交付常见 |
| 编辑器 monorepo | [pascalorg/editor](https://github.com/pascalorg/editor) | core / viewer / apps 分层 |
| BIM 整楼 | [xeokit-sdk](https://github.com/xeokit/xeokit-sdk) | 非 Three，超大精度模型 |

完整对照与可借鉴规范见 **[07 · 开源项目参考](./07-open-source-reference.md)**。

---

## 导航

- [工程目录](./README.md)
- 上一篇：[01 · 为什么不直接用 Three.js](./01-why-not-raw-threejs.md)
- 下一篇：[03 · 目录与模块边界](./03-project-structure.md)
