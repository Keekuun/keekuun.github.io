(window.webpackJsonp=window.webpackJsonp||[]).push([[268],{973:function(t,a,s){"use strict";s.r(a);var e=s(2),n=Object(e.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"新分支开发工作流"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#新分支开发工作流"}},[t._v("🌙")]),t._v(" 新分支开发工作流：")]),t._v(" "),a("blockquote",[a("p",[a("strong",[t._v("public")]),t._v(" 远程公共分支")]),t._v(" "),a("p",[a("strong",[t._v("origin")]),t._v(" fork自public的自己的远程分支")])]),t._v(" "),a("p",[t._v("拉取最新的分支信息")]),t._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" fetch public\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("h2",{attrs:{id:"_1-拉取远程public库新分支"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-拉取远程public库新分支"}},[t._v("🌙")]),t._v(" 1.拉取远程public库新分支")]),t._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" checkout public/Branch-25 "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--track")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("h2",{attrs:{id:"_2-将新分支推送到origin库里面-没有这个分支会自动创建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-将新分支推送到origin库里面-没有这个分支会自动创建"}},[t._v("🌙")]),t._v(" 2.将新分支推送到origin库里面，没有这个分支会自动创建")]),t._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" push origin Branch-25:Branch-25\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("h2",{attrs:{id:"_3-将本地branch-25分支的默认push分支切换为origin-branch-25"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-将本地branch-25分支的默认push分支切换为origin-branch-25"}},[t._v("🌙")]),t._v(" 3.将本地Branch-25分支的默认push分支切换为origin Branch-25")]),t._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" push --set-upstream origin Branch-25\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("h2",{attrs:{id:"_4-缓存本地更改"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-缓存本地更改"}},[t._v("🌙")]),t._v(" 4.缓存本地更改")]),t._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" stash\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("h2",{attrs:{id:"_5-拉去最新代码"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_5-拉去最新代码"}},[t._v("🌙")]),t._v(" 5.拉去最新代码")]),t._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" pull public Branch-25\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("h2",{attrs:{id:"_6-合并代码"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_6-合并代码"}},[t._v("🌙")]),t._v(" 6.合并代码")]),t._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" stash pop\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("h2",{attrs:{id:"_7-提交到远程"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_7-提交到远程"}},[t._v("🌙")]),t._v(" 7.提交到远程")]),t._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("add")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(".")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" commit "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-m")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"feat: 新增feature"')]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" push\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br")])]),a("ul",[a("li",[t._v("commit msg类型说明：")])]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("类型")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("描述")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("feat")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("新增feature")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("fix")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("修复bug")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("docs")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("仅仅修改了文档，比如README，CHANGELOG,CONTRIBUTE等等")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("styles")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("修改了空格、格式缩进、逗号等，不改变代码逻辑")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("refactor")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("代码重构，没有加新功能或者修复Bug")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("perf")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("优化相关，比如提升性能、体验")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("test")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("测试用例，包括单元测试、集成测试")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("chore")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("改变构建流程、或者增加依赖库、工具等")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("revert")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("回滚到上一个版本")])])])]),t._v(" "),a("blockquote",[a("p",[a("a",{attrs:{href:"https://backlog.com/git-tutorial/cn/contents/",target:"_blank",rel:"noopener noreferrer"}},[t._v("猴子都能懂的GIT入门"),a("OutboundLink")],1)])])])}),[],!1,null,null,null);a.default=n.exports}}]);