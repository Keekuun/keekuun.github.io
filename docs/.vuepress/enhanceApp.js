import mermaid from 'mermaid';

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

export default ({ router }) => {
    if (typeof window === 'undefined') return;

    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
    });

    setupMermaidZoomListeners();

    router.onReady(() => {
        setTimeout(renderMermaidDiagrams, 50);
    });

    router.afterEach(() => {
        closeMermaidZoom();
        setTimeout(renderMermaidDiagrams, 50);
    });
};
