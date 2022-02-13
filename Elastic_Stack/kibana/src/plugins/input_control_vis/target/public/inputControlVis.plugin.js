!function(t){function e(e){for(var n,r,i=e[0],s=e[1],u=0,l=[];u<i.length;u++)r=i[u],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&l.push(o[r][0]),o[r]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(t[n]=s[n]);for(a&&a(e);l.length;)l.shift()()}var n={},o={0:0};function r(e){if(n[e])return n[e].exports;var o=n[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.e=function(t){var e=[],n=o[t];if(0!==n)if(n)e.push(n[2]);else{var i=new Promise((function(e,r){n=o[t]=[e,r]}));e.push(n[2]=i);var s,u=document.createElement("script");u.charset="utf-8",u.timeout=120,r.nc&&u.setAttribute("nonce",r.nc),u.src=function(t){return r.p+"inputControlVis.chunk."+t+".js"}(t);var a=new Error;s=function(e){u.onerror=u.onload=null,clearTimeout(l);var n=o[t];if(0!==n){if(n){var r=e&&("load"===e.type?"missing":e.type),i=e&&e.target&&e.target.src;a.message="Loading chunk "+t+" failed.\n("+r+": "+i+")",a.name="ChunkLoadError",a.type=r,a.request=i,n[1](a)}o[t]=void 0}};var l=setTimeout((function(){s({type:"timeout",target:u})}),12e4);u.onerror=u.onload=s,document.head.appendChild(u)}return Promise.all(e)},r.m=t,r.c=n,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r.oe=function(t){throw console.error(t),t};var i=window.inputControlVis_bundle_jsonpfunction=window.inputControlVis_bundle_jsonpfunction||[],s=i.push.bind(i);i.push=e,i=i.slice();for(var u=0;u<i.length;u++)e(i[u]);var a=s;r(r.s=7)}([function(t,e){t.exports=__kbnSharedDeps__.KbnI18n},function(t,e){t.exports=__kbnSharedDeps__.React},function(t,e){t.exports=__kbnSharedDeps__.EmotionReact},function(t,e,n){n.r(e);var o=__kbnBundles__.get("plugin/expressions/public");Object.defineProperties(e,Object.getOwnPropertyDescriptors(o))},function(t,e,n){n.r(e);var o=__kbnBundles__.get("plugin/visualizations/public");Object.defineProperties(e,Object.getOwnPropertyDescriptors(o))},function(t,e,n){t.exports=n(6)(1074)},function(t,e){t.exports=__kbnSharedDeps_npm__},function(t,e,n){n(8),__kbnBundles__.define("plugin/inputControlVis/public",n,9)},function(t,e,n){n.p=window.__kbnPublicPath__.inputControlVis},function(t,e,n){"use strict";n.r(e),n.d(e,"plugin",(function(){return v}));var o=n(0);const r=()=>({name:"input_control_vis",type:"render",inputTypes:[],help:o.i18n.translate("inputControl.function.help",{defaultMessage:"Input control visualization"}),args:{visConfig:{types:["string"],default:'"{}"',help:""}},fn:(t,e)=>({type:"render",as:"input_control_vis",value:{visType:"input_control_vis",visConfig:JSON.parse(e.visConfig)}})}),i=new Map;var s=n(4),u=n(5),a=n.n(u),l=n(1),c=n(2);const p=Object(l.lazy)((()=>n.e(2).then(n.bind(null,52)))),d=Object(l.lazy)((()=>n.e(3).then(n.bind(null,50)))),f=t=>Object(c.jsx)(d,t);var _=n(3);const b=t=>{const e=Object(_.buildExpressionFunction)("input_control_vis",{visConfig:JSON.stringify(t.params)});return Object(_.buildExpression)([e]).toAst()};function g(t){const e=(t=>e=>Object(c.jsx)(p,a()({},e,{deps:t})))(t);return{name:"input_control_vis",title:o.i18n.translate("inputControl.register.controlsTitle",{defaultMessage:"Controls"}),icon:"controlsHorizontal",group:s.VisGroups.TOOLS,description:o.i18n.translate("inputControl.register.controlsDescription",{defaultMessage:"Add dropdown menus and range sliders to your dashboard."}),stage:"experimental",visConfig:{defaults:{controls:[],updateFiltersOnChange:!1,useTimeFilter:!1,pinFilters:!1}},editorConfig:{optionTabs:[{name:"controls",title:o.i18n.translate("inputControl.register.tabs.controlsTitle",{defaultMessage:"Controls"}),editor:e},{name:"options",title:o.i18n.translate("inputControl.register.tabs.optionsTitle",{defaultMessage:"Options"}),editor:f}]},inspectorAdapters:{},toExpressionAst:b}}class plugin_InputControlVisPlugin{constructor(t){this.initializerContext=t}setup(t,{expressions:e,visualizations:o,data:s}){const u={core:t,data:s,getSettings:async()=>{const{timeout:t,terminateAfter:e}=s.autocomplete.getAutocompleteSettings();return{autocompleteTimeout:t,autocompleteTerminateAfter:e}}};var a;e.registerFunction(r),e.registerRenderer((a=u,{name:"input_control_vis",reuseDomNode:!0,render:async(t,{visConfig:e},o)=>{let r=i.get(t);if(!r){const{createInputControlVisController:e}=await n.e(1).then(n.bind(null,51));r=e(a,o,t),i.set(t,r),o.onDestroy((()=>{var e;null===(e=r)||void 0===e||e.destroy(),i.delete(t)}))}await r.render(e),o.done()}})),o.createBaseVisualization(g(u))}start(t,e){}}function v(t){return new plugin_InputControlVisPlugin(t)}},function(t,e){t.exports=__kbnSharedDeps__.Lodash},function(t,e){t.exports=__kbnSharedDeps__.ElasticEui},function(t,e){t.exports=__kbnSharedDeps__.KbnI18nReact},function(t,e){t.exports=__kbnSharedDeps__.ReactDom},function(t,e,n){n.r(e);var o=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(e,Object.getOwnPropertyDescriptors(o))},function(t,e){t.exports=__kbnSharedDeps__.MomentTimezone}]);