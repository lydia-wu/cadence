/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.triggersActionsUi_bundle_jsonpfunction=window.triggersActionsUi_bundle_jsonpfunction||[]).push([[42,16],{272:function(e,t,i){"use strict";i.r(t),i.d(t,"default",(function(){return o}));var n=i(1),s=i.n(n),r=i(13),l=i(93),a=i(72),c=i(5);const o=({action:e,editActionSecrets:t,editActionConfig:i,errors:o,readOnly:u})=>{var d;const{apiUrl:p,orgId:g}=e.config,I=void 0!==p&&void 0!==o.apiUrl&&o.apiUrl.length>0,{apiKeyId:E,apiKeySecret:b}=e.secrets,j=void 0!==g&&void 0!==o.orgId&&o.orgId.length>0,x=void 0!==E&&void 0!==o.apiKeyId&&o.apiKeyId.length>0,A=void 0!==b&&void 0!==o.apiKeySecret&&o.apiKeySecret.length>0,m=Object(n.useCallback)(((e,t)=>i(e,t)),[i]),f=Object(n.useCallback)(((e,i)=>t(e,i)),[t]);return Object(c.jsx)(s.a.Fragment,null,Object(c.jsx)(r.EuiFlexGroup,null,Object(c.jsx)(r.EuiFlexItem,null,Object(c.jsx)(r.EuiFormRow,{id:"apiUrl",fullWidth:!0,error:o.apiUrl,isInvalid:I,label:l.API_URL_LABEL},Object(c.jsx)(r.EuiFieldText,{fullWidth:!0,isInvalid:I,name:"apiUrl",readOnly:u,value:p||"","data-test-subj":"apiUrlFromInput",onChange:e=>m("apiUrl",e.target.value),onBlur:()=>{p||i("apiUrl","")}})))),Object(c.jsx)(r.EuiSpacer,{size:"m"}),Object(c.jsx)(r.EuiFlexGroup,null,Object(c.jsx)(r.EuiFlexItem,null,Object(c.jsx)(r.EuiFormRow,{id:"connector-resilient-orgId-key",fullWidth:!0,error:o.orgId,isInvalid:j,label:l.ORG_ID_LABEL},Object(c.jsx)(r.EuiFieldText,{fullWidth:!0,isInvalid:j,name:"connector-resilient-orgId",value:g||"","data-test-subj":"connector-resilient-orgId-form-input",onChange:e=>m("orgId",e.target.value),onBlur:()=>{g||i("orgId","")}})))),Object(c.jsx)(r.EuiSpacer,{size:"m"}),Object(c.jsx)(r.EuiFlexGroup,null,Object(c.jsx)(r.EuiFlexItem,null,Object(c.jsx)(r.EuiTitle,{size:"xxs"},Object(c.jsx)("h4",null,l.API_KEY_LABEL)))),Object(c.jsx)(r.EuiSpacer,{size:"m"}),Object(c.jsx)(r.EuiFlexGroup,null,Object(c.jsx)(r.EuiFlexItem,null,Object(c.jsx)(r.EuiFormRow,{fullWidth:!0},Object(a.a)(!e.id,2,null!==(d=e.isMissingSecrets)&&void 0!==d&&d,l.REENTER_VALUES_LABEL)))),Object(c.jsx)(r.EuiSpacer,{size:"m"}),Object(c.jsx)(r.EuiFlexGroup,null,Object(c.jsx)(r.EuiFlexItem,null,Object(c.jsx)(r.EuiFormRow,{id:"connector-resilient-apiKeyId",fullWidth:!0,error:o.apiKeyId,isInvalid:x,label:l.API_KEY_ID_LABEL},Object(c.jsx)(r.EuiFieldText,{fullWidth:!0,isInvalid:x,readOnly:u,name:"connector-resilient-apiKeyId",value:E||"","data-test-subj":"connector-resilient-apiKeyId-form-input",onChange:e=>f("apiKeyId",e.target.value),onBlur:()=>{E||t("apiKeyId","")}})))),Object(c.jsx)(r.EuiSpacer,{size:"m"}),Object(c.jsx)(r.EuiFlexGroup,null,Object(c.jsx)(r.EuiFlexItem,null,Object(c.jsx)(r.EuiFormRow,{id:"connector-resilient-apiKeySecret",fullWidth:!0,error:o.apiKeySecret,isInvalid:A,label:l.API_KEY_SECRET_LABEL},Object(c.jsx)(r.EuiFieldPassword,{fullWidth:!0,readOnly:u,isInvalid:A,name:"connector-resilient-apiKeySecret",value:b||"","data-test-subj":"connector-resilient-apiKeySecret-form-input",onChange:e=>f("apiKeySecret",e.target.value),onBlur:()=>{b||t("apiKeySecret","")}})))))}},72:function(e,t,i){"use strict";i.d(t,"a",(function(){return o}));var n=i(13),s=i(0),r=i(1),l=i.n(r),a=i(36),c=i(5);const o=(e,t,i,r)=>i?Object(c.jsx)(l.a.Fragment,null,Object(c.jsx)(n.EuiSpacer,{size:"m"}),Object(c.jsx)(n.EuiCallOut,{size:"s",color:"warning",iconType:"alert","data-test-subj":"missingSecretsMessage",title:s.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.missingSecretsValuesLabel",{defaultMessage:"Sensitive information is not imported. Please enter value{encryptedFieldsLength, plural, one {} other {s}} for the following field{encryptedFieldsLength, plural, one {} other {s}}.",values:{encryptedFieldsLength:t}})}),Object(c.jsx)(n.EuiSpacer,{size:"m"})):e?Object(c.jsx)(l.a.Fragment,null,Object(c.jsx)(n.EuiSpacer,{size:"s"}),Object(c.jsx)(n.EuiText,{size:"s","data-test-subj":"rememberValuesMessage"},Object(c.jsx)(a.FormattedMessage,{id:"xpack.triggersActionsUI.components.builtinActionTypes.rememberValueLabel",defaultMessage:"Remember {encryptedFieldsLength, plural, one {this} other {these}} value. You must reenter {encryptedFieldsLength, plural, one {it} other {them}} each time you edit the connector.",values:{encryptedFieldsLength:t}})),Object(c.jsx)(n.EuiSpacer,{size:"s"})):Object(c.jsx)(l.a.Fragment,null,Object(c.jsx)(n.EuiSpacer,{size:"s"}),Object(c.jsx)(n.EuiCallOut,{size:"s",iconType:"iInCircle","data-test-subj":"reenterValuesMessage",title:r}),Object(c.jsx)(n.EuiSpacer,{size:"m"}))},93:function(e,t,i){"use strict";i.r(t),i.d(t,"API_URL_LABEL",(function(){return s})),i.d(t,"API_URL_REQUIRED",(function(){return r})),i.d(t,"API_URL_INVALID",(function(){return l})),i.d(t,"API_URL_REQUIRE_HTTPS",(function(){return a})),i.d(t,"ORG_ID_LABEL",(function(){return c})),i.d(t,"ORG_ID_REQUIRED",(function(){return o})),i.d(t,"API_KEY_LABEL",(function(){return u})),i.d(t,"REMEMBER_VALUES_LABEL",(function(){return d})),i.d(t,"REENTER_VALUES_LABEL",(function(){return p})),i.d(t,"API_KEY_ID_LABEL",(function(){return g})),i.d(t,"API_KEY_ID_REQUIRED",(function(){return I})),i.d(t,"API_KEY_SECRET_LABEL",(function(){return E})),i.d(t,"API_KEY_SECRET_REQUIRED",(function(){return b})),i.d(t,"MAPPING_FIELD_NAME",(function(){return j})),i.d(t,"MAPPING_FIELD_DESC",(function(){return x})),i.d(t,"MAPPING_FIELD_COMMENTS",(function(){return A})),i.d(t,"DESCRIPTION_REQUIRED",(function(){return m})),i.d(t,"NAME_REQUIRED",(function(){return f})),i.d(t,"INCIDENT_TYPES_API_ERROR",(function(){return y})),i.d(t,"SEVERITY_API_ERROR",(function(){return _}));var n=i(0);const s=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.apiUrlTextFieldLabel",{defaultMessage:"URL"}),r=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.requiredApiUrlTextField",{defaultMessage:"URL is required."}),l=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.invalidApiUrlTextField",{defaultMessage:"URL is invalid."}),a=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.requireHttpsApiUrlTextField",{defaultMessage:"URL must start with https://."}),c=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.orgId",{defaultMessage:"Organization ID"}),o=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.requiredOrgIdTextField",{defaultMessage:"Organization ID is required"}),u=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.apiKey",{defaultMessage:"API key"}),d=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.rememberValuesLabel",{defaultMessage:"Remember these values. You must reenter them each time you edit the connector."}),p=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.reenterValuesLabel",{defaultMessage:"ID and secret are encrypted. Please reenter values for these fields."}),g=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.apiKeyId",{defaultMessage:"ID"}),I=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.requiredApiKeyIdTextField",{defaultMessage:"ID is required"}),E=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.apiKeySecret",{defaultMessage:"Secret"}),b=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.requiredApiKeySecretTextField",{defaultMessage:"Secret is required"}),j=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.mappingFieldShortDescription",{defaultMessage:"Name"}),x=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.mappingFieldDescription",{defaultMessage:"Description"}),A=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.mappingFieldComments",{defaultMessage:"Comments"}),m=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.requiredDescriptionTextField",{defaultMessage:"Description is required."}),f=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.requiredNameTextField",{defaultMessage:"Name is required."}),y=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.unableToGetIncidentTypesMessage",{defaultMessage:"Unable to get incident types"}),_=n.i18n.translate("xpack.triggersActionsUI.components.builtinActionTypes.resilient.unableToGetSeverityMessage",{defaultMessage:"Unable to get severity"})}}]);