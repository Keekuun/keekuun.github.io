<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { withBase } from "vitepress";
import { slugify } from "@mdit-vue/shared";
import { NavLink } from '../untils/types'
import { TkIcon } from "vitepress-theme-teek";
import { NoIcon } from "../icon/NavIcon";

const props = defineProps<{
  noIcon?: boolean;
  icon?: NavLink["icon"];
  badge?: NavLink["badge"];
  title?: NavLink["title"];
  desc?: NavLink["desc"];
  link: NavLink["link"];
}>();

const imgError = ref(false);

watch(() => props.icon, () => {
  imgError.value = false;
});

const showImg = computed(() => {
  return typeof props.icon === "string" && props.icon && !imgError.value;
});

const imgSrc = computed(() => {
  if (typeof props.icon === "string") {
    return withBase(props.icon);
  }
  return '';
});

const formatTitle = computed(() => {
  if (!props.title) {
    return "";
  }
  return slugify(props.title);
});

const svg = computed(() => {
  if (typeof props.icon === "object" && props.icon && 'svg' in props.icon) return props.icon.svg;
  return "";
});

const formatBadge = computed(() => {
  if (typeof props.badge === "string") {
    return { text: props.badge, type: "info" };
  }
  return props.badge;
});
</script>

<template>
  <a v-if="link" class="m-nav-link" :href="link" target="_blank" rel="noreferrer">
    <article class="box" :class="{ 'has-badge': formatBadge }">
      <div class="box-header">
        <template v-if="!noIcon">
          <div v-if="svg" class="icon" v-html="svg"></div>
          <div v-else-if="showImg" class="icon">
            <img :src="imgSrc" :alt="title" @error="imgError = true" />
          </div>
          <TkIcon v-else class="icon" :icon="NoIcon"></TkIcon>
        </template>
        <div class="content">
          <h5 v-if="title" :id="formatTitle" class="title" :class="{ 'no-icon': noIcon }">
            {{ title }}
          </h5>
          <p v-if="desc" class="desc">{{ desc }}</p>
        </div>
      </div>
      <Badge v-if="formatBadge" class="badge" :type="formatBadge.type" :text="formatBadge.text" />
    </article>
  </a>
</template>

<style scoped>
.m-nav-link {
  --m-nav-icon-box-size: 60px;
  --m-nav-icon-size: 60px;
  --m-nav-box-gap: 8px;
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.25s;
}

.m-nav-link:hover {
  box-shadow: var(--vp-shadow-2);
  border-color: var(--vp-c-brand);
  text-decoration: initial;
  background-color: var(--vp-c-brand-1);
  transform: translateY(-5px);
}

.m-nav-link:hover .icon {
  transform: translateX(-50%) scale(0);
  opacity: 0;
}

.m-nav-link:hover .content {
  margin-left: calc(-5 * var(--m-nav-box-gap));
}

.m-nav-link:hover .title,
.m-nav-link:hover .desc {
  color: white;
}

.m-nav-link .box {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 18px 2px;
  height: 100%;
  color: var(--vp-c-text-1);
}

.m-nav-link .box .has-badge {
  padding-top: calc(var(--m-nav-box-gap) + 2px);
}

.m-nav-link .box-header {
  display: flex;
  align-items: center;
  flex: 1;
}

.m-nav-link .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-right: calc(var(--m-nav-box-gap) - 2px); */
  border-radius: 50%;
  min-width: var(--m-nav-icon-box-size);
  min-height: var(--m-nav-icon-box-size);
  width: var(--m-nav-icon-box-size);
  height: var(--m-nav-icon-box-size);
  font-size: var(--m-nav-icon-size);
  background-color: var(--vp-c-bg-soft-down);
  /* 过度动画 */
  transition: transform 0.6s ease-in-out, opacity 0.4s ease-in-out;
  flex-shrink: 0;
  transform: translateX(0) scale(1);
  opacity: 1;
}

.m-nav-link .icon svg {
  width: var(--m-nav-icon-size);
  fill: currentColor;
}

.m-nav-link .icon img {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.m-nav-link .content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-height: var(--m-nav-icon-box-size);
  height: 100%;
  overflow: hidden;
  margin-left: 0;
  transition: margin-left 0.3s ease-in-out;
}

.m-nav-link .title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  width: 100%;
  flex-shrink: 0;
}

.m-nav-link .desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 4px 0 0;
  line-height: 1.5;
  font-size: 12px;
  color: var(--vp-c-text-2);
  width: 100%;
  word-wrap: break-word;
  flex: 1;
  min-height: 0;
}

.m-nav-link .badge {
  position: absolute;
  top: 2px;
  right: 0;
  transform: scale(0.8);
}

@media (max-width: 960px) {
  .m-nav-link {
    /* 当屏幕宽度小于960px时，应用以下样式 */
    --m-nav-icon-box-size: 50px;
    /* 移动端导航链接图标盒子大小 */
    --m-nav-icon-size: 36px;
    /* 移动端导航链接图标大小 */
    --m-nav-box-gap: 15px;
    /* 移动端导航链接盒子间距 */
  }

  .m-nav-link .box {
    /* 在移动端时设置内边距为上下12px,左右0 */
    padding: 12px 0;
  }

  .m-nav-link .icon img {
    /* 设置图标圆角为50% */
    border-radius: 50%;
    /* 设置图标宽度为36px */
    width: 36px;
    /* 设置图标高度为36px */
    height: 36px;
    /*设置图标的填充方式为覆盖 */
    object-fit: cover;
  }

  .m-nav-link .title {
    /* 移动端标题文字大小 */
    font-size: 14px;
  }

  .m-nav-link .desc {
    /* 移动端描述文字大小 */
    font-size: 12px;
  }

  .m-nav-link:hover .content {
    margin-left: calc(-3 * var(--m-nav-box-gap));
    /* 移动端导航链接鼠标悬停时，内容左边距 */
  }
}
</style>
