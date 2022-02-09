"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadlessChromiumDriverFactory = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _utils = require("@kbn/utils");

var _del = _interopRequireDefault(require("del"));

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

var _ = require("../");

var _schema_utils = require("../../../../common/schema_utils");

var _safe_child_process = require("../../safe_child_process");

var _driver = require("../driver");

var _args = require("./args");

var _metrics = require("./metrics");

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


class HeadlessChromiumDriverFactory {
  constructor(core, binaryPath, logger) {
    (0, _defineProperty2.default)(this, "binaryPath", void 0);
    (0, _defineProperty2.default)(this, "captureConfig", void 0);
    (0, _defineProperty2.default)(this, "browserConfig", void 0);
    (0, _defineProperty2.default)(this, "userDataDir", void 0);
    (0, _defineProperty2.default)(this, "getChromiumArgs", void 0);
    (0, _defineProperty2.default)(this, "core", void 0);
    (0, _defineProperty2.default)(this, "type", 'chromium');
    this.core = core;
    this.binaryPath = binaryPath;
    const config = core.getConfig();
    this.captureConfig = config.get('capture');
    this.browserConfig = this.captureConfig.browser.chromium;

    if (this.browserConfig.disableSandbox) {
      logger.warning(`Enabling the Chromium sandbox provides an additional layer of protection.`);
    }

    this.userDataDir = _fs.default.mkdtempSync(_path.default.join((0, _utils.getDataPath)(), 'chromium-'));

    this.getChromiumArgs = () => (0, _args.args)({
      userDataDir: this.userDataDir,
      disableSandbox: this.browserConfig.disableSandbox,
      proxy: this.browserConfig.proxy
    });
  }
  /*
   * Return an observable to objects which will drive screenshot capture for a page
   */


  createPage({
    browserTimezone
  }, pLogger) {
    // FIXME: 'create' is deprecated
    return Rx.Observable.create(async observer => {
      const logger = pLogger.clone(['browser-driver']);
      logger.info(`Creating browser page driver`);
      const chromiumArgs = this.getChromiumArgs();
      logger.debug(`Chromium launch args set to: ${chromiumArgs}`);
      let browser;
      let page;
      let devTools;
      let startMetrics;

      try {
        browser = await _puppeteer.default.launch({
          pipe: !this.browserConfig.inspect,
          userDataDir: this.userDataDir,
          executablePath: this.binaryPath,
          ignoreHTTPSErrors: true,
          handleSIGHUP: false,
          args: chromiumArgs,
          env: {
            TZ: browserTimezone
          }
        });
        page = await browser.newPage();
        devTools = await page.target().createCDPSession();
        await devTools.send('Performance.enable', {
          timeDomain: 'timeTicks'
        });
        startMetrics = await devTools.send('Performance.getMetrics'); // Log version info for debugging / maintenance

        const versionInfo = await devTools.send('Browser.getVersion');
        logger.debug(`Browser version: ${JSON.stringify(versionInfo)}`);
        await page.emulateTimezone(browserTimezone); // Set the default timeout for all navigation methods to the openUrl timeout (30 seconds)
        // All waitFor methods have their own timeout config passed in to them

        page.setDefaultTimeout((0, _schema_utils.durationToNumber)(this.captureConfig.timeouts.openUrl));
        logger.debug(`Browser page driver created`);
      } catch (err) {
        observer.error(new Error(`Error spawning Chromium browser!`));
        observer.error(err);
        throw err;
      }

      const childProcess = {
        async kill() {
          try {
            if (devTools && startMetrics) {
              var _apm$currentTransacti, _apm$currentTransacti2;

              const endMetrics = await devTools.send('Performance.getMetrics');
              const {
                cpu,
                cpuInPercentage,
                memory,
                memoryInMegabytes
              } = (0, _metrics.getMetrics)(startMetrics, endMetrics);
              (_apm$currentTransacti = _elasticApmNode.default.currentTransaction) === null || _apm$currentTransacti === void 0 ? void 0 : _apm$currentTransacti.setLabel('cpu', cpu, false);
              (_apm$currentTransacti2 = _elasticApmNode.default.currentTransaction) === null || _apm$currentTransacti2 === void 0 ? void 0 : _apm$currentTransacti2.setLabel('memory', memory, false);
              logger.debug(`Chromium consumed CPU ${cpuInPercentage}% Memory ${memoryInMegabytes}MB`);
            }
          } catch (error) {
            logger.error(error);
          }

          try {
            await browser.close();
          } catch (err) {
            // do not throw
            logger.error(err);
          }
        }

      };
      const {
        terminate$
      } = (0, _safe_child_process.safeChildProcess)(logger, childProcess); // this is adding unsubscribe logic to our observer
      // so that if our observer unsubscribes, we terminate our child-process

      observer.add(() => {
        logger.debug(`The browser process observer has unsubscribed. Closing the browser...`);
        childProcess.kill(); // ignore async
      }); // make the observer subscribe to terminate$

      observer.add(terminate$.pipe((0, _operators.tap)(signal => {
        logger.debug(`Termination signal received: ${signal}`);
      }), (0, _operators.ignoreElements)()).subscribe(observer)); // taps the browser log streams and combine them to Kibana logs

      this.getBrowserLogger(page, logger).subscribe();
      this.getProcessLogger(browser, logger).subscribe(); // HeadlessChromiumDriver: object to "drive" a browser page

      const driver = new _driver.HeadlessChromiumDriver(this.core, page, {
        inspect: !!this.browserConfig.inspect,
        networkPolicy: this.captureConfig.networkPolicy
      }); // Rx.Observable<never>: stream to interrupt page capture

      const exit$ = this.getPageExit(browser, page);
      observer.next({
        driver,
        exit$
      }); // unsubscribe logic makes a best-effort attempt to delete the user data directory used by chromium

      observer.add(() => {
        const userDataDir = this.userDataDir;
        logger.debug(`deleting chromium user data directory at [${userDataDir}]`); // the unsubscribe function isn't `async` so we're going to make our best effort at
        // deleting the userDataDir and if it fails log an error.

        (0, _del.default)(userDataDir, {
          force: true
        }).catch(error => {
          logger.error(`error deleting user data directory at [${userDataDir}]!`);
          logger.error(error);
        });
      });
    });
  }

  getBrowserLogger(page, logger) {
    const consoleMessages$ = Rx.fromEvent(page, 'console').pipe((0, _operators.map)(line => {
      const formatLine = () => {
        var _line$text, _line$location;

        return `{ text: "${(_line$text = line.text()) === null || _line$text === void 0 ? void 0 : _line$text.trim()}", url: ${(_line$location = line.location()) === null || _line$location === void 0 ? void 0 : _line$location.url} }`;
      };

      if (line.type() === 'error') {
        logger.error(`Error in browser console: ${formatLine()}`, ['headless-browser-console']);
      } else {
        logger.debug(`Message in browser console: ${formatLine()}`, [`headless-browser-console:${line.type()}`]);
      }
    }));
    const uncaughtExceptionPageError$ = Rx.fromEvent(page, 'pageerror').pipe((0, _operators.map)(err => {
      logger.warning(_i18n.i18n.translate('xpack.reporting.browsers.chromium.pageErrorDetected', {
        defaultMessage: `Reporting encountered an uncaught error on the page that will be ignored: {err}`,
        values: {
          err: err.toString()
        }
      }));
    }));
    const pageRequestFailed$ = Rx.fromEvent(page, 'requestfailed').pipe((0, _operators.map)(req => {
      const failure = req.failure && req.failure();

      if (failure) {
        logger.warning(`Request to [${req.url()}] failed! [${failure.errorText}]. This error will be ignored.`);
      }
    }));
    return Rx.merge(consoleMessages$, uncaughtExceptionPageError$, pageRequestFailed$);
  }

  getProcessLogger(browser, logger) {
    const childProcess = browser.process(); // NOTE: The browser driver can not observe stdout and stderr of the child process
    // Puppeteer doesn't give a handle to the original ChildProcess object
    // See https://github.com/GoogleChrome/puppeteer/issues/1292#issuecomment-521470627

    if (childProcess == null) {
      throw new TypeError('childProcess is null or undefined!');
    } // just log closing of the process


    const processClose$ = Rx.fromEvent(childProcess, 'close').pipe((0, _operators.tap)(() => {
      logger.debug('child process closed', ['headless-browser-process']);
    }));
    return processClose$; // ideally, this would also merge with observers for stdout and stderr
  }

  getPageExit(browser, page) {
    const pageError$ = Rx.fromEvent(page, 'error').pipe((0, _operators.mergeMap)(err => {
      return Rx.throwError(_i18n.i18n.translate('xpack.reporting.browsers.chromium.errorDetected', {
        defaultMessage: 'Reporting encountered an error: {err}',
        values: {
          err: err.toString()
        }
      }));
    }));
    const browserDisconnect$ = Rx.fromEvent(browser, 'disconnected').pipe((0, _operators.mergeMap)(() => Rx.throwError((0, _.getChromiumDisconnectedError)())));
    return Rx.merge(pageError$, browserDisconnect$);
  }

}

exports.HeadlessChromiumDriverFactory = HeadlessChromiumDriverFactory;