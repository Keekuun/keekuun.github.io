<template>
  <div>
    <button
      v-if="hidden"
      type="button"
      class="ai-summarize-float-restore"
      title="显示 AI 总结"
      aria-label="显示 AI 总结面板"
      @click="showPanel"
    >
      AI
    </button>

    <div
      v-else
      ref="panel"
      class="ai-summarize-float"
      :class="{ 'is-collapsed': collapsed, 'is-dragging': dragging }"
      :style="panelStyle"
      role="complementary"
      aria-label="AI 总结（可拖动）"
    >
      <div
        class="ai-summarize-float__head"
        title="拖动移动"
        @mousedown.prevent="onDragStart"
      >
        <span class="ai-summarize-float__title">{{ label }}</span>
        <div class="ai-summarize-float__actions">
          <button
            type="button"
            class="ai-summarize-float__btn"
            :title="collapsed ? '展开' : '收起'"
            :aria-expanded="!collapsed"
            @click.stop="toggleCollapsed"
          >
            {{ collapsed ? '展开' : '收起' }}
          </button>
          <button
            type="button"
            class="ai-summarize-float__btn"
            title="隐藏"
            aria-label="隐藏 AI 总结面板"
            @click.stop="hidePanel"
          >
            隐藏
          </button>
        </div>
      </div>
      <div v-show="!collapsed" class="ai-summarize-float__body">
        <AiSummarizeBar
          :page-url="pageUrl"
          :site-name="siteName"
          :label="label"
          layout="stack"
          :show-label="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AiSummarizeBar from './AiSummarizeBar.vue';

const DEFAULT_POS = { useDefault: true, left: null, top: null };

export default {
  name: 'AiSummarizeFloating',
  components: { AiSummarizeBar },
  props: {
    pageUrl: { type: String, required: true },
    siteName: { type: String, default: 'blog.zkkysqs.top' },
    label: { type: String, default: '用 AI 总结' },
    storageKey: { type: String, default: 'keekuun-blog-ai-summarize-float' },
    defaultCollapsed: { type: Boolean, default: true },
    defaultHidden: { type: Boolean, default: false },
  },
  data() {
    return {
      collapsed: this.defaultCollapsed,
      hidden: this.defaultHidden,
      pos: { ...DEFAULT_POS },
      dragging: false,
      dragOffset: { x: 0, y: 0 },
    };
  },
  computed: {
    panelStyle() {
      if (this.pos.useDefault) {
        return {
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      }
      return {
        left: `${this.pos.left}px`,
        top: `${this.pos.top}px`,
        transform: 'none',
      };
    },
  },
  mounted() {
    this.loadState();
    this.bindDragEnd();
    this.bindAutoCollapse();
  },
  beforeDestroy() {
    this.unbindDragEnd();
    this.unbindAutoCollapse();
  },
  methods: {
    loadState() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) return;
        const s = JSON.parse(raw);
        if (typeof s.collapsed === 'boolean') this.collapsed = s.collapsed;
        if (typeof s.hidden === 'boolean') this.hidden = s.hidden;
        if (
          typeof s.left === 'number' &&
          typeof s.top === 'number' &&
          !Number.isNaN(s.left) &&
          !Number.isNaN(s.top)
        ) {
          this.pos = { useDefault: false, left: s.left, top: s.top };
        }
      } catch {
        /* ignore */
      }
    },
    saveState() {
      try {
        localStorage.setItem(
          this.storageKey,
          JSON.stringify({
            collapsed: this.collapsed,
            hidden: this.hidden,
            left: this.pos.useDefault ? null : this.pos.left,
            top: this.pos.useDefault ? null : this.pos.top,
          })
        );
      } catch {
        /* ignore */
      }
    },
    isInteractionInsidePanel(target) {
      if (!target || !this.$el) return false;
      return this.$el.contains(target);
    },
    hideIfVisible() {
      if (this.hidden || this.dragging) return;
      this.hidden = true;
      this.saveState();
    },
    onDocumentClick(e) {
      if (this.isInteractionInsidePanel(e.target)) return;
      this.hideIfVisible();
    },
    onDocumentScroll(e) {
      const panel = this.$refs.panel;
      if (panel && e.target && panel.contains(e.target)) return;
      this.hideIfVisible();
    },
    bindAutoCollapse() {
      this._onDocClick = (e) => this.onDocumentClick(e);
      this._onDocScroll = (e) => this.onDocumentScroll(e);
      document.addEventListener('click', this._onDocClick, true);
      document.addEventListener('scroll', this._onDocScroll, true);
    },
    unbindAutoCollapse() {
      if (this._onDocClick) {
        document.removeEventListener('click', this._onDocClick, true);
      }
      if (this._onDocScroll) {
        document.removeEventListener('scroll', this._onDocScroll, true);
      }
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
      this.saveState();
    },
    hidePanel() {
      this.hidden = true;
      this.saveState();
    },
    showPanel() {
      this.hidden = false;
      this.collapsed = false;
      this.saveState();
    },
    clampPosition(left, top) {
      const panel = this.$refs.panel;
      const w = panel ? panel.offsetWidth : 280;
      const h = panel ? panel.offsetHeight : 120;
      const maxL = Math.max(8, window.innerWidth - w - 8);
      const maxT = Math.max(8, window.innerHeight - h - 8);
      return {
        left: Math.min(Math.max(8, left), maxL),
        top: Math.min(Math.max(8, top), maxT),
      };
    },
    onDragStart(e) {
      if (e.button !== 0) return;
      const panel = this.$refs.panel;
      if (!panel) return;

      const rect = panel.getBoundingClientRect();
      if (this.pos.useDefault) {
        this.pos = {
          useDefault: false,
          left: rect.left,
          top: rect.top,
        };
      }

      this.dragging = true;
      this.dragOffset = {
        x: e.clientX - this.pos.left,
        y: e.clientY - this.pos.top,
      };
      document.body.classList.add('ai-summarize-float-dragging');
    },
    onDragMove(e) {
      if (!this.dragging) return;
      const next = this.clampPosition(
        e.clientX - this.dragOffset.x,
        e.clientY - this.dragOffset.y
      );
      this.pos = { useDefault: false, left: next.left, top: next.top };
    },
    onDragEnd() {
      if (!this.dragging) return;
      this.dragging = false;
      document.body.classList.remove('ai-summarize-float-dragging');
      this.saveState();
    },
    bindDragEnd() {
      this._onMove = (e) => this.onDragMove(e);
      this._onUp = () => this.onDragEnd();
      document.addEventListener('mousemove', this._onMove);
      document.addEventListener('mouseup', this._onUp);
    },
    unbindDragEnd() {
      document.removeEventListener('mousemove', this._onMove);
      document.removeEventListener('mouseup', this._onUp);
    },
  },
};
</script>
