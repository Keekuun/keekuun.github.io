/** Lab 08 · docs/3d/threejs/08-interaction.md */
import * as THREE from 'three';
import { createScene, applyOrbitPreset } from '../../shared/createScene.js';
import { setupPick, highlightMesh, clearAllHighlights } from '../../shared/pick.js';

const root = document.getElementById('root');
const info = document.getElementById('info');
const ctx = createScene(root);
ctx.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const d = new THREE.DirectionalLight(0xffffff, 1);
d.position.set(3, 5, 2);
ctx.scene.add(d);

const colors = [0x58a6ff, 0x7ee787, 0xffa657, 0xf778ba];
const group = new THREE.Group();
colors.forEach((c, i) => {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: c }),
  );
  m.position.x = (i - 1.5) * 1.8;
  m.userData = { id: `device-${i + 1}`, name: `设备 ${i + 1}`, status: '正常' };
  group.add(m);
});
ctx.scene.add(group);
ctx.camera.position.set(0, 2, 6);

let selected = null;

setupPick(group, ctx.camera, ctx.renderer.domElement, {
  onPick: (mesh) => {
    clearAllHighlights(group);
    selected = mesh;
    if (mesh) {
      highlightMesh(mesh, 0x224466);
      const d = mesh.userData;
      info.textContent = `${d.name}\nid: ${d.id}\n状态: ${d.status}`;
    } else {
      info.textContent = '未选中';
    }
    ctx.requestRender();
  },
});

document.getElementById('presetProduct').addEventListener('click', () => applyOrbitPreset(ctx.controls, 'product'));
document.getElementById('presetTwin').addEventListener('click', () => applyOrbitPreset(ctx.controls, 'twin'));

window.addEventListener('beforeunload', () => ctx.dispose());
