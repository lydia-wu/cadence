/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.apm_bundle_jsonpfunction=window.apm_bundle_jsonpfunction||[]).push([[22],{1022:function(e,t,n){"use strict";n.r(t),n.d(t,"fetchObservabilityOverviewPageData",(function(){return i})),n.d(t,"getHasData",(function(){return r}));var a=n(60);const i=async({absoluteTime:e,relativeTime:t,bucketSize:n,intervalString:i})=>{const r=await Object(a.callApmApi)({endpoint:"GET /internal/apm/observability_overview",signal:null,params:{query:{start:new Date(e.start).toISOString(),end:new Date(e.end).toISOString(),bucketSize:n,intervalString:i}}}),{serviceCount:s,transactionPerMinute:o}=r;return{appLink:`/app/apm/services?rangeFrom=${t.start}&rangeTo=${t.end}`,stats:{services:{type:"number",value:s},transactions:{type:"number",value:o.value||0}},series:{transactions:{coordinates:o.timeseries}}}};async function r(){return await Object(a.callApmApi)({endpoint:"GET /internal/apm/observability_overview/has_data",signal:null})}}}]);