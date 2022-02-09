"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncateMessageList = exports.truncateMessage = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// When we write rule execution status updates to `siem-detection-engine-rule-status` saved objects
// or to event log, we write success and failure messages as well. Those messages are built from
// N errors collected during the "big loop" in the Detection Engine, where N can be very large.
// When N is large the resulting message strings are so large that these documents are up to 26MB.
// These large documents may cause migrations to fail because a batch of 1000 documents easily
// exceed Elasticsearch's `http.max_content_length` which defaults to 100mb.
// In order to fix that, we need to truncate those messages to an adequate MAX length.
// https://github.com/elastic/kibana/pull/112257


const MAX_MESSAGE_LENGTH = 10240;
const MAX_LIST_LENGTH = 20;

const truncateMessage = value => {
  if (value === undefined) {
    return value;
  }

  const str = (0, _lodash.toString)(value);
  return (0, _lodash.truncate)(str, {
    length: MAX_MESSAGE_LENGTH
  });
};

exports.truncateMessage = truncateMessage;

const truncateMessageList = list => {
  const deduplicatedList = (0, _lodash.uniq)(list);
  return (0, _lodash.take)(deduplicatedList, MAX_LIST_LENGTH);
};

exports.truncateMessageList = truncateMessageList;