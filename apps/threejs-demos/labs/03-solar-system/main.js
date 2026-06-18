/** Lab 03 · docs/3d/threejs/03-scene-graph-and-coordinates.md */
import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';

const root = document.getElementById('root');
const ctx = createScene(root);
ctx.scene.add(new THREE.AxesHelper(4));
ctx.scene.add(new THREE.GridHelper(20, 20, 0x30363d, 0x21262d));

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffcc00 }),
);
const earthPivot = new THREE.Object3D();
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.25, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x58a6ff }),
);
earth.position.x = 3;
earthPivot.add(earth);
sun.add(earthPivot);
ctx.scene.add(sun);
ctx.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const light = new THREE.PointLight(0xffffff, 2);
sun.add(light);
ctx.camera.position.set(0, 6, 10);

const worldPos = new THREE.Vector3();
let logged = false;

ctx.startLoop((t) => {
  const s = t * 0.001;
  sun.rotation.y = s * 0.2;
  earthPivot.rotation.y = s;
  earth.rotation.y = s * 3;
  if (!logged && s > 1) {
    earth.getWorldPosition(worldPos);
    console.log('[Lab03] Earth local', earth.position.toArray(), 'world', worldPos.toArray());
    logged = true;
  }
});

window.addEventListener('beforeunload', () => ctx.dispose());
