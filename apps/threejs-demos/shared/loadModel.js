import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

/**
 * @param {string} url
 * @param {{ draco?: boolean, onProgress?: (p: number) => void, manager?: THREE.LoadingManager }} [opts]
 */
export function loadGLTF(url, opts = {}) {
  const manager = opts.manager ?? new THREE.LoadingManager();
  const loader = new GLTFLoader(manager);
  loader.setCrossOrigin('anonymous');
  if (opts.draco) loader.setDRACOLoader(dracoLoader);

  return new Promise((resolve, reject) => {
    if (opts.onProgress) {
      manager.onProgress = (_item, loaded, total) => {
        if (total > 0) opts.onProgress(Math.min(1, loaded / total));
      };
    }
    loader.load(url, resolve, undefined, reject);
  });
}

/** 归一化到单位盒并居中 */
export function normalizeRoot(object, targetSize = 2) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDim;
  object.scale.multiplyScalar(scale);
  box.setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);
  return { box, size, scale };
}

export function fitCameraToObject(camera, controls, object, offset = 1.4) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = (camera.fov * Math.PI) / 180;
  let dist = maxDim / (2 * Math.tan(fov / 2));
  dist *= offset;
  camera.position.set(center.x + dist * 0.6, center.y + dist * 0.35, center.z + dist);
  camera.near = dist / 100;
  camera.far = dist * 100;
  camera.updateProjectionMatrix();
  if (controls) {
    controls.target.copy(center);
    controls.update();
  }
}
