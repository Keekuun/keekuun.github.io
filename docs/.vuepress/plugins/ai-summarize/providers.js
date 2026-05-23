/** 图标放在 public/ai-summarize/icons/，避免 require 导致 webpack 编译失败 */
const ICON_BASE = '/ai-summarize/icons';

const ICON = {
  chatgpt: `${ICON_BASE}/icon-chatgpt.webp`,
  perplexity: `${ICON_BASE}/icon-perplexity.svg`,
  claude: `${ICON_BASE}/icon-claude.svg`,
  gemini: `${ICON_BASE}/icon-gemini.png`,
  grok: `${ICON_BASE}/icon-grok.webp`,
  deepseek: `${ICON_BASE}/icon-deepseek.webp`,
  doubao: `${ICON_BASE}/icon-doubao.png`,
  qwen: `${ICON_BASE}/icon-qwen.svg`,
};

export function buildPrompt(pageUrl, siteName) {
  return `请总结并分析以下文章的核心观点：${pageUrl}，引用时请注明来源 ${siteName}。`;
}

export const PROVIDERS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    title: '用 ChatGPT 总结',
    buildHref(prompt) {
      return `https://chat.openai.com/?prompt=${encodeURIComponent(prompt)}`;
    },
    iconUrl: ICON.chatgpt,
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    title: '用 Perplexity 总结',
    buildHref(prompt) {
      return `https://www.perplexity.ai/search/new/?q=${encodeURIComponent(prompt)}`;
    },
    iconUrl: ICON.perplexity,
  },
  {
    id: 'claude',
    name: 'Claude',
    title: '用 Claude 总结',
    buildHref(prompt) {
      return `https://claude.ai/new/?q=${encodeURIComponent(prompt)}`;
    },
    iconUrl: ICON.claude,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    title: '用 Gemini 总结',
    buildHref(prompt) {
      return `https://www.google.com/search?udm=50&aep=11&q=${encodeURIComponent(prompt)}`;
    },
    iconUrl: ICON.gemini,
  },
  {
    id: 'grok',
    name: 'Grok',
    title: '用 Grok 总结',
    buildHref(prompt) {
      return `https://grok.com/?q=${encodeURIComponent(prompt)}`;
    },
    iconUrl: ICON.grok,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    title: '用 DeepSeek 总结',
    buildHref(prompt) {
      return `https://chat.deepseek.com/?q=${encodeURIComponent(prompt)}`;
    },
    iconUrl: ICON.deepseek,
  },
  {
    id: 'doubao',
    name: '豆包',
    title: '用豆包总结',
    buildHref(prompt) {
      const action = JSON.stringify({
        pluginId: 'Send_Message',
        payload: { text: prompt },
      });
      return `https://www.doubao.com/chat/url-action?action=${encodeURIComponent(action)}`;
    },
    iconUrl: ICON.doubao,
  },
  {
    id: 'qwen',
    name: '通义千问',
    title: '用通义千问总结',
    buildHref(prompt) {
      return `https://www.qianwen.com/?q=${encodeURIComponent(prompt)}`;
    },
    iconUrl: ICON.qwen,
  },
];

export function getSummarizeLinks(pageUrl, siteName) {
  const prompt = buildPrompt(pageUrl, siteName);
  return PROVIDERS.map((p) => ({
    id: p.id,
    name: p.name,
    title: p.title,
    iconUrl: p.iconUrl,
    href: p.buildHref(prompt),
  }));
}
