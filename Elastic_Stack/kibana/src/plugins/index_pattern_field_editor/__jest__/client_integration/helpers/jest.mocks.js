"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const EDITOR_ID = 'testEditor';
jest.mock('@elastic/eui', () => {
  const original = jest.requireActual('@elastic/eui');
  return { ...original,
    EuiComboBox: props => {
      var _props$selectedOption;

      return /*#__PURE__*/_react.default.createElement("input", {
        "data-test-subj": props['data-test-subj'] || 'mockComboBox',
        "data-currentvalue": props.selectedOptions,
        value: (_props$selectedOption = props.selectedOptions[0]) === null || _props$selectedOption === void 0 ? void 0 : _props$selectedOption.value,
        onChange: async syntheticEvent => {
          props.onChange([syntheticEvent['0']]);
        }
      });
    },
    EuiResizeObserver: ({
      onResize,
      children
    }) => {
      onResize({
        height: 1000
      });
      return children();
    }
  };
});
jest.mock('@kbn/monaco', () => {
  const original = jest.requireActual('@kbn/monaco');
  return { ...original,
    PainlessLang: {
      ID: 'painless',
      getSuggestionProvider: () => undefined,
      getSyntaxErrors: () => ({
        [EDITOR_ID]: []
      })
    }
  };
});
jest.mock('../../../../kibana_react/public', () => {
  const original = jest.requireActual('../../../../kibana_react/public');
  /**
   * We mock the CodeEditor because it requires the <KibanaReactContextProvider>
   * with the uiSettings passed down. Let's use a simple <input /> in our tests.
   */

  const CodeEditorMock = props => {
    // Forward our deterministic ID to the consumer
    // We need below for the PainlessLang.getSyntaxErrors mock
    props.editorDidMount({
      getModel() {
        return {
          id: EDITOR_ID
        };
      }

    });
    return /*#__PURE__*/_react.default.createElement("input", {
      "data-test-subj": props['data-test-subj'] || 'mockCodeEditor',
      "data-value": props.value,
      value: props.value,
      onChange: e => {
        props.onChange(e.target.value);
      }
    });
  };

  return { ...original,
    toMountPoint: node => node,
    CodeEditor: CodeEditorMock
  };
});