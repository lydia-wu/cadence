/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.savedObjectsTagging_bundle_jsonpfunction=window.savedObjectsTagging_bundle_jsonpfunction||[]).push([[1],{28:function(e,t,a){"use strict";var n,s=function(){return void 0===n&&(n=Boolean(window&&document&&document.all&&!window.atob)),n},i=function(){var e={};return function(t){if(void 0===e[t]){var a=document.querySelector(t);if(window.HTMLIFrameElement&&a instanceof window.HTMLIFrameElement)try{a=a.contentDocument.head}catch(e){a=null}e[t]=a}return e[t]}}(),o=[];function c(e){for(var t=-1,a=0;a<o.length;a++)if(o[a].identifier===e){t=a;break}return t}function l(e,t){for(var a={},n=[],s=0;s<e.length;s++){var i=e[s],l=t.base?i[0]+t.base:i[0],r=a[l]||0,g="".concat(l," ").concat(r);a[l]=r+1;var u=c(g),d={css:i[1],media:i[2],sourceMap:i[3]};-1!==u?(o[u].references++,o[u].updater(d)):o.push({identifier:g,updater:f(d,t),references:1}),n.push(g)}return n}function r(e){var t=document.createElement("style"),n=e.attributes||{};if(void 0===n.nonce){var s=a.nc;s&&(n.nonce=s)}if(Object.keys(n).forEach((function(e){t.setAttribute(e,n[e])})),"function"==typeof e.insert)e.insert(t);else{var o=i(e.insert||"head");if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(t)}return t}var g,u=(g=[],function(e,t){return g[e]=t,g.filter(Boolean).join("\n")});function d(e,t,a,n){var s=a?"":n.media?"@media ".concat(n.media," {").concat(n.css,"}"):n.css;if(e.styleSheet)e.styleSheet.cssText=u(t,s);else{var i=document.createTextNode(s),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(i,o[t]):e.appendChild(i)}}function b(e,t,a){var n=a.css,s=a.media,i=a.sourceMap;if(s?e.setAttribute("media",s):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(n+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}var p=null,m=0;function f(e,t){var a,n,s;if(t.singleton){var i=m++;a=p||(p=r(t)),n=d.bind(null,a,i,!1),s=d.bind(null,a,i,!0)}else a=r(t),n=b.bind(null,a,t),s=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(a)};return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else s()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=s());var a=l(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var n=0;n<a.length;n++){var s=c(a[n]);o[s].references--}for(var i=l(e,t),r=0;r<a.length;r++){var g=c(a[r]);0===o[g].references&&(o[g].updater(),o.splice(g,1))}a=i}}}},29:function(e,t,a){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var a=function(e,t){var a=e[1]||"",n=e[3];if(!n)return a;if(t&&"function"==typeof btoa){var s=(o=n,c=btoa(unescape(encodeURIComponent(JSON.stringify(o)))),l="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c),"/*# ".concat(l," */")),i=n.sources.map((function(e){return"/*# sourceURL=".concat(n.sourceRoot||"").concat(e," */")}));return[a].concat(i).concat([s]).join("\n")}var o,c,l;return[a].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(a,"}"):a})).join("")},t.i=function(e,a,n){"string"==typeof e&&(e=[[null,e,""]]);var s={};if(n)for(var i=0;i<this.length;i++){var o=this[i][0];null!=o&&(s[o]=!0)}for(var c=0;c<e.length;c++){var l=[].concat(e[c]);n&&s[l[0]]||(a&&(l[2]?l[2]="".concat(a," and ").concat(l[2]):l[2]=a),t.push(l))}},t}},32:function(e,t,a){switch(window.__kbnThemeTag__){case"v7dark":return a(33);case"v7light":return a(35);case"v8dark":return a(37);case"v8light":return a(39)}},33:function(e,t,a){var n=a(28),s=a(34);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[e.i,s,""]]);var i={insert:"head",singleton:!1};n(s,i);e.exports=s.locals||{}},34:function(e,t,a){(t=a(29)(!1)).push([e.i,".tagMgt__actionBar+.euiSpacer{display:none}.tagMgt__actionBarDivider{height:16px;border-right:1px solid #343741}.tagMgt__actionBar{border-bottom:1px solid #343741;padding-bottom:8px}.tagMgt__actionBarIcon{margin-left:4px}\n",""]),e.exports=t},35:function(e,t,a){var n=a(28),s=a(36);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[e.i,s,""]]);var i={insert:"head",singleton:!1};n(s,i);e.exports=s.locals||{}},36:function(e,t,a){(t=a(29)(!1)).push([e.i,".tagMgt__actionBar+.euiSpacer{display:none}.tagMgt__actionBarDivider{height:16px;border-right:1px solid #D3DAE6}.tagMgt__actionBar{border-bottom:1px solid #D3DAE6;padding-bottom:8px}.tagMgt__actionBarIcon{margin-left:4px}\n",""]),e.exports=t},37:function(e,t,a){var n=a(28),s=a(38);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[e.i,s,""]]);var i={insert:"head",singleton:!1};n(s,i);e.exports=s.locals||{}},38:function(e,t,a){(t=a(29)(!1)).push([e.i,".tagMgt__actionBar+.euiSpacer{display:none}.tagMgt__actionBarDivider{height:16px;border-right:1px solid #343741}.tagMgt__actionBar{border-bottom:1px solid #343741;padding-bottom:8px}.tagMgt__actionBarIcon{margin-left:4px}\n",""]),e.exports=t},39:function(e,t,a){var n=a(28),s=a(40);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[e.i,s,""]]);var i={insert:"head",singleton:!1};n(s,i);e.exports=s.locals||{}},40:function(e,t,a){(t=a(29)(!1)).push([e.i,".tagMgt__actionBar+.euiSpacer{display:none}.tagMgt__actionBarDivider{height:16px;border-right:1px solid #D3DAE6}.tagMgt__actionBar{border-bottom:1px solid #D3DAE6;padding-bottom:8px}.tagMgt__actionBarIcon{margin-left:4px}\n",""]),e.exports=t},41:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(22).__importDefault(a(42));t.default=function(e){n.default((function(){e()}))}},42:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(1);t.default=function(e){n.useEffect(e,[])}},54:function(e,t,a){"use strict";a.r(t),a.d(t,"mountSection",(function(){return D}));var n=a(1),s=a.n(n),i=a(27),o=a.n(i),c=a(10),l=a(13),r=a(14),g=a(41),u=a.n(g),d=a(2),b=a(6),p=a(19),m=a(0);const f=({canCreate:e,onCreate:t})=>Object(m.jsx)(d.EuiPageHeader,{pageTitle:Object(m.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.headerTitle",defaultMessage:"Tags"}),bottomBorder:!0,description:Object(m.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.headerDescription",defaultMessage:"Use tags to categorize and easily find your objects."}),rightSideItems:[e&&Object(m.jsx)(d.EuiButton,{key:"createTag",iconType:"tag",color:"primary",fill:!0,"data-test-subj":"createTagButton",onClick:t,isDisabled:!1},Object(m.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.actions.createTagButton",defaultMessage:"Create tag"}))]});var j=a(17);const v={initialPageSize:20,pageSizeOptions:[5,10,20,50]},h={sort:{field:"name",direction:"asc"}},x=({loading:e,capabilities:t,tags:a,initialQuery:s,allowSelection:i,onQueryChange:o,selectedTags:l,onSelectionChange:r,onShowRelations:g,getTagRelationUrl:u,actionBar:p,actions:f})=>{const x=Object(n.useRef)(null);Object(n.useEffect)((()=>{x.current&&x.current.setSelection(l)}),[l]);const T=[{field:"name",name:b.i18n.translate("xpack.savedObjectsTagging.management.table.columns.name",{defaultMessage:"Name"}),sortable:e=>e.name,"data-test-subj":"tagsTableRowName",render:(e,t)=>Object(m.jsx)(j.a,{tag:t})},{field:"description",name:b.i18n.translate("xpack.savedObjectsTagging.management.table.columns.description",{defaultMessage:"Description"}),sortable:!0,"data-test-subj":"tagsTableRowDescription"},{field:"relationCount",name:b.i18n.translate("xpack.savedObjectsTagging.management.table.columns.connections",{defaultMessage:"Connections"}),sortable:e=>e.relationCount,"data-test-subj":"tagsTableRowConnections",render:(e,a)=>{if(e<1)return;const n=Object(m.jsx)("span",{"data-test-subj":"tagsTableRowConnectionsText"},Object(m.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.table.content.connectionCount",defaultMessage:"{relationCount, plural, one {1 saved object} other {# saved objects}}",values:{relationCount:e}}));return t.viewConnections?Object(m.jsx)(d.EuiLink,{"data-test-subj":"tagsTableRowConnectionsLink",href:u(a),onClick:e=>{var t;(t=e).metaKey||t.altKey||t.ctrlKey||t.shiftKey||t.defaultPrevented||0!==e.button||(e.preventDefault(),g(a))}},n):n}},...f.length?[{name:b.i18n.translate("xpack.savedObjectsTagging.management.table.columns.actions",{defaultMessage:"Actions"}),width:"100px",actions:f}]:[]];return Object(m.jsx)(d.EuiInMemoryTable,{"data-test-subj":"tagsManagementTable",ref:x,childrenBetween:p,loading:e,itemId:"id",columns:T,items:a,pagination:v,sorting:h,tableCaption:b.i18n.translate("xpack.savedObjectsTagging.management.table.columns.caption",{defaultMessage:"Tags"}),rowHeader:"name",selection:i?{initialSelected:l,onSelectionChange:r}:void 0,search:{defaultQuery:s,onChange:({query:e})=>{o(e||void 0)},box:{"data-test-subj":"tagsManagementSearchBar",incremental:!0,schema:{fields:{name:{type:"string"},description:{type:"string"}}}}},rowProps:e=>({"data-test-subj":"tagsTableRow"})})};a(32);const T=({actions:e,onActionSelected:t,selectedCount:a,totalCount:i})=>{const[o,l]=Object(n.useState)(!1),r=Object(n.useCallback)((()=>{l(!1)}),[l]),g=Object(n.useCallback)((()=>{l((e=>!e))}),[l]),u=Object(n.useMemo)((()=>[{id:0,items:e.map((e=>((e,t,a)=>({name:e.label,icon:e.icon,onClick:()=>{a(),t(e)},"data-test-subj":`actionBar-button-${e.id}`}))(e,t,r)))}]),[e,t,r]);return Object(m.jsx)("div",{className:"tagMgt__actionBar"},Object(m.jsx)(d.EuiFlexGroup,{justifyContent:"flexStart",alignItems:"center",gutterSize:"m"},Object(m.jsx)(d.EuiFlexItem,{grow:!1},Object(m.jsx)(d.EuiText,{size:"xs",color:"subdued"},Object(m.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.actionBar.totalTagsLabel",defaultMessage:"{count, plural, one {1 tag} other {# tags}}",values:{count:i}}))),a>0&&Object(m.jsx)(s.a.Fragment,null,Object(m.jsx)(d.EuiFlexItem,{grow:!1},Object(m.jsx)("div",{className:"tagMgt__actionBarDivider"})),Object(m.jsx)(d.EuiFlexItem,{grow:!1},Object(m.jsx)(d.EuiPopover,{isOpen:o,closePopover:r,panelPaddingSize:"none",button:Object(m.jsx)(d.EuiText,{size:"xs"},Object(m.jsx)(d.EuiLink,{onClick:g,"data-test-subj":"actionBar-contextMenuButton"},Object(m.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.actionBar.selectedTagsLabel",defaultMessage:"{count, plural, one {1 selected tag} other {# selected tags}}",values:{count:a}}),Object(m.jsx)(d.EuiIcon,{className:"tagMgt__actionBarIcon",type:"arrowDown",size:"s"})))},Object(m.jsx)(d.EuiContextMenu,{initialPanelId:0,panels:u,"data-test-subj":"actionBar-contextMenu"}))))))};var O=a(18),y=a(16);const C=()=>Object(m.jsx)(d.EuiDelayRender,null,Object(m.jsx)(d.EuiLoadingSpinner,null)),M=s.a.lazy((()=>a.e(2).then(a.bind(null,55)).then((({AssignFlyout:e})=>({default:e}))))),S=({overlays:e,notifications:t,tagCache:a,assignmentService:n,assignableTypes:i})=>async({tagIds:o})=>{const c=e.openFlyout(Object(y.toMountPoint)(Object(m.jsx)(s.a.Suspense,{fallback:Object(m.jsx)(C,null)},Object(m.jsx)(M,{tagIds:o,tagCache:a,notifications:t,allowedTypes:i,assignmentService:n,onClose:()=>c.close()}))),{size:"m",maxWidth:600});return c},k=({core:{notifications:e,overlays:t},capabilities:a,tagClient:n,tagCache:s,assignmentService:i,setLoading:o,assignableTypes:c,fetchTags:l,canceled$:g})=>{const u=[];return a.edit&&u.push((({notifications:e,overlays:t,tagClient:a,fetchTags:n})=>{const s=Object(p.b)({overlays:t,tagClient:a});return{id:"edit",name:({name:e})=>b.i18n.translate("xpack.savedObjectsTagging.management.table.actions.edit.title",{defaultMessage:"Edit {name} tag",values:{name:e}}),isPrimary:!0,description:b.i18n.translate("xpack.savedObjectsTagging.management.table.actions.edit.description",{defaultMessage:"Edit this tag"}),type:"icon",icon:"pencil",onClick:t=>{s({tagId:t.id,onUpdate:t=>{n(),e.toasts.addSuccess({title:b.i18n.translate("xpack.savedObjectsTagging.notifications.editTagSuccessTitle",{defaultMessage:'Saved changes to "{name}" tag',values:{name:t.name}})})}})},"data-test-subj":"tagsTableAction-edit"}})({notifications:e,overlays:t,tagClient:n,fetchTags:l})),a.assign&&c.length>0&&u.push((({notifications:e,overlays:t,assignableTypes:a,assignmentService:n,tagCache:s,fetchTags:i,canceled$:o})=>{const c=S({overlays:t,notifications:e,tagCache:s,assignmentService:n,assignableTypes:a});return{id:"assign",name:({name:e})=>b.i18n.translate("xpack.savedObjectsTagging.management.table.actions.assign.title",{defaultMessage:"Manage {name} assignments",values:{name:e}}),description:b.i18n.translate("xpack.savedObjectsTagging.management.table.actions.assign.description",{defaultMessage:"Manage assignments"}),type:"icon",icon:"tag",onClick:async e=>{const t=await c({tagIds:[e.id]});o.pipe(Object(O.takeUntil)(Object(r.from)(t.onClose))).subscribe((()=>{t.close()})),await t.onClose,await i()},"data-test-subj":"tagsTableAction-assign"}})({tagCache:s,assignmentService:i,assignableTypes:c,fetchTags:l,notifications:e,overlays:t,canceled$:g})),a.delete&&u.push((({notifications:e,overlays:t,tagClient:a,fetchTags:n})=>({id:"delete",name:({name:e})=>b.i18n.translate("xpack.savedObjectsTagging.management.table.actions.delete.title",{defaultMessage:"Delete {name} tag",values:{name:e}}),description:b.i18n.translate("xpack.savedObjectsTagging.management.table.actions.delete.description",{defaultMessage:"Delete this tag"}),type:"icon",icon:"trash",onClick:async s=>{await t.openConfirm(b.i18n.translate("xpack.savedObjectsTagging.modals.confirmDelete.text",{defaultMessage:"By deleting this tag, you will no longer be able to assign it to saved objects. This tag will be removed from any saved objects that currently use it."}),{title:b.i18n.translate("xpack.savedObjectsTagging.modals.confirmDelete.title",{defaultMessage:'Delete "{name}" tag',values:{name:s.name}}),confirmButtonText:b.i18n.translate("xpack.savedObjectsTagging.modals.confirmDelete.confirmButtonText",{defaultMessage:"Delete tag"}),buttonColor:"danger",maxWidth:560})&&(await a.delete(s.id),e.toasts.addSuccess({title:b.i18n.translate("xpack.savedObjectsTagging.notifications.deleteTagSuccessTitle",{defaultMessage:'Deleted "{name}" tag',values:{name:s.name}})}),await n())},"data-test-subj":"tagsTableAction-delete"}))({overlays:t,notifications:e,tagClient:n,fetchTags:l})),u},_=({core:{notifications:e,overlays:t},capabilities:a,tagClient:n,tagCache:s,assignmentService:i,clearSelection:o,setLoading:c,assignableTypes:l})=>{const g=[];return a.assign&&l.length>0&&g.push((({overlays:e,notifications:t,tagCache:a,assignmentService:n,setLoading:s,assignableTypes:i})=>{const o=S({overlays:e,notifications:t,tagCache:a,assignmentService:n,assignableTypes:i});return{id:"assign",label:b.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkAssign.label",{defaultMessage:"Manage tag assignments"}),icon:"tag",refreshAfterExecute:!0,execute:async(e,{canceled$:t})=>{const a=await o({tagIds:e});return t.pipe(Object(O.takeUntil)(Object(r.from)(a.onClose))).subscribe((()=>{a.close()})),a.onClose}}})({notifications:e,overlays:t,tagCache:s,assignmentService:i,assignableTypes:l,setLoading:c})),a.delete&&g.push((({overlays:e,notifications:t,tagClient:a,setLoading:n})=>({id:"delete",label:b.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.label",{defaultMessage:"Delete"}),"aria-label":b.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.ariaLabel",{defaultMessage:"Delete selected tags"}),icon:"trash",refreshAfterExecute:!0,execute:async s=>{await e.openConfirm(b.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.confirm.text",{defaultMessage:"By deleting {count, plural, one {this tag} other {these tags}}, you will no longer be able to assign {count, plural, one {it} other {them}} to saved objects. {count, plural, one {This tag} other {These tags}} will be removed from any saved objects that currently use {count, plural, one {it} other {them}}.",values:{count:s.length}}),{title:b.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.confirm.title",{defaultMessage:"Delete {count, plural, one {1 tag} other {# tags}}",values:{count:s.length}}),confirmButtonText:b.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.confirm.confirmButtonText",{defaultMessage:"Delete {count, plural, one {tag} other {tags}}",values:{count:s.length}}),buttonColor:"danger",maxWidth:560})&&(n(!0),await a.bulkDelete(s),n(!1),t.toasts.addSuccess({title:b.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.notification.successTitle",{defaultMessage:"Deleted {count, plural, one {1 tag} other {# tags}}",values:{count:s.length}})}))}}))({notifications:e,overlays:t,tagClient:n,setLoading:c})),g.length>0&&g.push((({clearSelection:e})=>({id:"clear_selection",label:b.i18n.translate("xpack.savedObjectsTagging.management.actions.clearSelection.label",{defaultMessage:"Clear selection"}),icon:"cross",refreshAfterExecute:!0,execute:async()=>{e()}}))({clearSelection:o})),g},w=({setBreadcrumbs:e,core:t,tagClient:a,tagCache:i,assignmentService:o,capabilities:c,assignableTypes:l})=>{const{overlays:g,notifications:j,application:v,http:h}=t,[O,y]=Object(n.useState)(!1),[C,M]=Object(n.useState)([]),[S,w]=Object(n.useState)([]),[B,D]=Object(n.useState)(),E=Object(n.useMemo)((()=>B?d.Query.execute(B,C):C),[C,B]),A=Object(n.useMemo)((()=>new r.Subject),[]);Object(n.useEffect)((()=>()=>{A.next()}),[A]);const I=Object(n.useCallback)((async()=>{y(!0);const{tags:e}=await a.find({page:1,perPage:1e4});M(e),y(!1)}),[a]);u()((()=>{I()}));const L=Object(n.useMemo)((()=>Object(p.a)({overlays:g,tagClient:a})),[g,a]),R=Object(n.useMemo)((()=>k({core:t,capabilities:c,tagClient:a,tagCache:i,assignmentService:o,setLoading:y,assignableTypes:l,fetchTags:I,canceled$:A})),[t,c,a,i,o,y,l,I,A]),F=Object(n.useMemo)((()=>_({core:t,capabilities:c,tagClient:a,tagCache:i,assignmentService:o,setLoading:y,assignableTypes:l,clearSelection:()=>w([])})),[t,c,a,i,o,l]);Object(n.useEffect)((()=>{e([{text:b.i18n.translate("xpack.savedObjectsTagging.management.breadcrumb.index",{defaultMessage:"Tags"}),href:"/"}])}),[e]);const P=Object(n.useCallback)((()=>{L({onCreate:e=>{I(),j.toasts.addSuccess({title:b.i18n.translate("xpack.savedObjectsTagging.notifications.createTagSuccessTitle",{defaultMessage:'Created "{name}" tag',values:{name:e.name}})})}})}),[j,L,I]),N=Object(n.useCallback)((e=>((e,t)=>{const a=encodeURIComponent(`tag:("${e.name}")`);return t.prepend(`/app/management/kibana/objects?initialQuery=${a}`)})(e,h.basePath)),[h]),U=Object(n.useCallback)((e=>{v.navigateToUrl(N(e))}),[v,N]),z=Object(n.useCallback)((async e=>{try{await e.execute(S.map((({id:e})=>e)),{canceled$:A})}catch(e){j.toasts.addError(e,{title:b.i18n.translate("xpack.savedObjectsTagging.notifications.bulkActionError",{defaultMessage:"An error occurred"})})}finally{y(!1)}e.refreshAfterExecute&&await I()}),[S,I,j,A]),$=Object(n.useMemo)((()=>Object(m.jsx)(T,{actions:F,totalCount:E.length,selectedCount:S.length,onActionSelected:z})),[S,E,F,z]);return Object(m.jsx)(s.a.Fragment,null,Object(m.jsx)(f,{canCreate:c.create,onCreate:P}),Object(m.jsx)(d.EuiSpacer,{size:"l"}),Object(m.jsx)(x,{loading:O,tags:E,capabilities:c,actionBar:$,actions:R,initialQuery:B,onQueryChange:e=>{D(e),w([])},allowSelection:F.length>0,selectedTags:S,onSelectionChange:e=>{w(e)},getTagRelationUrl:N,onShowRelations:e=>{U(e)}}))},B=({applications:e,children:t})=>{var a,n,s,i;return null!==(a=null===(n=e.capabilities)||void 0===n||null===(s=n.management)||void 0===s||null===(i=s.kibana)||void 0===i?void 0:i.tags)&&void 0!==a&&a?t:(e.navigateToApp("home"),null)},D=async({tagClient:e,tagCache:t,assignmentService:a,core:n,mountParams:s,title:i})=>{const[r]=await n.getStartServices(),{element:g,setBreadcrumbs:u}=s,d=Object(l.a)(r.application.capabilities),b=await a.getAssignableTypes();return r.chrome.docTitle.change(i),o.a.render(Object(m.jsx)(c.I18nProvider,null,Object(m.jsx)(B,{applications:r.application},Object(m.jsx)(w,{setBreadcrumbs:u,core:r,tagClient:e,tagCache:t,assignmentService:a,capabilities:d,assignableTypes:b}))),g),()=>{r.chrome.docTitle.reset(),o.a.unmountComponentAtNode(g)}}}}]);