<template>
  <div class="about-container">
    <!-- Profile Section -->
    <ProfileSection :is-visible="aboutHeroVisible" />

    <!-- Skills Section -->
    <SkillsSection :is-visible="skillsSectionVisible" :is-mobile="isMobile" />

    <!-- Projects Section -->
    <ProjectsSection/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMobileDetection } from './useMobileDetection';
import ProfileSection from './ProfileSection.vue';
import SkillsSection from './SkillsSection.vue';
import ProjectsSection from './ProjectsSection.vue';

// 移动端检测
const { isMobile } = useMobileDetection();

// 首屏元素延迟动画
const aboutHeroVisible = ref(false);
const skillsSectionVisible = ref(false);

// 首屏动画优化
onMounted(() => {
  // 使用 requestAnimationFrame 优化动画触发时机
  requestAnimationFrame(() => {
    aboutHeroVisible.value = true;
    skillsSectionVisible.value = true;
  });
});
</script>

<style scoped>
.about-container {
  width: 100%;
  min-height: 100vh;
}

/* 全局动画优化 */
.about-container * {
  will-change: auto;
}

/* 减少重绘和回流 */
.about-container img {
  transform: translateZ(0);
}

/* 优化滚动性能 */
@media (prefers-reduced-motion: no-preference) {
  .about-container {
    scroll-behavior: smooth;
  }
}

/* 针对低性能设备的优化 */
@media (prefers-reduced-motion: reduce) {
  .about-container * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
