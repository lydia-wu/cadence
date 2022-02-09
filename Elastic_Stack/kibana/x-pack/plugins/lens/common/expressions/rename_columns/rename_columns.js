"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renameColumns = void 0;

var _i18n = require("@kbn/i18n");

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

const renameColumns = {
  name: 'lens_rename_columns',
  type: 'datatable',
  help: _i18n.i18n.translate('xpack.lens.functions.renameColumns.help', {
    defaultMessage: 'A helper to rename the columns of a datatable'
  }),
  args: {
    idMap: {
      types: ['string'],
      help: _i18n.i18n.translate('xpack.lens.functions.renameColumns.idMap.help', {
        defaultMessage: 'A JSON encoded object in which keys are the old column ids and values are the corresponding new ones. All other columns ids are kept.'
      })
    }
  },
  inputTypes: ['datatable'],

  async fn(...args) {
    /** Build optimization: prevent adding extra code into initial bundle **/
    const {
      renameColumnFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./rename_columns_fn')));
    return renameColumnFn(...args);
  }

};
exports.renameColumns = renameColumns;