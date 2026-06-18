/** Lab 06 · docs/3d/threejs/06-lights-and-shadows.md */
import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';
import { setupThreePointLight, setupTwinLight, setupShadowGround, setMeshShadows } from '../../shared/lights.js';

const root = document.getElementById('root');
let ctx = null;
let mesh = null;
let lights = [];

function clearLights() {
  lights.forEach((l) => ctx.scene.remove(l));
  lights = [];
  [...ctx.scene.children].forEach((c) => {
    if (c.userData.temp) ctx.scene.remove(c);
  });
}

function boot(shadows) {
  if (ctx) ctx.dispose();
  root.innerHTML = '';
  ctx = createScene(root, { shadows });
  mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.25 }),
  );
  mesh.userData.temp = true;
  ctx.scene.add(mesh);
  ctx.camera.position.set(0, 2, 5);
}

function modeThree() {
  boot(false);
  const l = setupThreePointLight(ctx.scene);
  lights = [l.key, l.fill, l.rim];
}

function modeShadow() {
  boot(true);
  const { ground, light } = setupShadowGround(ctx.scene, ctx.renderer);
  ground.userData.temp = true;
  light.userData.temp = true;
  setMeshShadows(mesh, true, false);
  lights = [light];
}

function modeTwin() {
  boot(false);
  const l = setupTwinLight(ctx.scene);
  lights = [l.hemi];
}

document.getElementById('mode3').addEventListener('click', modeThree);
document.getElementById('modeShadow').addEventListener('click', modeShadow);
document.getElementById('modeTwin').addEventListener('click', modeTwin);
modeThree();

window.addEventListener('beforeunload', () => ctx?.dispose());
