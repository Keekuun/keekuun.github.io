(window.webpackJsonp=window.webpackJsonp||[]).push([[49],{391:function(e,t,n){"use strict";n.d(t,"a",(function(){return a})),n.d(t,"b",(function(){return c}));n(162);var r=n(1);function a(){const e=Object(r.getCurrentInstance)();if(!e)throw new Error("must be called in setup");return(null==e?void 0:e.proxy)||{}}function c(){const e=Object(r.ref)(!1);return Object(r.onMounted)(()=>{e.value=!0}),Object(r.onUpdated)(()=>{e.value=!1,setTimeout(()=>{e.value=!0},100)}),{recoShowModule:e}}},410:function(e,t,n){},427:function(e,t,n){"use strict";n(410)},431:function(e,t,n){"use strict";n.r(t);var r=n(1),a=n(59),c=n(391),o=Object(r.defineComponent)({props:{currentTag:{type:String,default:""}},setup(e,t){const n=Object(c.a)();return{tags:Object(r.computed)(()=>[{name:n.$recoLocales.all,path:"/tag/"},...n.$tagesList]),tagClick:e=>{t.emit("getCurrentTag",e)},getOneColor:a.b}}}),s=(n(427),n(2)),u=Object(s.a)(o,(function(){var e=this,t=e._self._c;e._self._setupProxy;return t("div",{staticClass:"tags"},e._l(e.tags,(function(n,r){return t("span",{directives:[{name:"show",rawName:"v-show",value:!n.pages||n.pages&&n.pages.length>0,expression:"!item.pages || (item.pages && item.pages.length > 0)"}],key:r,class:{active:n.name==e.currentTag},style:{backgroundColor:e.getOneColor()},on:{click:function(t){return e.tagClick(n)}}},[e._v(e._s(n.name))])})),0)}),[],!1,null,"cbf58c6c",null);t.default=u.exports}}]);