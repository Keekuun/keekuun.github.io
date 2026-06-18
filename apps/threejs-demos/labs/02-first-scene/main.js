/** Lab 02 · docs/3d/threejs/02-first-scene.md */
import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';

const root = document.getElementById('root');
const status = document.getElementById('status');
let ctx = boot({ alpha: false, onDemand: false, dprCap: 2 });

function boot(opts) {
  root.innerHTML = '';
  const c = createScene(root, { alpha: opts.alpha, onDemand: opts.onDemand, dprCap: opts.dprCap });
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshStandardMaterial({ color: 0x58a6ff, metalness: 0.2, roughness: 0.4 });
  const mesh = new THREE.Mesh(geo, mat);
  c.scene.add(mesh);
  c.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 4, 2);
  c.scene.add(dir);

  c.startLoop((t) => {
    mesh.rotation.x = t * 0.001;
    mesh.rotation.y = t * 0.0015;
    if (opts.onDemand) c.requestRender();
  });

  status.textContent = opts.onDemand ? '按需渲染：拖动 orbit 或动画时刷新' : '连续渲染中';
  return c;
}

document.getElementById('alpha').addEventListener('change', (e) => {
  ctx.dispose();
  ctx = boot({
    alpha: e.target.checked,
    onDemand: document.getElementById('onDemand').checked,
    dprCap: parseFloat(document.getElementById('dpr').value),
  });
});

document.getElementById('onDemand').addEventListener('change', (e) => {
  ctx.dispose();
  ctx = boot({
    alpha: document.getElementById('alpha').checked,
    onDemand: e.target.checked,
    dprCap: parseFloat(document.getElementById('dpr').value),
  });
});

document.getElementById('dpr').addEventListener('input', (e) => {
  document.getElementById('dprVal').textContent = e.target.value;
  ctx.renderer.setPixelRatio(Math.min(window.devicePixelRatio, parseFloat(e.target.value)));
  ctx.requestRender();
});

window.addEventListener('beforeunload', () => ctx.dispose());
