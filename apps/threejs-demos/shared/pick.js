import * as THREE from 'three';

export function setupPick(root, camera, domElement, { onPick, onHover } = {}) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;

  const getMeshes = () => {
    const list = [];
    root.traverse((o) => {
      if (o.isMesh && o.visible) list.push(o);
    });
    return list;
  };

  const setPointer = (event) => {
    const rect = domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const pick = (event) => {
    setPointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(getMeshes(), false);
    return hits[0]?.object ?? null;
  };

  const onClick = (e) => {
    const mesh = pick(e);
    onPick?.(mesh, e);
  };

  const onMove = (e) => {
    const mesh = pick(e);
    if (mesh !== hovered) {
      onHover?.(mesh, hovered);
      hovered = mesh;
    }
    domElement.style.cursor = mesh ? 'pointer' : '';
  };

  domElement.addEventListener('click', onClick);
  domElement.addEventListener('mousemove', onMove);

  return () => {
    domElement.removeEventListener('click', onClick);
    domElement.removeEventListener('mousemove', onMove);
    domElement.style.cursor = '';
  };
}

const _prevEmissive = new WeakMap();

export function highlightMesh(mesh, color = 0x335588) {
  if (!mesh?.material) return;
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  mats.forEach((m) => {
    if (!_prevEmissive.has(m)) _prevEmissive.set(m, m.emissive?.clone());
    if (m.emissive) m.emissive.setHex(color);
  });
}

export function clearHighlight(mesh) {
  if (!mesh?.material) return;
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  mats.forEach((m) => {
    const prev = _prevEmissive.get(m);
    if (prev && m.emissive) m.emissive.copy(prev);
  });
}

export function clearAllHighlights(root) {
  root.traverse((o) => {
    if (o.isMesh) clearHighlight(o);
  });
}
