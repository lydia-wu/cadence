"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spySearchQueryResponse = exports.spySearchQuery = exports.spyIndexPatternGetAllFields = exports.setupEnvironment = exports.indexPatternNameForTest = exports.fieldFormatsOptions = exports.WithFieldEditorDependencies = void 0;

require("./jest.mocks");

var _react = _interopRequireDefault(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _xhr = _interopRequireDefault(require("axios/lib/adapters/xhr"));

var _lodash = require("lodash");

var _mocks = require("../../../../../core/public/mocks");

var _mocks2 = require("../../../../data/public/mocks");

var _field_editor_context = require("../../../public/components/field_editor_context");

var _preview = require("../../../public/components/preview");

var _lib = require("../../../public/lib");

var _http_requests = require("./http_requests");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const mockHttpClient = _axios.default.create({
  adapter: _xhr.default
});

const dataStart = _mocks2.dataPluginMock.createStartContract();

const {
  search,
  fieldFormats
} = dataStart;
const spySearchQuery = jest.fn();
exports.spySearchQuery = spySearchQuery;
const spySearchQueryResponse = jest.fn();
exports.spySearchQueryResponse = spySearchQueryResponse;
const spyIndexPatternGetAllFields = jest.fn().mockImplementation(() => []);
exports.spyIndexPatternGetAllFields = spyIndexPatternGetAllFields;
spySearchQuery.mockImplementation(params => {
  return {
    toPromise: () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(undefined);
        }, 2000); // simulate 2s latency for the HTTP request
      }).then(() => spySearchQueryResponse());
    }
  };
});
search.search = spySearchQuery;
let apiService;

const setupEnvironment = () => {
  // @ts-expect-error Axios does not fullfill HttpSetupn from core but enough for our tests
  apiService = (0, _lib.initApi)(mockHttpClient);
  const {
    server,
    httpRequestsMockHelpers
  } = (0, _http_requests.init)();
  return {
    server,
    httpRequestsMockHelpers
  };
}; // The format options available in the dropdown select for our tests.


exports.setupEnvironment = setupEnvironment;
const fieldFormatsOptions = [{
  id: 'upper',
  title: 'UpperCaseString'
}];
exports.fieldFormatsOptions = fieldFormatsOptions;
const indexPatternNameForTest = 'testIndexPattern';
exports.indexPatternNameForTest = indexPatternNameForTest;

const WithFieldEditorDependencies = (Comp, overridingDependencies) => props => {
  // Setup mocks
  fieldFormats.getByFieldType.mockReturnValue(fieldFormatsOptions);
  fieldFormats.getDefaultType.mockReturnValue({
    id: 'testDefaultFormat',
    title: 'TestDefaultFormat'
  });
  fieldFormats.getInstance.mockImplementation(id => {
    if (id === 'upper') {
      return {
        convertObject: {
          html(value = '') {
            return `<span>${value.toUpperCase()}</span>`;
          }

        }
      };
    }
  });
  const dependencies = {
    indexPattern: {
      title: indexPatternNameForTest,
      fields: {
        getAll: spyIndexPatternGetAllFields
      }
    },
    uiSettings: _mocks.uiSettingsServiceMock.createStartContract(),
    fieldTypeToProcess: 'runtime',
    existingConcreteFields: [],
    namesNotAllowed: [],
    links: {
      runtimePainless: 'https://elastic.co'
    },
    services: {
      notifications: _mocks.notificationServiceMock.createStartContract(),
      search,
      api: apiService
    },
    fieldFormatEditors: {
      getAll: () => [],
      getById: () => undefined
    },
    fieldFormats
  };
  const mergedDependencies = (0, _lodash.merge)({}, dependencies, overridingDependencies);
  return /*#__PURE__*/_react.default.createElement(_field_editor_context.FieldEditorProvider, mergedDependencies, /*#__PURE__*/_react.default.createElement(_preview.FieldPreviewProvider, null, /*#__PURE__*/_react.default.createElement(Comp, props)));
};

exports.WithFieldEditorDependencies = WithFieldEditorDependencies;