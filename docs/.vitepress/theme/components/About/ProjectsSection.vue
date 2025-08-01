<template>
  <div class="oss-section visible" > <!-- :class="{ visible: isVisible }" -->
    <h2 class="oss-title">开源项目</h2>
    <div class="oss-list">

      <div class="oss-card" v-for="(item, idx) in ossProjects" :key="item.name" :ref="setOssCardRef(idx)"
        :class="{ visible: ossCardVisible[idx] }" v-memo="[item, ossCardVisible[idx]]">
        <div class="oss-img-wrap">
          <img :src="item.projectsimg" class="oss-img" :alt="item.name" />
        </div>
        <div class="oss-content">
          <div class="oss-name">{{ item.name }}</div>
          <div class="oss-desc">{{ item.desc }}</div>
          <div class="oss-data">
            <span>
              <TkIcon :icon="Star" icon-type="svg" size="16px" />
              {{ item.Star }}
            </span>
            <span>
              <TkIcon :icon="Fork" icon-type="svg" size="16px" />
              {{ item.Fork }}
            </span>
            <span>
              <TkIcon :icon="View" icon-type="svg" size="16px" />
              {{ item.View }}
            </span>
          </div>
          <a class="oss-btn" :href="item.github" target="_blank" rel="noopener noreferrer">
            查看项目
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onBeforeUnmount } from 'vue';
import { TkIcon } from "vitepress-theme-teek";
import { useMultipleIntersectionObserver } from './useIntersectionObserver';
import { ossProjects, Star, Fork, View } from './AboutData';

const props = defineProps({
});

// 使用多元素观察器组合函数
const {
  elementsVisible: ossCardVisible,
  setElementRef: setOssCardRef,
  setupObserver,
  cleanup
} = useMultipleIntersectionObserver(0.2, false);

onMounted(() => {
  nextTick(() => setupObserver());
});

onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
.oss-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 0;
  opacity: 0;
  transform: scale(0.8);
  transition: box-shadow 0.22s, transform 0.18s, border 0.18s, opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.oss-section.visible {
  opacity: 1;
  transform: scale(1);
}

.oss-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 32px;
}

.oss-list {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
}

.oss-card {
  width: 356px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  opacity: 0;
  transform: scale(0.8);
}

.oss-card.visible {
  opacity: 1;
  transform: scale(1);
}

.oss-card:hover {
  box-shadow: 0 8px 32px var(--vp-c-brand-1);
  transform: scale(1.04);
}

.oss-img-wrap {
  position: relative;
  width: 100%;
  height: 185px;
  overflow: hidden;
}

.oss-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.oss-img:hover {
  transform: scale(1.08);
}

.oss-tag {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 0.1rem 1rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 500;
}

.oss-content {
  padding: 18px 20px 16px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.oss-name {
  color: #444;
  font-size: 1.18rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.oss-desc {
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 18px;
  min-height: 56px;
}

.oss-data {
  display: flex;
  gap: 18px;
  color: #888;
  font-size: 0.98rem;
  margin-bottom: 12px;
}

.oss-data i {
  margin-right: 4px;
}

.oss-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--vp-c-brand-1);
}

.oss-btn:hover {
  color: #539dfd;
}

@media (max-width: 960px) {

  .oss-card {
    width: 362px;
    flex-direction: column;
    gap: 18px;
  }

  .oss-preview-grid {
    width: 100%;
    grid-template-columns: 1fr 1fr;
  }

  .oss-right {
    min-width: 0;
  }

  .oss-left {
    width: 100%;
    min-width: 0;
    margin-bottom: 10px;
  }

  .oss-preview-img {
    height: 100px;
    border-radius: 5px;
  }

}
</style>
