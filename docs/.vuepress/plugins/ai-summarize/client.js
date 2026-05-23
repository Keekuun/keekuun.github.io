import { resolveAiSummarizeOptions } from './options';

export function shouldShowAiSummarize(page) {
  if (!page) return false;
  if (page.frontmatter && page.frontmatter.aiSummarize === false) return false;
  if (page.frontmatter && page.frontmatter.home) return false;

  const path = page.path || '';
  if (path === '/' || path === '/index.html') return false;
  if (/^\/(tag|tags|category|categories|timeline)(\/|$)/.test(path)) {
    return false;
  }
  if (
    page.frontmatter &&
    ['tag', 'category', 'tags', 'categories'].includes(page.frontmatter.type)
  ) {
    return false;
  }

  return true;
}

function findTitleAnchor(selectors) {
  const list = selectors && selectors.length ? selectors : [];
  for (const sel of list) {
    try {
      const el = document.querySelector(sel);
      if (el) return { container: el, mode: 'append' };
    } catch {
      /* 无效选择器 */
    }
  }

  const pageRoot = document.querySelector('main.page, .page');
  if (pageRoot) {
    const h1 = pageRoot.querySelector('h1.title, h1');
    if (h1 && h1.textContent && h1.textContent.trim()) {
      const parent = h1.parentElement;
      if (parent) return { container: parent, mode: 'append' };
      return { container: h1, mode: 'after' };
    }
  }

  return null;
}

let inlineVm = null;
let floatingVm = null;

function destroyVm(vm) {
  if (!vm) return;
  vm.$destroy();
  if (vm.$el && vm.$el.parentNode) {
    vm.$el.parentNode.removeChild(vm.$el);
  }
}

export function unmountAiSummarize() {
  destroyVm(inlineVm);
  destroyVm(floatingVm);
  inlineVm = null;
  floatingVm = null;
  document
    .querySelectorAll(
      '.ai-summarize-bar[data-injected-inline], .ai-summarize-float-root[data-injected]'
    )
    .forEach((el) => el.remove());
}

function mountInline(Vue, AiSummarizeBar, options, page) {
  if (!options.underTitle) return;
  if (options.floating && options.floating.enabled) return;

  const anchor = findTitleAnchor(options.titleSelector);
  if (!anchor) return;
  if (anchor.container.querySelector('.ai-summarize-bar[data-injected-inline]')) {
    return;
  }

  const pageUrl = window.location.href;
  const Ctor = Vue.extend(AiSummarizeBar);
  inlineVm = new Ctor({
    propsData: {
      pageUrl,
      siteName: options.siteName,
      label: options.label,
      layout: 'inline',
      showLabel: true,
    },
  });

  inlineVm.$mount();
  inlineVm.$el.setAttribute('data-injected-inline', 'true');

  if (anchor.mode === 'after') {
    anchor.container.insertAdjacentElement('afterend', inlineVm.$el);
  } else {
    anchor.container.appendChild(inlineVm.$el);
  }
}

function mountFloating(Vue, AiSummarizeFloating, options, page) {
  if (!options.floating || !options.floating.enabled) return;
  if (document.querySelector('.ai-summarize-float-root[data-injected]')) return;

  const pageUrl = window.location.href;
  const root = document.createElement('div');
  root.className = 'ai-summarize-float-root';
  root.setAttribute('data-injected', 'true');
  document.body.appendChild(root);

  const Ctor = Vue.extend(AiSummarizeFloating);
  floatingVm = new Ctor({
    propsData: {
      pageUrl,
      siteName: options.siteName,
      label: options.label.replace(/：$/, '') || '用 AI 总结',
      storageKey: options.floating.storageKey,
    },
  });
  floatingVm.$mount(root);
}

export function mountAiSummarize(Vue, AiSummarizeBar, AiSummarizeFloating, site, page) {
  if (!shouldShowAiSummarize(page)) return;

  const options = resolveAiSummarizeOptions(site, page);
  if (!options.enabled) return;

  mountInline(Vue, AiSummarizeBar, options, page);
  mountFloating(Vue, AiSummarizeFloating, options, page);
}
