<template>
  <div class="skills-section" :class="{ visible: isVisible }">
    <h2 class="skills-title">我的技能</h2>
    <div class="skills-content">
      <div class="skills-left" :class="{ visible: skillsLeftVisible }" ref="skillsLeftRef">
        <div class="skills-subtitle">专业技能</div>
        <div v-for="skill in majorSkills"
             :key="skill.name"
             class="skill-bar-item"
             v-memo="[skill]">
          <div class="skill-bar-label">
            <span>{{ skill.name }}</span>
            <span>{{ skill.percent }}%</span>
          </div>
          <div class="skill-bar-bg">
            <div class="skill-bar-fill"
                 :style="{ width: skill.percent + '%', background: skill.color }">
            </div>
          </div>
          <div class="skill-bar-tags" v-if="skill.tags">
            <span class="skill-tag"
                  v-for="tag in skill.tags"
                  :key="tag.name"
                  :style="{ background: tag.bg, color: tag.color }">
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>

      <div class="skills-right" :class="{ visible: skillsRightVisible }" ref="skillsRightRef">
        <div class="skills-subtitle">技术栈</div>
        <!-- PC端 -->
        <div class="tech-stack-grid pc" v-if="!isMobile">
          <div v-for="(row, rowIdx) in techStackRows"
               :key="rowIdx"
               class="tech-stack-row"
               v-memo="[row]">
            <div v-for="(item, idx) in row"
                 :key="idx"
                 class="tech-stack-item"
                 :class="{ empty: !item.icon }">
              <TkIcon v-if="item.icon"
                      :icon="item.icon"
                      icon-type="svg"
                      :size="item.small ? '32px' : iconSize"
                      :title="item.name" />
            </div>
          </div>
        </div>
        <!-- 移动端 -->
        <div class="tech-stack-grid mobile" v-else>
          <div v-for="(item, idx) in mobileTechStackIcons"
               :key="idx"
               class="tech-stack-item">
            <TkIcon :icon="item.icon"
                    icon-type="svg"
                    size="32px"
                    :title="item.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import {TkIcon} from "vitepress-theme-teek";
import {useIntersectionObserver} from './useIntersectionObserver';
import {majorSkills, techStackIcons} from './AboutData';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  }
});

// 响应式图标大小
const iconSize = ref('46px');

// 窗口大小变化时更新图标大小
const handleResize = () => {
  let result = '46px';
  if (window.innerWidth > 900 && window.innerWidth <= 1100){
    result = '40px';
  }else if (window.innerWidth <= 900){
    result = '46px';
  }

  iconSize.value = result
};

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

// 使用组合函数创建监听动画
const { isVisible: skillsLeftVisible, targetRef: skillsLeftRef } = useIntersectionObserver(0.1);
const { isVisible: skillsRightVisible, targetRef: skillsRightRef } = useIntersectionObserver(0.1);

// 计算属性优化
const techStackRows = computed(() => {
  const rows = [];
  for (let i = 0; i < techStackIcons.length; i += 8) {
    rows.push(techStackIcons.slice(i, i + 8));
  }
  return rows;
});

// 修复移动端技术栈显示问题
const mobileTechStackIcons = computed(() => {
  return techStackIcons.filter(item => item && item.icon);
});
</script>

<style scoped>
.skills-section {
  margin: auto;
  border-radius: 24px;
  max-width: 1200px;
  padding: 2.5rem 2rem 2.5rem 2rem;
  transition: box-shadow 0.22s, transform 0.18s, border 0.18s, opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  opacity: 0;
  transform: scale(0.8);
}

.skills-section.visible {
  opacity: 1;
  transform: scale(1);
}

/* 修复移动端动画问题 */
.skills-left,
.skills-right {
  opacity: 0;
  /* 修改为缩放动画 */
  transform: scale(0.8);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.skills-left.visible,
.skills-right.visible {
  opacity: 1;
  /* 移除 translateY */
  transform: scale(1);
}

.skills-title {
  text-align: center;
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  letter-spacing: 2px;
}

.skills-title::after {
  /* 我的技能下划线 */
  content: '';
  display: block;
  margin: 0.6rem auto 0 auto;
  width: 150px;
  height: 4px;
  border-radius: 2px;
  background: var(--vp-c-brand-1);
}

.skills-content {
  display: flex;
  gap: 2.5rem;
  margin-top: 2.5rem;
}

.skills-left {
  flex: 1.1;
  min-width: 260px;
}

.skills-right {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
}

.skills-subtitle {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.skill-bar-item {
  margin-bottom: 0.8rem;
}

.skill-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 1.08rem;
  margin-bottom: 0.3rem;
}

.skill-bar-bg {
  width: 100%;
  height: 8px;
  background: #e5eaf3;
  border-radius: 6px;
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
}

.skill-bar-tags {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.skill-tag {
  border-radius: 16px;
  padding: 0.05rem 0.5rem;
  font-size: 0.98rem;
  font-weight: 500;
  display: inline-block;
  letter-spacing: 0.5px;
  transition: background 0.18s;
}

.tech-stack-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.2rem;
}

.tech-stack-row {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
  justify-content: center;
}

.tech-stack-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  border-radius: 12px;
  transition: box-shadow 0.18s, transform 0.18s;
}

.tech-stack-item:hover {
  transform: translateY(-3px) scale(1.2);
}

.tech-stack-item.empty {
  background: transparent;
  box-shadow: none;
  pointer-events: none;
}

/* 移动端样式修复 */
@media (max-width: 768px) {
  .skills-title {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
  }

  .skills-title::after {
    width: 100px;
    height: 3px;
    margin: 0.4rem auto 0 auto;
  }

  .skills-content {
    flex-direction: column;
    gap: 1.2rem;
    margin-top: 1.2rem;
  }

  .skills-left,
  .skills-right {
    min-width: 0;
  }

  .skills-subtitle {
    font-size: 1.08rem;
    margin-bottom: 1rem;
  }

  /* 确保PC端在移动端隐藏 */
  .tech-stack-grid.pc {
    display: none ;
  }

  /* 移动端技术栈网格布局 */
  .tech-stack-grid.mobile {
    display: grid ;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.8rem;
    margin-top: 0.8rem;
    justify-items: center;
    align-items: center;
  }

  .tech-stack-item {
    width: auto;
    height: auto;
    min-width: 40px;
    min-height: 40px;
    padding: 0.5rem;
  }

  .tech-stack-item.empty {
    display: none;
  }

  /* 确保图标在移动端正确显示 */
  .tech-stack-item :deep(svg) {
    width: 42px ;
    height: 42px ;
  }
}

@media (max-width: 960px) {
  .skills-title {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
  }

  .skills-title::after {
    width: 100px;
    height: 3px;
    margin: 0.4rem auto 0 auto;
  }

  .skills-content {
    flex-direction: column;
    gap: 1.2rem;
    margin-top: 1.2rem;
  }

  .skills-left,
  .skills-right {
    min-width: 0;
  }

  .skills-subtitle {
    font-size: 1.08rem;
    margin-bottom: 1rem;
  }
}
</style>
