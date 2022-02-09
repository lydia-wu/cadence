"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectPairIntersection = exports.objectArrayIntersection = exports.buildSignalGroupFromSequence = exports.buildSignalFromSequence = exports.buildSignalFromEvent = exports.buildBulkBody = void 0;

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _strategies = require("./source_fields_merging/strategies");

var _build_rule = require("./build_rule");

var _build_signal = require("./build_signal");

var _build_event_type_signal = require("./build_event_type_signal");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Formats the search_after result for insertion into the signals index. We first create a
 * "best effort" merged "fields" with the "_source" object, then build the signal object,
 * then the event object, and finally we strip away any additional temporary data that was added
 * such as the "threshold_result".
 * @param ruleSO The rule saved object to build overrides
 * @param doc The SignalSourceHit with "_source", "fields", and additional data such as "threshold_result"
 * @returns The body that can be added to a bulk call for inserting the signal.
 */


const buildBulkBody = (ruleSO, doc, mergeStrategy, ignoreFields, buildReasonMessage) => {
  var _mergedDoc$_source;

  const mergedDoc = (0, _strategies.getMergeStrategy)(mergeStrategy)({
    doc,
    ignoreFields
  });
  const rule = (0, _build_rule.buildRuleWithOverrides)(ruleSO, (_mergedDoc$_source = mergedDoc._source) !== null && _mergedDoc$_source !== void 0 ? _mergedDoc$_source : {});
  const timestamp = new Date().toISOString();
  const reason = buildReasonMessage({
    mergedDoc,
    rule
  });
  const signal = { ...(0, _build_signal.buildSignal)([mergedDoc], rule, reason),
    ...(0, _build_signal.additionalSignalFields)(mergedDoc)
  };
  const event = (0, _build_event_type_signal.buildEventTypeSignal)(mergedDoc); // Filter out any kibana.* fields from the generated signal - kibana.* fields are aliases
  // in siem-signals so we can't write to them, but for signals-on-signals they'll be returned
  // in the fields API response and merged into the mergedDoc source

  const {
    threshold_result: thresholdResult,
    kibana,
    ...filteredSource
  } = mergedDoc._source || {
    threshold_result: null
  };
  const signalHit = { ...filteredSource,
    [_ruleDataUtils.TIMESTAMP]: timestamp,
    event,
    signal
  };
  return signalHit;
};
/**
 * Takes N raw documents from ES that form a sequence and builds them into N+1 signals ready to be indexed -
 * one signal for each event in the sequence, and a "shell" signal that ties them all together. All N+1 signals
 * share the same signal.group.id to make it easy to query them.
 * @param sequence The raw ES documents that make up the sequence
 * @param ruleSO SavedObject representing the rule that found the sequence
 * @param outputIndex Index to write the resulting signals to
 */


exports.buildBulkBody = buildBulkBody;

const buildSignalGroupFromSequence = (sequence, ruleSO, outputIndex, mergeStrategy, ignoreFields, buildReasonMessage) => {
  const wrappedBuildingBlocks = (0, _utils.wrapBuildingBlocks)(sequence.events.map(event => {
    const signal = buildSignalFromEvent(event, ruleSO, false, mergeStrategy, ignoreFields, buildReasonMessage);
    signal.signal.rule.building_block_type = 'default';
    return signal;
  }), outputIndex);

  if (wrappedBuildingBlocks.some(block => {
    var _block$_source$signal;

    return (_block$_source$signal = block._source.signal) === null || _block$_source$signal === void 0 ? void 0 : _block$_source$signal.ancestors.some(ancestor => ancestor.rule === ruleSO.id);
  })) {
    return [];
  } // Now that we have an array of building blocks for the events in the sequence,
  // we can build the signal that links the building blocks together
  // and also insert the group id (which is also the "shell" signal _id) in each building block


  const sequenceSignal = (0, _utils.wrapSignal)(buildSignalFromSequence(wrappedBuildingBlocks, ruleSO, buildReasonMessage), outputIndex);
  wrappedBuildingBlocks.forEach((block, idx) => {
    // TODO: fix type of blocks so we don't have to check existence of _source.signal
    if (block._source.signal) {
      block._source.signal.group = {
        id: sequenceSignal._id,
        index: idx
      };
    }
  });
  return [...wrappedBuildingBlocks, sequenceSignal];
};

exports.buildSignalGroupFromSequence = buildSignalGroupFromSequence;

const buildSignalFromSequence = (events, ruleSO, buildReasonMessage) => {
  const rule = (0, _build_rule.buildRuleWithoutOverrides)(ruleSO);
  const timestamp = new Date().toISOString();
  const mergedEvents = objectArrayIntersection(events.map(event => event._source));
  const reason = buildReasonMessage({
    rule,
    mergedDoc: mergedEvents
  });
  const signal = (0, _build_signal.buildSignal)(events, rule, reason);
  return { ...mergedEvents,
    [_ruleDataUtils.TIMESTAMP]: timestamp,
    event: {
      kind: 'signal'
    },
    signal: { ...signal,
      group: {
        // This is the same function that is used later to generate the _id for the sequence signal document,
        // so _id should equal signal.group.id for the "shell" document
        id: (0, _utils.generateSignalId)(signal)
      }
    }
  };
};

exports.buildSignalFromSequence = buildSignalFromSequence;

const buildSignalFromEvent = (event, ruleSO, applyOverrides, mergeStrategy, ignoreFields, buildReasonMessage) => {
  var _mergedEvent$_source;

  const mergedEvent = (0, _strategies.getMergeStrategy)(mergeStrategy)({
    doc: event,
    ignoreFields
  });
  const rule = applyOverrides ? (0, _build_rule.buildRuleWithOverrides)(ruleSO, (_mergedEvent$_source = mergedEvent._source) !== null && _mergedEvent$_source !== void 0 ? _mergedEvent$_source : {}) : (0, _build_rule.buildRuleWithoutOverrides)(ruleSO);
  const timestamp = new Date().toISOString();
  const reason = buildReasonMessage({
    mergedDoc: mergedEvent,
    rule
  });
  const signal = { ...(0, _build_signal.buildSignal)([mergedEvent], rule, reason),
    ...(0, _build_signal.additionalSignalFields)(mergedEvent)
  };
  const eventFields = (0, _build_event_type_signal.buildEventTypeSignal)(mergedEvent); // Filter out any kibana.* fields from the generated signal - kibana.* fields are aliases
  // in siem-signals so we can't write to them, but for signals-on-signals they'll be returned
  // in the fields API response and merged into the mergedDoc source

  const {
    kibana,
    ...filteredSource
  } = mergedEvent._source || {}; // TODO: better naming for SignalHit - it's really a new signal to be inserted

  const signalHit = { ...filteredSource,
    [_ruleDataUtils.TIMESTAMP]: timestamp,
    event: eventFields,
    signal
  };
  return signalHit;
};

exports.buildSignalFromEvent = buildSignalFromEvent;

const objectArrayIntersection = objects => {
  if (objects.length === 0) {
    return undefined;
  } else if (objects.length === 1) {
    return objects[0];
  } else {
    return objects.slice(1).reduce((acc, obj) => objectPairIntersection(acc, obj), objects[0]);
  }
};

exports.objectArrayIntersection = objectArrayIntersection;

const objectPairIntersection = (a, b) => {
  if (a === undefined || b === undefined) {
    return undefined;
  }

  const intersection = {};
  Object.entries(a).forEach(([key, aVal]) => {
    if (key in b) {
      const bVal = b[key];

      if (typeof aVal === 'object' && !(aVal instanceof Array) && aVal !== null && typeof bVal === 'object' && !(bVal instanceof Array) && bVal !== null) {
        intersection[key] = objectPairIntersection(aVal, bVal);
      } else if (aVal === bVal) {
        intersection[key] = aVal;
      }
    }
  }); // Count up the number of entries that are NOT undefined in the intersection
  // If there are no keys OR all entries are undefined, return undefined

  if (Object.values(intersection).reduce((acc, value) => value !== undefined ? acc + 1 : acc, 0) === 0) {
    return undefined;
  } else {
    return intersection;
  }
};

exports.objectPairIntersection = objectPairIntersection;