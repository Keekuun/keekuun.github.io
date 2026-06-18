import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { HDR, DEMO_BG } from './constants.js';

/**
 * PMREM 环境贴图（PBR 反射用）
 * @param {THREE.Scene} scene
 * @param {THREE.WebGLRenderer} renderer
 * @param {string} [url]
 * @param {{ background?: boolean, exposure?: number }} [opts]
 */
export async function setupHDRI(scene, renderer, url = HDR.venice, opts = {}) {
  const { background = false, exposure = 1 } = opts;
  const hdr = await new RGBELoader().loadAsync(url);
  hdr.mapping = THREE.EquirectangularReflectionMapping;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envMap = pmrem.fromEquirectangular(hdr).texture;

  scene.environment = envMap;
  scene.background = background ? envMap : new THREE.Color(DEMO_BG);
  renderer.toneMappingExposure = exposure;

  hdr.dispose();
  pmrem.dispose();
  return envMap;
}

/** 清除 environment，恢复纯色背景 */
export function clearHDRI(scene) {
  scene.environment = null;
  scene.background = new THREE.Color(DEMO_BG);
}
