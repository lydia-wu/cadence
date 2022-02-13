/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.spaces_bundle_jsonpfunction=window.spaces_bundle_jsonpfunction||[]).push([[7],{163:function(e,t,a){"use strict";a.r(t),a.d(t,"EmbeddableLegacyUrlConflictInternal",(function(){return d}));var s=a(2),n=a(1),i=a.n(n),l=a(16),c=a.n(l),o=a(3),r=a(10),u=a(0);const d=e=>{const{spacesManager:t,getStartServices:a,targetType:l,sourceId:d}=e,[g,b]=Object(n.useState)(!1),{value:p}=c()((async()=>{const[{docLinks:e}]=await a(),{id:s}=await t.getActiveSpace();return{docLink:e.links.spaces.kibanaDisableLegacyUrlAliasesApi,aliasJsonString:JSON.stringify({targetSpace:s,targetType:l,sourceId:d},null,2)}}),[a,t]),{docLink:j,aliasJsonString:f}=null!=p?p:{};return f&&j?Object(u.jsx)(i.a.Fragment,null,Object(u.jsx)(r.FormattedMessage,{id:"xpack.spaces.embeddableLegacyUrlConflict.messageText",defaultMessage:"We found 2 saved objects for this panel. Disable the legacy URL alias to fix this error."}),Object(u.jsx)(s.EuiSpacer,null),g?Object(u.jsx)(s.EuiTextAlign,{textAlign:"left"},Object(u.jsx)(s.EuiCallOut,{title:Object(u.jsx)(r.FormattedMessage,{id:"xpack.spaces.embeddableLegacyUrlConflict.calloutTitle",defaultMessage:"Copy this JSON and use it with the {documentationLink}",values:{documentationLink:Object(u.jsx)(s.EuiLink,{external:!0,href:j,target:"_blank"},"_disable_legacy_url_aliases API")}}),color:"danger",iconType:"alert"},Object(u.jsx)(s.EuiCodeBlock,{fontSize:"s",language:"json",isCopyable:!0,paddingSize:"none"},f))):Object(u.jsx)(s.EuiButtonEmpty,{onClick:()=>b(!0)},o.i18n.translate("xpack.spaces.embeddableLegacyUrlConflict.detailsButton",{defaultMessage:"View details"}))):null}}}]);