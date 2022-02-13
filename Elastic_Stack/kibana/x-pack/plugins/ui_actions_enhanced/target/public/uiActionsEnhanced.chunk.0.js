/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.uiActionsEnhanced_bundle_jsonpfunction=window.uiActionsEnhanced_bundle_jsonpfunction||[]).push([[0],{85:function(e,t,a){"use strict";a.r(t),a.d(t,"CustomizeTimeRangeModal",(function(){return CustomizeTimeRangeModal}));var n=a(0),i=a.n(n),s=a(2),o=a.n(s),l=a(7),d=a(3),u=a(11),m=a(1);class CustomizeTimeRangeModal extends s.Component{constructor(e){super(e),i()(this,"onTimeChange",(({start:e,end:t})=>{this.setState({timeRange:{from:e,to:t}})})),i()(this,"cancel",(()=>{this.props.onClose()})),i()(this,"onInheritToggle",(()=>{this.setState((e=>({inheritTimeRange:!e.inheritTimeRange})))})),i()(this,"addToPanel",(()=>{const{embeddable:e}=this.props;e.updateInput({timeRange:this.state.timeRange}),this.props.onClose()})),i()(this,"inheritFromParent",(()=>{const{embeddable:e}=this.props,t=e.parent,a=t.getInput().panels;t.updateInput({panels:{...a,[e.id]:{...a[e.id],explicitInput:{...a[e.id].explicitInput,timeRange:void 0}}}}),this.props.onClose()})),this.state={timeRange:e.embeddable.getInput().timeRange,inheritTimeRange:Object(u.a)(e.embeddable)}}render(){return Object(m.jsx)(o.a.Fragment,null,Object(m.jsx)(l.EuiModalHeader,null,Object(m.jsx)(l.EuiModalHeaderTitle,{"data-test-subj":"customizePanelTitle"},d.i18n.translate("xpack.uiActionsEnhanced.customizeTimeRange.modal.headerTitle",{defaultMessage:"Customize panel time range"}))),Object(m.jsx)(l.EuiModalBody,{"data-test-subj":"customizePanelBody"},Object(m.jsx)(l.EuiFormRow,{label:d.i18n.translate("xpack.uiActionsEnhanced.customizePanelTimeRange.modal.optionsMenuForm.panelTitleFormRowLabel",{defaultMessage:"Time range"})},Object(m.jsx)(l.EuiSuperDatePicker,{start:this.state.timeRange?this.state.timeRange.from:void 0,end:this.state.timeRange?this.state.timeRange.to:void 0,isPaused:!1,onTimeChange:this.onTimeChange,showUpdateButton:!1,dateFormat:this.props.dateFormat,commonlyUsedRanges:this.props.commonlyUsedRanges.map((({from:e,to:t,display:a})=>({start:e,end:t,label:a}))),"data-test-subj":"customizePanelTimeRangeDatePicker"}))),Object(m.jsx)(l.EuiModalFooter,{"data-test-subj":"customizePanelFooter"},Object(m.jsx)(l.EuiFlexGroup,{gutterSize:"s",responsive:!1,justifyContent:"spaceBetween"},Object(m.jsx)(l.EuiFlexItem,{grow:!0},Object(m.jsx)("div",null,Object(m.jsx)(l.EuiButtonEmpty,{onClick:this.inheritFromParent,color:"danger","data-test-subj":"removePerPanelTimeRangeButton",disabled:!this.props.embeddable.parent||this.state.inheritTimeRange,flush:"left"},d.i18n.translate("xpack.uiActionsEnhanced.customizePanelTimeRange.modal.removeButtonTitle",{defaultMessage:"Remove"})))),Object(m.jsx)(l.EuiFlexItem,{grow:!1},Object(m.jsx)(l.EuiButtonEmpty,{onClick:this.cancel,"data-test-subj":"cancelPerPanelTimeRangeButton"},d.i18n.translate("xpack.uiActionsEnhanced.customizePanelTimeRange.modal.cancelButtonTitle",{defaultMessage:"Cancel"}))),Object(m.jsx)(l.EuiFlexItem,{grow:!1},Object(m.jsx)(l.EuiButton,{"data-test-subj":"addPerPanelTimeRangeButton",onClick:this.addToPanel,fill:!0},this.state.inheritTimeRange?d.i18n.translate("xpack.uiActionsEnhanced.customizePanelTimeRange.modal.addToPanelButtonTitle",{defaultMessage:"Add to panel"}):d.i18n.translate("xpack.uiActionsEnhanced.customizePanelTimeRange.modal.updatePanelTimeRangeButtonTitle",{defaultMessage:"Update"}))))))}}}}]);