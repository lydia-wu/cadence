"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeClashes = exports.generateAlertId = exports.buildParent = exports.buildAncestors = exports.buildAlert = exports.additionalAlertFields = void 0;

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _crypto = require("crypto");

var _build_event_type_signal = require("../../../signals/build_event_type_signal");

var _utils = require("../../../signals/utils");

var _invariant = require("../../../../../../common/utils/invariant");

var _flatten_with_prefix = require("./flatten_with_prefix");

var _field_names = require("../../field_maps/field_names");

var _constants = require("../../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const generateAlertId = alert => {
  return (0, _crypto.createHash)('sha256').update(alert['kibana.alert.ancestors'].reduce((acc, ancestor) => acc.concat(ancestor.id, ancestor.index), '').concat(alert[_ruleDataUtils.ALERT_RULE_UUID])).digest('hex');
};
/**
 * Takes an event document and extracts the information needed for the corresponding entry in the child
 * alert's ancestors array.
 * @param doc The parent event
 */


exports.generateAlertId = generateAlertId;

const buildParent = doc => {
  var _getField;

  const isSignal = (0, _utils.isWrappedSignalHit)(doc) || (0, _utils.isWrappedRACAlert)(doc);
  const parent = {
    id: doc._id,
    type: isSignal ? 'signal' : 'event',
    index: doc._index,
    depth: isSignal ? (_getField = (0, _utils.getField)(doc, 'signal.depth')) !== null && _getField !== void 0 ? _getField : 1 : 0
  };

  if (isSignal) {
    parent.rule = (0, _utils.getField)(doc, 'signal.rule.id');
  }

  return parent;
};
/**
 * Takes a parent event document with N ancestors and adds the parent document to the ancestry array,
 * creating an array of N+1 ancestors.
 * @param doc The parent event for which to extend the ancestry.
 */


exports.buildParent = buildParent;

const buildAncestors = doc => {
  var _getField2;

  const newAncestor = buildParent(doc);
  const existingAncestors = (_getField2 = (0, _utils.getField)(doc, 'signal.ancestors')) !== null && _getField2 !== void 0 ? _getField2 : [];
  return [...existingAncestors, newAncestor];
};
/**
 * This removes any alert name clashes such as if a source index has
 * "signal" but is not a signal object we put onto the object. If this
 * is our "signal object" then we don't want to remove it.
 * @param doc The source index doc to a signal.
 */


exports.buildAncestors = buildAncestors;

const removeClashes = doc => {
  if ((0, _utils.isWrappedSignalHit)(doc)) {
    (0, _invariant.invariant)(doc._source, '_source field not found');
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
  }

  return doc;
};
/**
 * Builds the `kibana.alert.*` fields that are common across all alerts.
 * @param docs The parent alerts/events of the new alert to be built.
 * @param rule The rule that is generating the new alert.
 */


exports.removeClashes = removeClashes;

const buildAlert = (docs, rule, spaceId, reason) => {
  const removedClashes = docs.map(removeClashes);
  const parents = removedClashes.map(buildParent);
  const depth = parents.reduce((acc, parent) => Math.max(parent.depth, acc), 0) + 1;
  const ancestors = removedClashes.reduce((acc, doc) => acc.concat(buildAncestors(doc)), []);
  const {
    id,
    output_index: outputIndex,
    ...mappedRule
  } = rule;
  mappedRule.uuid = id;
  return {
    [_ruleDataUtils.TIMESTAMP]: new Date().toISOString(),
    [_ruleDataUtils.ALERT_RULE_CONSUMER]: _constants.SERVER_APP_ID,
    [_ruleDataUtils.SPACE_IDS]: spaceId != null ? [spaceId] : [],
    [_field_names.ALERT_ANCESTORS]: ancestors,
    [_ruleDataUtils.ALERT_STATUS]: _ruleDataUtils.ALERT_STATUS_ACTIVE,
    [_ruleDataUtils.ALERT_WORKFLOW_STATUS]: 'open',
    [_field_names.ALERT_DEPTH]: depth,
    [_ruleDataUtils.ALERT_REASON]: reason,
    ...(0, _flatten_with_prefix.flattenWithPrefix)(_ruleDataUtils.ALERT_RULE_NAMESPACE, mappedRule)
  };
};
/**
 * Creates signal fields that are only available in the special case where a signal has only 1 parent signal/event.
 * We copy the original time from the document as "original_time" since we override the timestamp with the current date time.
 * @param doc The parent signal/event of the new signal to be built.
 */


exports.buildAlert = buildAlert;

const additionalAlertFields = doc => {
  var _doc$_source;

  const originalTime = (0, _utils.getValidDateFromDoc)({
    doc,
    timestampOverride: undefined
  });
  const additionalFields = {
    [_field_names.ALERT_ORIGINAL_TIME]: originalTime != null ? originalTime.toISOString() : undefined
  };
  const event = (_doc$_source = doc._source) === null || _doc$_source === void 0 ? void 0 : _doc$_source.event;

  if (event != null) {
    additionalFields[_field_names.ALERT_ORIGINAL_EVENT] = event;
  }

  return additionalFields;
};

exports.additionalAlertFields = additionalAlertFields;