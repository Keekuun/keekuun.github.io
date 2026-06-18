import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';
import { setupThreePointLight, setupShadowGround } from '../../shared/lights.js';

export class Configurator {
  constructor(container) {
    this.ctx = createScene(container, { shadows: true, controls: { minDistance: 4, maxDistance: 12 } });
    setupShadowGround(this.ctx.scene, this.ctx.renderer);

    this.body = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.9, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x58a6ff, metalness: 0.6, roughness: 0.25 }),
    );
    this.body.position.y = 0.65;
    this.body.castShadow = true;
    this.ctx.scene.add(this.body);

    this.cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.7, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x3d4a62, metalness: 0.3, roughness: 0.4 }),
    );
    this.cabin.position.set(-0.3, 1.2, 0);
    this.cabin.castShadow = true;
    this.ctx.scene.add(this.cabin);

    this.wheelGroup = new THREE.Group();
    this.wheels = [];
    [[-1, 0.35, 0.6], [-1, 0.35, -0.6], [1, 0.35, 0.6], [1, 0.35, -0.6]].forEach((p) => {
      const w = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.25, 24),
        new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.5, roughness: 0.5 }),
      );
      w.rotation.z = Math.PI / 2;
      w.position.set(...p);
      w.castShadow = true;
      this.wheelGroup.add(w);
      this.wheels.push(w);
    });
    this.ctx.scene.add(this.wheelGroup);

    this.ctx.camera.position.set(5, 3, 6);
    this.ctx.controls.autoRotate = true;
    this.ctx.controls.autoRotateSpeed = 0.8;
  }

  setColor(hex) {
    this.body.material.color.setHex(hex);
    this.ctx.requestRender?.();
  }

  setWheel(type) {
    const r = type === 'sport' ? 0.45 : 0.35;
    this.wheels.forEach((w) => {
      w.geometry.dispose();
      w.geometry = new THREE.CylinderGeometry(r, r, 0.25, 24);
    });
  }

  screenshot() {
    this.ctx.renderOnce();
    return this.ctx.renderer.domElement.toDataURL('image/png');
  }

  dispose() {
    this.body.geometry.dispose();
    this.body.material.dispose();
    this.cabin.geometry.dispose();
    this.cabin.material.dispose();
    this.wheels.forEach((w) => {
      w.geometry.dispose();
      w.material.dispose();
    });
    this.ctx.dispose();
  }
}
