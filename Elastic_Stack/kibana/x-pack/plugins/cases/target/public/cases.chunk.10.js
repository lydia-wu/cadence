/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.cases_bundle_jsonpfunction=window.cases_bundle_jsonpfunction||[]).push([[10],{182:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return j}));var a=n(2),r=n.n(a),s=n(21),i=n(6),o=n(14),c=n(3),l=n(20),u=n(22),d=n(61);const b=({http:e,connector:t,toastNotifications:n,handleIssueType:r})=>{const[s,i]=Object(a.useState)(!0),[c,l]=Object(a.useState)([]),b=Object(a.useRef)(!1),p=Object(a.useRef)(new AbortController);return Object(a.useEffect)((()=>(b.current=!1,p.current.abort(),(async()=>{if(t)try{p.current=new AbortController,i(!0);const f=await async function({http:e,signal:t,connectorId:n}){const a=await e.post(Object(u.d)(n),{body:JSON.stringify({params:{subAction:"issueTypes",subActionParams:{}}}),signal:t});return Object(d.a)(a)}({http:e,signal:p.current.signal,connectorId:t.id});if(!b.current){var a,s;const e=(null!==(a=f.data)&&void 0!==a?a:[]).map((e=>{var t,n;return{text:null!==(t=e.name)&&void 0!==t?t:"",value:null!==(n=e.id)&&void 0!==n?n:""}}));var c;if(l(null!==(s=f.data)&&void 0!==s?s:[]),r(e),i(!1),f.status&&"error"===f.status)n.addDanger({title:o.e,text:`${null!==(c=f.serviceMessage)&&void 0!==c?c:f.message}`})}}catch(e){b.current||(i(!1),"AbortError"!==e.name&&n.addDanger({title:o.e,text:e.message}))}else i(!1)})(),()=>{b.current=!0,p.current.abort()})),[e,t,n]),{issueTypes:c,isLoading:s}},p=({http:e,toastNotifications:t,connector:n,issueType:r})=>{const[s,i]=Object(a.useState)(!0),[c,l]=Object(a.useState)({}),b=Object(a.useRef)(!1),p=Object(a.useRef)(new AbortController);return Object(a.useEffect)((()=>(b.current=!1,p.current.abort(),(async()=>{if(n&&r)try{p.current=new AbortController,i(!0);const c=await async function({http:e,signal:t,connectorId:n,id:a}){const r=await e.post(Object(u.d)(n),{body:JSON.stringify({params:{subAction:"fieldsByIssueType",subActionParams:{id:a}}}),signal:t});return Object(d.a)(r)}({http:e,signal:p.current.signal,connectorId:n.id,id:r});var a,s;if(!b.current)if(l(null!==(a=c.data)&&void 0!==a?a:{}),i(!1),c.status&&"error"===c.status)t.addDanger({title:o.a,text:`${null!==(s=c.serviceMessage)&&void 0!==s?s:c.message}`})}catch(e){b.current||(i(!1),"AbortError"!==e.name&&t.addDanger({title:o.a,text:e.message}))}else i(!1)})(),()=>{b.current=!0,p.current.abort()})),[e,n,r,t]),{isLoading:s,fields:c}},f=({http:e,actionConnector:t,toastNotifications:n,query:r})=>{const[i,c]=Object(a.useState)(!1),[l,b]=Object(a.useState)([]),p=Object(a.useRef)(!1),f=Object(a.useRef)(new AbortController);return Object(a.useEffect)((()=>{const a=Object(s.debounce)(500,(async()=>{if(t&&!Object(s.isEmpty)(r))try{f.current=new AbortController,c(!0);const s=await async function({http:e,signal:t,connectorId:n,title:a}){const r=await e.post(Object(u.d)(n),{body:JSON.stringify({params:{subAction:"issues",subActionParams:{title:a}}}),signal:t});return Object(d.a)(r)}({http:e,signal:f.current.signal,connectorId:t.id,title:null!=r?r:""});var a,i;if(!p.current)if(c(!1),b(null!==(a=s.data)&&void 0!==a?a:[]),s.status&&"error"===s.status)n.addDanger({title:o.c,text:`${null!==(i=s.serviceMessage)&&void 0!==i?i:s.message}`})}catch(e){p.current||(c(!1),"AbortError"!==e.name&&n.addDanger({title:o.c,text:e.message}))}else c(!1)}));return p.current=!1,f.current.abort(),a(),()=>{p.current=!0,f.current.abort()}}),[e,t,n,r]),{issues:l,isLoading:i}},m=({http:e,toastNotifications:t,actionConnector:n,id:r})=>{const[s,i]=Object(a.useState)(!1),[c,l]=Object(a.useState)(null),b=Object(a.useRef)(!1),p=Object(a.useRef)(new AbortController);return Object(a.useEffect)((()=>(b.current=!1,p.current.abort(),(async()=>{if(n&&r){p.current=new AbortController,i(!0);try{const c=await async function({http:e,signal:t,connectorId:n,id:a}){const r=await e.post(Object(u.d)(n),{body:JSON.stringify({params:{subAction:"issue",subActionParams:{id:a}}}),signal:t});return Object(d.a)(r)}({http:e,signal:p.current.signal,connectorId:n.id,id:r});var a,s;if(!b.current)if(i(!1),l(null!==(a=c.data)&&void 0!==a?a:null),c.status&&"error"===c.status)t.addDanger({title:o.b(r),text:`${null!==(s=c.serviceMessage)&&void 0!==s?s:c.message}`})}catch(e){b.current||(i(!1),"AbortError"!==e.name&&t.addDanger({title:o.b(r),text:e.message}))}}else i(!1)})(),()=>{b.current=!0,p.current.abort()})),[e,n,r,t]),{isLoading:s,issue:c}},g=({selectedValue:e,actionConnector:t,onChange:n})=>{const[s,c]=Object(a.useState)(null),[u,d]=Object(a.useState)([]),[b,p]=Object(a.useState)([]),{http:g,notifications:y}=Object(l.d)().services,{isLoading:v,issues:j}=f({http:g,toastNotifications:y.toasts,actionConnector:t,query:s}),{isLoading:O,issue:E}=m({http:g,toastNotifications:y.toasts,actionConnector:t,id:e});Object(a.useEffect)((()=>p(j.map((e=>({label:e.title,value:e.key}))))),[j]),Object(a.useEffect)((()=>{if(O||null==E)return;const e=[{label:E.title,value:E.key}];p(e),d(e)}),[E,O]);const h=Object(a.useCallback)((e=>{c(e)}),[]),C=Object(a.useCallback)((e=>{d(e),n(e[0].value)}),[n]),w=Object(a.useMemo)((()=>v||O?o.i:o.j),[v,O]);return r.a.createElement(i.EuiComboBox,{singleSelection:!0,fullWidth:!0,placeholder:w,"data-test-subj":"search-parent-issues","aria-label":o.h,options:b,isLoading:v||O,onSearchChange:h,selectedOptions:u,onChange:C})},y=Object(a.memo)(g);var v=n(56);const j=({connector:e,fields:t,isEdit:n=!0,onChange:u})=>{const d=Object(a.useRef)(!0),{issueType:f=null,priority:m=null,parent:g=null}=null!=t?t:{},{http:j,notifications:O}=Object(l.d)().services,E=Object(a.useCallback)((e=>{null==f&&e.length>0&&n&&u({issueType:e[0].value,parent:g,priority:m})}),[n,f,u,g,m]),{isLoading:h,issueTypes:C}=b({connector:e,http:j,toastNotifications:O.toasts,handleIssueType:E}),w=Object(a.useMemo)((()=>C.map((e=>{var t,n;return{text:null!==(t=e.name)&&void 0!==t?t:"",value:null!==(n=e.id)&&void 0!==n?n:""}}))),[C]),T=Object(a.useMemo)((()=>!f&&w.length>0||w.length>0&&!w.some((({value:e})=>e===f))?w[0].value:f),[f,w]),{isLoading:S,fields:I}=p({connector:e,http:j,issueType:T,toastNotifications:O.toasts}),A=Object(a.useMemo)((()=>null!=I.priority),[I]),x=Object(a.useMemo)((()=>null!=I.parent),[I]),N=Object(a.useMemo)((()=>{var e,t;const n=null!==(e=null===(t=I.priority)||void 0===t?void 0:t.allowedValues)&&void 0!==e?e:[];return Object(s.map)((e=>({text:e.name,value:e.name})),n)}),[I]),M=Object(a.useMemo)((()=>{var e,t;return[...null!=f&&f.length>0?[{title:o.d,description:null!==(e=null===(t=C.find((e=>e.id===f)))||void 0===t?void 0:t.name)&&void 0!==e?e:""}]:[],...null!=g&&g.length>0?[{title:o.f,description:g}]:[],...null!=m&&m.length>0?[{title:o.g,description:m}]:[]]}),[f,C,g,m]),R=Object(a.useCallback)(((e,n)=>u("issueType"===e?{...t,issueType:n,priority:null,parent:null}:{...t,issueType:T,parent:g,priority:m,[e]:n})),[T,t,u,g,m]);return Object(a.useEffect)((()=>{d.current&&(d.current=!1,u({issueType:f,priority:m,parent:g}))}),[f,u,g,m]),n?r.a.createElement("div",{"data-test-subj":"connector-fields-jira"},r.a.createElement(i.EuiFormRow,{fullWidth:!0,label:o.d},r.a.createElement(i.EuiSelect,{"data-test-subj":"issueTypeSelect",disabled:h||S,fullWidth:!0,isLoading:h,onChange:e=>R("issueType",e.target.value),options:w,value:null!=T?T:""})),r.a.createElement(i.EuiSpacer,{size:"m"}),r.a.createElement(r.a.Fragment,null,x&&r.a.createElement(r.a.Fragment,null,r.a.createElement(i.EuiFlexGroup,null,r.a.createElement(i.EuiFlexItem,null,r.a.createElement(i.EuiFormRow,{fullWidth:!0,label:o.f},r.a.createElement(y,{actionConnector:e,onChange:e=>R("parent",e),selectedValue:g})))),r.a.createElement(i.EuiSpacer,{size:"m"})),A&&r.a.createElement(r.a.Fragment,null,r.a.createElement(i.EuiFlexGroup,null,r.a.createElement(i.EuiFlexItem,null,r.a.createElement(i.EuiFormRow,{fullWidth:!0,label:o.g},r.a.createElement(i.EuiSelect,{"data-test-subj":"prioritySelect",disabled:h||S,fullWidth:!0,hasNoInitialSelection:!0,isLoading:S,onChange:e=>R("priority",e.target.value),options:N,value:null!=m?m:""}))))))):r.a.createElement(v.a,{connectorType:c.ConnectorTypes.jira,isLoading:h||S,listItems:M,title:e.name})}},47:function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"c",(function(){return c})),n.d(t,"b",(function(){return l})),n.d(t,"d",(function(){return u}));var a=n(3),r=n(51),s=n(49);const i=(e,t)=>{var n;return null!==(n=t.find((t=>t.id===e)))&&void 0!==n?n:null},o={[a.ConnectorTypes.swimlane]:r.a,[a.ConnectorTypes.serviceNowITSM]:s.a,[a.ConnectorTypes.serviceNowSIR]:s.a},c=({connectors:e=[],config:t={}})=>({...t,validations:[{validator:({value:t})=>{const n=i(t,e);var a;if(null!=n)return null===(a=o[n.actionTypeId])||void 0===a?void 0:a.call(o,n)}}]}),l=(e,t)=>{if(null==t)return"";try{if(e.actionTypeRegistry.has(t))return e.actionTypeRegistry.get(t).iconClass}catch{return""}return""},u=e=>null!=e&&((".servicenow"===e.actionTypeId||".servicenow-sir"===e.actionTypeId)&&!!e.config.usesTableApi)},49:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));const a=e=>{const{config:{usesTableApi:t}}=e;if(t)return{message:"Deprecated connector"}}},51:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var a=n(3);const r=["caseIdConfig","caseNameConfig","descriptionConfig","commentsConfig"],s=e=>{const{config:{mappings:t,connectorType:n}}=e;if(n===a.SwimlaneConnectorType.Alerts||(s=t,r.some((e=>null==(null==s?void 0:s[e])))))return{message:"Invalid connector"};var s}},56:function(e,t,n){"use strict";n.d(t,"a",(function(){return b}));var a=n(2),r=n.n(a),s=n(6),i=n(33),o=n.n(i),c=n(20),l=n(47);const u=o.a.span.withConfig({displayName:"StyledText",componentId:"sc-10fyrf5-0"})(["span{display:block;}"]),d=({connectorType:e,title:t,listItems:n,isLoading:i})=>{const{triggersActionsUi:o}=Object(c.d)().services,d=Object(a.useMemo)((()=>r.a.createElement(u,null,n.length>0&&n.map(((e,t)=>r.a.createElement("span",{"data-test-subj":"card-list-item",key:`${e.title}-${t}`},r.a.createElement("strong",null,`${e.title}: `),e.description))))),[n]),b=Object(a.useMemo)((()=>r.a.createElement(s.EuiIcon,{size:"xl",type:Object(l.b)(o,e)})),[e]);return r.a.createElement(r.a.Fragment,null,i&&r.a.createElement(s.EuiLoadingSpinner,{"data-test-subj":"connector-card-loading"}),!i&&r.a.createElement(s.EuiFlexGroup,{direction:"row"},r.a.createElement(s.EuiFlexItem,null,r.a.createElement(s.EuiCard,{"data-test-subj":"connector-card",description:d,display:"plain",layout:"horizontal",paddingSize:"none",title:t,titleSize:"xs"})),r.a.createElement(s.EuiFlexItem,{grow:!1},b)))},b=Object(a.memo)(d)},61:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));const a=({connector_id:e,service_message:t,...n})=>({...n,actionId:e,...t&&{serviceMessage:t}})}}]);