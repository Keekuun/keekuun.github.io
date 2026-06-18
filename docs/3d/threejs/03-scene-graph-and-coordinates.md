---
title: 03 · 场景图与坐标
date: 2026-06-11
isComment: true
categories:
- 前端
- Three.js
tags:
- Three.js
- WebGL
- 3D
---

# 03 · 场景图与坐标

> 理解 Object3D 层级、矩阵变换，以及孪生 / 产品项目里 **坐标对不齐** 的根因。

---

## 目录

- [适用场景](#适用场景)
- [场景图与矩阵更新](#场景图与矩阵更新)
- [坐标系与单位](#坐标系与单位)
- [变换：position / rotation / scale](#变换position--rotation--scale)
- [Group 与业务建模](#group-与业务建模)
- [局部坐标与世界坐标](#局部坐标与世界坐标)
- [Pivot 与模型对齐](#pivot-与模型对齐)
- [完整示例](#完整示例)
- [常见问题](#常见问题)
- [练习](#练习)
- [导航](#导航)

---

## 适用场景

| 场景 | 为何依赖场景图 |
|------|----------------|
| 产品配置器：换轮毂、开车门 | 按部件 Group 做 `visible` / 动画 |
| 数字孪生：设备状态变色 | `traverse` 按 `name` 找 mesh |
| 多模型拼装（设备放厂房） | 子 Group 局部坐标 + 父级整体平移 |
| HTML 标签钉在设备上 | `getWorldPosition` 投影到屏幕 |
| 动画：整台机器绕 Y 转 | 旋转父 Group，子 mesh 跟随 |
| CAD/BIM 导入后「飘到地底」 | 世界/局部矩阵、pivot、单位问题 |

**不需要深入场景图的情况**：只有一个 glTF、整体 orbit、无部件交互——但仍建议理解 `traverse` 和 world 坐标，否则拾取和标注做不稳。

---

## 场景图与矩阵更新

每个 `Object3D` 维护：

- `matrix`：局部变换（相对父节点）
- `matrixWorld`：世界变换（乘上所有祖先）

默认 `matrixAutoUpdate = true`：改 `position/rotation/scale` 后，**下一次 render 前** Three.js 会递归 `updateMatrixWorld()`。

```js
// 批量改很多 object 后，可手动触发（少见优化）
scene.updateMatrixWorld(true);
```

**性能提示**：静态模型加载后可冻结矩阵：

```js
model.traverse((obj) => {
  obj.matrixAutoUpdate = false;
  obj.updateMatrix();
});
// 之后若再移动，须 matrixAutoUpdate = true 或手动改 matrix
```

渲染时 GPU 用的是 **世界空间** 顶点；不理解层级，会出现「改了 position 但 pick 位置不对」。

---

## 坐标系与单位

Three.js：**右手系**，Y 轴向上。

```
      Y
      |
      |____ X
     /
    Z（指向屏幕外）
```

- glTF 规范也是 Y-up，与 Three.js 一致
- 部分 CAD 导出 Z-up，需在 Blender 导出时勾选 **Y-Up** 或加载后 `model.rotation.x = -Math.PI / 2`
- **单位无强制**：1 单位可等于 1 米或 1 毫米，全项目统一即可；glTF 常用米，BIM 大场景可能用毫米导致相机 far 不够

---

## 变换：position / rotation / scale

| 属性 | 类型 | 要点 |
|------|------|------|
| `position` | Vector3 | 相对父原点偏移 |
| `rotation` | Euler（弧度） | 默认顺序 `XYZ`，会万向节锁 |
| `quaternion` | Quaternion | 与 rotation 联动；复杂旋转推荐只用 quaternion |
| `scale` | Vector3 | 负 scale 会镜像翻面，影响法线和 culling |

```js
mesh.rotation.set(
  THREE.MathUtils.degToRad(30),
  THREE.MathUtils.degToRad(45),
  0
);

// 或避免万向节锁
mesh.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
```

**变换顺序**（局部）：先 scale → 再 rotation → 再 position（由 matrix 组合实现）。父节点再乘一层。

---

## Group 与业务建模

```js
const product = new THREE.Group();
product.name = 'ProductRoot';

const body = new THREE.Group();
body.name = 'Body';
const wheelFL = new THREE.Mesh(geo, mat);
wheelFL.name = 'Wheel_FL';

body.add(wheelFL);
product.add(body);
scene.add(product);

// 业务：隐藏左前轮
product.getObjectByName('Wheel_FL').visible = false;
```

**命名规范**（与美术约定）：

- 英文、无空格：`Door_LF`、`Sensor_01`
- 可交互部件、需换色部件必须有稳定 `name` 或 `userData.id`
- 导出 glTF 前在 Blender Outliner 检查名称

`userData` 存业务字段，不参与渲染：

```js
mesh.userData = { deviceId: 'pump-001', alarmLevel: 0 };
```

---

## 局部坐标与世界坐标

```js
const local = mesh.position.clone();
const world = new THREE.Vector3();
mesh.getWorldPosition(world);

// 世界 → 局部
const localPoint = worldPoint.clone();
mesh.worldToLocal(localPoint);
```

| API | 用途 |
|-----|------|
| `getWorldPosition` | 标签定位、测距 |
| `getWorldQuaternion` | 相机跟随物体朝向 |
| `localToWorld` / `worldToLocal` | 在物体坐标系下偏移放置子物体 |
| `lookAt` | 让物体 -Z 轴指向目标（Three.js 相机/物体默认朝向） |

孪生场景：**传感器读数世界坐标 (x,y,z)** 要在场景里标点时，直接 `marker.position.set(x,y,z)`（与模型同一坐标系约定下）。

---

## Pivot 与模型对齐

**现象**：旋转时模型「绕奇怪的点转」—— pivot 不在几何中心。

处理方式：

1. **美术侧**（推荐）：Blender 设置 Origin to Geometry，再导出
2. **代码侧**：`geometry.center()` 改几何顶点，再 `mesh.position` 补偿
3. **包装 Group**：模型 mesh 作 Group 子节点，偏移 mesh.localPosition，旋转 Group

```js
// 加载后居中到原点（常用套路）
const box = new THREE.Box3().setFromObject(model);
const center = box.getCenter(new THREE.Vector3());
const wrapper = new THREE.Group();
wrapper.add(model);
model.position.sub(center); // 几何中心移到 wrapper 原点
scene.add(wrapper);
// 之后 orbit 绕 wrapper 转
```

---

## 完整示例

```js
import * as THREE from 'three';

// ... renderer, scene, camera 同 02 ...

const rig = new THREE.Group();
rig.name = 'Rig';

const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const cubeA = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x22c55e }));
cubeA.position.x = -0.6;
const cubeB = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
cubeB.position.x = 0.6;

rig.add(cubeA, cubeB);
rig.position.y = 1;
scene.add(rig);

scene.add(new THREE.AxesHelper(3));
scene.add(new THREE.GridHelper(10, 10));

const worldPos = new THREE.Vector3();
function animate() {
  requestAnimationFrame(animate);
  rig.rotation.y += 0.01;
  cubeA.getWorldPosition(worldPos);
  // console.log(worldPos) // 观察世界坐标随旋转变化
  renderer.render(scene, camera);
}
animate();
```

---

## 常见问题

| 现象 | 原因 | 处理 |
|------|------|------|
| 改 position 无效 | 改错对象；未 add；matrixAutoUpdate false | 检查 scene graph |
| 子物体「飞走」 | 父 scale 非均匀 | 检查父级 scale |
| pick 与视觉不符 | 未 updateMatrixWorld | render 前自动更新；手动改 matrix 时需自己 update |
| 模型躺倒 | Z-up 未转换 | 导出 Y-up 或 rotation.x |
| traverse 改 material 全变 | 多 mesh 共享 material | `material.clone()` |

---

## 练习

1. 三层 Group 嵌套，打印最底层 mesh 的 world position。
2. 用 `getObjectByName` 实现按键切换某个子 mesh 显隐。
3. 加载 [07](./07-load-gltf.md) 模型后 `setFromObject` 算包围盒，把模型底面对齐 `GridHelper`。
4. 对比 `rotation.y` 与 `quaternion.setFromAxisAngle` 在 gimbal lock 极端角度下的差异。

---

## 导航

- [系列目录](./README.md)
- 上一篇：[02 · 第一个场景](./02-first-scene.md)
- 下一篇：[04 · 相机](./04-camera.md)
