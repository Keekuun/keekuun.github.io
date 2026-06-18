/** Lab 09 · docs/3d/threejs/09-performance-and-dispose.md */
import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';
import { loadGLTF, normalizeRoot } from '../../shared/loadModel.js';
import { disposeObject3D } from '../../shared/dispose.js';
import { setupTwinLight } from '../../shared/lights.js';
import { MODELS } from '../../shared/constants.js';

const root = document.getElementById('root');
const log = document.getElementById('log');
const ctx = createScene(root, { dprCap: 1.5 });
setupTwinLight(ctx.scene);
ctx.camera.position.set(0, 2, 5);
log.textContent = '左下角 Perf 按钮 · 查看 FPS / 三角面 / Draw Call';

let model = null;
let instanced = null;
let useInstanced = false;

async function loadModel() {
  const gltf = await loadGLTF(MODELS.duck);
  model = gltf.scene;
  normalizeRoot(model, 2);
  ctx.scene.add(model);
}

function unloadModel() {
  if (!model) return;
  ctx.scene.remove(model);
  disposeObject3D(model);
  model = null;
}

function showInstanced() {
  unloadModel();
  if (instanced) {
    ctx.scene.remove(instanced);
    instanced.geometry.dispose();
    instanced.material.dispose();
    instanced = null;
  }
  const geo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
  const mat = new THREE.MeshStandardMaterial({ color: 0x58a6ff });
  instanced = new THREE.InstancedMesh(geo, mat, 1000);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 1000; i++) {
    dummy.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20);
    dummy.updateMatrix();
    instanced.setMatrixAt(i, dummy.matrix);
  }
  instanced.instanceMatrix.needsUpdate = true;
  ctx.scene.add(instanced);
  log.textContent = 'InstancedMesh 1000 · 展开 Perf 对比 Draw Call';
}

document.getElementById('toggle').addEventListener('click', async () => {
  if (model) {
    unloadModel();
    log.textContent = '已 unload';
  } else {
    await loadModel();
    log.textContent = '已 load Duck';
  }
});

document.getElementById('loop10').addEventListener('click', async () => {
  for (let i = 0; i < 10; i++) {
    await loadModel();
    unloadModel();
  }
  log.textContent = '10 次 load/unload 完成，请观察 Memory';
});

document.getElementById('instanced').addEventListener('click', () => {
  useInstanced = !useInstanced;
  if (useInstanced) showInstanced();
  else {
    if (instanced) {
      ctx.scene.remove(instanced);
      instanced.geometry.dispose();
      instanced.material.dispose();
      instanced = null;
    }
    log.textContent = '已关闭 Instancing';
  }
});

window.addEventListener('beforeunload', () => ctx.dispose());
