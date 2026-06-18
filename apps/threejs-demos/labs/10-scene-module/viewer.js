/** 引擎层 · 模拟 @corp/3d-viewer */
import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';
import { loadGLTF, normalizeRoot, fitCameraToObject } from '../../shared/loadModel.js';
import { setupThreePointLight } from '../../shared/lights.js';
import { disposeObject3D } from '../../shared/dispose.js';
import { MODELS } from '../../shared/constants.js';

/** @returns {Promise<{ dispose: () => void }>} */
export async function bootstrapViewer(container, { loadOk, onStatus }) {
  const ctx = createScene(container);
  setupThreePointLight(ctx.scene);

  try {
    onStatus?.('加载中…');
    const url = loadOk ? MODELS.duck : '/missing.glb';
    const gltf = await loadGLTF(url);
    const model = gltf.scene;
    normalizeRoot(model, 2);
    ctx.scene.add(model);
    fitCameraToObject(ctx.camera, ctx.controls, model);
    onStatus?.('就绪');
  } catch {
    onStatus?.('模型加载失败 · 显示占位几何体');
    const fallback = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xf85149 }),
    );
    ctx.scene.add(fallback);
  }

  return {
    dispose: () => {
      ctx.scene.traverse((o) => { if (o.isMesh) disposeObject3D(o); });
      ctx.dispose();
    },
  };
}

export function destroyViewer(viewer) {
  viewer?.dispose();
}
