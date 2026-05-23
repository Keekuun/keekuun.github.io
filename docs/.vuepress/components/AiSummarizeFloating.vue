<template>
  <div
    ref="anchor"
    class="ai-summarize-float-anchor is-docked"
    :class="{
      'is-hover-open': hoverOpen,
      [`dock-${dockSide}`]: true,
      'is-ready': anchorLeft != null,
    }"
    :style="anchorStyle"
    @mouseenter="onAnchorEnter"
  >
    <button
      v-show="!hoverOpen"
      type="button"
      class="ai-summarize-float-restore"
      :class="{ 'is-touch': !canHoverPreview }"
      :aria-expanded="hoverOpen"
      aria-label="AI 总结"
      @click.stop="onChipActivate"
    >
      AI
    </button>

    <div
      v-show="hoverOpen"
      ref="panel"
      class="ai-summarize-float is-overlay"
      role="complementary"
      aria-label="AI 总结"
      @click.stop
    >
      <div class="ai-summarize-float__head">
        <span class="ai-summarize-float__title">{{ label }}</span>
      </div>
      <div class="ai-summarize-float__body">
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

const EDGE_MARGIN = 12;
const DOCK_CHIP_SIZE = 40;

export default {
  name: 'AiSummarizeFloating',
  components: { AiSummarizeBar },
  props: {
    pageUrl: { type: String, required: true },
    siteName: { type: String, default: 'blog.zkkysqs.top' },
    label: { type: String, default: '用 AI 总结' },
    storageKey: { type: String, default: 'keekuun-blog-ai-summarize-float' },
  },
  data() {
    return {
      hoverOpen: false,
      anchorLeft: null,
      anchorTop: null,
      dockSide: 'right',
      layoutScheduled: false,
    };
  },
  computed: {
    canHoverPreview() {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    },
    anchorStyle() {
      if (this.anchorLeft == null || this.anchorTop == null) {
        return { visibility: 'hidden' };
      }
      return {
        left: `${this.anchorLeft}px`,
        top: `${this.anchorTop}px`,
        right: 'auto',
        bottom: 'auto',
        transform: 'none',
        visibility: 'visible',
      };
    },
  },
  mounted() {
    this.loadState();
    this.bindDismissListeners();
    this.bindViewportWatch();
    this.$nextTick(() => {
      this.initPosition();
    });
  },
  beforeDestroy() {
    this.unbindDismissListeners();
    this.unbindViewportWatch();
  },
  methods: {
    getViewportBounds() {
      const vv = window.visualViewport;
      if (vv) {
        return {
          left: vv.offsetLeft,
          top: vv.offsetTop,
          right: vv.offsetLeft + vv.width,
          bottom: vv.offsetTop + vv.height,
          width: vv.width,
          height: vv.height,
        };
      }
      return {
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    scheduleLayoutUpdate() {
      if (this.layoutScheduled) return;
      this.layoutScheduled = true;
      this.$nextTick(() => {
        this.layoutScheduled = false;
        if (!this.hoverOpen) this.applyDockPosition();
      });
    },
    initPosition() {
      const vv = this.getViewportBounds();
      const height = DOCK_CHIP_SIZE;

      if (this.anchorLeft == null || this.anchorTop == null) {
        this.dockSide = this.dockSide || 'right';
        this.anchorTop = vv.top + Math.max(EDGE_MARGIN, (vv.height - height) / 2);
        if (this.dockSide === 'left') {
          this.anchorLeft = vv.left + EDGE_MARGIN;
        } else {
          this.anchorLeft = vv.right - DOCK_CHIP_SIZE - EDGE_MARGIN;
        }
      }

      this.applyDockPosition();
    },
    applyDockPosition() {
      const vv = this.getViewportBounds();
      const height = DOCK_CHIP_SIZE;

      if (this.dockSide === 'left') {
        this.anchorLeft = vv.left + EDGE_MARGIN;
      } else {
        this.anchorLeft = vv.right - DOCK_CHIP_SIZE - EDGE_MARGIN;
      }

      const minTop = vv.top + EDGE_MARGIN;
      const maxTop = vv.bottom - height - EDGE_MARGIN;
      if (this.anchorTop == null) {
        this.anchorTop = vv.top + (vv.height - height) / 2;
      }
      this.anchorTop = Math.min(Math.max(minTop, this.anchorTop), maxTop);
    },
    loadState() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) return;
        const s = JSON.parse(raw);
        if (s.dockSide === 'left' || s.dockSide === 'right') {
          this.dockSide = s.dockSide;
        }
        if (
          typeof s.left === 'number' &&
          typeof s.top === 'number' &&
          !Number.isNaN(s.left) &&
          !Number.isNaN(s.top)
        ) {
          this.anchorLeft = s.left;
          this.anchorTop = s.top;
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
            dockSide: this.dockSide,
            left: this.anchorLeft,
            top: this.anchorTop,
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
    onAnchorEnter() {
      if (!this.canHoverPreview) return;
      this.hoverOpen = true;
    },
    onChipActivate() {
      if (this.canHoverPreview) return;
      this.hoverOpen = !this.hoverOpen;
    },
    closeHoverPreview() {
      this.hoverOpen = false;
    },
    onDocumentClick(e) {
      if (!this.hoverOpen) return;
      if (this.isInteractionInsidePanel(e.target)) return;
      this.closeHoverPreview();
    },
    onDocumentScroll() {
      if (!this.hoverOpen) return;
      this.closeHoverPreview();
    },
    bindDismissListeners() {
      this._onDocClick = (e) => this.onDocumentClick(e);
      this._onDocScroll = () => this.onDocumentScroll();
      document.addEventListener('click', this._onDocClick, true);
      document.addEventListener('scroll', this._onDocScroll, true);
    },
    unbindDismissListeners() {
      if (this._onDocClick) {
        document.removeEventListener('click', this._onDocClick, true);
      }
      if (this._onDocScroll) {
        document.removeEventListener('scroll', this._onDocScroll, true);
      }
    },
    bindViewportWatch() {
      this._onViewportChange = () => {
        if (!this.hoverOpen) this.applyDockPosition();
      };
      window.addEventListener('resize', this._onViewportChange);
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', this._onViewportChange);
        window.visualViewport.addEventListener('scroll', this._onViewportChange);
      }
    },
    unbindViewportWatch() {
      if (this._onViewportChange) {
        window.removeEventListener('resize', this._onViewportChange);
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', this._onViewportChange);
          window.visualViewport.removeEventListener('scroll', this._onViewportChange);
        }
      }
    },
  },
};
</script>
