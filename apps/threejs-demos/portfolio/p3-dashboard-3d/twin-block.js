import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';
import { setupTwinLight } from '../../shared/lights.js';
import { setupPick, highlightMesh, clearAllHighlights } from '../../shared/pick.js';

export class TwinBlock {
  constructor(container, store) {
    this.store = store;
    this.ctx = createScene(container, {
      onDemand: true,
      controls: { minDistance: 8, maxDistance: 25, maxPolarAngle: Math.PI / 2.2 },
    });
    setupTwinLight(this.ctx.scene);
    this.ctx.scene.add(new THREE.GridHelper(30, 30, 0x30363d, 0x21262d));

    this.meshes = new Map();
    const positions = [[-3, 0.5, 0], [-1, 0.5, 1], [1, 0.5, -1], [3, 0.5, 0]];
    store.getState().devices.forEach((d, i) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x3fb950 }),
      );
      m.position.set(...positions[i]);
      m.userData.id = d.id;
      this.ctx.scene.add(m);
      this.meshes.set(d.id, m);
    });

    this.unpick = setupPick(this.ctx.scene, this.ctx.camera, this.ctx.renderer.domElement, {
      onPick: (mesh) => {
        const id = mesh?.userData?.id;
        if (id) store.select(id);
        this.ctx.requestRender();
      },
    });

    store.subscribe(() => this.syncFromStore());
    this.syncFromStore();
    this.ctx.camera.position.set(0, 10, 14);
    this.ctx.controls.target.set(0, 0, 0);
  }

  syncFromStore() {
    const { devices, selectedId } = this.store.getState();
    clearAllHighlights(this.ctx.scene);
    devices.forEach((d) => {
      const m = this.meshes.get(d.id);
      if (!m) return;
      m.material.color.setHex(d.status === 'alarm' ? 0xf85149 : 0x3fb950);
      if (d.id === selectedId) highlightMesh(m, 0x224466);
    });
    this.ctx.requestRender();
  }

  setSelected(id) {
    this.syncFromStore();
  }

  dispose() {
    this.unpick?.();
    this.meshes.forEach((m) => {
      m.geometry.dispose();
      m.material.dispose();
    });
    this.ctx.dispose();
  }
}
