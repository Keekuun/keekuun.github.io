/** Lab 12 · docs/3d/threejs/advanced/19-webgpu.md */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { WebGPURenderer } from 'three/webgpu';
import { DPR_CAP, DEMO_BG } from '../../shared/constants.js';
import { attachPerfHud } from '../../shared/perfHud.js';

const COUNT = 2000;
const GRID = Math.ceil(Math.sqrt(COUNT));
const status = document.getElementById('status');
const webglLabel = document.getElementById('webglLabel');
const webgpuLabel = document.getElementById('webgpuLabel');

function buildScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(DEMO_BG);
  const geo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
  const mat = new THREE.MeshStandardMaterial({ color: 0x58a6ff, metalness: 0.15, roughness: 0.55 });
  const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
  const dummy = new THREE.Object3D();
  let idx = 0;
  for (let z = 0; z < GRID && idx < COUNT; z++) {
    for (let x = 0; x < GRID && idx < COUNT; x++) {
      dummy.position.set((x - GRID / 2) * 0.35, 0, (z - GRID / 2) * 0.35);
      dummy.rotation.y = (x + z) * 0.08;
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
      idx++;
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
  scene.add(mesh);
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const dir = new THREE.DirectionalLight(0xffffff, 1.1);
  dir.position.set(4, 6, 3);
  scene.add(dir);
  return { scene, mesh };
}

async function createPane(container, labelEl, preferWebGPU) {
  const { scene, mesh } = buildScene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
  camera.position.set(0, 8, 14);

  let renderer;
  let backend = 'webgl';

  if (preferWebGPU && navigator.gpu) {
    try {
      renderer = new WebGPURenderer({ antialias: true, powerPreference: 'high-performance' });
      await renderer.init();
      backend = 'webgpu';
    } catch (e) {
      console.warn('WebGPU pane fallback', e);
    }
  }

  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    if (preferWebGPU) backend = 'unavailable';
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);

  const perf = attachPerfHud(container, { renderer });
  labelEl.textContent = `${preferWebGPU ? 'WebGPURenderer' : 'WebGLRenderer'} · ${backend}`;

  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  let raf = 0;
  const loop = (t) => {
    raf = requestAnimationFrame(loop);
    mesh.rotation.y = t * 0.0003;
    controls.update();
    renderer.render(scene, camera);
    perf.update();
  };
  raf = requestAnimationFrame(loop);

  return {
    backend,
    dispose: () => {
      cancelAnimationFrame(raf);
      perf.dispose();
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      geoDispose(scene);
    },
  };
}

function geoDispose(obj) {
  obj.traverse((o) => {
    o.geometry?.dispose();
    if (o.material) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => m.dispose());
    }
  });
}

async function main() {
  const webglPane = await createPane(
    document.getElementById('webglRoot'),
    webglLabel,
    false,
  );
  const webgpuPane = await createPane(
    document.getElementById('webgpuRoot'),
    webgpuLabel,
    true,
  );

  const ua = navigator.userAgent.match(/(Chrome|Firefox|Safari|Edg)\/[\d.]+/)?.[0] ?? 'unknown';
  status.textContent = `浏览器: ${ua} · 左 ${webglPane.backend} · 右 ${webgpuPane.backend} · 各 ${COUNT} 实例`;

  window.addEventListener('beforeunload', () => {
    webglPane.dispose();
    webgpuPane.dispose();
  });
}

main().catch((e) => {
  console.error(e);
  status.textContent = `错误: ${e.message}`;
  status.style.color = '#f85149';
});
