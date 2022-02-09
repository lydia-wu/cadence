"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfig = exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");

var _experimental_features = require("../common/experimental_features");

var _types = require("./lib/detection_engine/rule_execution_log/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const allowedExperimentalValues = (0, _experimental_features.getExperimentalAllowedValues)();

const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  maxRuleImportExportSize: _configSchema.schema.number({
    defaultValue: 10000
  }),
  maxRuleImportPayloadBytes: _configSchema.schema.number({
    defaultValue: 10485760
  }),
  maxTimelineImportExportSize: _configSchema.schema.number({
    defaultValue: 10000
  }),
  maxTimelineImportPayloadBytes: _configSchema.schema.number({
    defaultValue: 10485760
  }),

  /**
   * This is used within the merge strategies:
   * server/lib/detection_engine/signals/source_fields_merging
   *
   * For determining which strategy for merging "fields" and "_source" together to get
   * runtime fields, constant keywords, etc...
   *
   * "missingFields" (default) This will only merge fields that are missing from the _source and exist in the fields.
   * "noFields" This will turn off all merging of runtime fields, constant keywords from fields.
   * "allFields" This will merge and overwrite anything found within "fields" into "_source" before indexing the data.
   */
  alertMergeStrategy: _configSchema.schema.oneOf([_configSchema.schema.literal('allFields'), _configSchema.schema.literal('missingFields'), _configSchema.schema.literal('noFields')], {
    defaultValue: 'missingFields'
  }),

  /**
   * This is used within the merge strategies:
   * server/lib/detection_engine/signals/source_fields_merging
   *
   * For determining if we need to ignore particular "fields" and not merge them with "_source" such as
   * runtime fields, constant keywords, etc...
   *
   * This feature and functionality is mostly as "safety feature" meaning that we have had bugs in the past
   * where something down the stack unexpectedly ends up in the fields API which causes documents to not
   * be indexable. Rather than changing alertMergeStrategy to be "noFields", you can use this array to add
   * any problematic values.
   *
   * You can use plain dotted notation strings such as "host.name" or a regular expression such as "/host\..+/"
   */
  alertIgnoreFields: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: [],

    validate(ignoreFields) {
      const errors = ignoreFields.flatMap((ignoreField, index) => {
        if (ignoreField.startsWith('/') && ignoreField.endsWith('/')) {
          try {
            new RegExp(ignoreField.slice(1, -1));
            return [];
          } catch (error) {
            return [`"${error.message}" at array position ${index}`];
          }
        } else {
          return [];
        }
      });

      if (errors.length !== 0) {
        return errors.join('. ');
      } else {
        return undefined;
      }
    }

  }),
  [_constants.SIGNALS_INDEX_KEY]: _configSchema.schema.string({
    defaultValue: _constants.DEFAULT_SIGNALS_INDEX
  }),

  /**
   * For internal use. A list of string values (comma delimited) that will enable experimental
   * type of functionality that is not yet released. Valid values for this settings need to
   * be defined in:
   * `x-pack/plugins/security_solution/common/experimental_features.ts`
   * under the `allowedExperimentalValues` object
   *
   * @example
   * xpack.securitySolution.enableExperimental:
   *   - someCrazyFeature
   *   - trustedAppsByPolicyEnabled
   */
  enableExperimental: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: () => [],

    validate(list) {
      for (const key of list) {
        if (!(0, _experimental_features.isValidExperimentalValue)(key)) {
          return `[${key}] is not allowed. Allowed values are: ${allowedExperimentalValues.join(', ')}`;
        }
      }
    }

  }),

  /**
   * Rule Execution Log Configuration
   */
  ruleExecutionLog: _configSchema.schema.object({
    underlyingClient: _configSchema.schema.oneOf([_configSchema.schema.literal(_types.UnderlyingLogClient.eventLog), _configSchema.schema.literal(_types.UnderlyingLogClient.savedObjects)], {
      defaultValue: _types.UnderlyingLogClient.eventLog
    })
  }),

  /**
   * Host Endpoint Configuration
   */
  endpointResultListDefaultFirstPageIndex: _configSchema.schema.number({
    defaultValue: 0
  }),
  endpointResultListDefaultPageSize: _configSchema.schema.number({
    defaultValue: 10
  }),

  /**
   * Artifacts Configuration
   */
  packagerTaskInterval: _configSchema.schema.string({
    defaultValue: '60s'
  }),

  /**
   * Detection prebuilt rules
   */
  prebuiltRulesFromFileSystem: _configSchema.schema.boolean({
    defaultValue: true
  }),
  prebuiltRulesFromSavedObjects: _configSchema.schema.boolean({
    defaultValue: true
  })
});

exports.configSchema = configSchema;

const createConfig = context => {
  const globalConfig = context.config.legacy.get();
  const pluginConfig = context.config.get();
  const kibanaIndex = globalConfig.kibana.index;
  const experimentalFeatures = (0, _experimental_features.parseExperimentalConfigValue)(pluginConfig.enableExperimental);
  return { ...pluginConfig,
    kibanaIndex,
    experimentalFeatures
  };
};

exports.createConfig = createConfig;