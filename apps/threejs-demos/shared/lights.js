import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { HDR } from './constants.js';

export function setupThreePointLight(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(5, 8, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xaaccff, 0.5);
  fill.position.set(-5, 3, -2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffddaa, 0.6);
  rim.position.set(0, 4, -6);
  scene.add(rim);
  return { key, fill, rim };
}

export function setupTwinLight(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const hemi = new THREE.HemisphereLight(0x88bbff, 0x223344, 0.6);
  scene.add(hemi);
  return { hemi };
}

export function setupShadowGround(scene, renderer) {
  renderer.shadowMap.enabled = true;
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x3a4458, roughness: 0.9 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(5, 10, 3);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 40;
  light.shadow.camera.left = -8;
  light.shadow.camera.right = 8;
  light.shadow.camera.top = 8;
  light.shadow.camera.bottom = -8;
  scene.add(light);
  return { ground, light };
}

export async function loadHDRI(scene, renderer, url = HDR.venice) {
  const tex = await new RGBELoader().loadAsync(url);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = tex;
  scene.background = tex;
  renderer.toneMappingExposure = 1;
  return tex;
}

export function setMeshShadows(object, cast = true, receive = true) {
  object.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = cast;
      o.receiveShadow = receive;
    }
  });
}
