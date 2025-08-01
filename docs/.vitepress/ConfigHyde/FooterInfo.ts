// 底部信息配置
import { version } from "vitepress-theme-teek/es/version"; // 导入版本号

export const FooterInfo = {
  topMessage: [
    // `<span><img alt="VitePress" src="https://liuyuyang.net/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanimals.65eaf6e3.webp&w=750&q=75"><span/>`,
    //
    // `<a target="_blank" href="https://vitepress.dev/" title="本站框架基于 VitePress_v1.6.3" ><img alt="VitePress" src="https://img.shields.io/badge/Frame-VitePress-4868C2?logo=vitepress&amp;logoColor=fff" ></a>
    //
    // <a target="_blank" href="https://twikoo.js.org/" title="本站评论系统使用 Twikoo" ><img alt="Twikoo" src="https://img.shields.io/badge/Comments-Twikoo-0072F9"></a>
    //
    // <a target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" title="本站内容采用 CC BY-NC-SA 4.0 国际许可协议进行许可"><img alt="Copyright" src="https://img.shields.io/badge/Copyright-BY--NC--SA%204.0-d42328?logo=coursera&amp;logoColor=fff"></a>
    //
    // <a target="_blank" href="https://www.algolia.com/" title="本站搜索服务使用 Algolia"><img alt="Algolia" src="https://img.shields.io/badge/Search-Algolia-3095FA?logo=Algolia"></a>
    //
    // <a target="_blank" href="https://www.aliyun.com/" title="本站部署服务使用 Aliyun"><img alt="Aliyun" src="https://img.shields.io/badge/Alibaba-Cloud?logo=alibabacloud&label=Server&color=%23FF6A00"></a>
    //
    // <a target="_blank" href="https://edgeone.ai/zh" title="本站CND加速服务 EdgeOne"><img alt="EdgeOne" src="https://img.shields.io/badge/EdgeOne-CDN?logo=alibabacloud&label=CDN&color=%23FF6A00"></a>
    //
    // <a target="_blank" href="https://umami.is/" title="本站统计服务使用 Umami"><img alt="Umami" src="https://img.shields.io/badge/umami-000000?logo=umami&label=Count&color=%23000000"></a>
    //
    // <a target="_blank" href="https://nginx.org/" title="本站Nginx反向代理服务 Nginx"><img alt="Nginx" src="https://img.shields.io/badge/Nginx-Proxy?logo=Nginx&label=Proxy"></a>`,
  ],
  theme: {
    name: `Theme By Teek@${version}`,
  },
  bottomMessage: [
    `<!--<script id="LA-DATA-WIDGET" crossorigin="anonymous" charset="UTF-8" src="https://v6-widget.51.la/v6/3MQCwI1AgSSiVg37/quote.js?theme=#1690FF,#539DFD,#539DFD,#539DFD,#FFFFFF,#1690FF,12&f=12"></script>-->`,

    `<!--<a href="https://51.la/" target="_blank" style="display:flex;align-items:center;justify-content:center;">本网站由<img src="https://51.la/favicon.ico" style="width:16px;height:16px;" alt="51.LA"> 51.LA </a>-->

<!--    <a href="https://umami.is/" target="_blank" style="display:flex;align-items:center;justify-content:center;"> |<img src="https://umami.is/favicon.ico" style="width:16px;height:16px;" alt="Umami">Umami </a>-->

<!--    <a href="https://analytics.google.com/" target="_blank" style="display:flex;align-items:center;justify-content:center;"> |<img src="//www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg" style="width:16px;height:16px;" alt="Google Analytics">Google Analytics 提供数据统计服务</a>-->`,
    `<span id="runtime"></span>(●'◡'●)`,
    "每一个不曾起舞的日子，都是对生命的辜负~",
  ],
  copyright: {
    createYear: 2021,
    suffix: "Jeek Blog",
  },
  icpRecord: {
    name: "xxICP备xxx号",
    link: "http://beian.miit.gov.cn/",
  },
  // 网络安全备案信息配置
  securityRecord: {
    name: "xxx安备xxx号",
    link: "https://beian.mps.gov.cn/",
  },
  customHtml: ``, // 搭配 ./theme/composables/useRuntime.ts
};
