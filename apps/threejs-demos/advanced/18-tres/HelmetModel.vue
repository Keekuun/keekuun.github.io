<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useTres } from '@tresjs/core';
import { loadGLTF, normalizeRoot, fitCameraToObject } from '../../shared/loadModel.js';
import { MODELS } from '../../shared/constants.js';

const { scene, camera } = useTres();
let model = null;

onMounted(async () => {
  const gltf = await loadGLTF(MODELS.helmet);
  model = gltf.scene;
  normalizeRoot(model, 2.5);
  scene.value.add(model);
  if (camera.value) fitCameraToObject(camera.value, null, model);
});

onUnmounted(() => {
  model?.removeFromParent();
});
</script>

<template></template>
