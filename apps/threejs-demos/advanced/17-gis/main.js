/** 进阶 17 · docs/3d/threejs/advanced/17-gis-coordinates.md */
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { createScene } from '../../shared/createScene.js';
import { setupTwinLight } from '../../shared/lights.js';
import { setupPick, highlightMesh, clearAllHighlights } from '../../shared/pick.js';
import { REF, POIS, poiToPosition } from '../../shared/geo.js';

const root = document.getElementById('root');
const detail = document.getElementById('detail');
const btns = document.getElementById('btns');

const ctx = createScene(root, { controls: { minDistance: 80, maxDistance: 400, maxPolarAngle: Math.PI / 2.1 } });
setupTwinLight(ctx.scene);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(800, 800),
  new THREE.MeshStandardMaterial({ color: 0x1a2332, roughness: 0.95 }),
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
ctx.scene.add(ground);
ctx.scene.add(new THREE.GridHelper(800, 40, 0x30363d, 0x21262d));

const labelRenderer = new CSS2DRenderer();
labelRenderer.domElement.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
root.appendChild(labelRenderer.domElement);

const markers = new THREE.Group();
ctx.scene.add(markers);
const meshById = new Map();

POIS.forEach((poi) => {
  const { x, z } = poiToPosition(poi);
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(18, 12 + Math.random() * 8, 14),
    new THREE.MeshStandardMaterial({ color: poi.color }),
  );
  building.position.set(x, building.geometry.parameters.height / 2, z);
  building.userData = poi;
  markers.add(building);
  meshById.set(poi.id, building);

  const el = document.createElement('div');
  el.style.cssText = 'padding:2px 5px;background:rgba(22,27,34,.9);border:1px solid #30363d;border-radius:3px;font:10px system-ui;color:#e6edf3;';
  el.textContent = poi.name;
  const label = new CSS2DObject(el);
  label.position.set(0, building.geometry.parameters.height / 2 + 4, 0);
  building.add(label);

  const btn = document.createElement('button');
  btn.textContent = poi.name;
  btn.addEventListener('click', () => focusPoi(poi.id));
  btns.appendChild(btn);
});

const refMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(3, 3, 20, 16),
  new THREE.MeshStandardMaterial({ color: 0xffcc00 }),
);
const refPos = poiToPosition({ lng: REF.lng, lat: REF.lat });
refMesh.position.set(refPos.x, 10, refPos.z);
refMesh.userData = { ...REF, id: 'ref', name: REF.label };
markers.add(refMesh);

function showDetail(poi) {
  detail.innerHTML = `
    <strong>${poi.name ?? REF.label}</strong><br/>
    lng: ${poi.lng?.toFixed(4) ?? REF.lng}<br/>
    lat: ${poi.lat?.toFixed(4) ?? REF.lat}<br/>
    本地 x: ${poiToPosition(poi).x.toFixed(1)} m · z: ${poiToPosition(poi).z.toFixed(1)} m
  `;
}

function focusPoi(id) {
  const mesh = meshById.get(id) ?? refMesh;
  clearAllHighlights(markers);
  highlightMesh(mesh, 0x224466);
  showDetail(mesh.userData);
  ctx.controls.target.copy(mesh.position);
  ctx.camera.position.set(mesh.position.x + 60, 80, mesh.position.z + 60);
  ctx.controls.update();
}

setupPick(markers, ctx.camera, ctx.renderer.domElement, {
  onPick: (mesh) => {
    if (mesh?.userData?.id) focusPoi(mesh.userData.id);
  },
});

ctx.camera.position.set(120, 150, 120);
ctx.controls.target.set(refPos.x, 0, refPos.z);

ctx.startLoop(() => {
  labelRenderer.setSize(root.clientWidth, root.clientHeight);
  labelRenderer.render(ctx.scene, ctx.camera);
});

showDetail({ name: REF.label, lng: REF.lng, lat: REF.lat });

window.addEventListener('beforeunload', () => {
  labelRenderer.domElement.remove();
  ctx.dispose();
});
