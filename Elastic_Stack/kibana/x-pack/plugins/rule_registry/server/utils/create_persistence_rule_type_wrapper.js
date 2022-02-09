"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPersistenceRuleTypeWrapper = void 0;

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _get_common_alert_fields = require("./get_common_alert_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createPersistenceRuleTypeWrapper = ({
  logger,
  ruleDataClient
}) => type => {
  return { ...type,
    executor: async options => {
      const state = await type.executor({ ...options,
        services: { ...options.services,
          alertWithPersistence: async (alerts, refresh) => {
            const numAlerts = alerts.length;
            logger.debug(`Found ${numAlerts} alerts.`);

            if (ruleDataClient.isWriteEnabled() && numAlerts) {
              const commonRuleFields = (0, _get_common_alert_fields.getCommonAlertFields)(options);
              const response = await ruleDataClient.getWriter().bulk({
                body: alerts.flatMap(alert => [{
                  index: {}
                }, {
                  [_ruleDataUtils.ALERT_INSTANCE_ID]: alert.id,
                  [_ruleDataUtils.VERSION]: ruleDataClient.kibanaVersion,
                  ...commonRuleFields,
                  ...alert.fields
                }]),
                refresh
              });
              return response;
            } else {
              logger.debug('Writing is disabled.');
            }
          }
        }
      });
      return state;
    }
  };
};

exports.createPersistenceRuleTypeWrapper = createPersistenceRuleTypeWrapper;