const DEFAULT_TITLE_SELECTORS = [
  'main.page .page-title',
  '.page .page-title',
  '.page-title',
];

export function resolveAiSummarizeOptions(site, page) {
  const theme = (site && site.themeConfig && site.themeConfig.aiSummarize) || {};
  const fm = (page && page.frontmatter && page.frontmatter.aiSummarize) || {};
  const fmObj = typeof fm === 'object' ? fm : {};

  const floatingTheme = theme.floating || {};
  const floatingFm = fmObj.floating || {};

  const pick = (fmVal, themeVal, fallback) => {
    if (fmVal !== undefined) return fmVal;
    if (themeVal !== undefined) return themeVal;
    return fallback;
  };

  let titleSelector = pick(fmObj.titleSelector, theme.titleSelector, null);
  if (typeof titleSelector === 'string' && titleSelector.trim()) {
    titleSelector = [titleSelector.trim()];
  } else if (Array.isArray(titleSelector) && titleSelector.length) {
    titleSelector = titleSelector.filter(Boolean);
  } else {
    titleSelector = DEFAULT_TITLE_SELECTORS;
  }

  return {
    enabled: pick(fmObj.enabled, theme.enabled, true) !== false,
    siteName: theme.siteName || 'blog.zkkysqs.top',
    label: theme.label || '用 AI 总结：',
    underTitle: pick(fmObj.underTitle, theme.underTitle, true) !== false,
    titleSelector,
    floating: {
      enabled: pick(floatingFm.enabled, floatingTheme.enabled, true) !== false,
      storageKey:
        floatingTheme.storageKey || 'keekuun-blog-ai-summarize-float',
    },
  };
}
