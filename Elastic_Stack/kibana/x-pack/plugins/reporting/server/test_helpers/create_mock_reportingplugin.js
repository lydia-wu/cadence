"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockReportingCore = exports.createMockPluginStart = exports.createMockPluginSetup = exports.createMockConfigSchema = exports.createMockConfig = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _mocks = require("src/core/server/mocks");

var _mocks2 = require("src/plugins/data/server/mocks");

var _common = require("src/plugins/field_formats/common");

var _2 = require("../");

var _mocks3 = require("../../../features/server/mocks");

var _mocks4 = require("../../../security/server/mocks");

var _mocks5 = require("../../../task_manager/server/mocks");

var _browsers = require("../browsers");

var _lib = require("../lib");

var _services = require("../services");

var _create_mock_levellogger = require("./create_mock_levellogger");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


jest.mock('../routes');
jest.mock('../usage');
jest.mock('../browsers');

_browsers.initializeBrowserDriverFactory.mockImplementation(() => Promise.resolve({}));

_browsers.chromium.createDriverFactory.mockImplementation(() => ({}));

const createMockPluginSetup = setupMock => {
  return {
    features: _mocks3.featuresPluginMock.createSetup(),
    basePath: {
      set: jest.fn()
    },
    router: setupMock.router,
    security: _mocks4.securityMock.createSetup(),
    licensing: {
      license$: Rx.of({
        isAvailable: true,
        isActive: true,
        type: 'basic'
      })
    },
    taskManager: _mocks5.taskManagerMock.createSetup(),
    logger: (0, _create_mock_levellogger.createMockLevelLogger)(),
    ...setupMock
  };
};

exports.createMockPluginSetup = createMockPluginSetup;
const logger = (0, _create_mock_levellogger.createMockLevelLogger)();

const createMockReportingStore = () => ({});

const createMockPluginStart = (mockReportingCore, startMock) => {
  const store = mockReportingCore ? new _lib.ReportingStore(mockReportingCore, logger) : createMockReportingStore();
  return {
    browserDriverFactory: startMock.browserDriverFactory,
    esClient: _mocks.elasticsearchServiceMock.createClusterClient(),
    savedObjects: startMock.savedObjects || {
      getScopedClient: jest.fn()
    },
    uiSettings: startMock.uiSettings || {
      asScopedToClient: () => ({
        get: jest.fn()
      })
    },
    data: startMock.data || _mocks2.dataPluginMock.createStartContract(),
    store,
    taskManager: {
      schedule: jest.fn().mockImplementation(() => ({
        id: 'taskId'
      })),
      ensureScheduled: jest.fn()
    },
    logger: (0, _create_mock_levellogger.createMockLevelLogger)(),
    ...startMock
  };
};

exports.createMockPluginStart = createMockPluginStart;

const createMockConfigSchema = (overrides = {}) => {
  // deeply merge the defaults and the provided partial schema
  return {
    index: '.reporting',
    encryptionKey: 'cool-encryption-key-where-did-you-find-it',
    ...overrides,
    kibanaServer: {
      hostname: 'localhost',
      port: 80,
      ...overrides.kibanaServer
    },
    capture: {
      browser: {
        chromium: {
          disableSandbox: true
        }
      },
      ...overrides.capture
    },
    queue: {
      indexInterval: 'week',
      pollEnabled: true,
      pollInterval: 3000,
      timeout: 120000,
      ...overrides.queue
    },
    csv: { ...overrides.csv
    },
    roles: {
      enabled: false,
      ...overrides.roles
    }
  };
};

exports.createMockConfigSchema = createMockConfigSchema;

const createMockConfig = reportingConfig => {
  const mockConfigGet = jest.fn().mockImplementation((...keys) => {
    return _lodash.default.get(reportingConfig, keys.join('.'));
  });
  return {
    get: mockConfigGet,
    kbnConfig: {
      get: mockConfigGet
    }
  };
};

exports.createMockConfig = createMockConfig;

const createMockReportingCore = async (config, setupDepsMock = undefined, startDepsMock = undefined) => {
  const mockReportingCore = {
    getConfig: () => createMockConfig(config),
    getEsClient: () => {
      var _startDepsMock;

      return (_startDepsMock = startDepsMock) === null || _startDepsMock === void 0 ? void 0 : _startDepsMock.esClient;
    },
    getDataService: () => {
      var _startDepsMock2;

      return (_startDepsMock2 = startDepsMock) === null || _startDepsMock2 === void 0 ? void 0 : _startDepsMock2.data;
    }
  };

  if (!setupDepsMock) {
    setupDepsMock = createMockPluginSetup({});
  }

  if (!startDepsMock) {
    startDepsMock = createMockPluginStart(mockReportingCore, {});
  }

  const context = _mocks.coreMock.createPluginInitializerContext(createMockConfigSchema());

  context.config = {
    get: () => config
  };
  const core = new _2.ReportingCore(logger, context);
  core.setConfig(createMockConfig(config));
  core.pluginSetup(setupDepsMock);
  await core.pluginSetsUp();

  if (!startDepsMock) {
    startDepsMock = createMockPluginStart(core, context);
  }

  await core.pluginStart(startDepsMock);
  await core.pluginStartsUp();
  (0, _services.setFieldFormats)({
    fieldFormatServiceFactory() {
      const fieldFormatsRegistry = new _common.FieldFormatsRegistry();
      return Promise.resolve(fieldFormatsRegistry);
    }

  });
  return core;
};

exports.createMockReportingCore = createMockReportingCore;