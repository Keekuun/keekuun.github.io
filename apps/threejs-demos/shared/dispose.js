import * as THREE from 'three';

export function disposeObject3D(root) {
  root.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => {
        if (!m) return;
        Object.keys(m).forEach((key) => {
          const val = m[key];
          if (val && val.isTexture) val.dispose();
        });
        m.dispose();
      });
    }
  });
}

export function disposeScene(scene) {
  [...scene.children].forEach((child) => {
    scene.remove(child);
    disposeObject3D(child);
  });
}
