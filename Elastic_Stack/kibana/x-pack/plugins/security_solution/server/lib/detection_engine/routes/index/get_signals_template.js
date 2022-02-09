"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignalsTemplate = exports.getRbacRequiredFields = exports.createSignalsFieldAliases = exports.createBackwardsCompatibilityMapping = exports.backwardsCompatibilityMappings = exports.SIGNALS_TEMPLATE_VERSION = exports.SIGNALS_FIELD_ALIASES_VERSION = exports.MIN_EQL_RULE_INDEX_VERSION = exports.ALIAS_VERSION_FIELD = void 0;

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _lodash = require("lodash");

var _signals_mapping = _interopRequireDefault(require("./signals_mapping.json"));

var _ecs_mapping = _interopRequireDefault(require("./ecs_mapping.json"));

var _other_mappings = _interopRequireDefault(require("./other_mappings.json"));

var _signal_aad_mapping = _interopRequireDefault(require("./signal_aad_mapping.json"));

var _signal_extra_fields = _interopRequireDefault(require("./signal_extra_fields.json"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
  @constant
  @type {number}
  @description This value represents the template version assumed by app code.
  If this number is greater than the user's signals index version, the
  detections UI will attempt to update the signals template and roll over to
  a new signals index. 
  
  Since we create a new index for new versions, this version on an existing index should never change.

  If making mappings changes in a patch release, this number should be incremented by 1.
  If making mappings changes in a minor release, this number should be
  incremented by 10 in order to add "room" for the aforementioned patch
  release
*/


const SIGNALS_TEMPLATE_VERSION = 57;
/**
  @constant
  @type {number}
  @description This value represents the version of the field aliases that map the new field names
  used for alerts-as-data to the old signal.* field names and any other runtime fields that are added
  to .siem-signals indices for compatibility reasons (e.g. host.os.name.caseless).

  This version number can change over time on existing indices as we add backwards compatibility fields.

  If any .siem-signals-<space id> indices have an aliases_version less than this value, the detections 
  UI will call create_index_route and and go through the index update process. Increment this number if 
  making changes to the field aliases we use to make signals forwards-compatible.
*/

exports.SIGNALS_TEMPLATE_VERSION = SIGNALS_TEMPLATE_VERSION;
const SIGNALS_FIELD_ALIASES_VERSION = 1;
/**
  @constant
  @type {number}
  @description This value represents the minimum required index version (SIGNALS_TEMPLATE_VERSION) for EQL 
  rules to write signals correctly. If the write index has a `version` less than this value, the EQL rule
  will throw an error on execution.
*/

exports.SIGNALS_FIELD_ALIASES_VERSION = SIGNALS_FIELD_ALIASES_VERSION;
const MIN_EQL_RULE_INDEX_VERSION = 2;
exports.MIN_EQL_RULE_INDEX_VERSION = MIN_EQL_RULE_INDEX_VERSION;
const ALIAS_VERSION_FIELD = 'aliases_version';
exports.ALIAS_VERSION_FIELD = ALIAS_VERSION_FIELD;

const getSignalsTemplate = (index, spaceId, aadIndexAliasName) => {
  const fieldAliases = createSignalsFieldAliases();
  const template = {
    index_patterns: [`${index}-*`],
    template: {
      // aliases: {
      //   [aadIndexAliasName]: {
      //     is_write_index: false,
      //   },
      // },
      settings: {
        index: {
          lifecycle: {
            name: index,
            rollover_alias: index
          }
        },
        mapping: {
          total_fields: {
            limit: 10000
          }
        }
      },
      mappings: {
        dynamic: false,
        properties: (0, _lodash.merge)(_ecs_mapping.default.mappings.properties, _other_mappings.default.mappings.properties, fieldAliases, _signals_mapping.default.mappings.properties),
        _meta: {
          version: SIGNALS_TEMPLATE_VERSION,
          [ALIAS_VERSION_FIELD]: SIGNALS_FIELD_ALIASES_VERSION
        }
      }
    },
    version: SIGNALS_TEMPLATE_VERSION
  };
  return template;
};

exports.getSignalsTemplate = getSignalsTemplate;

const createSignalsFieldAliases = () => {
  const fieldAliases = {};
  Object.entries(_signal_aad_mapping.default).forEach(([key, value]) => {
    fieldAliases[value] = {
      type: 'alias',
      path: key
    };
  });
  return fieldAliases;
};

exports.createSignalsFieldAliases = createSignalsFieldAliases;
const backwardsCompatibilityMappings = [{
  minVersion: 0,
  // Version 45 shipped with 7.14
  maxVersion: 45,
  mapping: {
    runtime: {
      'host.os.name.caseless': {
        type: 'keyword',
        script: {
          source: "if(doc['host.os.name'].size()!=0) emit(doc['host.os.name'].value.toLowerCase());"
        }
      }
    },
    properties: { // signalExtraFields contains the field mappings that have been added to the signals indices over time.
      // We need to include these here because we can't add an alias for a field that isn't in the mapping,
      // and we want to apply the aliases to all old signals indices at the same time.
      ..._signal_extra_fields.default,
      ...createSignalsFieldAliases()
    }
  }
}];
exports.backwardsCompatibilityMappings = backwardsCompatibilityMappings;

const createBackwardsCompatibilityMapping = version => {
  const mappings = backwardsCompatibilityMappings.filter(mapping => version <= mapping.maxVersion && version >= mapping.minVersion).map(mapping => mapping.mapping);
  const meta = {
    _meta: {
      version,
      [ALIAS_VERSION_FIELD]: SIGNALS_FIELD_ALIASES_VERSION
    }
  };
  return (0, _lodash.merge)({}, ...mappings, meta);
};

exports.createBackwardsCompatibilityMapping = createBackwardsCompatibilityMapping;

const getRbacRequiredFields = spaceId => {
  return {
    [_ruleDataUtils.SPACE_IDS]: {
      type: 'constant_keyword',
      value: spaceId
    },
    [_ruleDataUtils.ALERT_RULE_CONSUMER]: {
      type: 'constant_keyword',
      value: 'siem'
    },
    [_ruleDataUtils.ALERT_RULE_PRODUCER]: {
      type: 'constant_keyword',
      value: 'siem'
    },
    // TODO: discuss naming of this field and what the value will be for legacy signals.
    // Can we leave it as 'siem.signals' or do we need a runtime field that will map signal.rule.type
    // to the new ruleTypeId?
    [_ruleDataUtils.ALERT_RULE_TYPE_ID]: {
      type: 'constant_keyword',
      value: 'siem.signals'
    }
  };
};

exports.getRbacRequiredFields = getRbacRequiredFields;