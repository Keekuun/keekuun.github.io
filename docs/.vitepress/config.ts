import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

import { groupIconMdPlugin } from "vitepress-plugin-group-icons"; // 导入代码组图标插件
import timeline from "vitepress-markdown-timeline"; // 导入时间线插件
import { Nav } from "./ConfigHyde/Nav"; // 导入Nav模块
import type { HeadConfig } from "vitepress"; // 在文件顶部添加类型导入
import { HeadData } from "./ConfigHyde/Head"; // 导入 HeadData 导入和类型断言
import { SocialLinks } from "./ConfigHyde/SocialLinks"; //导入社交链接配置
import { CommentData } from "./ConfigHyde/Comment"; //导入评论配置
import { FooterGroup } from "./ConfigHyde/footerGroup"; //导入页脚信息组配置
import { Wallpaper } from "./ConfigHyde/Wallaper"; // 导入Wallaper模块
import { Plugins } from "./plugins";
import { Build } from "./build";

const description = [
  "欢迎来到Jeek's Blog",
].toString();
const CoverImgList = Wallpaper; // 获取壁纸列表

const teekConfig = defineTeekConfig({
  // teekHome: true, // 是否使用tk主题，teekHome 和 teekTheme 默认都是 true，可以注释
  // teekTheme: true, // 是否使用tk主题，teekHome 和 teekTheme 默认都是 true，可以注释
  // vpHome: true, // 是否使用vp主题，是否启用 VitePress 首页风格，支持 teekHome 和 vpHome 同时存在。
  backTopDone: (TkMessage) =>
    TkMessage.success({
      message: "已达到顶部🎉",
      duration: 3000,
    }),
  toCommentDone: (TkMessage) =>
    TkMessage.success({
      message: "已达到评论区✨",
      duration: 3000,
    }),
  // 新版代码块配置
  codeBlock: {
    disabled: false, // 是否禁用新版代码块
    collapseHeight: 700, // 超出高度后自动折叠，设置 true 则默认折叠，false 则默认不折叠
    copiedDone: (TkMessage) => TkMessage.success("代码已复制 🎉"),
  },
  page: {
    pageSize: 16, // 每页显示的文章数量
  },
  post: {
    coverImgMode: "full", // 封面图模式，default 为默认，full 为全图
    showMore: true, // 是否显示更多按钮
  },
  author: { name: "Jeek", link: "" }, // 作者信息
  articleAnalyze: {
    imageViewer: { hideOnClickModal: true }, // 图片预览是否点击遮罩层关闭}
    showIcon: true, // 作者、日期、分类、标签、字数、阅读时长、浏览量等文章信息的图标是否显示
    dateFormat: "yyyy-MM-dd hh:mm:ss", // 文章日期格式，首页和文章页解析日期时使用
    showInfo: true, // 是否展示作者、日期、分类、标签、字数、阅读时长、浏览量等文章信息，分别作用于首页和文章页
    showAuthor: true, // 是否展示作者
    showCreateDate: true, // 是否展示创建日期
    showUpdateDate: true, // 是否展示更新日期，是否展示更新时间，仅在文章页显示
    showCategory: true, // 是否展示分类
    showTag: true, // 是否展示标签
    // 将文章信息传到一级标题下面
    teleport: {
      selector: "h1",
      position: "after",
      className: "h1-bottom-info",
    },
  },
  // 超过半年的文章自动提示文章内容可能已过时
  articleTopTip: (frontmatter) => {
    const tip: Record<string, string> = {
      type: "warning",
      text: "文章发布较早，内容可能过时，阅读注意甄别。",
    };

    // 大于半年，添加提示
    const longTime = 6 * 30 * 24 * 60 * 60 * 1000;
    if (
      frontmatter.date &&
      Date.now() - new Date(frontmatter.date).getTime() > longTime
    )
      return tip;
  },
  // 评论配置
  comment: {
    provider: "twikoo",
    options: CommentData,
  },
  // 公告
  notice: {
    enabled: true, // 是否启用公告功能
    title: "公告", // 公告标题，支持函数式：需要和国际化搭配使用，根据不同语言环境返回不同标题
    initOpen: false, // 公告是否默认打开
    duration: 3000, // 弹框定时自动关闭，0 不自动消失
    mobileMinify: false, // 移动端自动最小化
    reopen: true, // 关闭公告弹框后，是否支持重新打开，如果为 false，则代表公告只显示一次
    useStorage: false, // 是否使用 localStorage 存储公告状态，如：当打开公告弹框后，下次进来则自动打开弹框
    twinkle: true, // 公告图标是否打开闪烁提示
    position: "center", // 公告弹框出现位置
  },
  vitePlugins: {
    sidebarOption: {
      initItems: false, //这条命令注释后，才会让文档和目录的样式保持一致
      collapsed: true, //打开侧边栏自动收缩功能
      // ignoreList: ["nav"], //忽略的文件夹和文件
      ignoreWarn: true, // 忽略警告
    },
    autoFrontmatter: true, // 自动生成 frontmatter
    permalinkOption: {
      notFoundDelayLoad: 1000, // 1秒后加载
    },

    autoFrontmatterOption: {
      exclude: { title: true, date: true }, // 排除自动生成字段
      transform: (frontmatter) => {
        // 如果文件本身存在了 coverImg，则不生成
        if (frontmatter.coverImg) return; // 随机获取 coverImg

        const list = CoverImgList;

        const coverImg = list[Math.floor(Math.random() * list.length)];

        const transformResult = { ...frontmatter, coverImg };

        return Object.keys(transformResult).length
          ? transformResult
          : undefined;
      },
    },
  },

  markdown: {
    config: (md) => {
      md.use(timeline); //时间线插件
      md.use(groupIconMdPlugin); // 代码组图标插件
    },
  },
  // 站点分析
  siteAnalytics: [
    {
      provider: "google",
      options: {
        id: "G-xxx",
      },
    },
    // {
    //   provider: "baidu",
    //   options: {
    //     id: "******",
    //   },
    // },
    // {
    //   provider: "umami",
    //   options: {
    //     id: "******",
    //     src: "**",
    //   },
    // },
  ],
  // 赞赏在文章下方
  appreciation: {
    position: "doc-after",
    options: {
      // buttonHtml: `<button>测试按钮</button>`,
      // icon: "weChatPay", // 赞赏图标，内置 weChatPay 和 alipay
      // expandTitle: "打赏支持", // 展开标题，支持 HTML
      // collapseTitle: "下次一定", // 折叠标题，支持 HTML
      // content: `<img src='/appreciation/WeChatPay.jpg'><img src='/appreciation/Alipay.jpg'>`, // 赞赏内容，支持 HTML
      // expand: false, // 是否默认展开，默认 false
    },
  },
  // 赞赏在 文章导航栏下侧
  // appreciation: {
  //   position: "aside-bottom",
  //   options: {
  //     title: `<span style="color: var(--tk-theme-color)">欢迎打赏支持</span>`, // 赞赏标题，支持 HTML
  //     content: `<img src='/appreciation/WeChatPay.jpg'><img src='/appreciation/Alipay.jpg'>`, // 赞赏内容，支持 HTML
  //   },
  // },
  articleShare: { enabled: true }, // 文章分享
  footerGroup: FooterGroup, // 页脚信息组配置
  // 精选文章卡片
  topArticle: {
    enabled: true, // 是否启用精选文章卡片
    limit: 5, // 一页显示的数量
    autoPage: false, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
    dateFormat: "yyyy-MM-dd hh:mm:ss", // 精选文章的日期格式
  },
  themeSize: "large",
  // 风险链接提示页
  riskLink: {
    enabled: true, //是否启用风险链接提示功能
    whitelist: ["https://teek.seasir.top/", /https:\/\/github.com/], // 白名单，匹配到的链接不提示风险
    blacklist: [], // 黑名单，匹配到的链接提示风险
  },
  // 私密文章（登录页）
  private: {
    enabled: true, // 是否启用私密文章功能
    expire: "1d", //可选，登录失效时间，如果不填则以全局配置为准，全局设置默认为 1d
    session: true, //可选，开启是否在网页关闭或刷新后，清除登录状态，这样再次访问网页，需要重新登录，默认为 false
    siteLogin: false, //可选，是否使用站点级别登录功能，即第一次进入网站需要验证，默认为 false
    site: [
      {
        username: "teek", //用户名
        password: "teek", //密码
        role: "common", // 角色，common为普通用户，admin为管理员
        expire: "1d", // 过期时间，单位：天
        session: true, // 可选，开启是否在网页关闭或刷新后，清除登录状态，这样再次访问网页，需要重新登录，默认为 false
        strategy: "always", //可选，登录策略，once 代表一次登录，always 代表每次访问都登录，默认为 once
      },
      {
        username: "teek-site-2",
        password: "teek",
        role: "admin",
        expire: "1d",
        session: false,
        strategy: "always",
      },
    ],
    pages: [
      {
        username: "teek",
        password: "teek",
        expire: "1d",
        session: true,
        strategy: "once",
      },
      {
        username: "teek-pages-2",
        password: "teek",
        expire: "1d",
        session: false,
        strategy: "always",
      },
    ],
    // realm: {
    //   blog: [
    //     {
    //       username: "teek-blog-1",
    //       password: "teek",
    //       expire: "1d",
    //       session: true,
    //       strategy: "once",
    //     },
    //     {
    //       username: "teek-blog-2",
    //       password: "teek",
    //       expire: "1d",
    //       session: false,
    //       strategy: "always",
    //     },
    //   ],
    //   comment: [
    //     {
    //       username: "teek-comment-1",
    //       password: "teek",
    //       expire: "1d",
    //       session: true,
    //       strategy: "always",
    //     },
    //     {
    //       username: "teek-comment-2",
    //       password: "teek",
    //       expire: "1d",
    //       session: false,
    //       strategy: "always",
    //     },
    //   ],
    // },
    // onFocus: (value, formName) => {},
    // onBlur: (value, formName) => {},
    // doLogin: (loginInfo, type, nativeExecLogin) => true,
    // doValidate: (type, frontmatter, nativeExecLogin) => true,
    // encrypt: (value, frontmatter) => value,
    // decrypt: (value, frontmatter) => value,
  },
  // 在每个文章页顶部显示 VitePress 容器添加提示，使用场景如超过半年的文章自动提示文章内容可能已过时。
  articleBottomTip: () => {
    return {
      type: "tip",
      title: "声明",
      text: `<p>作者：Jeek</p>
             <p>版权：此文章版权归 Jeek 所有，如有转载，请注明出处!</p>
             <p style="margin-bottom: 0">链接：可点击右上角分享此页面复制文章链接</p>
            `,
    };
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: teekConfig,
  base: "/",
  title: "Jeek's Blog",
  description: description,
  cleanUrls: true,
  lastUpdated: true, // 显示最后更新时间
  lang: "zh-CN",
  head: HeadData as HeadConfig[],
  markdown: {
    // 开启行号
    lineNumbers: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true,
    },
    // 更改容器默认值标题
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.ico",
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    lastUpdatedText: "上次更新时间",
    outline: {
      level: [2, 4],
      label: "本页导航",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    nav: Nav, // 导航栏配置
    socialLinks: SocialLinks, // 社交链接配置
    search: {
      provider: "local",
    },
    // editLink: {
    //   text: "在 GitHub 上编辑此页",
    //   pattern: "https://gitee.com/xx/main/docs/:path",
    // },
  },

  vite: {
    plugins: Plugins(), // vite 插件
    server: {
      host: "0.0.0.0", // 推荐使用，自动适配电脑IP
      // port: 5173, // 端口号
      strictPort: false, // 若端口已被占用则会直接退出
      // open: true, // 运行后自动打开网页
    },
    build: Build(),
  },
});
