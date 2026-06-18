import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';
import { loadGLTF, normalizeRoot, fitCameraToObject } from '../../shared/loadModel.js';
import { setupThreePointLight } from '../../shared/lights.js';
import { setupHDRI } from '../../shared/setupHDRI.js';
import { setupPick, highlightMesh, clearAllHighlights } from '../../shared/pick.js';
import { disposeObject3D } from '../../shared/dispose.js';
import { MODELS } from '../../shared/constants.js';

const MODEL_MAP = {
  helmet: { url: MODELS.helmet, label: 'DamagedHelmet' },
  duck: { url: MODELS.duck, label: 'Duck' },
};

const PART_INFO = {
  default: { name: '外壳', desc: 'PBR 金属外壳', size: '120 × 80 × 60 mm', material: 'MeshStandard' },
  mesh_0: { name: '主体', desc: '主结构件', size: '—', material: 'Standard' },
};

export class ProductViewer {
  /** @param {HTMLElement} container */
  constructor(container, callbacks = {}) {
    this.cb = callbacks;
    this.ctx = createScene(container, { controls: { minDistance: 1.2, maxDistance: 15, maxPolarAngle: Math.PI * 0.48 } });
    setupThreePointLight(this.ctx.scene);
    this.root = new THREE.Group();
    this.ctx.scene.add(this.root);
    this.currentId = null;
    this.selected = null;

    this.unpick = setupPick(this.root, this.ctx.camera, this.ctx.renderer.domElement, {
      onPick: (mesh) => this.#handlePick(mesh),
    });

    this.ctx.renderer.domElement.addEventListener('dblclick', () => this.resetView());

    this.envReady = setupHDRI(this.ctx.scene, this.ctx.renderer, undefined, { background: false })
      .then(() => this.ctx.requestRender())
      .catch((e) => console.warn('环境贴图加载失败', e));
  }

  async loadModel(id) {
    await this.envReady;
    const cfg = MODEL_MAP[id];
    if (!cfg) return;
    if (this.model) {
      this.root.remove(this.model);
      disposeObject3D(this.model);
      this.model = null;
    }
    this.currentId = id;
    try {
      const gltf = await loadGLTF(cfg.url, {
        onProgress: (p) => this.cb.onProgress?.(p),
      });
      this.model = gltf.scene;
      let meshIndex = 0;
      this.model.traverse((o) => {
        if (o.isMesh) {
          o.userData.id = o.name || `part-${meshIndex++}`;
          o.userData.info = PART_INFO[o.name] || PART_INFO.default;
        }
      });
      normalizeRoot(this.model, 2.5);
      this.root.add(this.model);
      this.resetView();
      this.cb.onReady?.();
    } catch (e) {
      this.cb.onError?.(`加载失败: ${e.message}`);
    }
  }

  #handlePick(mesh) {
    clearAllHighlights(this.root);
    this.selected = mesh;
    if (mesh) {
      highlightMesh(mesh, 0x113355);
      this.cb.onPick?.(mesh.userData.info);
    } else {
      this.cb.onPick?.(null);
    }
    this.ctx.requestRender();
  }

  resetView() {
    if (this.model) fitCameraToObject(this.ctx.camera, this.ctx.controls, this.model, 1.5);
  }

  dispose() {
    this.unpick?.();
    if (this.model) disposeObject3D(this.model);
    this.ctx.dispose();
  }
}
