/** Lab 11 · WebGPURenderer · 对照 labs/02-first-scene 与 docs/3d/webgl/webgpu */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { WebGPURenderer } from 'three/webgpu';
import { DPR_CAP, DEMO_BG } from '../../shared/constants.js';
import { attachPerfHud } from '../../shared/perfHud.js';

const root = document.getElementById('root');
const status = document.getElementById('status');

async function main() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(DEMO_BG);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
  camera.position.set(3, 2, 5);

  let renderer;
  let api = 'webgl';

  if (navigator.gpu) {
    try {
      renderer = new WebGPURenderer({ antialias: true, powerPreference: 'high-performance' });
      await renderer.init();
      api = 'webgpu';
      status.textContent = 'WebGPURenderer · 场景 API 与 WebGLRenderer 相同';
    } catch (e) {
      console.warn('WebGPURenderer init failed', e);
    }
  }

  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    status.textContent = '无 WebGPU，已回退 WebGLRenderer';
    status.style.color = '#d29922';
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  root.appendChild(renderer.domElement);

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x58a6ff, metalness: 0.2, roughness: 0.4 }),
  );
  scene.add(mesh);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 4, 2);
  scene.add(dir);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const perf = attachPerfHud(root, { renderer });

  const resize = () => {
    const w = root.clientWidth;
    const h = root.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(root);
  resize();

  let raf = 0;
  const loop = (t) => {
    raf = requestAnimationFrame(loop);
    mesh.rotation.x = t * 0.001;
    mesh.rotation.y = t * 0.0015;
    controls.update();
    renderer.render(scene, camera);
    perf.update();
  };
  raf = requestAnimationFrame(loop);

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(raf);
    perf.dispose();
    ro.disconnect();
    controls.dispose();
    renderer.dispose();
  });
}

main().catch((e) => {
  console.error(e);
  status.textContent = `错误: ${e.message}`;
  status.style.color = '#f85149';
});
