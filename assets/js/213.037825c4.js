(window.webpackJsonp=window.webpackJsonp||[]).push([[213],{910:function(t,e,s){"use strict";s.r(e);var a=s(2),r=Object(a.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("p",[t._v("在每个react组件中都有以下几个生命周期方法~我们需要在不同阶段进行讨论")]),t._v(" "),e("h2",{attrs:{id:"组件生命周期概述"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#组件生命周期概述"}},[t._v("🌙")]),t._v(" 组件生命周期概述")]),t._v(" "),e("blockquote",[e("p",[e("a",{attrs:{href:"https://github.com/mytac/blogs/blob/master/%E7%BF%BB%E8%AF%91/react%E7%BB%84%E4%BB%B6%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%EF%BC%88v16.3.1%EF%BC%89.md",target:"_blank",rel:"noopener noreferrer"}},[t._v("这里阅读原文"),e("OutboundLink")],1)])]),t._v(" "),e("h3",{attrs:{id:"_1-初始化"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-初始化"}},[t._v("🌙")]),t._v(" 1.初始化")]),t._v(" "),e("p",[t._v("在组件初始化阶段会执行")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("constructor")])]),t._v(" "),e("li",[e("code",[t._v("static getDerivedStateFromProps()")])]),t._v(" "),e("li",[e("code",[t._v("componentWillMount()")]),t._v(" / "),e("code",[t._v("UNSAFE_componentWillMount()")])]),t._v(" "),e("li",[e("code",[t._v("render()")])]),t._v(" "),e("li",[e("code",[t._v("componentDidMount()")])])]),t._v(" "),e("h3",{attrs:{id:"_2-更新阶段"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-更新阶段"}},[t._v("🌙")]),t._v(" 2.更新阶段")]),t._v(" "),e("p",[e("code",[t._v("props")]),t._v("或"),e("code",[t._v("state")]),t._v("的改变可能会引起组件的更新，组件重新渲染的过程中会调用以下方法：")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("componentWillReceiveProps()")]),t._v(" / "),e("code",[t._v("UNSAFE_componentWillReceiveProps()")])]),t._v(" "),e("li",[e("code",[t._v("static getDerivedStateFromProps()")])]),t._v(" "),e("li",[e("code",[t._v("shouldComponentUpdate()")])]),t._v(" "),e("li",[e("code",[t._v("componentWillUpdate()")]),t._v(" / "),e("code",[t._v("UNSAFE_componentWillUpdate()")])]),t._v(" "),e("li",[e("code",[t._v("render()")])]),t._v(" "),e("li",[e("code",[t._v("getSnapshotBeforeUpdate()")])]),t._v(" "),e("li",[e("code",[t._v("componentDidUpdate()")])])]),t._v(" "),e("h3",{attrs:{id:"_3-卸载阶段"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-卸载阶段"}},[t._v("🌙")]),t._v(" 3.卸载阶段")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("componentWillUnmount()")])])]),t._v(" "),e("h3",{attrs:{id:"_4-错误处理"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-错误处理"}},[t._v("🌙")]),t._v(" 4.错误处理")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("componentDidCatch()")])])]),t._v(" "),e("h2",{attrs:{id:"react生命周期图示"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#react生命周期图示"}},[t._v("🌙")]),t._v(" react生命周期图示")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://jspang.com/images/React1901.png",alt:"react生命周期"}})]),t._v(" "),e("p",[e("a",{attrs:{href:"http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/",target:"_blank",rel:"noopener noreferrer"}},[t._v("交互式展示："),e("OutboundLink")],1)]),t._v(" "),e("iframe",{attrs:{src:"http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/",frameborder:"0",height:"650",width:"100%"}}),t._v(" "),e("h2",{attrs:{id:"生命周期函数详解"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#生命周期函数详解"}},[t._v("🌙")]),t._v(" 生命周期函数详解")]),t._v(" "),e("h3",{attrs:{id:"_1-constructor-props"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-constructor-props"}},[t._v("🌙")]),t._v(" 1.constructor(props)")]),t._v(" "),e("p",[t._v("react组件的构造函数在挂载之前被调用。在实现"),e("code",[t._v("React.Component")]),t._v("构造函数时，需要先在添加其他内容前，调用"),e("code",[t._v("super(props)")]),t._v("，用来将父组件传来的"),e("code",[t._v("props")]),t._v("绑定到这个类中，使用"),e("code",[t._v("this.props")]),t._v("将会得到。")]),t._v(" "),e("p",[t._v("官方建议不要在"),e("code",[t._v("constructor")]),t._v("引入任何具有副作用和订阅功能的代码，这些应当在"),e("code",[t._v("componentDidMount()")]),t._v("中写入。")]),t._v(" "),e("p",[e("code",[t._v("constructor")]),t._v("中应当做些初始化的动作，如：初始化"),e("code",[t._v("state")]),t._v("，将事件处理函数绑定到类实例上，但也不要使用"),e("code",[t._v("setState()")]),t._v("。如果没有必要初始化state或绑定方法，则不需要构造"),e("code",[t._v("constructor")]),t._v("，或者把这个组件换成纯函数写法。")]),t._v(" "),e("p",[t._v("当然也可以利用"),e("code",[t._v("props")]),t._v("初始化"),e("code",[t._v("state")]),t._v("，在之后修改"),e("code",[t._v("state")]),t._v("不会对props造成任何修改，但仍然建议大家提升状态到父组件中，或使用"),e("code",[t._v("redux")]),t._v("统一进行状态管理。")]),t._v(" "),e("div",{staticClass:"language-js line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[t._v("constructor")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("props")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("super")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("props"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("state "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("color")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" props"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("initialColor\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[t._v("1")]),e("br"),e("span",{staticClass:"line-number"},[t._v("2")]),e("br"),e("span",{staticClass:"line-number"},[t._v("3")]),e("br"),e("span",{staticClass:"line-number"},[t._v("4")]),e("br"),e("span",{staticClass:"line-number"},[t._v("5")]),e("br"),e("span",{staticClass:"line-number"},[t._v("6")]),e("br")])]),e("h3",{attrs:{id:"_2-static-getderivedstatefromprops-nextprops-prevstate"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-static-getderivedstatefromprops-nextprops-prevstate"}},[t._v("🌙")]),t._v(" 2.static getDerivedStateFromProps(nextProps, prevState)")]),t._v(" "),e("p",[e("code",[t._v("getDerivedStateFromProps")]),t._v("在组件实例化后，和接受新的"),e("code",[t._v("props")]),t._v("后被调用。他返回一个对象来更新状态，或者返回null表示新的props不需要任何state的更新。")]),t._v(" "),e("p",[t._v("如果是由于父组件的props更改，所带来的重新渲染，也会触发此方法。")]),t._v(" "),e("p",[t._v("调用"),e("code",[t._v("steState()")]),t._v("不会触发"),e("code",[t._v("getDerivedStateFromProps()")]),t._v("。")]),t._v(" "),e("h3",{attrs:{id:"_3-componentwillmount-unsafe-componentwillmount"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-componentwillmount-unsafe-componentwillmount"}},[t._v("🌙")]),t._v(" 3. componentWillMount() / UNSAFE_componentWillMount()")]),t._v(" "),e("p",[e("code",[t._v("componentWillMount()")]),t._v("将在react未来版本中被弃用。"),e("code",[t._v("UNSAFE_componentWillMount()")]),t._v("在组件挂载前被调用，在这个方法中调用"),e("code",[t._v("setState()")]),t._v("不会起作用，是由于他在"),e("code",[t._v("render()")]),t._v("前被调用。")]),t._v(" "),e("p",[t._v("为了避免副作用和其他的订阅，官方都建议使用"),e("code",[t._v("componentDidMount()")]),t._v("代替。这个方法是用于在服务器渲染上的唯一方法。")]),t._v(" "),e("h3",{attrs:{id:"_4-render"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-render"}},[t._v("🌙")]),t._v(" 4.render()")]),t._v(" "),e("p",[e("code",[t._v("render()")]),t._v("方法是必需的。当他被调用时，他将计算"),e("code",[t._v("this.props")]),t._v("和"),e("code",[t._v("this.state")]),t._v("，并返回以下一种类型：")]),t._v(" "),e("ol",[e("li",[t._v("React元素。通过jsx创建，既可以是dom元素，也可以是用户自定义的组件。")]),t._v(" "),e("li",[t._v("字符串或数字。他们将会以文本节点形式渲染到dom中。")]),t._v(" "),e("li",[t._v("Portals。react 16版本中提出的新的解决方案，可以使组件脱离父组件层级直接挂载在DOM树的任何位置。")]),t._v(" "),e("li",[e("code",[t._v("null")]),t._v("，什么也不渲染")]),t._v(" "),e("li",[t._v("布尔值。也是什么都不渲染，通常后跟组件进行判断。")])]),t._v(" "),e("p",[t._v("当返回"),e("code",[t._v("null")]),t._v(","),e("code",[t._v("false")]),t._v(","),e("code",[t._v("ReactDOM.findDOMNode(this)")]),t._v("将会返回null，什么都不会渲染。")]),t._v(" "),e("p",[e("code",[t._v("render()")]),t._v("方法必须是一个纯函数，他不应该改变"),e("code",[t._v("state")]),t._v("，也不能直接和浏览器进行交互，应该将事件放在其他生命周期函数中。\n如果"),e("code",[t._v("shouldComponentUpdate()")]),t._v("返回"),e("code",[t._v("false")]),t._v("，"),e("code",[t._v("render()")]),t._v("不会被调用。")]),t._v(" "),e("h4",{attrs:{id:"fragments"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#fragments"}},[t._v("🌙")]),t._v(" Fragments")]),t._v(" "),e("p",[t._v("你也可以在"),e("code",[t._v("render()")]),t._v("中使用数组，如：("),e("em",[t._v("不要忘记给每个数组元素添加key，防止出现警告")]),t._v(")")]),t._v(" "),e("div",{staticClass:"language-js line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[t._v("render")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("li key"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"A"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("First item"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("li"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("li key"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"B"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("Second item"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("li"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("li key"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"C"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("Third item"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("li"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[t._v("1")]),e("br"),e("span",{staticClass:"line-number"},[t._v("2")]),e("br"),e("span",{staticClass:"line-number"},[t._v("3")]),e("br"),e("span",{staticClass:"line-number"},[t._v("4")]),e("br"),e("span",{staticClass:"line-number"},[t._v("5")]),e("br"),e("span",{staticClass:"line-number"},[t._v("6")]),e("br"),e("span",{staticClass:"line-number"},[t._v("7")]),e("br")])]),e("p",[t._v("换一种写法，可以不写key（v16++）")]),t._v(" "),e("div",{staticClass:"language-js line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[t._v("render")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("React"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Fragment"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n      "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("li"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("First item"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("li"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n      "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("li"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("Second item"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("li"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n      "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("li"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("Third item"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("li"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("React"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Fragment"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[t._v("1")]),e("br"),e("span",{staticClass:"line-number"},[t._v("2")]),e("br"),e("span",{staticClass:"line-number"},[t._v("3")]),e("br"),e("span",{staticClass:"line-number"},[t._v("4")]),e("br"),e("span",{staticClass:"line-number"},[t._v("5")]),e("br"),e("span",{staticClass:"line-number"},[t._v("6")]),e("br"),e("span",{staticClass:"line-number"},[t._v("7")]),e("br"),e("span",{staticClass:"line-number"},[t._v("8")]),e("br"),e("span",{staticClass:"line-number"},[t._v("9")]),e("br")])]),e("h3",{attrs:{id:"_5-componentwillreceiveprops-unsafe-componentwillreceiveprops-nextprops"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_5-componentwillreceiveprops-unsafe-componentwillreceiveprops-nextprops"}},[t._v("🌙")]),t._v(" 5.componentWillReceiveProps()/UNSAFE_componentWillReceiveProps(nextProps)")]),t._v(" "),e("p",[t._v("官方建议使用"),e("code",[t._v("getDerivedStateFromProps")]),t._v("函数代替"),e("code",[t._v("componentWillReceiveProps()")]),t._v("。当组件挂载后，接收到新的"),e("code",[t._v("props")]),t._v("后会被调用。如果需要更新"),e("code",[t._v("state")]),t._v("来响应"),e("code",[t._v("props")]),t._v("的更改，则可以进行"),e("code",[t._v("this.props")]),t._v("和"),e("code",[t._v("nextProps")]),t._v("的比较，并在此方法中使用"),e("code",[t._v("this.setState()")]),t._v("。")]),t._v(" "),e("p",[t._v("如果父组件会让这个组件重新渲染，即使"),e("code",[t._v("props")]),t._v("没有改变，也会调用这个方法。")]),t._v(" "),e("p",[t._v("react不会在组件初始化props时调用这个方法。调用"),e("code",[t._v("this.setState")]),t._v("也不会触发。")]),t._v(" "),e("h3",{attrs:{id:"_6-shouldcomponentupdate-nextprops-nextstate"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_6-shouldcomponentupdate-nextprops-nextstate"}},[t._v("🌙")]),t._v(" 6.shouldComponentUpdate(nextProps, nextState)")]),t._v(" "),e("p",[t._v("调用"),e("code",[t._v("shouldComponentUpdate")]),t._v("使react知道，组件的输出是否受"),e("code",[t._v("state")]),t._v("和"),e("code",[t._v("props")]),t._v("的影响。默认每个状态的更改都会重新渲染，大多数情况下应该保持这个默认行为。")]),t._v(" "),e("p",[t._v("在渲染新的"),e("code",[t._v("props")]),t._v("或"),e("code",[t._v("state")]),t._v("前，"),e("code",[t._v("shouldComponentUpdate")]),t._v("会被调用。默认为"),e("code",[t._v("true")]),t._v("。这个方法不会在初始化时被调用，也不会在"),e("code",[t._v("forceUpdate()")]),t._v("时被调用。返回"),e("code",[t._v("false")]),t._v("不会阻止子组件在"),e("code",[t._v("state")]),t._v("更改时重新渲染。")]),t._v(" "),e("p",[t._v("如果"),e("code",[t._v("shouldComponentUpdate()")]),t._v("返回"),e("code",[t._v("false")]),t._v("，"),e("code",[t._v("componentwillupdate")]),t._v(","),e("code",[t._v("render")]),t._v("和"),e("code",[t._v("componentDidUpdate")]),t._v("不会被调用。")]),t._v(" "),e("blockquote",[e("p",[t._v("在未来版本，shouldComponentUpdate()将会作为一个提示而不是严格的指令，返回false仍然可能导致组件的重新渲染。")])]),t._v(" "),e("p",[t._v("官方并不建议在"),e("code",[t._v("shouldComponentUpdate()")]),t._v("中进行深度查询或使用"),e("code",[t._v("JSON.stringify()")]),t._v("，他效率非常低，并且损伤性能。")]),t._v(" "),e("h3",{attrs:{id:"_7-unsafe-componentwillupdate-nextprops-nextstate"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_7-unsafe-componentwillupdate-nextprops-nextstate"}},[t._v("🌙")]),t._v(" 7.UNSAFE_componentWillUpdate(nextProps, nextState)")]),t._v(" "),e("p",[t._v("在渲染新的"),e("code",[t._v("state")]),t._v("或"),e("code",[t._v("props")]),t._v("时，"),e("code",[t._v("UNSAFE_componentWillUpdate")]),t._v("会被调用，将此作为在更新发生之前进行准备的机会。这个方法不会在初始化时被调用。")]),t._v(" "),e("p",[e("em",[t._v("不能在这里使用this.setState()")]),t._v("，也不能做会触发视图更新的操作。如果需要更新"),e("code",[t._v("state")]),t._v("或"),e("code",[t._v("props")]),t._v("，调用"),e("code",[t._v("getDerivedStateFromProps")]),t._v("。")]),t._v(" "),e("h3",{attrs:{id:"_8-getsnapshotbeforeupdate"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_8-getsnapshotbeforeupdate"}},[t._v("🌙")]),t._v(" 8.getSnapshotBeforeUpdate()")]),t._v(" "),e("p",[t._v("在react "),e("code",[t._v("render()")]),t._v("后的输出被渲染到DOM之前被调用。它使您的组件能够在它们被潜在更改之前捕获当前值（如滚动位置）。这个生命周期返回的任何值都将作为参数传递给componentDidUpdate（）。")]),t._v(" "),e("h3",{attrs:{id:"_9-componentdidupdate-prevprops-prevstate-snapshot"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_9-componentdidupdate-prevprops-prevstate-snapshot"}},[t._v("🌙")]),t._v(" 9.componentDidUpdate(prevProps, prevState, snapshot)")]),t._v(" "),e("p",[t._v("在更新发生后立即调用"),e("code",[t._v("componentDidUpdate()")]),t._v("。此方法不用于初始渲染。当组件更新时，将此作为一个机会来操作DOM。只要您将当前的props与以前的props进行比较（例如，如果props没有改变，则可能不需要网络请求），这也是做网络请求的好地方。")]),t._v(" "),e("p",[t._v("如果组件实现"),e("code",[t._v("getSnapshotBeforeUpdate()")]),t._v("生命周期，则它返回的值将作为第三个“快照”参数传递给"),e("code",[t._v("componentDidUpdate()")]),t._v("。否则，这个参数是"),e("code",[t._v("undefined")]),t._v("。")]),t._v(" "),e("h3",{attrs:{id:"_10-componentwillunmount"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_10-componentwillunmount"}},[t._v("🌙")]),t._v(" 10.componentWillUnmount()")]),t._v(" "),e("p",[t._v("在组件被卸载并销毁之前立即被调用。在此方法中执行任何必要的清理，例如使定时器无效，取消网络请求或清理在componentDidMount（）中创建的任何监听。")]),t._v(" "),e("h3",{attrs:{id:"_11-componentdidcatch-error-info"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_11-componentdidcatch-error-info"}},[t._v("🌙")]),t._v(" 11.componentDidCatch(error, info)")]),t._v(" "),e("p",[e("em",[t._v("错误边界")]),t._v("是React组件，可以在其子组件树中的任何位置捕获JavaScript错误，记录这些错误并显示回退UI，而不是崩溃的组件树。错误边界在渲染期间，生命周期方法以及整个树下的构造函数中捕获错误。")]),t._v(" "),e("p",[t._v("如果类组件定义了此生命周期方法，则它将成为"),e("em",[t._v("错误边界")]),t._v("。在它中调用"),e("code",[t._v("setState()")]),t._v("可以让你在下面的树中捕获未处理的JavaScript错误，并显示一个后备UI。只能使用错误边界从意外异常中恢复;不要试图将它们用于控制流程。"),e("a",{attrs:{href:"https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("详细"),e("OutboundLink")],1)]),t._v(" "),e("p",[t._v("错误边界只会捕获树中下面组件中的错误。错误边界本身不能捕获错误。")]),t._v(" "),e("h2",{attrs:{id:"参考文档"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#参考文档"}},[t._v("🌙")]),t._v(" 参考文档")]),t._v(" "),e("ol",[e("li",[e("a",{attrs:{href:"https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes",target:"_blank",rel:"noopener noreferrer"}},[t._v("React v16.3.0: New lifecycles and context API"),e("OutboundLink")],1)]),t._v(" "),e("li",[e("a",{attrs:{href:"https://reactjs.org/docs/react-component.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("React.Component"),e("OutboundLink")],1)])])])}),[],!1,null,null,null);e.default=r.exports}}]);