/** 进阶 13 · docs/3d/threejs/advanced/13-animation-and-camera.md */
import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';
import { loadGLTF, normalizeRoot } from '../../shared/loadModel.js';
import { setupTwinLight } from '../../shared/lights.js';
import { flyTo } from '../../shared/flyTo.js';
import { MODELS } from '../../shared/constants.js';

const root = document.getElementById('root');
const status = document.getElementById('status');
const ctx = createScene(root);
setupTwinLight(ctx.scene);
ctx.scene.add(new THREE.GridHelper(20, 20, 0x30363d, 0x21262d));

const clock = new THREE.Clock();
let mixer = null;
let action = null;
let playing = true;

const views = {
  a: { pos: new THREE.Vector3(0, 2, 6), look: new THREE.Vector3(0, 1, 0) },
  b: { pos: new THREE.Vector3(5, 3, 2), look: new THREE.Vector3(0, 0.5, 0) },
  c: { pos: new THREE.Vector3(-4, 1.5, 4), look: new THREE.Vector3(0, 1, 0) },
};

async function init() {
  const gltf = await loadGLTF(MODELS.fox);
  const model = gltf.scene;
  normalizeRoot(model, 3);
  model.position.y = 0;
  ctx.scene.add(model);

  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(model);
    action = mixer.clipAction(gltf.animations[0]);
    action.play();
    status.textContent = `AnimationMixer · clip: ${gltf.animations[0].name}`;
  } else {
    status.textContent = '模型无动画 clip';
  }
}

document.getElementById('play').addEventListener('click', () => {
  if (!action) return;
  playing = !playing;
  action.paused = !playing;
});

['flyA', 'flyB', 'flyC'].forEach((id, i) => {
  document.getElementById(id).addEventListener('click', () => {
    const key = ['a', 'b', 'c'][i];
    const v = views[key];
    flyTo(ctx.camera, ctx.controls, v.pos, v.look, 1400);
  });
});

ctx.startLoop(() => {
  const delta = clock.getDelta();
  mixer?.update(delta);
});

init().catch((e) => {
  status.className = 'error';
  status.textContent = e.message;
});

window.addEventListener('beforeunload', () => ctx.dispose());
