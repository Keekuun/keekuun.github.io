(window.webpackJsonp=window.webpackJsonp||[]).push([[286],{1001:function(s,a,t){"use strict";t.r(a);var n=t(2),e=Object(n.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"_1-使用浏览器模拟真机"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-使用浏览器模拟真机"}},[s._v("🌙")]),s._v(" 1.使用浏览器模拟真机")]),s._v(" "),a("ul",[a("li",[s._v("F12打开开发者工具，或者页面鼠标右键选择查看，进入web开发调试模式。")]),s._v(" "),a("li",[s._v("默认是进入web端界面，可以在卡法这模式下使用快捷键"),a("code",[s._v("ctrl + shift + m")]),s._v(" 进入移动端界面。")])]),s._v(" "),a("p",[s._v("有时候h5页面在浏览器端和手机移动端显示不一致，往往是在浏览器移动调试界面正常，在手机上表现不一致，这个时候就需要使用手机来真机调试了。")]),s._v(" "),a("p",[s._v("一般地，开发环境下代码在电脑上跑，h5的域名和端口是在电脑上才能访问的（比如：localhost:3000），要想在手机上打开对应的h5页面，那么该怎么办呢？")]),s._v(" "),a("h1",{attrs:{id:"_2-使用共享网络访问"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-使用共享网络访问"}},[s._v("🌙")]),s._v(" 2.使用共享网络访问")]),s._v(" "),a("p",[s._v("如果电脑和手机在同一wifi环境下，可以通过ip来访问")]),s._v(" "),a("p",[s._v("通过"),a("code",[s._v("ipconfig")]),s._v("查看本机ipv4地址，然后把"),a("code",[s._v("localhost:3000")]),s._v("替换为对应的ip"),a("code",[s._v("$ip:3000")]),s._v(",手机就可以访问了。")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("$ ipconfig\n\nWindows IP Configuration\nEthernet adapter 以太网:\n\n   Connection-specific DNS Suffix  "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v("\n   IPv6 Address. "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" 240e:ff:a010:26d:feee:36b5:ca2d:fe2e\n   Link-local IPv6 Address "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" fe80::ac50:7f9b:5707:c085%14\n   IPv4 Address. "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),s._v(".99.59 "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# ipv4")]),s._v("\n   Subnet Mask "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("255.255")]),s._v(".255.0\n   Default Gateway "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" fe80::9e54:c2ff:fe3e:5ec1%14\n                                       "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),s._v(".99.1\n\nEthernet adapter 以太网 "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("4")]),s._v(":\n\n   Media State "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" Media disconnected\n   Connection-specific DNS Suffix  "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v("\n\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br")])]),a("h1",{attrs:{id:"_3-使用usb真机调试"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-使用usb真机调试"}},[s._v("🌙")]),s._v(" 3.使用USB真机调试")]),s._v(" "),a("p",[s._v("可以"),a("strong",[s._v("手机USB连接电脑，打开USB调试，通过chrome浏览器"),a("code",[s._v("chrome://inspect")]),s._v("进入真机调试界面")])]),s._v(" "),a("p",[s._v("一般在开发测试环境我们会在页面中嵌入抓包工具，比如："),a("a",{attrs:{href:"https://www.npmjs.com/package/vconsole",target:"_blank",rel:"noopener noreferrer"}},[s._v("vConsole"),a("OutboundLink")],1)]),s._v(" "),a("p",[a("strong",[s._v("在生产环境为了安全性访问，会把调试、抓包等入口关闭禁用，USB真机调试往往行不通。")])]),s._v(" "),a("p",[s._v("如果要定位线上的一些问题，往往需要抓包。如果是web端还可以在浏览器访问，通过浏览器调试查看请求。")]),s._v(" "),a("p",[s._v("但是h5一般是内嵌在原生app里面，测试环境有时候不能重现线上问题，需要线上抓包才行，那么就需要使用一些非常规手段了——代理。")]),s._v(" "),a("h1",{attrs:{id:"_4-使用whistle代理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-使用whistle代理"}},[s._v("🌙")]),s._v(" 4.使用whistle代理")]),s._v(" "),a("p",[s._v("Whistle 是基于 Node 实现的跨平台抓包调试工具，其主要特点：")]),s._v(" "),a("ul",[a("li",[s._v("1.完全跨平台：支持 Mac、Windows 等桌面系统，且支持服务端等命令行系统")]),s._v(" "),a("li",[s._v("2.功能强大（理论上可以对请求做任意修改）：\n"),a("ul",[a("li",[s._v("支持作为 HTTP、HTTPS、SOCKS 代理及反向代理")]),s._v(" "),a("li",[s._v("支持抓包及修改 HTTP、HTTPS、HTTP2、WebSocket、TCP 请求")]),s._v(" "),a("li",[s._v("支持重放及构造 HTTP、HTTPS、HTTP2、WebSocket、TCP 请求")]),s._v(" "),a("li",[s._v("支持设置上游代理、PAC 脚本、Hosts、延迟（限速）请求响应等")]),s._v(" "),a("li",[s._v("支持查看远程页面的 console 日志及 DOM 节点")]),s._v(" "),a("li",[s._v("支持用 Node 开发插件扩展功能，也可以作为独立 npm 包引用")])])]),s._v(" "),a("li",[s._v("3.操作简单：\n"),a("ul",[a("li",[s._v("直接通过浏览器查看抓包、修改请求")]),s._v(" "),a("li",[s._v("所有修改操作都可以通过配置方式实现（类似系统 Hosts），并支持分组管理")]),s._v(" "),a("li",[s._v("项目可以自带代理规则配置并一键设置到本地 Whistle 代理，也可以通过定制插件简化操作")])])])]),s._v(" "),a("blockquote",[a("p",[s._v("摘自"),a("a",{attrs:{href:"https://www.npmjs.com/package/whistle",target:"_blank",rel:"noopener noreferrer"}},[s._v("whistle"),a("OutboundLink")],1),s._v(", 见具体安装使用方式")])]),s._v(" "),a("p",[s._v("安装成功之后，开启whistle代理")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("$ w2 start\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("i"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" whistle@2.9.30 started\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("i"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(". use your device to visit the following URL list, gets the IP of the URL y\nou can access:\n       http://127.0.0.1:8899/\n       http://192.168.99.59:8899/\n       Note: If all the above URLs are unable to access, check the firewall sett\nings\n             For "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("help")]),s._v(" see https://github.com/avwo/whistle\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("i"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v(". "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("set")]),s._v(" the HTTP proxy on your device with the above IP "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v(" PORT"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8899")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("i"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v(". use Chrome to visit http://local.whistlejs.com/ to get started\n\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br")])]),a("p",[s._v("手机连接wifi之后，在wifi界面设置代理，填入whistle对应的ip（如：192.168.99.59）和端口（默认：8899），这时手机访问h5页面的请求会被whistle实时捕获。")]),s._v(" "),a("p",[s._v("我们通过浏览器访问"),a("code",[s._v("http://127.0.0.1:8899/")]),s._v(" 即可查看请求和响应参数，可以愉快地定位问题了。")]),s._v(" "),a("p",[s._v("另外，whistle还提供了一些插件，比如："),a("code",[s._v("vconsole")]),s._v("可以把vconsole嵌入到没有接入这个插件的页面。"),a("code",[s._v("vase")]),s._v("插件可以mock数据等等。")]),s._v(" "),a("p",[s._v("但是，如果电脑和手机不在同一个局域网环境，那么这种方式就行不通，我们可以想方设法使他们在同一网络下。")]),s._v(" "),a("p",[s._v("这时，我们可以尝试使用以下代理的方式。")]),s._v(" "),a("h1",{attrs:{id:"_5-使用adb代理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_5-使用adb代理"}},[s._v("🌙")]),s._v(" 5.使用adb代理")]),s._v(" "),a("p",[s._v("由于笔者是win10电脑，下面只针对windows和android")]),s._v(" "),a("ul",[a("li",[a("p",[s._v("1.下载"),a("a",{attrs:{href:"https://link.zhihu.com/?target=https%3A//github.com/Genymobile/gnirehtet/releases/download/v2.4/gnirehtet-rust-win64-v2.4.zip",target:"_blank",rel:"noopener noreferrer"}},[s._v("gnirehtet-windows版"),a("OutboundLink")],1),s._v(",解压之后获取：")]),s._v(" "),a("ul",[a("li",[s._v("gnirehtet.apk")]),s._v(" "),a("li",[s._v("gnirehtet.exe")]),s._v(" "),a("li",[s._v("gnirehtet-run.cmd")])])]),s._v(" "),a("li",[a("p",[s._v("2.安装最新adb：各平台的 adb 下载链接 —> "),a("a",{attrs:{href:"https://developer.android.google.cn/studio/releases/platform-tools?hl=zh-cn",target:"_blank",rel:"noopener noreferrer"}},[s._v("Android SDK"),a("OutboundLink")],1),s._v("。\n下载 "),a("a",{attrs:{href:"https://link.zhihu.com/?target=https%3A//dl.google.com/android/repository/platform-tools-latest-windows.zip",target:"_blank",rel:"noopener noreferrer"}},[s._v("platform-tools"),a("OutboundLink")],1),s._v(" 并将以下文件提取到 "),a("code",[s._v("gnirehtet")]),s._v(" 目录：")]),s._v(" "),a("ul",[a("li",[s._v("adb.exe")]),s._v(" "),a("li",[s._v("AdbWinApi.dll")]),s._v(" "),a("li",[s._v("AdbWinUsbApi.dll")])])]),s._v(" "),a("li",[a("p",[s._v("3.手机USB连接电脑，并打开USB调试模式，需要勾选 USB安装 和 USB调试(安全设置) 两个选项")])]),s._v(" "),a("li",[a("p",[s._v("4.执行"),a("code",[s._v("gnirehtet")]),s._v("：在 Windows 上，双击 "),a("code",[s._v("gnirehtet-run.cmd")]),s._v("，然后手机上会弹出一个窗口请求权限，确认即可，这时手顶部会有一个vpn开启的标志，即大功告成。")])])]),s._v(" "),a("p",[s._v("然后手机和电脑就共享了网络，手机无论是关闭流量，或者打开飞行模式，都可以可以上网。")]),s._v(" "),a("blockquote",[a("p",[s._v("参考："),a("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/166340450",target:"_blank",rel:"noopener noreferrer"}},[s._v("手机通过USB连接电脑上网"),a("OutboundLink")],1)])]),s._v(" "),a("h1",{attrs:{id:"_6-其他方式"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_6-其他方式"}},[s._v("🌙")]),s._v(" 6.其他方式")]),s._v(" "),a("p",[a("a",{attrs:{href:"https://github.com/goldenduo/AGB/blob/main/README_CN.md",target:"_blank",rel:"noopener noreferrer"}},[s._v("AGB方式"),a("OutboundLink")],1)]),s._v(" "),a("p",[s._v("这个笔者没试过，感兴趣的小伙伴可以去试试。")])])}),[],!1,null,null,null);a.default=e.exports}}]);