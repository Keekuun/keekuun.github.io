---
title: 工程 05 · 数据驱动与状态
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- Engineering
---

# 工程 05 · 数据驱动与状态

> 孪生 / 大屏里 3D 如何接 WebSocket、Store，以及与 ECharts 并存。

---

## 目录

- [适用场景](#适用场景)
- [单向数据流](#单向数据流)
- [id 映射表](#id-映射表)
- [更新策略](#更新策略)
- [与 2D 图表并存](#与-2d-图表并存)
- [引擎层 API 设计](#引擎层-api-设计)
- [导航](#导航)

---

## 适用场景

| 场景 | 数据特点 |
|------|----------|
| 产品配置器 | 用户点选 → 换色/显隐，低频 |
| 数字孪生 | WebSocket 推送设备状态，高频 |
| 大屏 | 轮询 + 3D 装饰，中低频 |
| 告警 | 批量改 emissive / 标签 |

**原则**：3D 是 **视图**；真相在 store / 接口，不在 mesh.userData 里堆业务。

---

## 单向数据流

```
API / WebSocket
      ↓
  Pinia / Redux（deviceMap）
      ↓ watch / selector
  ModelViewer 或 sceneManager.sync(state)
      ↓
  mesh 外观（color / visible / label）
```

```ts
// store
interface DeviceState {
  id: string;
  level: 0 | 1 | 2; // 正常 / 预警 / 告警
  temp: number;
}

// 引擎层
syncDevices(states: DeviceState[]) {
  states.forEach((s) => {
    const mesh = this.registry.get(s.id);
    if (!mesh) return;
    applyLevel(mesh, s.level);
  });
  this.requestRender();
}
```

业务 **不** 在 WebSocket 回调里 `scene.traverse`。

---

## id 映射表

加载模型后 **构建一次**：

```ts
const registry = new Map<string, THREE.Mesh>();

model.traverse((o) => {
  if (o.isMesh && o.name) registry.set(o.name, o);
  // 或 o.userData.deviceId
});
```

维护 **CSV/JSON 映射**：`BIM_GUID → mesh.name`，由实施或美术提供。

映射缺失时打 log，不要 silent fail。

---

## 更新策略

| 频率 | 策略 |
|------|------|
| 用户操作 | 即时更新 + 按需 render |
| < 1s 推送 | 节流 200ms 批量 sync |
| 仅变标签文字 | 只改 DOM/CSS2D，不 traverse material |
| 上千设备 | 只更新 visible 变化 + Instancing |

避免每帧全量 `traverse` 改 material。

---

## 与 2D 图表并存

```
┌─────────────────────────────────┐
│  Layout（Vue/React）             │
│  ┌─────────────┐ ┌────────────┐ │
│  │ ECharts     │ │ ModelViewer│ │
│  │ store 只读  │ │ store 只读 │ │
│  └─────────────┘ └────────────┘ │
└─────────────────────────────────┘
           ↑ 同一 store / 同一 WS
```

- 点击 3D 设备 → dispatch `selectDevice(id)` → 图表联动高亮
- 禁止 ECharts option 里嵌 Three 配置

---

## 引擎层 API 设计

```ts
interface TwinSceneAPI {
  loadScene(config: SceneConfig): Promise<void>;
  syncDevices(states: DeviceState[]): void;
  select(id: string | null): void;
  flyTo(id: string): Promise<void>;
  destroy(): void;
}
```

版本升级只扩 API，不暴露 `scene: THREE.Scene` 给业务（除非 debug 模式）。

---

## 导航

- [工程目录](./README.md)
- 上一篇：[04 · 资源管线](./04-asset-pipeline.md)
- 下一篇：[06 · 质量与交付](./06-quality-and-delivery.md)
