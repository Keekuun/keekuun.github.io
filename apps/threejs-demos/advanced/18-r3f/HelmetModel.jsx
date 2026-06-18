import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { loadGLTF, normalizeRoot, fitCameraToObject } from '../../shared/loadModel.js';
import { MODELS } from '../../shared/constants.js';

export function HelmetModel() {
  const { camera, controls } = useThree();
  const [model, setModel] = useState(null);

  useEffect(() => {
    let alive = true;
    loadGLTF(MODELS.helmet).then((gltf) => {
      if (!alive) return;
      const root = gltf.scene;
      normalizeRoot(root, 2.5);
      setModel(root);
      if (camera) fitCameraToObject(camera, controls, root);
    });
    return () => { alive = false; };
  }, [camera, controls]);

  return model ? <primitive object={model} /> : null;
}
