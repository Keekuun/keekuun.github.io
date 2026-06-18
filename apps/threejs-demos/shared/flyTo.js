import * as THREE from 'three';

/**
 * 相机 + OrbitControls 平滑飞行
 * @param {THREE.PerspectiveCamera} camera
 * @param {import('three/addons/controls/OrbitControls.js').OrbitControls} controls
 * @param {THREE.Vector3} targetPos
 * @param {THREE.Vector3} targetLookAt
 * @param {number} duration ms
 * @param {() => void} [onDone]
 */
export function flyTo(camera, controls, targetPos, targetLookAt, duration = 1200, onDone) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const t0 = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - t0) / duration);
    const ease = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    camera.position.lerpVectors(startPos, targetPos, ease);
    controls.target.lerpVectors(startTarget, targetLookAt, ease);
    controls.update();
    if (t < 1) requestAnimationFrame(tick);
    else onDone?.();
  }
  requestAnimationFrame(tick);
}
