(window.webpackJsonp=window.webpackJsonp||[]).push([[174],{870:function(t,s,a){"use strict";a.r(s);var n=a(2),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"响应式开发"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#响应式开发"}},[t._v("🌙")]),t._v(" 响应式开发")]),t._v(" "),s("h2",{attrs:{id:"_1-响应式布局概念"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-响应式布局概念"}},[t._v("🌙")]),t._v(" 1.响应式布局概念")]),t._v(" "),s("p",[t._v("简而言之，即多端兼容。")]),t._v(" "),s("p",[t._v("响应式开发的提出：")]),t._v(" "),s("ul",[s("li",[t._v("在移动互联日益成熟的时候，我们在桌面浏览器上开发的网页已经无法满足移动设备的阅读。")]),t._v(" "),s("li",[t._v("通常的做法是针对移动端单独做一套稳定的版本。")]),t._v(" "),s("li",[t._v("但是如果中断越来越多那么你需要开发的版本就会越来越多（大屏移动设备普及）。")]),t._v(" "),s("li",[t._v("于是，Ethan Marcotte在2010年5月提出一个概念："),s("strong",[t._v("响应式开发")]),t._v("。简而言之，就是一个网站能构兼容多个终端。")])]),t._v(" "),s("p",[t._v("web开发现状：")]),t._v(" "),s("ul",[s("li",[t._v("移动web开发和响应式开发是目前主流的开发模式。")]),t._v(" "),s("li",[t._v("使用流式布局（百分比）来适配不同的设备。")]),t._v(" "),s("li",[t._v("由于终端设备的多样化，新建站点会优先使用响应式开发。")])]),t._v(" "),s("h2",{attrs:{id:"_2-响应式原理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-响应式原理"}},[t._v("🌙")]),t._v(" 2.响应式原理")]),t._v(" "),s("p",[t._v("基于CSS3 中的 "),s("a",{attrs:{href:"https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Media_queries",target:"_blank",rel:"noopener noreferrer"}},[t._v("Media Query(媒体查询)"),s("OutboundLink")],1),t._v("。")]),t._v(" "),s("p",[t._v("通过查询"),s("code",[t._v("screen")]),t._v("的宽度来指定某个宽度区间的网页布局。")]),t._v(" "),s("ul",[s("li",[t._v("超小屏幕（移动设备） 768px（iPad）以下")]),t._v(" "),s("li",[t._v("小屏幕 \t768px - 992px")]),t._v(" "),s("li",[t._v("中屏幕\t992px - 1200px;（如：1024 x 1366）")]),t._v(" "),s("li",[t._v("大屏幕 \t1200px以上(如：1366 x 768; 1920 x 1080)")])]),t._v(" "),s("h2",{attrs:{id:"_3-实现响应式布局"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-实现响应式布局"}},[t._v("🌙")]),t._v(" 3.实现响应式布局")]),t._v(" "),s("h3",{attrs:{id:"使用-media-媒体查询-关键字"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#使用-media-媒体查询-关键字"}},[t._v("🌙")]),t._v(" 使用 "),s("strong",[t._v("@media")]),t._v(" （媒体查询）关键字")]),t._v(" "),s("p",{staticClass:"codepen",staticStyle:{height:"265px","box-sizing":"border-box",display:"flex","align-items":"center","justify-content":"center",border:"2px solid",margin:"1em 0",padding:"1em"},attrs:{"data-height":"265","data-theme-id":"0","data-default-tab":"css,result","data-user":"keekuun","data-slug-hash":"xxKXKOe","data-pen-title":"响应式开发-媒体查询1"}},[s("span",[t._v("See the Pen "),s("a",{attrs:{href:"https://codepen.io/keekuun/pen/xxKXKOe/"}},[t._v("\n  响应式开发-媒体查询1")]),t._v(" by Keekuun ("),s("a",{attrs:{href:"https://codepen.io/keekuun"}},[t._v("@keekuun")]),t._v(")\n  on "),s("a",{attrs:{href:"https://codepen.io"}},[t._v("CodePen")]),t._v(".")])]),t._v(" "),s("script",{attrs:{async:"",src:"https://static.codepen.io/assets/embed/ei.js"}}),t._v(" "),s("ul",[s("li",[s("p",[s("strong",[t._v("@media")]),t._v(" 默认设备为"),s("strong",[t._v("screen")]),t._v("可以简写：\n")]),s("p",{staticClass:"codepen",staticStyle:{height:"265px","box-sizing":"border-box",display:"flex","align-items":"center","justify-content":"center",border:"2px solid",margin:"1em 0",padding:"1em"},attrs:{"data-height":"265","data-theme-id":"0","data-default-tab":"css,result","data-user":"keekuun","data-slug-hash":"wvwrwde","data-pen-title":"响应式开发-媒体查询2"}},[s("span",[t._v("See the Pen "),s("a",{attrs:{href:"https://codepen.io/keekuun/pen/wvwrwde/"}},[t._v("\n响应式开发-媒体查询2")]),t._v(" by Keekuun ("),s("a",{attrs:{href:"https://codepen.io/keekuun"}},[t._v("@keekuun")]),t._v(")\non "),s("a",{attrs:{href:"https://codepen.io"}},[t._v("CodePen")]),t._v(".")])]),t._v(" "),s("script",{attrs:{async:"",src:"https://static.codepen.io/assets/embed/ei.js"}}),s("p")]),t._v(" "),s("li",[s("p",[t._v("调整样式顺序，利用样式覆盖，简化条件：\n")]),s("p",{staticClass:"codepen",staticStyle:{height:"265px","box-sizing":"border-box",display:"flex","align-items":"center","justify-content":"center",border:"2px solid",margin:"1em 0",padding:"1em"},attrs:{"data-height":"265","data-theme-id":"0","data-default-tab":"css,result","data-user":"keekuun","data-slug-hash":"wvwrwde","data-pen-title":"响应式开发-媒体查询2"}},[s("span",[t._v("See the Pen "),s("a",{attrs:{href:"https://codepen.io/keekuun/pen/wvwrwde/"}},[t._v("\n响应式开发-媒体查询2")]),t._v(" by Keekuun ("),s("a",{attrs:{href:"https://codepen.io/keekuun"}},[t._v("@keekuun")]),t._v(")\non "),s("a",{attrs:{href:"https://codepen.io"}},[t._v("CodePen")]),t._v(".")])]),t._v(" "),s("script",{attrs:{async:"",src:"https://static.codepen.io/assets/embed/ei.js"}}),s("p")])]),t._v(" "),s("h2",{attrs:{id:"_4-使用ui布局框架"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-使用ui布局框架"}},[t._v("🌙")]),t._v(" 4.使用UI布局框架")]),t._v(" "),s("ul",[s("li",[s("p",[s("a",{attrs:{href:"https://www.bootcss.com",target:"_blank",rel:"noopener noreferrer"}},[t._v("Bootstrap"),s("OutboundLink")],1),t._v(" 是最受欢迎的 HTML、CSS 和 JS 框架(UI框架)，用于开发响应式布局、移动设备优先的 WEB 项目。")])]),t._v(" "),s("li",[s("p",[s("a",{attrs:{href:"https://amazeui.clouddeep.cn",target:"_blank",rel:"noopener noreferrer"}},[t._v("Amaze ~ 妹子 UI"),s("OutboundLink")],1),t._v("中国首个开源 HTML5 跨屏前端框架")])]),t._v(" "),s("li",[s("p",[s("a",{attrs:{href:"http://m.sui.taobao.org",target:"_blank",rel:"noopener noreferrer"}},[t._v("SUI Mobile"),s("OutboundLink")],1),t._v("是一套基于 "),s("a",{attrs:{href:"http://framework7.taobao.org",target:"_blank",rel:"noopener noreferrer"}},[t._v("Framework7"),s("OutboundLink")],1),t._v(" 开发的UI库。它非常轻量、精美，只需要引入我们的CDN文件就可以使用，并且能兼容到 iOS 6.0+ 和 Android 4.0+，非常适合开发跨平台Web App。")])]),t._v(" "),s("li",[s("p",[s("a",{attrs:{href:"http://www.wetouch.net",target:"_blank",rel:"noopener noreferrer"}},[t._v("WeTouch"),s("OutboundLink")],1),t._v("是App一站式快速开发平台，包含了Touch UI移动组件库、移动端常用API、插件化机制、热更新、云端打包等内容。几乎囊括了开发移动应用的所有细节，真正实现拿来即用，像搭积木一样开发移动应用。使用它，你无需学习原生native开发，就可以一次拥有安卓App、苹果App和H5等应用，极大地缩短项目周期。结合我们的Touch WX框架，还可以很方便的移植为微信小程序。")])]),t._v(" "),s("li",[s("p",[s("a",{attrs:{href:"https://frozenui.github.io",target:"_blank",rel:"noopener noreferrer"}},[t._v("FrozenUI"),s("OutboundLink")],1),t._v(" 是一套基于移动端的UI库轻量、精美、遵从手机 QQ 设计规范。")])]),t._v(" "),s("li",[s("p",[t._v("Bootstrap模板：")])])]),t._v(" "),s("div",{staticClass:"language-html line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-html"}},[s("code",[s("span",{pre:!0,attrs:{class:"token doctype"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<!")]),s("span",{pre:!0,attrs:{class:"token doctype-tag"}},[t._v("DOCTYPE")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token name"}},[t._v("html")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("html")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("lang")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("zh-CN"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("head")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("meta")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("charset")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("utf-8"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("meta")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("http-equiv")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("X-UA-Compatible"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("content")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("IE=edge"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("meta")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("viewport"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("content")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("width=device-width, initial-scale=1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("\x3c!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ --\x3e")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("title")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("Bootstrap 101 Template"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("title")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("\x3c!-- Bootstrap --\x3e")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("link")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("href")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("rel")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("stylesheet"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("\x3c!-- HTML5 shim 和 Respond.js 是为了让 IE8 支持 HTML5 元素和媒体查询（media queries）功能 --\x3e")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("\x3c!-- 警告：通过 file:// 协议（就是直接将 html 页面拖拽到浏览器中）访问页面时 Respond.js 不起作用 --\x3e")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('\x3c!--[if lt IE 9]>\n      <script src="https://cdn.jsdelivr.net/npm/html5shiv@3.7.3/dist/html5shiv.min.js"><\/script>\n      <script src="https://cdn.jsdelivr.net/npm/respond.js@1.4.2/dest/respond.min.js"><\/script>\n    <![endif]--\x3e')]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("head")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("body")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("h1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("你好，世界！"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("h1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("\x3c!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) --\x3e")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("script")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("src")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token script"}}),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("script")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("\x3c!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 --\x3e")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("script")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("src")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token script"}}),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("script")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("body")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("html")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br"),s("span",{staticClass:"line-number"},[t._v("9")]),s("br"),s("span",{staticClass:"line-number"},[t._v("10")]),s("br"),s("span",{staticClass:"line-number"},[t._v("11")]),s("br"),s("span",{staticClass:"line-number"},[t._v("12")]),s("br"),s("span",{staticClass:"line-number"},[t._v("13")]),s("br"),s("span",{staticClass:"line-number"},[t._v("14")]),s("br"),s("span",{staticClass:"line-number"},[t._v("15")]),s("br"),s("span",{staticClass:"line-number"},[t._v("16")]),s("br"),s("span",{staticClass:"line-number"},[t._v("17")]),s("br"),s("span",{staticClass:"line-number"},[t._v("18")]),s("br"),s("span",{staticClass:"line-number"},[t._v("19")]),s("br"),s("span",{staticClass:"line-number"},[t._v("20")]),s("br"),s("span",{staticClass:"line-number"},[t._v("21")]),s("br"),s("span",{staticClass:"line-number"},[t._v("22")]),s("br"),s("span",{staticClass:"line-number"},[t._v("23")]),s("br"),s("span",{staticClass:"line-number"},[t._v("24")]),s("br"),s("span",{staticClass:"line-number"},[t._v("25")]),s("br"),s("span",{staticClass:"line-number"},[t._v("26")]),s("br"),s("span",{staticClass:"line-number"},[t._v("27")]),s("br"),s("span",{staticClass:"line-number"},[t._v("28")]),s("br")])])])}),[],!1,null,null,null);s.default=e.exports}}]);