/** 进阶 16 · docs/3d/threejs/advanced/16-custom-shader.md */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DPR_CAP, DEMO_BG } from '../../shared/constants.js';
import { attachPerfHud } from '../../shared/perfHud.js';

const root = document.getElementById('root');

const scene = new THREE.Scene();
scene.background = new THREE.Color(DEMO_BG);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
camera.position.set(0, 3, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
root.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(3, 5, 2);
scene.add(dir);
scene.add(new THREE.GridHelper(14, 14, 0x30363d, 0x21262d));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.5, 0);

const heatGroup = new THREE.Group();
const flowGroup = new THREE.Group();
scene.add(heatGroup);
scene.add(flowGroup);

// —— 热力：5 个设备块，共用 ShaderMaterial clone ——
const heatVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const heatFrag = `
  precision mediump float;
  uniform float uIntensity;
  uniform vec3 uColorHot;
  uniform vec3 uColorCold;
  varying vec2 vUv;
  void main() {
    float t = smoothstep(0.15, 0.85, uIntensity);
    vec3 color = mix(uColorCold, uColorHot, t);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const heatMeshes = [];
for (let i = 0; i < 5; i++) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uIntensity: { value: 0.2 + i * 0.15 },
      uColorHot: { value: new THREE.Color(0xff4422) },
      uColorCold: { value: new THREE.Color(0x2244aa) },
    },
    vertexShader: heatVert,
    fragmentShader: heatFrag,
  });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), mat);
  mesh.position.set((i - 2) * 1.8, 0.6, 0);
  heatGroup.add(mesh);
  heatMeshes.push(mesh);
}

// —— 流动管线：TubeGeometry + 条纹 UV 动画 ——
const flowUniforms = {
  uTime: { value: 0 },
  uSpeed: { value: 1 },
  uColor: { value: new THREE.Color(0x58a6ff) },
};
const flowMat = new THREE.ShaderMaterial({
  uniforms: flowUniforms,
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;
    uniform float uTime;
    uniform float uSpeed;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      float stripe = fract(vUv.x * 8.0 - uTime * uSpeed);
      float arrow = step(0.55, stripe);
      vec3 col = mix(uColor * 0.35, uColor * 1.4, arrow);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
});

const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-5, 1, -2),
  new THREE.Vector3(-2, 2, 1),
  new THREE.Vector3(1, 1.5, -1),
  new THREE.Vector3(4, 2.5, 2),
  new THREE.Vector3(6, 1, 0),
]);
const tube = new THREE.Mesh(
  new THREE.TubeGeometry(curve, 64, 0.25, 12, false),
  flowMat,
);
flowGroup.add(tube);
flowGroup.visible = false;

const perf = attachPerfHud(root, { renderer });

function resize() {
  const w = root.clientWidth;
  const h = root.clientHeight;
  if (!w || !h) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
new ResizeObserver(resize).observe(root);
resize();

let mode = 'heat';
document.getElementById('modeHeat').addEventListener('click', () => {
  mode = 'heat';
  heatGroup.visible = true;
  flowGroup.visible = false;
  document.getElementById('modeHeat').classList.add('active');
  document.getElementById('modeFlow').classList.remove('active');
  document.getElementById('heatCtrl').hidden = false;
  document.getElementById('flowCtrl').hidden = true;
});
document.getElementById('modeFlow').addEventListener('click', () => {
  mode = 'flow';
  heatGroup.visible = false;
  flowGroup.visible = true;
  document.getElementById('modeFlow').classList.add('active');
  document.getElementById('modeHeat').classList.remove('active');
  document.getElementById('heatCtrl').hidden = true;
  document.getElementById('flowCtrl').hidden = false;
});

document.getElementById('intensity').addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  document.getElementById('intVal').textContent = v.toFixed(2);
  heatMeshes.forEach((m) => {
    m.material.uniforms.uIntensity.value = v;
  });
});

document.getElementById('speed').addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  document.getElementById('spdVal').textContent = v.toFixed(1);
  flowUniforms.uSpeed.value = v;
});

const clock = new THREE.Clock();
let raf = 0;
const loop = () => {
  raf = requestAnimationFrame(loop);
  flowUniforms.uTime.value = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  perf.update();
};
loop();

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(raf);
  perf.dispose();
  controls.dispose();
  tube.geometry.dispose();
  flowMat.dispose();
  heatMeshes.forEach((m) => {
    m.geometry.dispose();
    m.material.dispose();
  });
  renderer.dispose();
});
