/** 进阶 11 · docs/3d/threejs/advanced/11-hdri-and-environment.md */
import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';
import { loadGLTF, normalizeRoot, fitCameraToObject } from '../../shared/loadModel.js';
import { setupThreePointLight } from '../../shared/lights.js';
import { setupHDRI, clearHDRI } from '../../shared/setupHDRI.js';
import { MODELS } from '../../shared/constants.js';

const root = document.getElementById('root');
const status = document.getElementById('status');
const ctx = createScene(root);
let lights = null;
let model = null;
let envMap = null;

async function init() {
  const gltf = await loadGLTF(MODELS.helmet);
  model = gltf.scene;
  normalizeRoot(model, 2.5);
  ctx.scene.add(model);
  fitCameraToObject(ctx.camera, ctx.controls, model);
  await setMode('env');
  status.textContent = 'DamagedHelmet · 切换模式对比 PBR 反射';
}

function clearLights() {
  if (!lights) return;
  [lights.key, lights.fill, lights.rim].forEach((l) => ctx.scene.remove(l));
  const amb = ctx.scene.children.find((c) => c.isAmbientLight);
  if (amb) ctx.scene.remove(amb);
  lights = null;
}

async function setMode(mode) {
  clearLights();
  if (envMap) {
    envMap.dispose?.();
    envMap = null;
  }
  clearHDRI(ctx.scene);

  const exp = parseFloat(document.getElementById('exposure').value);

  if (mode === 'lights') {
    lights = setupThreePointLight(ctx.scene);
    status.textContent = '三点光 · 金属易偏灰/像塑料';
  } else if (mode === 'env') {
    envMap = await setupHDRI(ctx.scene, ctx.renderer, undefined, { background: false, exposure: exp });
    status.textContent = '仅 environment · 背景纯色，PBR 有反射';
  } else {
    envMap = await setupHDRI(ctx.scene, ctx.renderer, undefined, { background: true, exposure: exp });
    status.textContent = 'environment + background · 全景 HDR 背景';
  }
  ctx.requestRender();
}

document.getElementById('modeLights').addEventListener('click', () => setMode('lights'));
document.getElementById('modeEnv').addEventListener('click', () => setMode('env'));
document.getElementById('modeBg').addEventListener('click', () => setMode('bg'));

document.getElementById('exposure').addEventListener('input', (e) => {
  document.getElementById('expVal').textContent = Number(e.target.value).toFixed(1);
  ctx.renderer.toneMappingExposure = parseFloat(e.target.value);
  ctx.requestRender();
});

init().catch((e) => {
  status.className = 'error';
  status.textContent = e.message;
});

window.addEventListener('beforeunload', () => ctx.dispose());
