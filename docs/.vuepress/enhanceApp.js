import mermaid from 'mermaid';
import AiSummarizeBar from './components/AiSummarizeBar.vue';
import AiSummarizeFloating from './components/AiSummarizeFloating.vue';
import { mountAiSummarize, unmountAiSummarize } from './plugins/ai-summarize/client';

let zoomOverlay = null;
let zoomKeyHandler = null;
let zoomClickBound = false;

function renderMermaidDiagrams() {
    const nodes = document.querySelectorAll('.content__default .mermaid');
    if (!nodes.length) return;

    nodes.forEach((el) => {
        el.removeAttribute('data-processed');
        el.removeAttribute('data-zoom-bound');
    });
    mermaid.init(undefined, nodes);
    bindMermaidZoom(nodes);
}

function bindMermaidZoom(nodes) {
    nodes.forEach((el) => {
        if (el.dataset.zoomBound === 'true') return;
        if (!el.querySelector('svg')) return;
        el.dataset.zoomBound = 'true';
        el.classList.add('mermaid-zoomable');
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', '点击放大查看流程图');
        el.setAttribute('title', '点击放大查看');
    });
}

function ensureZoomOverlay() {
    if (zoomOverlay) return zoomOverlay;

    zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'mermaid-zoom-overlay';
    zoomOverlay.hidden = true;
    zoomOverlay.innerHTML = `
        <div class="mermaid-zoom-backdrop" data-mermaid-zoom-close></div>
        <div class="mermaid-zoom-panel" role="dialog" aria-modal="true" aria-label="流程图放大查看">
            <button type="button" class="mermaid-zoom-close" data-mermaid-zoom-close aria-label="关闭">×</button>
            <p class="mermaid-zoom-hint">滚轮可滚动 · 点击背景或按 Esc 关闭</p>
            <div class="mermaid-zoom-content"></div>
        </div>
    `;

    zoomOverlay.addEventListener('click', (e) => {
        if (e.target.closest('[data-mermaid-zoom-close]')) {
            closeMermaidZoom();
        }
    });

    document.body.appendChild(zoomOverlay);
    return zoomOverlay;
}

function openMermaidZoom(source) {
    const svg = source.querySelector('svg');
    if (!svg) return;

    const overlay = ensureZoomOverlay();
    const content = overlay.querySelector('.mermaid-zoom-content');
    content.innerHTML = '';
    content.appendChild(svg.cloneNode(true));

    overlay.hidden = false;
    document.body.classList.add('mermaid-zoom-open');

    if (!zoomKeyHandler) {
        zoomKeyHandler = (e) => {
            if (e.key === 'Escape') closeMermaidZoom();
        };
        document.addEventListener('keydown', zoomKeyHandler);
    }
}

function closeMermaidZoom() {
    if (!zoomOverlay) return;
    zoomOverlay.hidden = true;
    zoomOverlay.querySelector('.mermaid-zoom-content').innerHTML = '';
    document.body.classList.remove('mermaid-zoom-open');
}

function onMermaidClick(e) {
    const target = e.target.closest('.content__default .mermaid.mermaid-zoomable');
    if (!target) return;
    e.preventDefault();
    openMermaidZoom(target);
}

function onMermaidKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const target = e.target.closest('.content__default .mermaid.mermaid-zoomable');
    if (!target) return;
    e.preventDefault();
    openMermaidZoom(target);
}

function setupMermaidZoomListeners() {
    if (zoomClickBound) return;
    zoomClickBound = true;
    document.addEventListener('click', onMermaidClick);
    document.addEventListener('keydown', onMermaidKeydown);
}

function refreshAiSummarize(Vue, router) {
    const app = router.app;
    if (!app || !app.$page) return;

    unmountAiSummarize();
    mountAiSummarize(Vue, AiSummarizeBar, AiSummarizeFloating, app.$site, app.$page);
}

function scheduleAiSummarize(Vue, router) {
    [0, 80, 250, 700, 1500].forEach((ms) => {
        setTimeout(() => refreshAiSummarize(Vue, router), ms);
    });
}

function mountBlogAssistantWidget(site) {
    const cfg = site.themeConfig && site.themeConfig.blogAssistant;
    if (!cfg || !cfg.enabled || !cfg.baseUrl) return;
    if (document.getElementById('blog-assistant-widget-root')) return;

    const script = document.createElement('script');
    script.src = `${cfg.baseUrl}/embed.js`;
    script.setAttribute('data-base', cfg.baseUrl);
    script.setAttribute('data-position', cfg.position || 'right');
    script.defer = true;
    document.body.appendChild(script);
}

export default ({ Vue, router, isServer }) => {
    if (typeof window === 'undefined' || isServer) return;

    Vue.component('AiSummarizeBar', AiSummarizeBar);
    Vue.component('AiSummarizeFloating', AiSummarizeFloating);

    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
    });

    setupMermaidZoomListeners();

    router.onReady(() => {
        setTimeout(renderMermaidDiagrams, 50);
        scheduleAiSummarize(Vue, router);
        mountBlogAssistantWidget(router.app.$site);
    });

    router.afterEach(() => {
        closeMermaidZoom();
        setTimeout(renderMermaidDiagrams, 50);
        scheduleAiSummarize(Vue, router);
        mountBlogAssistantWidget(router.app.$site);
    });
};
