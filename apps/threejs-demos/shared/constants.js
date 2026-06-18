/**
 * 3D 资源走 jsDelivr CDN，不打包进仓库（Khronos 样本 + three.js examples）。
 * 国内访问通常比 threejs.org 原站更稳；需离线时可自建 public/models 镜像。
 */
const KHRONOS_CDN =
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0';
const THREEJS_CDN =
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r175/examples';

export const MODELS = {
  /** GLB 内嵌贴图，避免 .gltf 外链纹理加载失败发白 */
  helmet: `${KHRONOS_CDN}/DamagedHelmet/glTF-Binary/DamagedHelmet.glb`,
  duck: `${KHRONOS_CDN}/Duck/glTF-Binary/Duck.glb`,
  /** 带动画 clip，替代 threejs.org 已下架的 Flamingo */
  fox: `${KHRONOS_CDN}/Fox/glTF-Binary/Fox.glb`,
  /** @deprecated 使用 fox */
  flamingo: `${KHRONOS_CDN}/Fox/glTF-Binary/Fox.glb`,
};

export const HDR = {
  venice: `${THREEJS_CDN}/textures/equirectangular/venice_sunset_1k.hdr`,
};

export const DPR_CAP = 2;

/** 场景底色 — 略亮于页面 #0f1117，避免物体与背景糊在一起 */
export const DEMO_BG = 0x1a2030;
export const DEMO_BG_CSS = '#1a2030';
