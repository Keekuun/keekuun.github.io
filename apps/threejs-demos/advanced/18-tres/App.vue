<script setup>
import { Suspense } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, Environment } from '@tresjs/cientos';
import HelmetModel from './HelmetModel.vue';
import { DEMO_BG_CSS } from '../../shared/constants.js';
</script>

<template>
  <div class="tres-app">
    <header class="bar">
      <a href="/">← Demos</a>
      <span>进阶 18 · Vue 3 + TresJS · 声明式 3D</span>
    </header>
    <div class="canvas-wrap">
      <TresCanvas :clear-color="DEMO_BG_CSS" :dpr="[1, 2]">
        <TresPerspectiveCamera :position="[0, 0.5, 4]" :fov="45" />
        <OrbitControls make-default enable-damping :min-distance="1.5" :max-distance="12" />
        <TresAmbientLight :intensity="0.25" />
        <TresDirectionalLight :position="[5, 8, 5]" :intensity="0.9" />
        <Suspense>
          <Environment preset="sunset" :background="false" />
        </Suspense>
        <HelmetModel />
      </TresCanvas>
    </div>
    <div class="panel">
      <strong>Tres 要点</strong>
      <p class="hint">组件即 Object3D · GLTFModel / cientos · 与 R3F 对照（同一篇文档 18）</p>
    </div>
  </div>
</template>

<style scoped>
.tres-app { height: 100vh; display: flex; flex-direction: column; background: #0f1117; }
.canvas-wrap { flex: 1; min-height: 0; position: relative; }
.canvas-wrap :deep(canvas) { display: block; width: 100% !important; height: 100% !important; }
.hint { margin-top: 8px; font-size: 12px; color: #8b949e; line-height: 1.5; }
</style>
