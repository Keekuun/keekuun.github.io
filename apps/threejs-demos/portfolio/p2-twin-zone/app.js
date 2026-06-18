import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { createScene, applyOrbitPreset } from '../../shared/createScene.js';
import { setupTwinLight } from '../../shared/lights.js';
import { setupPick, highlightMesh, clearAllHighlights } from '../../shared/pick.js';
import { disposeObject3D } from '../../shared/dispose.js';

const ZONE_COLORS = { a: 0x58a6ff, b: 0x7ee787, c: 0xffa657 };
const STATUS_COLOR = { normal: 0x3fb950, alarm: 0xf85149, offline: 0x484f58 };

function buildZone(id) {
  const letter = id.split('-')[1];
  const group = new THREE.Group();
  group.name = id;

  const building = new THREE.Mesh(
    new THREE.BoxGeometry(8, 3, 6),
    new THREE.MeshStandardMaterial({ color: ZONE_COLORS[letter] ?? 0x888888, roughness: 0.7 }),
  );
  building.position.y = 1.5;
  building.userData = { type: 'building', id, name: `${letter.toUpperCase()} 栋` };
  group.add(building);

  const devices = [];
  for (let i = 0; i < 5; i++) {
    const dev = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.6, 0.6),
      new THREE.MeshStandardMaterial({ color: STATUS_COLOR.normal }),
    );
    dev.position.set((i - 2) * 1.5, 3.2, (i % 2) * 2 - 1);
    const devId = `${id}-dev-${i + 1}`;
    dev.userData = {
      type: 'device',
      id: devId,
      name: `设备 ${i + 1}`,
      status: 'normal',
    };
    group.add(dev);
    devices.push(dev);
  }
  return { group, devices };
}

export class TwinApp {
  constructor(viewport, detailEl) {
    this.detailEl = detailEl;
    this.ctx = createScene(viewport);
    applyOrbitPreset(this.ctx.controls, 'twin');
    setupTwinLight(this.ctx.scene);
    this.ctx.scene.add(new THREE.GridHelper(40, 40, 0x30363d, 0x21262d));

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.inset = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    viewport.appendChild(this.labelRenderer.domElement);

    this.zoneRoot = new THREE.Group();
    this.ctx.scene.add(this.zoneRoot);
    this.labels = [];
    this.devices = [];
    this.currentZone = null;

    this.unpick = setupPick(this.zoneRoot, this.ctx.camera, this.ctx.renderer.domElement, {
      onPick: (mesh) => this.#onPick(mesh),
    });

    this.ctx.startLoop(() => {
      const w = viewport.clientWidth;
      const h = viewport.clientHeight;
      if (w && h) this.labelRenderer.setSize(w, h);
      this.labelRenderer.render(this.ctx.scene, this.ctx.camera);
    });

    this.timer = setInterval(() => this.#tickData(), 3000);
  }

  loadZone(id) {
    this.#clearZone();
    const { group, devices } = buildZone(id);
    this.zoneRoot.add(group);
    this.devices = devices;
    this.currentZone = id;

    devices.forEach((dev) => {
      const el = document.createElement('div');
      el.className = 'label2d';
      el.textContent = dev.userData.name;
      const label = new CSS2DObject(el);
      label.position.set(0, 0.6, 0);
      dev.add(label);
      this.labels.push({ dev, el, label });
    });

    this.ctx.camera.position.set(12, 8, 12);
    this.ctx.controls.target.set(0, 1.5, 0);
    this.ctx.controls.update();
    this.detailEl.innerHTML = `<strong>${id}</strong><p>已加载 ${devices.length} 个设备标注</p>`;
  }

  #clearZone() {
    clearAllHighlights(this.zoneRoot);
    this.labels.forEach(({ label, dev }) => dev.remove(label));
    this.labels = [];
    [...this.zoneRoot.children].forEach((c) => {
      this.zoneRoot.remove(c);
      disposeObject3D(c);
    });
    this.devices = [];
  }

  #onPick(mesh) {
    clearAllHighlights(this.zoneRoot);
    if (!mesh?.userData?.id) {
      this.detailEl.innerHTML = '<p>点击设备或楼栋</p>';
      return;
    }
    highlightMesh(mesh, 0x224466);
    const u = mesh.userData;
    this.detailEl.innerHTML = `
      <strong>${u.name}</strong>
      <p>ID: ${u.id}</p>
      <p>状态: ${u.status ?? '—'}</p>
      <p>类型: ${u.type}</p>
    `;
  }

  #tickData() {
    if (!this.devices.length) return;
    const dev = this.devices[Math.floor(Math.random() * this.devices.length)];
    const statuses = ['normal', 'alarm', 'offline'];
    const next = statuses[Math.floor(Math.random() * statuses.length)];
    dev.userData.status = next;
    dev.material.color.setHex(STATUS_COLOR[next]);
    const entry = this.labels.find((l) => l.dev === dev);
    if (entry) {
      entry.el.className = 'label2d' + (next === 'alarm' ? ' alarm' : next === 'offline' ? ' offline' : '');
      entry.el.textContent = `${dev.userData.name} · ${next}`;
    }
  }

  dispose() {
    clearInterval(this.timer);
    this.unpick?.();
    this.#clearZone();
    this.labelRenderer.domElement.remove();
    this.ctx.dispose();
  }
}
