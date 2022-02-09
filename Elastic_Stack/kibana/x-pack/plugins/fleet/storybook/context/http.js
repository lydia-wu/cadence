"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHttp = void 0;

var _addonActions = require("@storybook/addon-actions");

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

const BASE_PATH = '';
let isReady = false;

const getHttp = (basepath = BASE_PATH) => {
  const http = {
    basePath: {
      prepend: path => {
        if (path.startsWith('/api/fleet/epm/packages/')) {
          return basepath;
        }

        return `${basepath}${path}`;
      },
      get: () => basepath,
      remove: () => basepath,
      serverBasePath: basepath
    },
    get: async (path, options) => {
      (0, _addonActions.action)('get')(path, options); // TODO: all of this needs revision, as it's far too clunky... but it works for now,
      // with the few paths we're supporting.

      if (path === '/api/fleet/agents/setup') {
        if (!isReady) {
          isReady = true;
          return {
            isReady: false,
            missing_requirements: ['api_keys', 'fleet_server']
          };
        }

        return {
          isInitialized: true,
          nonFatalErrors: []
        };
      }

      if (path === '/api/fleet/epm/categories') {
        return await Promise.resolve().then(() => _interopRequireWildcard(require('./fixtures/categories')));
      }

      if (path === '/api/fleet/epm/packages') {
        var _options$query;

        const category = options === null || options === void 0 ? void 0 : (_options$query = options.query) === null || _options$query === void 0 ? void 0 : _options$query.category;

        if (category && category !== ':category') {
          (0, _addonActions.action)(`CATEGORY QUERY - ${category}`)("KP: CATEGORY ROUTE RELIES ON SAVED_OBJECT API; STORIES DON'T FILTER");
        }

        return await Promise.resolve().then(() => _interopRequireWildcard(require('./fixtures/packages')));
      } // Ideally, this would be a markdown file instead of a ts file, but we don't have
      // markdown-loader in our package.json, so we'll make do with what we have.


      if (path.startsWith('/api/fleet/epm/packages/nginx/')) {
        const {
          readme
        } = await Promise.resolve().then(() => _interopRequireWildcard(require('./fixtures/readme.nginx')));
        return readme;
      }

      if (path.startsWith('/api/fleet/epm/packages/nginx')) {
        return await Promise.resolve().then(() => _interopRequireWildcard(require('./fixtures/integration.nginx')));
      } // Ideally, this would be a markdown file instead of a ts file, but we don't have
      // markdown-loader in our package.json, so we'll make do with what we have.


      if (path.startsWith('/api/fleet/epm/packages/okta/')) {
        const {
          readme
        } = await Promise.resolve().then(() => _interopRequireWildcard(require('./fixtures/readme.okta')));
        return readme;
      }

      if (path.startsWith('/api/fleet/epm/packages/okta')) {
        return await Promise.resolve().then(() => _interopRequireWildcard(require('./fixtures/integration.okta')));
      }

      if (path.startsWith('/api/fleet/check-permissions')) {
        return {
          success: true
        };
      }

      (0, _addonActions.action)(path)('KP: UNSUPPORTED ROUTE');
      return {};
    }
  };
  return http;
};

exports.getHttp = getHttp;