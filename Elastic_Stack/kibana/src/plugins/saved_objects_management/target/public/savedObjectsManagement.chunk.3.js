(window.savedObjectsManagement_bundle_jsonpfunction=window.savedObjectsManagement_bundle_jsonpfunction||[]).push([[3],{40:function(e,t,n){"use strict";n.r(t),n.d(t,"mountManagementSection",(function(){return O}));var s=n(6),a=n(17),c=n.n(a),i=n(15),l=n(14),o=n(1),r=n(13),u=n(7),j=n(3);let b;const d=o.i18n.translate("savedObjectsManagement.objects.savedObjectsTitle",{defaultMessage:"Saved Objects"}),g=Object(s.lazy)((()=>n.e(2).then(n.bind(null,39)))),p=Object(s.lazy)((()=>n.e(1).then(n.bind(null,38)))),O=async({core:e,mountParams:t,serviceRegistry:n})=>{const[a,{data:o,savedObjectsTaggingOss:O,spaces:m},v]=await e.getStartServices(),{capabilities:h}=a.application,{element:x,history:y,setBreadcrumbs:S}=t;b||(b=await Object(u.getAllowedTypes)(a.http)),a.chrome.docTitle.change(d);const w=({children:e})=>{var t,n,s;return null!==(t=null==h||null===(n=h.management)||void 0===n||null===(s=n.kibana)||void 0===s?void 0:s.objects)&&void 0!==t&&t?e:(a.application.navigateToApp("home"),null)};return c.a.render(Object(j.jsx)(l.I18nProvider,null,Object(j.jsx)(i.Router,{history:y},Object(j.jsx)(i.Switch,null,Object(j.jsx)(i.Route,{path:"/:service/:id",exact:!0},Object(j.jsx)(w,null,Object(j.jsx)(s.Suspense,{fallback:Object(j.jsx)(r.EuiLoadingSpinner,null)},Object(j.jsx)(g,{coreStart:a,serviceRegistry:n,setBreadcrumbs:S,history:y})))),Object(j.jsx)(i.Route,{path:"/",exact:!1},Object(j.jsx)(w,null,Object(j.jsx)(s.Suspense,{fallback:Object(j.jsx)(r.EuiLoadingSpinner,null)},Object(j.jsx)(p,{coreStart:a,taggingApi:null==O?void 0:O.getTaggingApi(),spacesApi:m,dataStart:o,serviceRegistry:n,actionRegistry:v.actions,columnRegistry:v.columns,allowedTypes:b,setBreadcrumbs:S}))))))),x),()=>{a.chrome.docTitle.reset(),c.a.unmountComponentAtNode(x)}}}}]);