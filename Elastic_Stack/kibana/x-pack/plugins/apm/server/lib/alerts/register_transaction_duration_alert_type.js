"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTransactionDurationAlertType = registerTransactionDurationAlertType;

var _configSchema = require("@kbn/config-schema");

var _technical_field_names = require("@kbn/rule-data-utils/technical_field_names");

var _operators = require("rxjs/operators");

var _formatters = require("../../../../observability/common/utils/formatters");

var _server = require("../../../../rule_registry/server");

var _aggregated_transactions = require("../../../common/aggregated_transactions");

var _alert_types = require("../../../common/alert_types");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _environment_filter_values = require("../../../common/environment_filter_values");

var _processor_event = require("../../../common/processor_event");

var _environment_query = require("../../../common/utils/environment_query");

var _formatters2 = require("../../../common/utils/formatters");

var _aggregated_transactions2 = require("../helpers/aggregated_transactions");

var _get_apm_indices = require("../settings/apm_indices/get_apm_indices");

var _action_variables = require("./action_variables");

var _alerting_es_client = require("./alerting_es_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  serviceName: _configSchema.schema.string(),
  transactionType: _configSchema.schema.string(),
  windowSize: _configSchema.schema.number(),
  windowUnit: _configSchema.schema.string(),
  threshold: _configSchema.schema.number(),
  aggregationType: _configSchema.schema.oneOf([_configSchema.schema.literal('avg'), _configSchema.schema.literal('95th'), _configSchema.schema.literal('99th')]),
  environment: _configSchema.schema.string()
});

const alertTypeConfig = _alert_types.ALERT_TYPES_CONFIG[_alert_types.AlertType.TransactionDuration];

function registerTransactionDurationAlertType({
  alerting,
  ruleDataClient,
  config$,
  logger
}) {
  const createLifecycleRuleType = (0, _server.createLifecycleRuleTypeFactory)({
    ruleDataClient,
    logger
  });
  const type = createLifecycleRuleType({
    id: _alert_types.AlertType.TransactionDuration,
    name: alertTypeConfig.name,
    actionGroups: alertTypeConfig.actionGroups,
    defaultActionGroupId: alertTypeConfig.defaultActionGroupId,
    validate: {
      params: paramsSchema
    },
    actionVariables: {
      context: [_action_variables.apmActionVariables.serviceName, _action_variables.apmActionVariables.transactionType, _action_variables.apmActionVariables.environment, _action_variables.apmActionVariables.threshold, _action_variables.apmActionVariables.triggerValue, _action_variables.apmActionVariables.interval]
    },
    producer: _alert_types.APM_SERVER_FEATURE_ID,
    minimumLicenseRequired: 'basic',
    isExportable: true,
    executor: async ({
      services,
      params
    }) => {
      const config = await config$.pipe((0, _operators.take)(1)).toPromise();
      const alertParams = params;
      const indices = await (0, _get_apm_indices.getApmIndices)({
        config,
        savedObjectsClient: services.savedObjectsClient
      }); // only query transaction events when set to 'never',
      // to prevent (likely) unnecessary blocking request
      // in rule execution

      const searchAggregatedTransactions = config.searchAggregatedTransactions !== _aggregated_transactions.SearchAggregatedTransactionSetting.never;
      const index = searchAggregatedTransactions ? indices.metric : indices.transaction;
      const field = (0, _aggregated_transactions2.getTransactionDurationFieldForAggregatedTransactions)(searchAggregatedTransactions);
      const searchParams = {
        index,
        body: {
          size: 0,
          query: {
            bool: {
              filter: [{
                range: {
                  '@timestamp': {
                    gte: `now-${alertParams.windowSize}${alertParams.windowUnit}`
                  }
                }
              }, ...(0, _aggregated_transactions2.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), {
                term: {
                  [_elasticsearch_fieldnames.SERVICE_NAME]: alertParams.serviceName
                }
              }, {
                term: {
                  [_elasticsearch_fieldnames.TRANSACTION_TYPE]: alertParams.transactionType
                }
              }, ...(0, _environment_query.environmentQuery)(alertParams.environment)]
            }
          },
          aggs: {
            latency: alertParams.aggregationType === 'avg' ? {
              avg: {
                field
              }
            } : {
              percentiles: {
                field,
                percents: [alertParams.aggregationType === '95th' ? 95 : 99]
              }
            }
          }
        }
      };
      const response = await (0, _alerting_es_client.alertingEsClient)({
        scopedClusterClient: services.scopedClusterClient,
        params: searchParams
      });

      if (!response.aggregations) {
        return {};
      }

      const {
        latency
      } = response.aggregations;
      const transactionDuration = 'values' in latency ? Object.values(latency.values)[0] : latency === null || latency === void 0 ? void 0 : latency.value; // Converts threshold to microseconds because this is the unit used on transactionDuration

      const thresholdMicroseconds = alertParams.threshold * 1000;

      if (transactionDuration && transactionDuration > thresholdMicroseconds) {
        const durationFormatter = (0, _formatters2.getDurationFormatter)(transactionDuration);
        const transactionDurationFormatted = durationFormatter(transactionDuration).formatted;
        services.alertWithLifecycle({
          id: `${_alert_types.AlertType.TransactionDuration}_${(0, _environment_filter_values.getEnvironmentLabel)(alertParams.environment)}`,
          fields: {
            [_elasticsearch_fieldnames.SERVICE_NAME]: alertParams.serviceName,
            ...(0, _environment_filter_values.getEnvironmentEsField)(alertParams.environment),
            [_elasticsearch_fieldnames.TRANSACTION_TYPE]: alertParams.transactionType,
            [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.transaction,
            [_technical_field_names.ALERT_EVALUATION_VALUE]: transactionDuration,
            [_technical_field_names.ALERT_EVALUATION_THRESHOLD]: thresholdMicroseconds,
            [_technical_field_names.ALERT_REASON]: (0, _alert_types.formatTransactionDurationReason)({
              measured: transactionDuration,
              serviceName: alertParams.serviceName,
              threshold: thresholdMicroseconds,
              asDuration: _formatters.asDuration
            })
          }
        }).scheduleActions(alertTypeConfig.defaultActionGroupId, {
          transactionType: alertParams.transactionType,
          serviceName: alertParams.serviceName,
          environment: (0, _environment_filter_values.getEnvironmentLabel)(alertParams.environment),
          threshold: thresholdMicroseconds,
          triggerValue: transactionDurationFormatted,
          interval: `${alertParams.windowSize}${alertParams.windowUnit}`
        });
      }

      return {};
    }
  });
  alerting.registerType(type);
}