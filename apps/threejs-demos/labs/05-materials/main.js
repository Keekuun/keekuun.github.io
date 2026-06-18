/** Lab 05 · docs/3d/threejs/05-geometry-and-material.md */
import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';

const root = document.getElementById('root');
const ctx = createScene(root);
const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
let mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x58a6ff, metalness: 0.4, roughness: 0.35 }));
ctx.scene.add(mesh);
ctx.scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const side = new THREE.DirectionalLight(0xffffff, 1.2);
side.position.set(5, 2, 3);
ctx.scene.add(side);
ctx.camera.position.set(2.5, 1.5, 3.5);

function setMaterial(type) {
  const wire = document.getElementById('wire').checked;
  const colors = { basic: 0x58a6ff, lambert: 0x7ee787, standard: 0xffa657 };
  let mat;
  if (type === 'basic') mat = new THREE.MeshBasicMaterial({ color: colors.basic });
  else if (type === 'lambert') mat = new THREE.MeshLambertMaterial({ color: colors.lambert });
  else mat = new THREE.MeshStandardMaterial({ color: colors.standard, metalness: 0.5, roughness: 0.3 });
  mat.wireframe = wire;
  mesh.material.dispose();
  mesh.material = mat;
}

document.querySelectorAll('[data-m]').forEach((btn) => {
  btn.addEventListener('click', () => setMaterial(btn.dataset.m));
});
document.getElementById('wire').addEventListener('change', () => {
  mesh.material.wireframe = document.getElementById('wire').checked;
});

document.getElementById('vertex').addEventListener('click', () => {
  const g = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const count = g.attributes.position.count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = (i % 3) / 2;
    colors[i * 3 + 1] = ((i + 1) % 3) / 2;
    colors[i * 3 + 2] = ((i + 2) % 3) / 2;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  mesh.geometry.dispose();
  mesh.geometry = g;
  mesh.material.dispose();
  mesh.material = new THREE.MeshBasicMaterial({ vertexColors: true });
});

window.addEventListener('beforeunload', () => ctx.dispose());
