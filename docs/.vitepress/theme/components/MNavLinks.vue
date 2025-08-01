<script setup lang="ts">
import { computed } from 'vue'
import { slugify } from '@mdit-vue/shared'
// @ts-ignore
import MNavLink from './MNavLink.vue'
import type { NavLink } from '../untils/types'

const props = defineProps<{
  title: string
  noIcon?: boolean
  items: NavLink[]
}>()

const formatTitle = computed(() => {
  return slugify(props.title)
})
</script>

<template>
  <h2 v-if="title" :id="formatTitle" tabindex="-1">
    {{ title }}
    <a class="header-anchor" :href="`#${formatTitle}`" aria-hidden="true"></a>
  </h2>
  <div class="m-nav-links">
    <MNavLink v-for="item in items" :key="item.link" :noIcon="noIcon" v-bind="item" />
  </div>
</template>

<style scoped>
.m-nav-links {
  --m-nav-gap: 10px;
  /* 设置导航链接的间距 */
  display: grid;
  /* 设置导航链接的布局为网格布局 */
  grid-template-columns: repeat(auto-fill, minmax(167px, 1fr));
  /* 设置网格的列数为自动填充，最小宽度为135px，最大宽度为1fr */
  grid-row-gap: var(--m-nav-gap);
  /* 设置网格的行间距为--m-nav-gap */
  grid-column-gap: var(--m-nav-gap);
  /* 设置网格的列间距为--m-nav-gap */
  grid-auto-flow: row dense;
  /* 设置网格的自动填充方式为行密集 */
  justify-content: center;
  /* 设置网格的居中对齐方式 */
  margin-top: var(--m-nav-gap);
  /* 设置导航链接的上边距为--m-nav-gap */
}

@media (min-width: 500px) {
  .m-nav-links {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

@media (min-width: 640px) {
  .m-nav-links {
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  }
}

@media (min-width: 768px) {
  .m-nav-links {
    grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  }
}

@media (min-width: 960px) {
  .m-nav-links {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (min-width: 1440px) {
  .m-nav-links {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (min-width: 960px) {
  .m-nav-links {
    --m-nav-gap: 10px;
  }
}

</style>