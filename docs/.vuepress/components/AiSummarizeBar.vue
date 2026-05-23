<template>
  <div
    v-if="links.length"
    class="ai-summarize-bar"
    :class="{ 'ai-summarize-bar--stack': layout === 'stack' }"
    role="navigation"
    aria-label="用 AI 总结本文"
  >
    <span v-if="showLabel" class="ai-summarize-bar__label">{{ label }}</span>
    <a
      v-for="item in links"
      :key="item.id"
      class="ai-summarize-bar__btn"
      :href="item.href"
      target="_blank"
      rel="noopener noreferrer nofollow"
      :title="item.title"
    >
      <span class="ai-summarize-bar__icon" aria-hidden="true">
        <img
          v-if="item.iconUrl"
          :src="item.iconUrl"
          :alt="item.name"
          width="20"
          height="20"
          loading="lazy"
          decoding="async"
        />
      </span>
      <span>{{ item.name }}</span>
    </a>
  </div>
</template>

<script>
import { getSummarizeLinks } from '../plugins/ai-summarize/providers';

export default {
  name: 'AiSummarizeBar',
  props: {
    pageUrl: { type: String, required: true },
    siteName: { type: String, default: 'blog.zkkysqs.top' },
    label: { type: String, default: '用 AI 总结：' },
    layout: { type: String, default: 'inline' },
    showLabel: { type: Boolean, default: true },
  },
  computed: {
    links() {
      return getSummarizeLinks(this.pageUrl, this.siteName);
    },
  },
};
</script>
