"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScreenshotObservableHandler = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

var _schema_utils = require("../../../common/schema_utils");

var _chromium = require("../../browsers/chromium");

var _get_element_position_data = require("./get_element_position_data");

var _get_number_of_items = require("./get_number_of_items");

var _get_render_errors = require("./get_render_errors");

var _get_screenshots = require("./get_screenshots");

var _get_time_range = require("./get_time_range");

var _inject_css = require("./inject_css");

var _open_url = require("./open_url");

var _wait_for_render = require("./wait_for_render");

var _wait_for_visualizations = require("./wait_for_visualizations");

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


class ScreenshotObservableHandler {
  constructor(driver, opts, timeouts) {
    (0, _defineProperty2.default)(this, "conditionalHeaders", void 0);
    (0, _defineProperty2.default)(this, "layout", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.driver = driver;
    this.timeouts = timeouts;
    this.conditionalHeaders = opts.conditionalHeaders;
    this.layout = opts.layout;
    this.logger = opts.logger;
  }
  /*
   * Decorates a TimeoutError with context of the phase that has timed out.
   */


  waitUntil(phase) {
    const {
      timeoutValue,
      label,
      configValue
    } = phase;
    return source => source.pipe((0, _operators.catchError)(error => {
      throw new Error(`The "${label}" phase encountered an error: ${error}`);
    }), (0, _operators.timeoutWith)(timeoutValue, Rx.throwError(new Error(`The "${label}" phase took longer than ${(0, _schema_utils.numberToDuration)(timeoutValue).asSeconds()} seconds. You may need to increase "${configValue}"`))));
  }

  openUrl(index, urlOrUrlLocatorTuple) {
    return Rx.defer(() => (0, _open_url.openUrl)(this.timeouts.openUrl.timeoutValue, this.driver, index, urlOrUrlLocatorTuple, this.conditionalHeaders, this.layout, this.logger)).pipe(this.waitUntil(this.timeouts.openUrl));
  }

  waitForElements() {
    const driver = this.driver;
    const waitTimeout = this.timeouts.waitForElements.timeoutValue;
    return Rx.defer(() => (0, _get_number_of_items.getNumberOfItems)(waitTimeout, driver, this.layout, this.logger)).pipe((0, _operators.mergeMap)(itemsCount => {
      // set the viewport to the dimentions from the job, to allow elements to flow into the expected layout
      const viewport = this.layout.getViewport(itemsCount) || getDefaultViewPort();
      return Rx.forkJoin([driver.setViewport(viewport, this.logger), (0, _wait_for_visualizations.waitForVisualizations)(waitTimeout, driver, itemsCount, this.layout, this.logger)]);
    }), this.waitUntil(this.timeouts.waitForElements));
  }

  completeRender(apmTrans) {
    const driver = this.driver;
    const layout = this.layout;
    const logger = this.logger;
    return Rx.defer(async () => {
      var _layout$positionEleme; // Waiting till _after_ elements have rendered before injecting our CSS
      // allows for them to be displayed properly in many cases


      await (0, _inject_css.injectCustomCss)(driver, layout, logger);
      const apmPositionElements = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('position_elements', 'correction'); // position panel elements for print layout

      await ((_layout$positionEleme = layout.positionElements) === null || _layout$positionEleme === void 0 ? void 0 : _layout$positionEleme.call(layout, driver, logger));
      apmPositionElements === null || apmPositionElements === void 0 ? void 0 : apmPositionElements.end();
      await (0, _wait_for_render.waitForRenderComplete)(this.timeouts.loadDelay, driver, layout, logger);
    }).pipe((0, _operators.mergeMap)(() => Rx.forkJoin({
      timeRange: (0, _get_time_range.getTimeRange)(driver, layout, logger),
      elementsPositionAndAttributes: (0, _get_element_position_data.getElementPositionAndAttributes)(driver, layout, logger),
      renderErrors: (0, _get_render_errors.getRenderErrors)(driver, layout, logger)
    })), this.waitUntil(this.timeouts.renderComplete));
  }

  setupPage(index, urlOrUrlLocatorTuple, apmTrans) {
    return this.openUrl(index, urlOrUrlLocatorTuple).pipe((0, _operators.switchMapTo)(this.waitForElements()), (0, _operators.switchMapTo)(this.completeRender(apmTrans)));
  }

  getScreenshots() {
    return withRenderComplete => withRenderComplete.pipe((0, _operators.mergeMap)(async data => {
      var _data$elementsPositio;

      this.checkPageIsOpen(); // fail the report job if the browser has closed

      const elements = (_data$elementsPositio = data.elementsPositionAndAttributes) !== null && _data$elementsPositio !== void 0 ? _data$elementsPositio : getDefaultElementPosition(this.layout.getViewport(1));
      const screenshots = await (0, _get_screenshots.getScreenshots)(this.driver, elements, this.logger);
      const {
        timeRange,
        error: setupError
      } = data;
      return {
        timeRange,
        screenshots,
        error: setupError,
        elementsPositionAndAttributes: elements
      };
    }));
  }

  checkPageIsOpen() {
    if (!this.driver.isPageOpen()) {
      throw (0, _chromium.getChromiumDisconnectedError)();
    }
  }

}

exports.ScreenshotObservableHandler = ScreenshotObservableHandler;
const DEFAULT_SCREENSHOT_CLIP_HEIGHT = 1200;
const DEFAULT_SCREENSHOT_CLIP_WIDTH = 1800;

const getDefaultElementPosition = dimensions => {
  const height = (dimensions === null || dimensions === void 0 ? void 0 : dimensions.height) || DEFAULT_SCREENSHOT_CLIP_HEIGHT;
  const width = (dimensions === null || dimensions === void 0 ? void 0 : dimensions.width) || DEFAULT_SCREENSHOT_CLIP_WIDTH;
  return [{
    position: {
      boundingClientRect: {
        top: 0,
        left: 0,
        height,
        width
      },
      scroll: {
        x: 0,
        y: 0
      }
    },
    attributes: {}
  }];
};
/*
 * If Kibana is showing a non-HTML error message, the viewport might not be
 * provided by the browser.
 */


const getDefaultViewPort = () => ({
  height: DEFAULT_SCREENSHOT_CLIP_HEIGHT,
  width: DEFAULT_SCREENSHOT_CLIP_WIDTH,
  zoom: 1
});