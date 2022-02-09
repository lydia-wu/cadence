"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDatatable = void 0;

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

const getDatatable = getFormatFactory => ({
  name: 'lens_datatable',
  type: 'render',
  inputTypes: ['lens_multitable'],
  help: _i18n.i18n.translate('xpack.lens.datatable.expressionHelpLabel', {
    defaultMessage: 'Datatable renderer'
  }),
  args: {
    title: {
      types: ['string'],
      help: _i18n.i18n.translate('xpack.lens.datatable.titleLabel', {
        defaultMessage: 'Title'
      })
    },
    description: {
      types: ['string'],
      help: ''
    },
    columns: {
      types: ['lens_datatable_column'],
      help: '',
      multi: true
    },
    sortingColumnId: {
      types: ['string'],
      help: ''
    },
    sortingDirection: {
      types: ['string'],
      help: ''
    }
  },

  async fn(...args) {
    /** Build optimization: prevent adding extra code into initial bundle **/
    const {
      datatableFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./datatable_fn')));
    return datatableFn(getFormatFactory)(...args);
  }

});

exports.getDatatable = getDatatable;