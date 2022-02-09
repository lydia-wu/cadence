"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAsyncValidationData = void 0;

var _react = require("react");

var _rxjs = require("rxjs");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const useAsyncValidationData = state => {
  const validationData$ = (0, _react.useRef)();
  const getValidationData$ = (0, _react.useCallback)(() => {
    if (validationData$.current === undefined) {
      validationData$.current = new _rxjs.Subject();
    }

    return validationData$.current;
  }, []);
  const hook = (0, _react.useMemo)(() => {
    const subject = getValidationData$();
    const observable = subject.asObservable();
    const next = subject.next.bind(subject);
    return [observable, next];
  }, [getValidationData$]); // Whenever the state changes we update the observable

  (0, _react.useEffect)(() => {
    getValidationData$().next(state);
  }, [state, getValidationData$]);
  return hook;
};

exports.useAsyncValidationData = useAsyncValidationData;