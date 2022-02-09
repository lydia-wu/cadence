"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAlertRoot = exports.buildAlertGroupFromSequence = void 0;

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _build_rule = require("../../../signals/build_rule");

var _build_alert = require("./build_alert");

var _build_bulk_body = require("./build_bulk_body");

var _generate_building_block_ids = require("./generate_building_block_ids");

var _build_bulk_body2 = require("../../../signals/build_bulk_body");

var _field_names = require("../../field_maps/field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Takes N raw documents from ES that form a sequence and builds them into N+1 signals ready to be indexed -
 * one signal for each event in the sequence, and a "shell" signal that ties them all together. All N+1 signals
 * share the same signal.group.id to make it easy to query them.
 * @param sequence The raw ES documents that make up the sequence
 * @param ruleSO SavedObject representing the rule that found the sequence
 */


const buildAlertGroupFromSequence = (logger, sequence, ruleSO, mergeStrategy, spaceId, buildReasonMessage) => {
  const ancestors = sequence.events.flatMap(event => (0, _build_alert.buildAncestors)(event));

  if (ancestors.some(ancestor => (ancestor === null || ancestor === void 0 ? void 0 : ancestor.rule) === ruleSO.id)) {
    return [];
  }

  let buildingBlocks = [];

  try {
    buildingBlocks = sequence.events.map(event => ({ ...(0, _build_bulk_body.buildBulkBody)(spaceId, ruleSO, event, mergeStrategy, [], false, buildReasonMessage),
      [_field_names.ALERT_BUILDING_BLOCK_TYPE]: 'default'
    }));
  } catch (error) {
    logger.error(error);
    return [];
  }

  const buildingBlockIds = (0, _generate_building_block_ids.generateBuildingBlockIds)(buildingBlocks);
  const wrappedBuildingBlocks = buildingBlocks.map((block, i) => ({
    _id: buildingBlockIds[i],
    _index: '',
    _source: { ...block,
      [_ruleDataUtils.ALERT_INSTANCE_ID]: buildingBlockIds[i]
    }
  })); // Now that we have an array of building blocks for the events in the sequence,
  // we can build the signal that links the building blocks together
  // and also insert the group id (which is also the "shell" signal _id) in each building block

  const doc = buildAlertRoot(wrappedBuildingBlocks, ruleSO, spaceId, buildReasonMessage);
  const sequenceAlert = {
    _id: (0, _build_alert.generateAlertId)(doc),
    _index: '',
    _source: doc
  };
  wrappedBuildingBlocks.forEach((block, i) => {
    block._source[_field_names.ALERT_GROUP_ID] = sequenceAlert._source[_field_names.ALERT_GROUP_ID];
    block._source[_field_names.ALERT_GROUP_INDEX] = i;
  });
  return [...wrappedBuildingBlocks, sequenceAlert];
};

exports.buildAlertGroupFromSequence = buildAlertGroupFromSequence;

const buildAlertRoot = (wrappedBuildingBlocks, ruleSO, spaceId, buildReasonMessage) => {
  const rule = (0, _build_rule.buildRuleWithoutOverrides)(ruleSO);
  const reason = buildReasonMessage({
    rule
  });
  const doc = (0, _build_alert.buildAlert)(wrappedBuildingBlocks, rule, spaceId, reason);
  const mergedAlerts = (0, _build_bulk_body2.objectArrayIntersection)(wrappedBuildingBlocks.map(alert => alert._source));
  return { ...mergedAlerts,
    event: {
      kind: 'signal'
    },
    ...doc,
    [_field_names.ALERT_GROUP_ID]: (0, _build_alert.generateAlertId)(doc)
  };
};

exports.buildAlertRoot = buildAlertRoot;