"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEventTypeSignal = exports.buildEventTypeSignal = void 0;

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildEventTypeSignal = doc => {
  if (doc._source != null && doc._source.event instanceof Object) {
    return { ...doc._source.event,
      kind: 'signal'
    };
  } else {
    return {
      kind: 'signal'
    };
  }
};
/**
 * Given a document this will return true if that document is a signal
 * document. We can't guarantee the code will call this function with a document
 * before adding the _source.event.kind = "signal" from "buildEventTypeSignal"
 * so we do basic testing to ensure that if the object has the fields of:
 * "signal.rule.id" then it will be one of our signals rather than a customer
 * overwritten signal.
 * @param doc The document which might be a signal or it might be a regular log
 */


exports.buildEventTypeSignal = buildEventTypeSignal;

const isEventTypeSignal = doc => {
  const ruleId = (0, _utils.getField)(doc, 'signal.rule.id');
  return ruleId != null && typeof ruleId === 'string';
};

exports.isEventTypeSignal = isEventTypeSignal;