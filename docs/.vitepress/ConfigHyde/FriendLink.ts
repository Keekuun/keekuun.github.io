// FriendLink用于在首页展示一些友链
export const FriendLink = {
  enabled: true, // 是否启用友情链接卡片
  limit: 5, // 一页显示的数量
  autoScroll: true, // 是否自动滚动
  scrollSpeed: 2500, // 滚动间隔时间，单位：毫秒。autoScroll 为 true 时生效
  autoPage: true, // 是否自动翻页
  pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
  titleClick: (router) => router.go("/websites"), // 查看更多友链
  // 友情链接数据列表
  list: [
    // {
    //   avatar: "https://vp.teek.top/teek-logo-large.png",
    //   name: "Teek VitePress主题",
    //   desc: "✨一个轻量、简洁高效、灵活配置、易于扩展的 VitePress 主题。",
    //   link: "https://vp.teek.top/",
    // },
    // {
    //   name: "Teeker",
    //   desc: "朝圣的使徒，正在走向编程的至高殿堂！",
    //   link: "http://notes.teek.top/",
    //   avatar:
    //     "https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar2.png",
    // },
    // {
    //   avatar: "https://onedayxyy.cn/favicon.ico",
    //   name: "One",
    //   desc: "明心静性，爱自己",
    //   link: "https://onedayxyy.cn/",
    // },
    // {
    //   avatar: "https://wiki.eryajf.net/img/logo.png",
    //   name: "二丫讲梵",
    //   desc: "坐而言不如起而行",
    //   link: "https://wiki.eryajf.net/",
    // },
    // {
    //   avatar: "https://blog.snowlinlan.com/logo.png",
    //   name: "SnowLin",
    //   desc: "一個溫暖的地方",
    //   link: "https://blog.snowlinlan.com/",
    // },
    // {
    //   avatar: "https://sinc.us.kg/avatar/avatar.webp",
    //   name: "凿壁偷光不算偷",
    //   desc: "tk 道友",
    //   link: "https://sinc.us.kg/",
    // },
    // {
    //   avatar: "https://zhouyu2156.github.io/favicon.png",
    //   name: "极客兔 - 笔记站",
    //   desc: "一心创作优质内容",
    //   link: "https://zhouyu2156.github.io/",
    // },
    // {
    //   avatar: "https://pic1.imgdb.cn/item/6804b1be58cb8da5c8b8ffa0.jpg ",
    //   name: "兔白白",
    //   desc: "牛马",
    //   link: "https://ydbsq123.top/",
    // },
    // {
    //   avatar: "https://cdn.upyun.sugarat.top/avatar/blog/zlyst-avatar.jpeg-wh100",
    //   name: "粥里有勺糖",
    //   desc: "你的指尖,拥有改变世界的力量",
    //   link: "https://sugarat.top/",
    // },
    // {
    //   avatar: "https://q1.qlogo.cn/g?b=qq&nk=3311118881&s=640",
    //   name: "宇阳",
    //   desc: "记录所学知识，缩短和大神的差距！",
    //   link: "https://liuyuyang.net",
    // },
    // {
    //   avatar: "https://dl-web.top/avatar/avatar.webp",
    //   name: "威威 Blog",
    //   desc: "书以启智 技于谋生",
    //   link: "https://dl-web.top/",
    // },
  ],
};
