(window.webpackJsonp=window.webpackJsonp||[]).push([[238],{941:function(t,a,s){"use strict";s.r(a);var e=s(2),n=Object(e.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"技术选型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#技术选型"}},[t._v("🌙")]),t._v(" 技术选型")]),t._v(" "),a("p",[t._v("一般来说，渲染界面的技术有三种")]),t._v(" "),a("ol",[a("li",[t._v("用纯客户端原生技术来渲染（IOS、Android）")]),t._v(" "),a("li",[t._v("用纯web技术渲染（RN）")]),t._v(" "),a("li",[t._v("用客户端原生技术和web技术结合的混合技术（简称Hybrid技术）来渲染（原生+H5）")])]),t._v(" "),a("p",[t._v("小程序技术选型分析过程如下：")]),t._v(" "),a("ul",[a("li",[t._v("开发门槛：web门槛低，Native也有像RN这样的框架支持")]),t._v(" "),a("li",[t._v("体验：Native比Web要好太多，Hybird在一定程度上比Web接近原生体验")]),t._v(" "),a("li",[t._v("版本更新：Web支持在线更新，Native则需要打包到微信一起审核发布")]),t._v(" "),a("li",[t._v("管控安全：web可跳转或是改变页面内容，存在一些不可控因素和安全风险")])]),t._v(" "),a("p",[t._v("由于小程序的宿主环境是微信，如果用纯客户端的原生技术来编写小程序，那么小程序代码更新每次都需要与微信的代码一起发版，此种方法不行。")]),t._v(" "),a("p",[t._v("因此需要向web一样可以把随时可更新的资源甩在云端，通过下载到本地，动态执行和即可渲染出界面。但如果用纯web来渲染小程序，在一些复杂的交互上会有些性能问题，因为在web中UI和js脚本是互斥的，在一个线程中执行，这就容易导致一些逻辑任务抢占UI资源。")]),t._v(" "),a("p",[t._v("最终采用二者结合起来的Hybrid技术来渲染小程序，用近似web的开发方式来开发，可以实现在线更新代码，同时引入客户端原生参与组件（原生组件）也有以下好处：")]),t._v(" "),a("ul",[a("li",[t._v("扩展web能力，例如像输入框组件 input textarea有更好的控制键盘的能力")]),t._v(" "),a("li",[t._v("体验更好，同时也减轻webView的渲染工作。例如地图组件map这类较复杂的组件，其渲染工作不占用webview线程，而交给更高效的客户端原生处理。")]),t._v(" "),a("li",[t._v("绕过setData、数据通信和重渲染流程，使渲染性能更好")]),t._v(" "),a("li",[t._v("用客户端原生渲染内置一些复杂组件、可以提供更好的性能")])]),t._v(" "),a("h1",{attrs:{id:"逻辑层"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#逻辑层"}},[t._v("🌙")]),t._v(" 逻辑层")]),t._v(" "),a("p",[t._v("小程序开发框架的逻辑层使用 JavaScript 引擎为小程序提供开发者 JavaScript 代码的运行环境以及微信小程序的特有功能。")]),t._v(" "),a("p",[a("strong",[t._v("作用：逻辑层将数据进行处理后发送给视图层，同时接受视图层的事件反馈。")])]),t._v(" "),a("p",[t._v("开发者写的所有代码最终将会打包成一份 JavaScript 文件，并在小程序启动的时候运行，直到小程序销毁。这一行为类似 "),a("a",{attrs:{href:"https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API",target:"_blank",rel:"noopener noreferrer"}},[t._v("ServiceWorker"),a("OutboundLink")],1),t._v("，所以"),a("strong",[t._v("逻辑层也称之为 App Service")]),t._v("。")]),t._v(" "),a("p",[t._v("在 JavaScript 的基础上，我们增加了一些功能，以方便小程序的开发：")]),t._v(" "),a("ul",[a("li",[t._v("增加 "),a("code",[t._v("App")]),t._v(" 和 "),a("code",[t._v("Page")]),t._v(" 方法，进行程序注册和页面注册。")]),t._v(" "),a("li",[t._v("增加 "),a("code",[t._v("getApp")]),t._v(" 和 "),a("code",[t._v("getCurrentPages")]),t._v(" 方法，分别用来获取 App 实例和当前页面栈。")]),t._v(" "),a("li",[t._v("提供丰富的 API，如微信用户数据，扫一扫，支付等微信特有能力。")]),t._v(" "),a("li",[t._v("提供模块化能力，每个页面有独立的作用域。\n注意：小程序框架的逻辑层并非运行在浏览器中，因此 JavaScript 在 web 中一些能力都无法使用，如 window，document 等。")])]),t._v(" "),a("h1",{attrs:{id:"视图层"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#视图层"}},[t._v("🌙")]),t._v(" 视图层")]),t._v(" "),a("p",[t._v("框架的视图层由 "),a("code",[t._v("WXML")]),t._v(" 与 "),a("code",[t._v("WXSS")]),t._v(" 编写，由组件来进行展示。")]),t._v(" "),a("p",[a("strong",[t._v("作用：将逻辑层的数据反映成视图，同时将视图层的事件发送给逻辑层。")])]),t._v(" "),a("ul",[a("li",[a("p",[a("code",[t._v("WXML")]),t._v("(WeiXin Markup language) 用于描述页面的结构。")])]),t._v(" "),a("li",[a("p",[a("code",[t._v("WXS")]),t._v("(WeiXin Script) 是小程序的一套脚本语言，结合 WXML，可以构建出页面的结构。")])]),t._v(" "),a("li",[a("p",[a("code",[t._v("WXSS")]),t._v("(WeiXin Style Sheet) 用于描述页面的样式。")])]),t._v(" "),a("li",[a("p",[t._v("组件(Component)是视图的基本组成单元。")])])]),t._v(" "),a("h1",{attrs:{id:"双线层通信"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#双线层通信"}},[t._v("🌙")]),t._v(" 双线层通信")]),t._v(" "),a("p",[t._v("视图层与逻辑层分别为不同的线程且单独运行，那么在webview里，开发者就没有办法直接操作dom\n那么如何实现动态更改界面呢？")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://res.wx.qq.com/wxdoc/dist/assets/img/4-1.ad156d1c.png",alt:""}})]),t._v(" "),a("p",[t._v("逻辑层和视图层通信会由native做中转，逻辑层发送网络请求也经由native转发。也就是说，可以把dom的更新通过简单的数据通信来实现\n采用Virtual DOM（虚拟dom）：即用"),a("strong",[t._v("js对象模拟DOM树")]),t._v(" --\x3e "),a("strong",[t._v("比较两棵虚拟dom树的差异")]),t._v(" --\x3e "),a("strong",[t._v("把差异应用到真正的dom树上")])]),t._v(" "),a("p",[t._v("视图层和逻辑层的数据传输，实际上通过两边提供的 evaluateJavascript 所实现。用户传输的数据，需要将其转换为字符串形式传递，同时把转换后的数据内容拼接成一份 JS 脚本，再通过执行 JS 脚本的形式传递到两边独立环境。")]),t._v(" "),a("h1",{attrs:{id:"渲染机制"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#渲染机制"}},[t._v("🌙")]),t._v(" 渲染机制")]),t._v(" "),a("p",[t._v("双线程的渲染，其实是结合了一系列机制（模版绑定、虚拟 DOM、线程通信），最后整合的一个执行步骤。\n1.通过模版数据绑定和虚拟 DOM 机制，小程序提供了带有数据绑定语法的 DSL （领域专用语言）给到开发者，用来在渲染层描述界面的结构。")]),t._v(" "),a("div",{staticClass:"language-html line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-html"}},[a("code",[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("view")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("{{ message }}"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("view")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("view")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token attr-name"}},[a("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("wx:")]),t._v("if")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[a("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("{{ true }}"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("hello"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("view")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("checkbox")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("checked")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[a("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("{{ false }}"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("checkbox")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br")])]),a("p",[t._v("2.小程序再逻辑层提供了设置页面数据的api（即，"),a("code",[t._v("setData")]),t._v("）")]),t._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("setData")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("key")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" value\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// setData函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的this.data的值（同步）。")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br")])]),a("p",[t._v("3.逻辑层需要更改界面时，只要把修改后的 "),a("code",[t._v("data")]),t._v(" 通过 "),a("code",[t._v("setData")]),t._v(" 传到渲染层。\n传输的数据，会转换为字符串形式传递，故应尽量避免传递大量数据。")]),t._v(" "),a("p",[t._v("4.渲染层会根据前面提到的渲染机制重新生成 Virtual Dom树，并更新到对应的 DOM 树上，引起界面变化。")]),t._v(" "),a("p",[a("strong",[t._v("模板数据绑定的过程")]),t._v("：")]),t._v(" "),a("ul",[a("li",[t._v("1.解析语法生成AST")]),t._v(" "),a("li",[t._v("2.根据AST结果生成DOM")]),t._v(" "),a("li",[t._v("3.将数据绑定更新至模板")])]),t._v(" "),a("h1",{attrs:{id:"虚拟dom"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#虚拟dom"}},[t._v("🌙")]),t._v(" 虚拟dom")]),t._v(" "),a("p",[t._v("虚拟 DOM 解决了常见的局部数据更新的问题，例如数组中值位置的调换、部分更新。\n计算过程如下：")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("用JS对象模拟DOM树。\n一个真正的DOM元素非常庞大，拥有很多的属性值。而其中很多的属性对于计算过程来说是不需要的，所以我们的第一步就是简化 DOM 对象。我们用一个 JavaScript 对象结构表示 DOM 树的结构。")])]),t._v(" "),a("li",[a("p",[t._v("比较两棵虚拟DOM树的差异。\n当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异。通常来说这样的差异需要记录，最后得到一组差异记录。")])]),t._v(" "),a("li",[a("p",[t._v("把差异应用到真正的DOM树上。\n对差异记录要应用到真正的 DOM 树上，例如节点的替换、移动、删除，文本内容的改变等。")])])]),t._v(" "),a("p",[t._v("小程序里，由于无法直接操作 DOM，主要也是通过数据传递的方式来进行相关的模版更新。模版绑定的机制、数据更新的机制，都可以参照上面的说明。")])])}),[],!1,null,null,null);a.default=n.exports}}]);