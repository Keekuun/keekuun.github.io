/** 进阶 12 · docs/3d/threejs/advanced/12-post-processing.md */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { DPR_CAP, DEMO_BG } from '../../shared/constants.js';
import { attachPerfHud } from '../../shared/perfHud.js';
import { setupTwinLight } from '../../shared/lights.js';

const root = document.getElementById('root');
const info = document.getElementById('info');

const scene = new THREE.Scene();
scene.background = new THREE.Color(DEMO_BG);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
camera.position.set(0, 2, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
renderer.outputColorSpace = THREE.SRGBColorSpace;
root.appendChild(renderer.domElement);

setupTwinLight(scene);
scene.add(new THREE.GridHelper(12, 12, 0x30363d, 0x21262d));

const pickables = [];
const colors = [0x58a6ff, 0x7ee787, 0xffa657, 0xf778ba, 0xd2a8ff];
colors.forEach((c, i) => {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: c, metalness: 0.3, roughness: 0.4 }),
  );
  m.position.set((i - 2) * 1.6, 0.5, 0);
  m.userData.name = `部件 ${i + 1}`;
  scene.add(m);
  pickables.push(m);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.5, 0);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const outlinePass = new OutlinePass(new THREE.Vector2(1, 1), scene, camera);
outlinePass.edgeStrength = 3;
outlinePass.edgeGlow = 0.4;
outlinePass.edgeThickness = 1;
outlinePass.visibleEdgeColor.set(0x00ff88);
outlinePass.hiddenEdgeColor.set(0x004422);
composer.addPass(outlinePass);
composer.addPass(new OutputPass());

const perf = attachPerfHud(root, { renderer });

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let selected = null;

function resize() {
  const w = root.clientWidth;
  const h = root.clientHeight;
  if (!w || !h) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
  outlinePass.resolution.set(w, h);
}
new ResizeObserver(resize).observe(root);
resize();

renderer.domElement.addEventListener('click', (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables, false);
  selected = hits[0]?.object ?? null;
  outlinePass.selectedObjects = selected ? [selected] : [];
  info.textContent = selected ? `选中: ${selected.userData.name}` : '未选中';
});

document.getElementById('outlineOn').addEventListener('change', (e) => {
  outlinePass.enabled = e.target.checked;
});

document.getElementById('strength').addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  document.getElementById('strVal').textContent = v;
  outlinePass.edgeStrength = v;
});

let raf = 0;
const loop = () => {
  raf = requestAnimationFrame(loop);
  controls.update();
  composer.render();
  perf.update();
};
loop();

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(raf);
  perf.dispose();
  controls.dispose();
  composer.dispose();
  renderer.dispose();
});
