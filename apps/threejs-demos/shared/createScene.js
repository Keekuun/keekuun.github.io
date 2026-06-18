import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DPR_CAP, DEMO_BG } from './constants.js';
import { attachPerfHud } from './perfHud.js';

/**
 * @param {HTMLElement} container
 * @param {object} [opts]
 */
export function createScene(container, opts = {}) {
  const {
    alpha = false,
    antialias = true,
    dprCap = DPR_CAP,
    fog = null,
    controls: controlsOpts = {},
    onDemand = false,
    perfHud = true,
  } = opts;

  const scene = new THREE.Scene();
  if (fog) scene.fog = fog;
  scene.background = alpha ? null : new THREE.Color(DEMO_BG);

  const camera = new THREE.PerspectiveCamera(
    controlsOpts.fov ?? 50,
    container.clientWidth / container.clientHeight,
    0.1,
    2000,
  );
  camera.position.set(3, 2, 5);

  const renderer = new THREE.WebGLRenderer({ alpha, antialias, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = !!opts.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  Object.assign(controls, controlsOpts);

  let raf = 0;
  let loopFn = null;
  let needsRender = true;

  const requestRender = () => {
    needsRender = true;
  };

  controls.addEventListener('change', requestRender);

  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    requestRender();
  };

  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const renderOnce = () => {
    renderer.render(scene, camera);
    needsRender = false;
  };

  const loop = (time) => {
    raf = requestAnimationFrame(loop);
    if (loopFn) loopFn(time);
    const controlsDirty = controls.update();
    if (onDemand) {
      if (needsRender || controlsDirty) {
        renderOnce();
        perf?.update();
      }
    } else {
      renderer.render(scene, camera);
      perf?.update();
    }
  };

  const startLoop = (fn) => {
    loopFn = fn ?? null;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  };

  const stopLoop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  startLoop();

  let perf = null;
  if (perfHud) {
    perf = attachPerfHud(container, { renderer });
  }

  const dispose = () => {
    stopLoop();
    perf?.dispose();
    ro.disconnect();
    controls.dispose();
    renderer.dispose();
    if (renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
  };

  return {
    scene,
    camera,
    renderer,
    controls,
    resize,
    startLoop,
    stopLoop,
    requestRender,
    renderOnce,
    dispose,
    perfHud: perf,
  };
}

/** 产品展示 / 孪生漫游两套 Orbit 预设 */
export const ORBIT_PRESETS = {
  product: {
    minDistance: 1.5,
    maxDistance: 12,
    maxPolarAngle: Math.PI * 0.48,
    autoRotate: false,
  },
  twin: {
    minDistance: 5,
    maxDistance: 80,
    maxPolarAngle: Math.PI / 2.1,
    autoRotate: true,
    autoRotateSpeed: 0.4,
  },
};

export function applyOrbitPreset(controls, name) {
  const p = ORBIT_PRESETS[name];
  if (!p) return;
  Object.assign(controls, p);
  controls.update();
}
