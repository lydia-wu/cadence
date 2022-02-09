"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorybookContext = void 0;

var _react = _interopRequireDefault(require("react"));

var _history = require("history");

var _react2 = require("@kbn/i18n/react");

var _public = require("../../../../../src/core/public");

var _storybook = require("../../../../../src/plugins/custom_integrations/storybook");

var _app = require("../../public/applications/integrations/app");

var _use_request = require("../../public/hooks/use_request");

var _custom_integrations = require("../../public/services/custom_integrations");

var _application = require("./application");

var _chrome = require("./chrome");

var _http = require("./http");

var _ui_settings = require("./ui_settings");

var _notifications = require("./notifications");

var _stubs = require("./stubs");

var _doc_links = require("./doc_links");

var _cloud = require("./cloud");

var _share = require("./share");

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
} // TODO: clintandrewhall - this is not ideal, or complete.  The root context of Fleet applications
// requires full start contracts of its dependencies.  As a result, we have to mock all of those contracts
// with Storybook equivalents.  This is a temporary solution, and should be replaced with a more complete
// mock later, (or, ideally, Fleet starts to use a service abstraction).
//
// Expect this to grow as components that are given Stories need access to mocked services.


const StorybookContext = ({
  storyContext,
  children: storyChildren
}) => {
  const basepath = '';
  const browserHistory = (0, _history.createBrowserHistory)();
  const history = new _public.ScopedHistory(browserHistory, basepath);
  const startServices = { ..._stubs.stubbedStartServices,
    application: (0, _application.getApplication)(),
    chrome: (0, _chrome.getChrome)(),
    cloud: (0, _cloud.getCloud)({
      isCloudEnabled: storyContext === null || storyContext === void 0 ? void 0 : storyContext.args.isCloudEnabled
    }),
    customIntegrations: {
      ContextProvider: (0, _storybook.getStorybookContextProvider)()
    },
    docLinks: (0, _doc_links.getDocLinks)(),
    http: (0, _http.getHttp)(),
    i18n: {
      Context: function I18nContext({
        children
      }) {
        return /*#__PURE__*/_react.default.createElement(_react2.I18nProvider, null, children);
      }
    },
    injectedMetadata: {
      getInjectedVar: () => null
    },
    notifications: (0, _notifications.getNotifications)(),
    share: (0, _share.getShare)(),
    uiSettings: (0, _ui_settings.getUiSettings)()
  };
  (0, _use_request.setHttpClient)(startServices.http);
  (0, _custom_integrations.setCustomIntegrations)({
    getAppendCustomIntegrations: async () => [],
    getReplacementCustomIntegrations: async () => {
      const {
        integrations
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('./fixtures/replacement_integrations')));
      return integrations;
    }
  });
  const config = {
    enabled: true,
    agents: {
      enabled: true,
      elasticsearch: {}
    }
  };
  const extensions = {};
  const kibanaVersion = '1.2.3';

  const setHeaderActionMenu = () => {};

  return /*#__PURE__*/_react.default.createElement(_app.IntegrationsAppContext, {
    kibanaVersion,
    basepath,
    config,
    history,
    startServices,
    extensions,
    setHeaderActionMenu
  }, storyChildren);
};

exports.StorybookContext = StorybookContext;