"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLimitedConcurrencyRoutes = registerLimitedConcurrencyRoutes;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _constants = require("../../../common/endpoint/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class MaxCounter {
  constructor(max = 1) {
    (0, _defineProperty2.default)(this, "counter", 0);
    this.max = max;
  }

  valueOf() {
    return this.counter;
  }

  increase() {
    if (this.counter < this.max) {
      this.counter += 1;
    }
  }

  decrease() {
    if (this.counter > 0) {
      this.counter -= 1;
    }
  }

  lessThanMax() {
    return this.counter < this.max;
  }

}

function shouldHandleRequest(request) {
  const tags = request.route.options.tags;
  return tags.includes(_constants.LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG);
}

function registerLimitedConcurrencyRoutes(core) {
  const counter = new MaxCounter(_constants.LIMITED_CONCURRENCY_ENDPOINT_COUNT);
  core.http.registerOnPreAuth(function preAuthHandler(request, response, toolkit) {
    if (!shouldHandleRequest(request)) {
      return toolkit.next();
    }

    if (!counter.lessThanMax()) {
      return response.customError({
        body: 'Too Many Requests',
        statusCode: 429
      });
    }

    counter.increase(); // requests.events.aborted$ has a bug (but has test which explicitly verifies) where it's fired even when the request completes
    // https://github.com/elastic/kibana/pull/70495#issuecomment-656288766

    request.events.aborted$.toPromise().then(() => {
      counter.decrease();
    });
    return toolkit.next();
  });
}