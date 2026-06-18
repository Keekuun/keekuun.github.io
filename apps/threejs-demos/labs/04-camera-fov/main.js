/** Lab 04 · docs/3d/threejs/04-camera.md */
import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';
import { fitCameraToObject } from '../../shared/loadModel.js';

const root = document.getElementById('root');
const ctx = createScene(root);
const group = new THREE.Group();
const mesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.35, 128, 32),
  new THREE.MeshStandardMaterial({ color: 0x58a6ff, metalness: 0.3, roughness: 0.5 }),
);
group.add(mesh);
ctx.scene.add(group);
ctx.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const d = new THREE.DirectionalLight(0xffffff, 1);
d.position.set(4, 5, 3);
ctx.scene.add(d);

document.getElementById('fov').addEventListener('input', (e) => {
  const v = Number(e.target.value);
  document.getElementById('fovVal').textContent = v;
  ctx.camera.fov = v;
  ctx.camera.updateProjectionMatrix();
});

document.getElementById('near').addEventListener('change', (e) => {
  ctx.camera.near = Math.max(0.0001, Number(e.target.value));
  ctx.camera.updateProjectionMatrix();
});

document.getElementById('fit').addEventListener('click', () => {
  fitCameraToObject(ctx.camera, ctx.controls, group);
});

document.getElementById('zfight').addEventListener('click', () => {
  ctx.camera.near = 0.001;
  ctx.camera.updateProjectionMatrix();
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshBasicMaterial({ color: 0xf85149, side: THREE.DoubleSide }),
  );
  plane.position.z = -0.5;
  plane.rotation.x = -0.1;
  group.add(plane);
});

fitCameraToObject(ctx.camera, ctx.controls, group);
window.addEventListener('beforeunload', () => ctx.dispose());
