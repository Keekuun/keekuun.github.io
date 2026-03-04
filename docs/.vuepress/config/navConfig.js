export default [
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
    link: '/categories/AI/',
    items: [
      { text: 'GitHub AI 库', link: '/ai/github-ai.html' },
      { text: 'Skills 入门指南', link: '/ai/skills-guide.html' },
    ],
  },

  {
    text: '专题',
    icon: 'reco-blog',
    items: [
      { text: '人月神话', link: '/books/The-Mythical-Man-Month-zh/' },
      { text: 'Label Studio', link: '/label-studio/README.html' },
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