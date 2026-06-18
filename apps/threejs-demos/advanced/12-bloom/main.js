/** 进阶 12 · Bloom 补充 · docs/3d/threejs/advanced/12-post-processing.md */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { DPR_CAP, DEMO_BG } from '../../shared/constants.js';
import { attachPerfHud } from '../../shared/perfHud.js';

const root = document.getElementById('root');

const scene = new THREE.Scene();
scene.background = new THREE.Color(DEMO_BG);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
root.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.15));
const dir = new THREE.DirectionalLight(0xffffff, 0.6);
dir.position.set(3, 5, 2);
scene.add(dir);

const normal = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 1.2, 1.2),
  new THREE.MeshStandardMaterial({ color: 0x58a6ff, metalness: 0.3, roughness: 0.5 }),
);
normal.position.x = -2;
scene.add(normal);

const alarm = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 1.2, 1.2),
  new THREE.MeshStandardMaterial({
    color: 0xff4422,
    emissive: 0xff2200,
    emissiveIntensity: 2,
    metalness: 0.2,
    roughness: 0.4,
  }),
);
alarm.position.x = 2;
scene.add(alarm);

scene.add(new THREE.GridHelper(12, 12, 0x30363d, 0x21262d));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.5, 0);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.8, 0.4, 0.85);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

const perf = attachPerfHud(root, { renderer });

function resize() {
  const w = root.clientWidth;
  const h = root.clientHeight;
  if (!w || !h) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
}
new ResizeObserver(resize).observe(root);
resize();

document.getElementById('bloomOn').addEventListener('change', (e) => {
  bloomPass.enabled = e.target.checked;
});
document.getElementById('strength').addEventListener('input', (e) => {
  bloomPass.strength = parseFloat(e.target.value);
  document.getElementById('strVal').textContent = e.target.value;
});
document.getElementById('threshold').addEventListener('input', (e) => {
  bloomPass.threshold = parseFloat(e.target.value);
  document.getElementById('thrVal').textContent = e.target.value;
});

let raf = 0;
const loop = () => {
  raf = requestAnimationFrame(loop);
  alarm.rotation.y += 0.008;
  controls.update();
  composer.render();
  perf.update();
};
loop();

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(raf);
  perf.dispose();
  composer.dispose();
  renderer.dispose();
});
