// nav导航栏配置
import {
  TeekIcon,
  VdoingIcon,
  SSLIcon,
  BlogIcon,
  DocusaurusIcon,
  LinuxIcon,
  NginxIcon,
  GitIcon,
  DockerIcon,
  AppstoreIcon,
  PhotoIcon,
  MusicIcon,
  FilmIcon,
  AboutIcon,
  LinkIcon,
  NavIcon,
  SiteAnalyticsIcon,
  StatusIcon,
} from "./icon/NavIcon";
export const Nav = [
  {
    text: "🏡首页",
    items: [
      { text: "首页", link: "/" },
      // { text: "起始页", link: "/" },
    ],
  },
  // {
  //   text: "📖笔记专栏",
  //   items: [
  //     {
  //       component: "NavIcon",
  //       props: TeekIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: VdoingIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: BlogIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: SSLIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: DocusaurusIcon,
  //     },
  //   ],
  // },
  // {
  //   text: "🧰工具资源", // 目录页链接，此处 link 是 vdoing 主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
  //   items: [
  //     {
  //       component: "NavIcon",
  //       props: LinuxIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: NginxIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: GitIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: DockerIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: AppstoreIcon,
  //     },
  //   ],
  // },
  // {
  //   text: "🏙️生活娱乐",
  //   items: [
  //     {
  //       component: "NavIcon",
  //       props: PhotoIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: MusicIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: FilmIcon,
  //     },
  //   ],
  // },
  { text: "👂畅所欲言", link: "/message-area/" },
  {
    text: "👏文章索引",
    items: [
      {
        text: "本站",
        items: [
          { text: "文章分类", link: "/categories/" },
          { text: "文章标签", link: "/tags/" },
          { text: "文章归档", link: "/archives/" },
          { text: "文章清单", link: "/articleOverview/" },
          { text: "站点登录", link: "/login/" },
          // {
          //   text: "风险提示",
          //   link: "/risk-link?target=https://teek.seasir.top/guide/quickstart",
          // },
        ],
      },
    ],
  },
  // {
  //   text: "🌐站点信息",
  //   items: [
  //     {
  //       component: "NavIcon",
  //       props: AboutIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: LinkIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: NavIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: SiteAnalyticsIcon,
  //     },
  //     {
  //       component: "NavIcon",
  //       props: StatusIcon,
  //     },
  //   ],
  // },
];
