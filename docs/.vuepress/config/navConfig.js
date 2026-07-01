const blogAssistantUrl = (process.env.BLOG_ASSISTANT_WIDGET_URL || '').replace(/\/$/, '');
const aiLabUrl = 'https://ai.zkkysqs.top';

module.exports = [
  {
    text: 'AI 检索',
    icon: 'reco-search',
    link: 'https://keekuun-blog-search.vercel.app/',
  },
  {
    text: 'AI Lab',
    icon: 'reco-blog',
    link: aiLabUrl,
  },
  ...(blogAssistantUrl
    ? [
        {
          text: 'AI 助手',
          icon: 'reco-message',
          link: blogAssistantUrl,
        },
      ]
    : []),
  {
    text: '前端',
    icon: 'reco-api',
    link: '/categories/前端/',
    items: [
      {
        text: '基础',
        items: [
          { text: 'CSS', link: '/tag/CSS/' },
          { text: 'JS', link: '/tag/JS/' },
          { text: 'TS', link: '/tag/TS/' },
        ],
      },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/categories/Vue/' },
          { text: 'React', link: '/categories/React/' },
          { text: 'Next.js', link: '/categories/Next.js/' },
        ],
      },
      {
        text: '移动端',
        items: [
          { text: '小程序', link: '/categories/移动端/' },
          { text: 'Flutter', link: '/categories/flutter/' },
        ],
      },
    ],
  },

  {
    text: '后端',
    icon: 'reco-coding',
    link: '/categories/后端/',
    items: [
      {
        text: 'Node & NestJS',
        items: [
          { text: 'Node.js', link: '/backEnd/node/' },
          { text: 'NestJS', link: '/backEnd/nestjs/' },
        ],
      },
      {
        text: 'Go & Python',
        items: [
          { text: 'Golang', link: '/backEnd/go/' },
          { text: 'Python', link: '/backEnd/python/' },
        ],
      },
      {
        text: 'Database',
        items: [
          { text: 'MySQL', link: '/dataBase/mysql/' },
          { text: 'Postgres', link: '/dataBase/postgres/' },
          { text: 'MongoDB', link: '/dataBase/mongodb/' },
          { text: 'Redis', link: '/dataBase/redis/' },
        ],
      },
    ],
  },

  {
    text: 'AI',
    icon: 'reco-message',
    link: aiLabUrl,
    items: [
      { text: 'AI Lab 首页', link: aiLabUrl },
      { text: 'Hello Agents', link: 'https://hello-agents.datawhale.cc/' },
      { text: 'GitHub AI 库', link: `${aiLabUrl}/github-ai` },
      { text: 'Skills 入门指南', link: `${aiLabUrl}/skills-guide` },
      {
        text: '框架深挖',
        items: [
          { text: 'AI 系列总索引', link: aiLabUrl },
          { text: 'Mastra 生态速览 (27)', link: `${aiLabUrl}/27-mastra-typescript-agent-framework` },
          { text: 'LangChain.js 专系列', link: `${aiLabUrl}/langchain/` },
          { text: 'LangGraph.js 专系列', link: `${aiLabUrl}/langgraph/` },
          { text: 'Mastra.js 专系列', link: `${aiLabUrl}/mastra/` },
          { text: 'Agent 学习路线图', link: `${aiLabUrl}/ai-agent-learning-roadmap` },
        ],
      },
    ],
  },

  {
    text: '专题',
    icon: 'reco-blog',
    items: [
      { text: '人月神话', link: '/books/The-Mythical-Man-Month-zh/' },
      { text: 'Label Studio', link: '/label-studio/' },
    ],
  },

  {
    text: '其他',
    icon: 'reco-other',
    link: '/tag/工程化/',
    items: [
      { text: '工程化 / 构建', link: '/tag/工程化/' },
      { text: 'Webpack', link: '/tag/webpack/' },
      { text: 'Git & CI/CD', link: '/tag/Git/' },
      { text: '算法', link: '/tag/算法/' },
      { text: '测试', link: '/tag/测试/' },
      { text: '优化', link: '/tag/优化/' },
      { text: '配置', link: '/tag/配置/' },
      { text: '常用工具', link: '/tools/code-tool.html' },
    ],
  },
  { text: '流月', link: '/timeLine/', icon: 'reco-date' },
]