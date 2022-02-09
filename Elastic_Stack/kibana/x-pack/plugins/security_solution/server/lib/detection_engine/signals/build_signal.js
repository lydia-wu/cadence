"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeClashes = exports.buildSignal = exports.buildParent = exports.buildAncestors = exports.additionalSignalFields = void 0;

var _get_signals_template = require("../routes/index/get_signals_template");

var _build_event_type_signal = require("./build_event_type_signal");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Takes a parent signal or event document and extracts the information needed for the corresponding entry in the child
 * signal's `signal.parents` array.
 * @param doc The parent signal or event
 */


const buildParent = doc => {
  var _doc$_source;

  if (((_doc$_source = doc._source) === null || _doc$_source === void 0 ? void 0 : _doc$_source.signal) != null) {
    var _doc$_source2, _ref, _doc$_source$signal$d, _doc$_source3, _doc$_source4, _doc$_source4$signal$;

    return {
      rule: (_doc$_source2 = doc._source) === null || _doc$_source2 === void 0 ? void 0 : _doc$_source2.signal.rule.id,
      id: doc._id,
      type: 'signal',
      index: doc._index,
      // We first look for signal.depth and use that if it exists. If it doesn't exist, this should be a pre-7.10 signal
      // and should have signal.parent.depth instead. signal.parent.depth in this case is treated as equivalent to signal.depth.
      depth: (_ref = (_doc$_source$signal$d = (_doc$_source3 = doc._source) === null || _doc$_source3 === void 0 ? void 0 : _doc$_source3.signal.depth) !== null && _doc$_source$signal$d !== void 0 ? _doc$_source$signal$d : (_doc$_source4 = doc._source) === null || _doc$_source4 === void 0 ? void 0 : (_doc$_source4$signal$ = _doc$_source4.signal.parent) === null || _doc$_source4$signal$ === void 0 ? void 0 : _doc$_source4$signal$.depth) !== null && _ref !== void 0 ? _ref : 1
    };
  } else {
    return {
      id: doc._id,
      type: 'event',
      index: doc._index,
      depth: 0
    };
  }
};
/**
 * Takes a parent signal or event document with N ancestors and adds the parent document to the ancestry array,
 * creating an array of N+1 ancestors.
 * @param doc The parent signal/event for which to extend the ancestry.
 */


exports.buildParent = buildParent;

const buildAncestors = doc => {
  var _doc$_source5, _doc$_source5$signal;

  const newAncestor = buildParent(doc);
  const existingAncestors = (_doc$_source5 = doc._source) === null || _doc$_source5 === void 0 ? void 0 : (_doc$_source5$signal = _doc$_source5.signal) === null || _doc$_source5$signal === void 0 ? void 0 : _doc$_source5$signal.ancestors;

  if (existingAncestors != null) {
    return [...existingAncestors, newAncestor];
  } else {
    return [newAncestor];
  }
};
/**
 * This removes any signal named clashes such as if a source index has
 * "signal" but is not a signal object we put onto the object. If this
 * is our "signal object" then we don't want to remove it.
 * @param doc The source index doc to a signal.
 */


exports.buildAncestors = buildAncestors;

const removeClashes = doc => {
  // @ts-expect-error @elastic/elasticsearch _source is optional
  const {
    signal,
    ...noSignal
  } = doc._source;

  if (signal == null || (0, _build_event_type_signal.isEventTypeSignal)(doc)) {
    return doc;
  } else {
    return { ...doc,
      _source: { ...noSignal
      }
    };
  }
};
/**
 * Builds the `signal.*` fields that are common across all signals.
 * @param docs The parent signals/events of the new signal to be built.
 * @param rule The rule that is generating the new signal.
 */


exports.removeClashes = removeClashes;

const buildSignal = (docs, rule, reason) => {
  const _meta = {
    version: _get_signals_template.SIGNALS_TEMPLATE_VERSION
  };
  const removedClashes = docs.map(removeClashes);
  const parents = removedClashes.map(buildParent);
  const depth = parents.reduce((acc, parent) => Math.max(parent.depth, acc), 0) + 1;
  const ancestors = removedClashes.reduce((acc, doc) => acc.concat(buildAncestors(doc)), []);
  return {
    _meta,
    parents,
    ancestors,
    status: 'open',
    rule,
    reason,
    depth
  };
};

exports.buildSignal = buildSignal;

const isThresholdResult = thresholdResult => {
  return typeof thresholdResult === 'object';
};
/**
 * Creates signal fields that are only available in the special case where a signal has only 1 parent signal/event.
 * We copy the original time from the document as "original_time" since we override the timestamp with the current date time.
 * @param doc The parent signal/event of the new signal to be built.
 */


const additionalSignalFields = doc => {
  var _doc$_source6, _doc$_source$event, _doc$_source7, _doc$_source8, _doc$_source9;

  const thresholdResult = (_doc$_source6 = doc._source) === null || _doc$_source6 === void 0 ? void 0 : _doc$_source6.threshold_result;

  if (thresholdResult != null && !isThresholdResult(thresholdResult)) {
    throw new Error(`threshold_result failed to validate: ${thresholdResult}`);
  }

  const originalTime = (0, _utils.getValidDateFromDoc)({
    doc,
    timestampOverride: undefined
  });
  return {
    parent: buildParent(removeClashes(doc)),
    original_time: originalTime != null ? originalTime.toISOString() : undefined,
    original_event: (_doc$_source$event = (_doc$_source7 = doc._source) === null || _doc$_source7 === void 0 ? void 0 : _doc$_source7.event) !== null && _doc$_source$event !== void 0 ? _doc$_source$event : undefined,
    threshold_result: thresholdResult,
    original_signal: ((_doc$_source8 = doc._source) === null || _doc$_source8 === void 0 ? void 0 : _doc$_source8.signal) != null && !(0, _build_event_type_signal.isEventTypeSignal)(doc) ? (_doc$_source9 = doc._source) === null || _doc$_source9 === void 0 ? void 0 : _doc$_source9.signal : undefined
  };
};

exports.additionalSignalFields = additionalSignalFields;