(window.visualizations_bundle_jsonpfunction=window.visualizations_bundle_jsonpfunction||[]).push([[1],Array(36).concat([function(e,i,t){"use strict";var s,a=function(){return void 0===s&&(s=Boolean(window&&document&&document.all&&!window.atob)),s},o=function(){var e={};return function(i){if(void 0===e[i]){var t=document.querySelector(i);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}e[i]=t}return e[i]}}(),n=[];function r(e){for(var i=-1,t=0;t<n.length;t++)if(n[t].identifier===e){i=t;break}return i}function l(e,i){for(var t={},s=[],a=0;a<e.length;a++){var o=e[a],l=i.base?o[0]+i.base:o[0],d=t[l]||0,p="".concat(l," ").concat(d);t[l]=d+1;var c=r(p),u={css:o[1],media:o[2],sourceMap:o[3]};-1!==c?(n[c].references++,n[c].updater(u)):n.push({identifier:p,updater:x(u,i),references:1}),s.push(p)}return s}function d(e){var i=document.createElement("style"),s=e.attributes||{};if(void 0===s.nonce){var a=t.nc;a&&(s.nonce=a)}if(Object.keys(s).forEach((function(e){i.setAttribute(e,s[e])})),"function"==typeof e.insert)e.insert(i);else{var n=o(e.insert||"head");if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");n.appendChild(i)}return i}var p,c=(p=[],function(e,i){return p[e]=i,p.filter(Boolean).join("\n")});function u(e,i,t,s){var a=t?"":s.media?"@media ".concat(s.media," {").concat(s.css,"}"):s.css;if(e.styleSheet)e.styleSheet.cssText=c(i,a);else{var o=document.createTextNode(a),n=e.childNodes;n[i]&&e.removeChild(n[i]),n.length?e.insertBefore(o,n[i]):e.appendChild(o)}}function g(e,i,t){var s=t.css,a=t.media,o=t.sourceMap;if(a?e.setAttribute("media",a):e.removeAttribute("media"),o&&"undefined"!=typeof btoa&&(s+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),e.styleSheet)e.styleSheet.cssText=s;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(s))}}var L=null,h=0;function x(e,i){var t,s,a;if(i.singleton){var o=h++;t=L||(L=d(i)),s=u.bind(null,t,o,!1),a=u.bind(null,t,o,!0)}else t=d(i),s=g.bind(null,t,i),a=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)};return s(e),function(i){if(i){if(i.css===e.css&&i.media===e.media&&i.sourceMap===e.sourceMap)return;s(e=i)}else a()}}e.exports=function(e,i){(i=i||{}).singleton||"boolean"==typeof i.singleton||(i.singleton=a());var t=l(e=e||[],i);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var s=0;s<t.length;s++){var a=r(t[s]);n[a].references--}for(var o=l(e,i),d=0;d<t.length;d++){var p=r(t[d]);0===n[p].references&&(n[p].updater(),n.splice(p,1))}t=o}}}},function(e,i,t){"use strict";e.exports=function(e){var i=[];return i.toString=function(){return this.map((function(i){var t=function(e,i){var t=e[1]||"",s=e[3];if(!s)return t;if(i&&"function"==typeof btoa){var a=(n=s,r=btoa(unescape(encodeURIComponent(JSON.stringify(n)))),l="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(r),"/*# ".concat(l," */")),o=s.sources.map((function(e){return"/*# sourceURL=".concat(s.sourceRoot||"").concat(e," */")}));return[t].concat(o).concat([a]).join("\n")}var n,r,l;return[t].join("\n")}(i,e);return i[2]?"@media ".concat(i[2]," {").concat(t,"}"):t})).join("")},i.i=function(e,t,s){"string"==typeof e&&(e=[[null,e,""]]);var a={};if(s)for(var o=0;o<this.length;o++){var n=this[o][0];null!=n&&(a[n]=!0)}for(var r=0;r<e.length;r++){var l=[].concat(e[r]);s&&a[l[0]]||(t&&(l[2]?l[2]="".concat(t," and ").concat(l[2]):l[2]=t),i.push(l))}},i}},,,,,,,,,,function(e,i,t){switch(window.__kbnThemeTag__){case"v7dark":return t(48);case"v7light":return t(50);case"v8dark":return t(52);case"v8light":return t(54)}},function(e,i,t){var s=t(36),a=t(49);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".visNewVisDialogGroupSelection__body .euiModalBody__overflow{padding:0 !important}.visNewVisDialogGroupSelection__visGroups{padding:8px 32px 0}.visNewVisDialogGroupSelection__footer{padding:0 32px 24px;background:#25262E}@media only screen and (max-width: 574px){.visNewVisDialogGroupSelection__footer{background:#1D1E24}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialogGroupSelection__footer{background:#1D1E24}}@media only screen and (max-width: 574px){.visNewVisDialogGroupSelection__footerDescriptionList{padding-top:24px}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialogGroupSelection__footerDescriptionList{padding-top:24px}}.visNewVisDialogGroupSelection__footerDescriptionListTitle{width:auto !important}\n",""]),e.exports=i},function(e,i,t){var s=t(36),a=t(51);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".visNewVisDialogGroupSelection__body .euiModalBody__overflow{padding:0 !important}.visNewVisDialogGroupSelection__visGroups{padding:8px 32px 0}.visNewVisDialogGroupSelection__footer{padding:0 32px 24px;background:#F5F7FA}@media only screen and (max-width: 574px){.visNewVisDialogGroupSelection__footer{background:#fff}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialogGroupSelection__footer{background:#fff}}@media only screen and (max-width: 574px){.visNewVisDialogGroupSelection__footerDescriptionList{padding-top:24px}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialogGroupSelection__footerDescriptionList{padding-top:24px}}.visNewVisDialogGroupSelection__footerDescriptionListTitle{width:auto !important}\n",""]),e.exports=i},function(e,i,t){var s=t(36),a=t(53);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".visNewVisDialogGroupSelection__body .euiModalBody__overflow{padding:0 !important}.visNewVisDialogGroupSelection__visGroups{padding:8px 32px 0}.visNewVisDialogGroupSelection__footer{padding:0 32px 24px;background:#25262E}@media only screen and (max-width: 574px){.visNewVisDialogGroupSelection__footer{background:#1D1E24}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialogGroupSelection__footer{background:#1D1E24}}@media only screen and (max-width: 574px){.visNewVisDialogGroupSelection__footerDescriptionList{padding-top:24px}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialogGroupSelection__footerDescriptionList{padding-top:24px}}.visNewVisDialogGroupSelection__footerDescriptionListTitle{width:auto !important}\n",""]),e.exports=i},function(e,i,t){var s=t(36),a=t(55);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".visNewVisDialogGroupSelection__body .euiModalBody__overflow{padding:0 !important}.visNewVisDialogGroupSelection__visGroups{padding:8px 32px 0}.visNewVisDialogGroupSelection__footer{padding:0 32px 24px;background:#F5F7FA}@media only screen and (max-width: 574px){.visNewVisDialogGroupSelection__footer{background:#fff}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialogGroupSelection__footer{background:#fff}}@media only screen and (max-width: 574px){.visNewVisDialogGroupSelection__footerDescriptionList{padding-top:24px}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialogGroupSelection__footerDescriptionList{padding-top:24px}}.visNewVisDialogGroupSelection__footerDescriptionListTitle{width:auto !important}\n",""]),e.exports=i},function(e,i,t){switch(window.__kbnThemeTag__){case"v7dark":return t(57);case"v7light":return t(59);case"v8dark":return t(61);case"v8light":return t(63)}},function(e,i,t){var s=t(36),a=t(58);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".aggBasedDialog__card{background-color:#1D1E24}\n",""]),e.exports=i},function(e,i,t){var s=t(36),a=t(60);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".aggBasedDialog__card{background-color:#fff}\n",""]),e.exports=i},function(e,i,t){var s=t(36),a=t(62);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".aggBasedDialog__card{background-color:#1D1E24}\n",""]),e.exports=i},function(e,i,t){var s=t(36),a=t(64);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".aggBasedDialog__card{background-color:#fff}\n",""]),e.exports=i},function(e,i,t){switch(window.__kbnThemeTag__){case"v7dark":return t(66);case"v7light":return t(68);case"v8dark":return t(70);case"v8light":return t(72)}},function(e,i,t){var s=t(36),a=t(67);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".visNewVisDialog{max-width:816px;max-height:720px;background:#1D1E24}@media only screen and (max-width: 574px){.visNewVisDialog{max-height:100%}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialog{max-height:100%}}.visNewVisDialog--aggbased{max-width:816px;max-height:720px;background-repeat:no-repeat;background-position:calc(100% + 1px) calc(100% + 1px);background-size:30%;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='313' height='461' viewBox='0 0 313 461'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='%2318191E' d='M294.009,184.137 C456.386,184.137 588.018,315.77 588.018,478.146 C588.018,640.523 456.386,772.156 294.009,772.156 C131.632,772.156 0,640.523 0,478.146 C0,315.77 131.632,184.137 294.009,184.137 Z M294.009,384.552 C242.318,384.552 200.415,426.456 200.415,478.146 C200.415,529.837 242.318,571.741 294.009,571.741 C345.7,571.741 387.604,529.837 387.604,478.146 C387.604,426.456 345.7,384.552 294.009,384.552 Z'/%3E%3Cpath fill='%2315161B' d='M202.958,365.731 L202.958,380.991 L187.698,380.991 L187.698,365.731 L202.958,365.731 Z M202.958,327.073 L202.958,342.333 L187.698,342.333 L187.698,327.073 L202.958,327.073 Z M243.651,325.038 L243.651,340.298 L228.391,340.298 L228.391,325.038 L243.651,325.038 Z M243.651,286.379 L243.651,301.639 L228.391,301.639 L228.391,286.379 L243.651,286.379 Z M202.958,285.362 L202.958,300.622 L187.698,300.622 L187.698,285.362 L202.958,285.362 Z M284.345,284.345 L284.345,299.605 L269.085,299.605 L269.085,284.345 L284.345,284.345 Z M284.345,245.686 L284.345,260.946 L269.085,260.946 L269.085,245.686 L284.345,245.686 Z M243.651,244.669 L243.651,259.929 L228.391,259.929 L228.391,244.669 L243.651,244.669 Z M202.958,243.651 L202.958,258.911 L187.698,258.911 L187.698,243.651 L202.958,243.651 Z M284.345,203.975 L284.345,219.235 L269.085,219.235 L269.085,203.975 L284.345,203.975 Z M202.958,203.975 L202.958,219.235 L187.698,219.235 L187.698,203.975 L202.958,203.975 Z M243.651,202.958 L243.651,218.218 L228.391,218.218 L228.391,202.958 L243.651,202.958 Z M243.651,163.282 L243.651,178.542 L228.391,178.542 L228.391,163.282 L243.651,163.282 Z M202.958,163.282 L202.958,178.542 L187.698,178.542 L187.698,163.282 L202.958,163.282 Z M284.345,162.265 L284.345,177.525 L269.085,177.525 L269.085,162.265 L284.345,162.265 Z M284.345,122.589 L284.345,137.849 L269.085,137.849 L269.085,122.589 L284.345,122.589 Z M243.651,122.589 L243.651,137.849 L228.391,137.849 L228.391,122.589 L243.651,122.589 Z M202.958,122.589 L202.958,137.849 L187.698,137.849 L187.698,122.589 L202.958,122.589 Z M284.345,81.8954 L284.345,97.1554 L269.085,97.1554 L269.085,81.8954 L284.345,81.8954 Z M243.651,81.8954 L243.651,97.1554 L228.391,97.1554 L228.391,81.8954 L243.651,81.8954 Z M202.958,81.8954 L202.958,97.1554 L187.698,97.1554 L187.698,81.8954 L202.958,81.8954 Z M284.345,41.202 L284.345,56.462 L269.085,56.462 L269.085,41.202 L284.345,41.202 Z M243.651,41.202 L243.651,56.462 L228.391,56.462 L228.391,41.202 L243.651,41.202 Z M284.345,0.508789 L284.345,15.7688 L269.085,15.7688 L269.085,0.508789 L284.345,0.508789 Z'/%3E%3C/g%3E%3C/svg%3E\")}@media only screen and (max-width: 574px){.visNewVisDialog--aggbased{max-height:100%}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialog--aggbased{max-height:100%}}.visNewVisSearchDialog{min-width:816px;min-height:720px}.visNewVisDialog__toolsCard{background-color:transparent}.visNewVisDialog__groupsCard{background-color:transparent;box-shadow:none}.visNewVisDialog__groupsCardWrapper{position:relative}.visNewVisDialog__groupsCardWrapper .visNewVisDialog__groupsCardLink{position:absolute;left:50%;transform:translateX(-50%);margin-top:-12px}.visNewVisDialog__groupsCardWrapper .visNewVisDialog__groupsCardBetaBadge{background:#1D1E24;cursor:pointer}\n",""]),e.exports=i},function(e,i,t){var s=t(36),a=t(69);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".visNewVisDialog{max-width:816px;max-height:720px;background:#fff}@media only screen and (max-width: 574px){.visNewVisDialog{max-height:100%}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialog{max-height:100%}}.visNewVisDialog--aggbased{max-width:816px;max-height:720px;background-repeat:no-repeat;background-position:calc(100% + 1px) calc(100% + 1px);background-size:30%;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='313' height='461' viewBox='0 0 313 461'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='%23F5F7FA' d='M294.009,184.137 C456.386,184.137 588.018,315.77 588.018,478.146 C588.018,640.523 456.386,772.156 294.009,772.156 C131.632,772.156 0,640.523 0,478.146 C0,315.77 131.632,184.137 294.009,184.137 Z M294.009,384.552 C242.318,384.552 200.415,426.456 200.415,478.146 C200.415,529.837 242.318,571.741 294.009,571.741 C345.7,571.741 387.604,529.837 387.604,478.146 C387.604,426.456 345.7,384.552 294.009,384.552 Z'/%3E%3Cpath fill='%23E6EBF2' d='M202.958,365.731 L202.958,380.991 L187.698,380.991 L187.698,365.731 L202.958,365.731 Z M202.958,327.073 L202.958,342.333 L187.698,342.333 L187.698,327.073 L202.958,327.073 Z M243.651,325.038 L243.651,340.298 L228.391,340.298 L228.391,325.038 L243.651,325.038 Z M243.651,286.379 L243.651,301.639 L228.391,301.639 L228.391,286.379 L243.651,286.379 Z M202.958,285.362 L202.958,300.622 L187.698,300.622 L187.698,285.362 L202.958,285.362 Z M284.345,284.345 L284.345,299.605 L269.085,299.605 L269.085,284.345 L284.345,284.345 Z M284.345,245.686 L284.345,260.946 L269.085,260.946 L269.085,245.686 L284.345,245.686 Z M243.651,244.669 L243.651,259.929 L228.391,259.929 L228.391,244.669 L243.651,244.669 Z M202.958,243.651 L202.958,258.911 L187.698,258.911 L187.698,243.651 L202.958,243.651 Z M284.345,203.975 L284.345,219.235 L269.085,219.235 L269.085,203.975 L284.345,203.975 Z M202.958,203.975 L202.958,219.235 L187.698,219.235 L187.698,203.975 L202.958,203.975 Z M243.651,202.958 L243.651,218.218 L228.391,218.218 L228.391,202.958 L243.651,202.958 Z M243.651,163.282 L243.651,178.542 L228.391,178.542 L228.391,163.282 L243.651,163.282 Z M202.958,163.282 L202.958,178.542 L187.698,178.542 L187.698,163.282 L202.958,163.282 Z M284.345,162.265 L284.345,177.525 L269.085,177.525 L269.085,162.265 L284.345,162.265 Z M284.345,122.589 L284.345,137.849 L269.085,137.849 L269.085,122.589 L284.345,122.589 Z M243.651,122.589 L243.651,137.849 L228.391,137.849 L228.391,122.589 L243.651,122.589 Z M202.958,122.589 L202.958,137.849 L187.698,137.849 L187.698,122.589 L202.958,122.589 Z M284.345,81.8954 L284.345,97.1554 L269.085,97.1554 L269.085,81.8954 L284.345,81.8954 Z M243.651,81.8954 L243.651,97.1554 L228.391,97.1554 L228.391,81.8954 L243.651,81.8954 Z M202.958,81.8954 L202.958,97.1554 L187.698,97.1554 L187.698,81.8954 L202.958,81.8954 Z M284.345,41.202 L284.345,56.462 L269.085,56.462 L269.085,41.202 L284.345,41.202 Z M243.651,41.202 L243.651,56.462 L228.391,56.462 L228.391,41.202 L243.651,41.202 Z M284.345,0.508789 L284.345,15.7688 L269.085,15.7688 L269.085,0.508789 L284.345,0.508789 Z'/%3E%3C/g%3E%3C/svg%3E\")}@media only screen and (max-width: 574px){.visNewVisDialog--aggbased{max-height:100%}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialog--aggbased{max-height:100%}}.visNewVisSearchDialog{min-width:816px;min-height:720px}.visNewVisDialog__toolsCard{background-color:transparent}.visNewVisDialog__groupsCard{background-color:transparent;box-shadow:none}.visNewVisDialog__groupsCardWrapper{position:relative}.visNewVisDialog__groupsCardWrapper .visNewVisDialog__groupsCardLink{position:absolute;left:50%;transform:translateX(-50%);margin-top:-12px}.visNewVisDialog__groupsCardWrapper .visNewVisDialog__groupsCardBetaBadge{background:#fff;cursor:pointer}\n",""]),e.exports=i},function(e,i,t){var s=t(36),a=t(71);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".visNewVisDialog{max-width:816px;max-height:720px;background:#1D1E24}@media only screen and (max-width: 574px){.visNewVisDialog{max-height:100%}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialog{max-height:100%}}.visNewVisDialog--aggbased{max-width:816px;max-height:720px;background-repeat:no-repeat;background-position:calc(100% + 1px) calc(100% + 1px);background-size:30%;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='313' height='461' viewBox='0 0 313 461'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='%2318191E' d='M294.009,184.137 C456.386,184.137 588.018,315.77 588.018,478.146 C588.018,640.523 456.386,772.156 294.009,772.156 C131.632,772.156 0,640.523 0,478.146 C0,315.77 131.632,184.137 294.009,184.137 Z M294.009,384.552 C242.318,384.552 200.415,426.456 200.415,478.146 C200.415,529.837 242.318,571.741 294.009,571.741 C345.7,571.741 387.604,529.837 387.604,478.146 C387.604,426.456 345.7,384.552 294.009,384.552 Z'/%3E%3Cpath fill='%2315161B' d='M202.958,365.731 L202.958,380.991 L187.698,380.991 L187.698,365.731 L202.958,365.731 Z M202.958,327.073 L202.958,342.333 L187.698,342.333 L187.698,327.073 L202.958,327.073 Z M243.651,325.038 L243.651,340.298 L228.391,340.298 L228.391,325.038 L243.651,325.038 Z M243.651,286.379 L243.651,301.639 L228.391,301.639 L228.391,286.379 L243.651,286.379 Z M202.958,285.362 L202.958,300.622 L187.698,300.622 L187.698,285.362 L202.958,285.362 Z M284.345,284.345 L284.345,299.605 L269.085,299.605 L269.085,284.345 L284.345,284.345 Z M284.345,245.686 L284.345,260.946 L269.085,260.946 L269.085,245.686 L284.345,245.686 Z M243.651,244.669 L243.651,259.929 L228.391,259.929 L228.391,244.669 L243.651,244.669 Z M202.958,243.651 L202.958,258.911 L187.698,258.911 L187.698,243.651 L202.958,243.651 Z M284.345,203.975 L284.345,219.235 L269.085,219.235 L269.085,203.975 L284.345,203.975 Z M202.958,203.975 L202.958,219.235 L187.698,219.235 L187.698,203.975 L202.958,203.975 Z M243.651,202.958 L243.651,218.218 L228.391,218.218 L228.391,202.958 L243.651,202.958 Z M243.651,163.282 L243.651,178.542 L228.391,178.542 L228.391,163.282 L243.651,163.282 Z M202.958,163.282 L202.958,178.542 L187.698,178.542 L187.698,163.282 L202.958,163.282 Z M284.345,162.265 L284.345,177.525 L269.085,177.525 L269.085,162.265 L284.345,162.265 Z M284.345,122.589 L284.345,137.849 L269.085,137.849 L269.085,122.589 L284.345,122.589 Z M243.651,122.589 L243.651,137.849 L228.391,137.849 L228.391,122.589 L243.651,122.589 Z M202.958,122.589 L202.958,137.849 L187.698,137.849 L187.698,122.589 L202.958,122.589 Z M284.345,81.8954 L284.345,97.1554 L269.085,97.1554 L269.085,81.8954 L284.345,81.8954 Z M243.651,81.8954 L243.651,97.1554 L228.391,97.1554 L228.391,81.8954 L243.651,81.8954 Z M202.958,81.8954 L202.958,97.1554 L187.698,97.1554 L187.698,81.8954 L202.958,81.8954 Z M284.345,41.202 L284.345,56.462 L269.085,56.462 L269.085,41.202 L284.345,41.202 Z M243.651,41.202 L243.651,56.462 L228.391,56.462 L228.391,41.202 L243.651,41.202 Z M284.345,0.508789 L284.345,15.7688 L269.085,15.7688 L269.085,0.508789 L284.345,0.508789 Z'/%3E%3C/g%3E%3C/svg%3E\")}@media only screen and (max-width: 574px){.visNewVisDialog--aggbased{max-height:100%}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialog--aggbased{max-height:100%}}.visNewVisSearchDialog{min-width:816px;min-height:720px}.visNewVisDialog__toolsCard{background-color:transparent}.visNewVisDialog__groupsCard{background-color:transparent;box-shadow:none}.visNewVisDialog__groupsCardWrapper{position:relative}.visNewVisDialog__groupsCardWrapper .visNewVisDialog__groupsCardLink{position:absolute;left:50%;transform:translateX(-50%);margin-top:-12px}.visNewVisDialog__groupsCardWrapper .visNewVisDialog__groupsCardBetaBadge{background:#1D1E24;cursor:pointer}\n",""]),e.exports=i},function(e,i,t){var s=t(36),a=t(73);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};s(a,o);e.exports=a.locals||{}},function(e,i,t){(i=t(37)(!1)).push([e.i,".visNewVisDialog{max-width:816px;max-height:720px;background:#fff}@media only screen and (max-width: 574px){.visNewVisDialog{max-height:100%}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialog{max-height:100%}}.visNewVisDialog--aggbased{max-width:816px;max-height:720px;background-repeat:no-repeat;background-position:calc(100% + 1px) calc(100% + 1px);background-size:30%;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='313' height='461' viewBox='0 0 313 461'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='%23F5F7FA' d='M294.009,184.137 C456.386,184.137 588.018,315.77 588.018,478.146 C588.018,640.523 456.386,772.156 294.009,772.156 C131.632,772.156 0,640.523 0,478.146 C0,315.77 131.632,184.137 294.009,184.137 Z M294.009,384.552 C242.318,384.552 200.415,426.456 200.415,478.146 C200.415,529.837 242.318,571.741 294.009,571.741 C345.7,571.741 387.604,529.837 387.604,478.146 C387.604,426.456 345.7,384.552 294.009,384.552 Z'/%3E%3Cpath fill='%23E6EBF2' d='M202.958,365.731 L202.958,380.991 L187.698,380.991 L187.698,365.731 L202.958,365.731 Z M202.958,327.073 L202.958,342.333 L187.698,342.333 L187.698,327.073 L202.958,327.073 Z M243.651,325.038 L243.651,340.298 L228.391,340.298 L228.391,325.038 L243.651,325.038 Z M243.651,286.379 L243.651,301.639 L228.391,301.639 L228.391,286.379 L243.651,286.379 Z M202.958,285.362 L202.958,300.622 L187.698,300.622 L187.698,285.362 L202.958,285.362 Z M284.345,284.345 L284.345,299.605 L269.085,299.605 L269.085,284.345 L284.345,284.345 Z M284.345,245.686 L284.345,260.946 L269.085,260.946 L269.085,245.686 L284.345,245.686 Z M243.651,244.669 L243.651,259.929 L228.391,259.929 L228.391,244.669 L243.651,244.669 Z M202.958,243.651 L202.958,258.911 L187.698,258.911 L187.698,243.651 L202.958,243.651 Z M284.345,203.975 L284.345,219.235 L269.085,219.235 L269.085,203.975 L284.345,203.975 Z M202.958,203.975 L202.958,219.235 L187.698,219.235 L187.698,203.975 L202.958,203.975 Z M243.651,202.958 L243.651,218.218 L228.391,218.218 L228.391,202.958 L243.651,202.958 Z M243.651,163.282 L243.651,178.542 L228.391,178.542 L228.391,163.282 L243.651,163.282 Z M202.958,163.282 L202.958,178.542 L187.698,178.542 L187.698,163.282 L202.958,163.282 Z M284.345,162.265 L284.345,177.525 L269.085,177.525 L269.085,162.265 L284.345,162.265 Z M284.345,122.589 L284.345,137.849 L269.085,137.849 L269.085,122.589 L284.345,122.589 Z M243.651,122.589 L243.651,137.849 L228.391,137.849 L228.391,122.589 L243.651,122.589 Z M202.958,122.589 L202.958,137.849 L187.698,137.849 L187.698,122.589 L202.958,122.589 Z M284.345,81.8954 L284.345,97.1554 L269.085,97.1554 L269.085,81.8954 L284.345,81.8954 Z M243.651,81.8954 L243.651,97.1554 L228.391,97.1554 L228.391,81.8954 L243.651,81.8954 Z M202.958,81.8954 L202.958,97.1554 L187.698,97.1554 L187.698,81.8954 L202.958,81.8954 Z M284.345,41.202 L284.345,56.462 L269.085,56.462 L269.085,41.202 L284.345,41.202 Z M243.651,41.202 L243.651,56.462 L228.391,56.462 L228.391,41.202 L243.651,41.202 Z M284.345,0.508789 L284.345,15.7688 L269.085,15.7688 L269.085,0.508789 L284.345,0.508789 Z'/%3E%3C/g%3E%3C/svg%3E\")}@media only screen and (max-width: 574px){.visNewVisDialog--aggbased{max-height:100%}}@media only screen and (min-width: 575px) and (max-width: 767px){.visNewVisDialog--aggbased{max-height:100%}}.visNewVisSearchDialog{min-width:816px;min-height:720px}.visNewVisDialog__toolsCard{background-color:transparent}.visNewVisDialog__groupsCard{background-color:transparent;box-shadow:none}.visNewVisDialog__groupsCardWrapper{position:relative}.visNewVisDialog__groupsCardWrapper .visNewVisDialog__groupsCardLink{position:absolute;left:50%;transform:translateX(-50%);margin-top:-12px}.visNewVisDialog__groupsCardWrapper .visNewVisDialog__groupsCardBetaBadge{background:#fff;cursor:pointer}\n",""]),e.exports=i},,,,,,,,,,,,,function(e,i,t){"use strict";t.r(i),t.d(i,"default",(function(){return new_vis_modal_NewVisModal}));var s=t(0),a=t.n(s),o=t(10),n=t.n(o),r=t(12),l=t(4),d=t(34),p=t(14),c=t(13),u=t(2);function g(e){return Object(u.jsx)(n.a.Fragment,null,Object(u.jsx)(r.EuiLink,{"data-test-subj":"goBackLink",onClick:e.goBack},Object(u.jsx)(r.EuiFlexGroup,{alignItems:"center",gutterSize:"s",responsive:!1},Object(u.jsx)(r.EuiFlexItem,{grow:!1},Object(u.jsx)(r.EuiIcon,{type:"arrowLeft"})),Object(u.jsx)(r.EuiFlexItem,null,l.i18n.translate("visualizations.newVisWizard.goBackLink",{defaultMessage:"Select a different visualization"})))),Object(u.jsx)(r.EuiSpacer,null))}class search_selection_SearchSelection extends n.a.Component{constructor(...e){super(...e),a()(this,"fixedPageSize",8)}render(){return Object(u.jsx)(n.a.Fragment,null,Object(u.jsx)(r.EuiModalHeader,null,Object(u.jsx)(r.EuiModalHeaderTitle,null,Object(u.jsx)(p.FormattedMessage,{id:"visualizations.newVisWizard.newVisTypeTitle",defaultMessage:"New {visTypeName}",values:{visTypeName:this.props.visType.title}})," ","/"," ",Object(u.jsx)(p.FormattedMessage,{id:"visualizations.newVisWizard.chooseSourceTitle",defaultMessage:"Choose a source"}))),Object(u.jsx)(r.EuiModalBody,null,Object(u.jsx)(g,{goBack:this.props.goBack}),Object(u.jsx)(c.SavedObjectFinderUi,{key:"searchSavedObjectFinder",onChoose:this.props.onSearchSelected,showFilter:!0,noItemsMessage:l.i18n.translate("visualizations.newVisWizard.searchSelection.notFoundLabel",{defaultMessage:"No matching indices or saved searches found."}),savedObjectMetaData:[{type:"search",getIconForSavedObject:()=>"search",name:l.i18n.translate("visualizations.newVisWizard.searchSelection.savedObjectType.search",{defaultMessage:"Saved search"})},{type:"index-pattern",getIconForSavedObject:()=>"indexPatternApp",name:l.i18n.translate("visualizations.newVisWizard.searchSelection.savedObjectType.indexPattern",{defaultMessage:"Index pattern"})}],fixedPageSize:this.fixedPageSize,uiSettings:this.props.uiSettings,savedObjects:this.props.savedObjects})))}}var L=t(5),h=t(18);t(47);function x(e){const i=e.docLinks.links.dashboard.guide,t=Object(o.useMemo)((()=>Object(L.orderBy)([...e.visTypesRegistry.getAliases(),...e.visTypesRegistry.getByGroup(h.a.PROMOTED)],["promotion","title"],["asc","asc"])),[e.visTypesRegistry]);return Object(u.jsx)(n.a.Fragment,null,Object(u.jsx)(r.EuiModalHeader,null,Object(u.jsx)(r.EuiModalHeaderTitle,{"data-test-subj":"groupModalHeader"},Object(u.jsx)(p.FormattedMessage,{id:"visualizations.newVisWizard.title",defaultMessage:"New visualization"}))),Object(u.jsx)(r.EuiModalBody,{className:"visNewVisDialogGroupSelection__body"},Object(u.jsx)("div",{className:"visNewVisDialogGroupSelection__visGroups"},Object(u.jsx)(r.EuiSpacer,{size:"s"}),Object(u.jsx)(r.EuiFlexGrid,{columns:2,"data-test-subj":"visNewDialogGroups"},t.map((i=>Object(u.jsx)(v,{visType:i,key:i.name,onVisTypeSelected:e.onVisTypeSelected})))),Object(u.jsx)(r.EuiSpacer,{size:"l"})),Object(u.jsx)("div",{className:"visNewVisDialogGroupSelection__footer"},Object(u.jsx)(r.EuiSpacer,{size:"l"}),Object(u.jsx)(r.EuiFlexGrid,{columns:2},e.visTypesRegistry.getByGroup(h.a.AGGBASED).length>0&&Object(u.jsx)(r.EuiFlexItem,null,Object(u.jsx)(r.EuiCard,{titleSize:"xs",layout:"horizontal",onClick:()=>e.toggleGroups(!1),title:Object(u.jsx)("span",{"data-test-subj":"visGroupAggBasedTitle"},l.i18n.translate("visualizations.newVisWizard.aggBasedGroupTitle",{defaultMessage:"Aggregation based"})),"data-test-subj":"visGroup-aggbased",description:l.i18n.translate("visualizations.newVisWizard.aggBasedGroupDescription",{defaultMessage:"Use our classic visualize library to create charts based on aggregations."}),icon:Object(u.jsx)(r.EuiIcon,{type:"heatmap",size:"xl",color:"secondary"}),className:"visNewVisDialog__groupsCard"},Object(u.jsx)(r.EuiLink,{"data-test-subj":"visGroupAggBasedExploreLink",onClick:()=>e.toggleGroups(!1)},Object(u.jsx)(r.EuiText,{size:"s"},l.i18n.translate("visualizations.newVisWizard.exploreOptionLinkText",{defaultMessage:"Explore options"})," ",Object(u.jsx)(r.EuiIcon,{type:"sortRight"}))))),e.visTypesRegistry.getByGroup(h.a.TOOLS).length>0&&Object(u.jsx)(r.EuiFlexItem,{className:"visNewVisDialog__toolsCard"},Object(u.jsx)(r.EuiSpacer,{size:"m"}),Object(u.jsx)(r.EuiTitle,{size:"xs"},Object(u.jsx)("span",{"data-test-subj":"visGroup-tools"},l.i18n.translate("visualizations.newVisWizard.toolsGroupTitle",{defaultMessage:"Tools"}))),Object(u.jsx)(r.EuiSpacer,{size:"s"}),Object(u.jsx)("div",{className:"visNewVisDialog__toolsCardGroupContainer"},e.visTypesRegistry.getByGroup(h.a.TOOLS).map((i=>Object(u.jsx)(m,{visType:i,key:i.name,onVisTypeSelected:e.onVisTypeSelected,showExperimental:e.showExperimental})))))),Object(u.jsx)(r.EuiSpacer,{size:"m"}),Object(u.jsx)(r.EuiDescriptionList,{className:"visNewVisDialogGroupSelection__footerDescriptionList",type:"responsiveColumn"},Object(u.jsx)(r.EuiDescriptionListTitle,{className:"visNewVisDialogGroupSelection__footerDescriptionListTitle"},Object(u.jsx)(p.FormattedMessage,{id:"visualizations.newVisWizard.learnMoreText",defaultMessage:"Want to learn more?"})),Object(u.jsx)(r.EuiDescriptionListDescription,null,Object(u.jsx)(r.EuiLink,{href:i,target:"_blank",external:!0},Object(u.jsx)(p.FormattedMessage,{id:"visualizations.newVisWizard.readDocumentationLink",defaultMessage:"Read documentation"})))))))}const v=({visType:e,onVisTypeSelected:i})=>{const t=Object(o.useCallback)((()=>{i(e)}),[i,e]);return Object(u.jsx)(r.EuiFlexItem,{className:"visNewVisDialog__groupsCardWrapper"},Object(u.jsx)(r.EuiCard,{titleSize:"xs",title:Object(u.jsx)("span",{"data-test-subj":"visTypeTitle"},"titleInWizard"in e&&e.titleInWizard?e.titleInWizard:e.title),onClick:t,"data-test-subj":`visType-${e.name}`,"data-vis-stage":"aliasPath"in e?"alias":e.stage,"aria-label":`visType-${e.name}`,description:Object(u.jsx)(n.a.Fragment,null,Object(u.jsx)("span",null,e.description||""),Object(u.jsx)("em",null," ",e.note||"")),layout:"horizontal",icon:Object(u.jsx)(r.EuiIcon,{type:e.icon||"empty",size:"xl",color:"secondary"}),className:"visNewVisDialog__groupsCard"}))},m=({visType:e,onVisTypeSelected:i,showExperimental:t})=>{const s=Object(o.useCallback)((()=>{i(e)}),[i,e]);return t||"experimental"!==e.stage?Object(u.jsx)(r.EuiFlexGroup,{alignItems:"center",gutterSize:"m",responsive:!1},Object(u.jsx)(r.EuiFlexItem,{grow:!1},Object(u.jsx)(r.EuiIcon,{type:e.icon||"empty",size:"l"})),Object(u.jsx)(r.EuiFlexItem,null,Object(u.jsx)(r.EuiFlexGroup,{gutterSize:"xs",alignItems:"center",responsive:!1},Object(u.jsx)(r.EuiFlexItem,{grow:!1},Object(u.jsx)(r.EuiLink,{"data-test-subj":`visType-${e.name}`,onClick:s},"titleInWizard"in e&&e.titleInWizard?e.titleInWizard:e.title)),"experimental"===e.stage&&Object(u.jsx)(r.EuiFlexItem,{grow:!1},Object(u.jsx)(r.EuiBetaBadge,{iconType:"beaker",tooltipContent:l.i18n.translate("visualizations.newVisWizard.experimentalTooltip",{defaultMessage:"This visualization might be changed or removed in a future release and is not subject to the support SLA."}),label:l.i18n.translate("visualizations.newVisWizard.experimentalTitle",{defaultMessage:"Experimental"})}))),Object(u.jsx)(r.EuiText,{color:"subdued",size:"s"},e.description))):null},w=Symbol();t(56);class agg_based_selection_AggBasedSelection extends n.a.Component{constructor(...e){super(...e),a()(this,"state",{query:""}),a()(this,"getFilteredVisTypes",function(e){let i=w;return function(...t){return i!==w&&i.this===this&&i.args.length===t.length&&i.args.every(((e,i)=>e===t[i]))||(i={args:t,this:this,returnValue:e.apply(this,t)}),i.returnValue}}(this.filteredVisTypes)),a()(this,"renderVisType",(e=>{const i=""!==this.state.query&&!e.highlighted;return Object(u.jsx)(r.EuiFlexItem,{key:e.type.name},Object(u.jsx)(r.EuiCard,{titleSize:"xs",title:Object(u.jsx)("span",{"data-test-subj":"visTypeTitle"},e.type.title),onClick:()=>this.props.onVisTypeSelected(e.type),"data-test-subj":`visType-${e.type.name}`,"data-vis-stage":e.type.stage,"aria-label":`visType-${e.type.name}`,description:e.type.description||"",layout:"horizontal",isDisabled:i,icon:Object(u.jsx)(r.EuiIcon,{type:e.type.icon||"empty",size:"l",color:"secondary"}),className:"aggBasedDialog__card"}))})),a()(this,"onQueryChange",(e=>{this.setState({query:e.target.value})}))}render(){const{query:e}=this.state,i=this.getFilteredVisTypes(this.props.visTypesRegistry,e);return Object(u.jsx)(n.a.Fragment,null,Object(u.jsx)(r.EuiModalHeader,null,Object(u.jsx)(r.EuiModalHeaderTitle,null,Object(u.jsx)(p.FormattedMessage,{id:"visualizations.newVisWizard.title",defaultMessage:"New visualization"}))),Object(u.jsx)(r.EuiModalBody,null,Object(u.jsx)(g,{goBack:()=>this.props.toggleGroups(!0)}),Object(u.jsx)(r.EuiFieldSearch,{placeholder:"Filter",value:e,onChange:this.onQueryChange,fullWidth:!0,"data-test-subj":"filterVisType","aria-label":l.i18n.translate("visualizations.newVisWizard.filterVisTypeAriaLabel",{defaultMessage:"Filter for a visualization type"})}),Object(u.jsx)(r.EuiSpacer,null),Object(u.jsx)(r.EuiScreenReaderOnly,null,Object(u.jsx)("span",{"aria-live":"polite"},e&&Object(u.jsx)(p.FormattedMessage,{id:"visualizations.newVisWizard.resultsFound",defaultMessage:"{resultCount, plural, one {type} other {types}} found",values:{resultCount:i.filter((e=>e.highlighted)).length}}))),Object(u.jsx)(r.EuiFlexGrid,{columns:3,"data-test-subj":"visNewDialogTypes"},i.map(this.renderVisType))))}filteredVisTypes(e,i){const t=e.getByGroup(h.a.AGGBASED).filter((e=>!e.hidden));let s;if(i){const e=i.toLowerCase();s=t.map((i=>{const t=i.name.toLowerCase().includes(e)||i.title.toLowerCase().includes(e)||"string"==typeof i.description&&i.description.toLowerCase().includes(e);return{type:i,highlighted:t}}))}else s=t.map((e=>({type:e,highlighted:!1})));return Object(L.orderBy)(s,["highlighted","type.title"],["desc","asc"])}}var f=t(11);t(65);class new_vis_modal_NewVisModal extends n.a.Component{constructor(e){var i;super(e),a()(this,"isLabsEnabled",void 0),a()(this,"trackUiMetric",void 0),a()(this,"onCloseModal",(()=>{this.setState({showSearchVisModal:!1}),this.props.onClose()})),a()(this,"onVisTypeSelected",(e=>{!("aliasPath"in e)&&e.requiresSearch&&e.options.showIndexSelection?this.setState({showSearchVisModal:!0,visType:e}):this.redirectToVis(e)})),a()(this,"onSearchSelected",((e,i)=>{this.redirectToVis(this.state.visType,i,e)})),this.isLabsEnabled=e.uiSettings.get(f.VISUALIZE_ENABLE_LABS_SETTING),this.state={showSearchVisModal:Boolean(this.props.selectedVisType),showGroups:!this.props.showAggsSelection,visType:this.props.selectedVisType},this.trackUiMetric=null===(i=this.props.usageCollection)||void 0===i?void 0:i.reportUiCounter.bind(this.props.usageCollection,"visualize")}render(){if(!this.props.isOpen)return null;const e=l.i18n.translate("visualizations.newVisWizard.helpTextAriaLabel",{defaultMessage:"Start creating your visualization by selecting a type for that visualization. Hit escape to close this modal. Hit Tab key to go further."}),i=this.state.showGroups?x:agg_based_selection_AggBasedSelection;return this.state.showSearchVisModal&&this.state.visType?Object(u.jsx)(r.EuiModal,{onClose:this.onCloseModal,className:"visNewVisSearchDialog"},Object(u.jsx)(search_selection_SearchSelection,{onSearchSelected:this.onSearchSelected,visType:this.state.visType,uiSettings:this.props.uiSettings,savedObjects:this.props.savedObjects,goBack:()=>this.setState({showSearchVisModal:!1})})):Object(u.jsx)(r.EuiModal,{onClose:this.onCloseModal,className:this.state.showGroups?"visNewVisDialog":"visNewVisDialog--aggbased","aria-label":e},Object(u.jsx)(i,{showExperimental:this.isLabsEnabled,onVisTypeSelected:this.onVisTypeSelected,visTypesRegistry:this.props.visTypesRegistry,docLinks:this.props.docLinks,toggleGroups:e=>this.setState({showGroups:e})}))}redirectToVis(e,i,t){let s;if(this.trackUiMetric&&this.trackUiMetric(d.METRIC_TYPE.CLICK,`${e.name}:create`),"aliasPath"in e)return s=e.aliasPath,this.props.onClose(),void this.navigate(e.aliasApp,e.aliasPath);s=[`type=${encodeURIComponent(e.name)}`],i&&s.push(`${"search"===i?"savedSearchId":"indexPattern"}=${t}`),s=s.concat(this.props.editorParams),this.props.onClose(),this.props.outsideVisualizeApp?this.navigate("visualize",`#/create?${s.join("&")}`):location.assign(this.props.addBasePath(`/app/visualize#/create?${s.join("&")}`))}navigate(e,i){this.props.stateTransfer&&this.props.originatingApp?this.props.stateTransfer.navigateToEditor(e,{path:i,state:{originatingApp:this.props.originatingApp}}):this.props.application.navigateToApp(e,{path:i})}}a()(new_vis_modal_NewVisModal,"defaultProps",{editorParams:[]})}])]);