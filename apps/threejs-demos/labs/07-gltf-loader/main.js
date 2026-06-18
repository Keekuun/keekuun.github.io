/** Lab 07 · docs/3d/threejs/07-load-gltf.md */
import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';
import { loadGLTF, normalizeRoot, fitCameraToObject } from '../../shared/loadModel.js';
import { disposeObject3D } from '../../shared/dispose.js';
import { setupThreePointLight } from '../../shared/lights.js';
import { setupHDRI } from '../../shared/setupHDRI.js';
import { MODELS } from '../../shared/constants.js';

const root = document.getElementById('root');
const progressEl = document.getElementById('progress');
const ctx = createScene(root);
setupThreePointLight(ctx.scene);
let current = null;

async function load(url, label) {
  if (current) {
    ctx.scene.remove(current);
    disposeObject3D(current);
    current = null;
  }
  progressEl.className = 'status';
  progressEl.textContent = `加载 ${label}… 0%`;

  try {
    const t0 = performance.now();
    const gltf = await loadGLTF(url, {
      onProgress: (p) => {
        progressEl.textContent = `加载 ${label}… ${Math.round(p * 100)}%`;
      },
    });
    current = gltf.scene;
    normalizeRoot(current, 2.5);
    ctx.scene.add(current);
    fitCameraToObject(ctx.camera, ctx.controls, current);
    ctx.requestRender();
    const ms = Math.round(performance.now() - t0);
    progressEl.textContent = `${label} 完成 · ${ms}ms`;
  } catch (err) {
    progressEl.className = 'error';
    progressEl.textContent = `加载失败: ${err.message}`;
  }
}

document.getElementById('helmet').addEventListener('click', () => load(MODELS.helmet, 'Helmet'));
document.getElementById('duck').addEventListener('click', () => load(MODELS.duck, 'Duck'));
document.getElementById('bad').addEventListener('click', () =>
  load('https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/NotExist/Nope.glb', '404'));

load(MODELS.helmet, 'Helmet');

(async () => {
  try {
    await setupHDRI(ctx.scene, ctx.renderer, undefined, { background: false });
    ctx.requestRender();
  } catch (e) {
    console.warn('环境贴图加载失败，金属材质可能偏白', e);
  }
})();

window.addEventListener('beforeunload', () => ctx.dispose());
