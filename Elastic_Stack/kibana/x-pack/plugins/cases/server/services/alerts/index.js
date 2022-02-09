"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertService = void 0;

var _pMap = _interopRequireDefault(require("p-map"));

var _lodash = require("lodash");

var _common = require("../../../common");

var _common2 = require("../../common");

var _technical_rule_data_field_names = require("../../../../rule_registry/common/technical_rule_data_field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isEmptyAlert(alert) {
  return (0, _lodash.isEmpty)(alert.id) || (0, _lodash.isEmpty)(alert.index);
}

class AlertService {
  constructor() {}

  async updateAlertsStatus({
    alerts,
    scopedClusterClient,
    logger
  }) {
    try {
      const bucketedAlerts = bucketAlertsByIndexAndStatus(alerts, logger);
      const indexBuckets = Array.from(bucketedAlerts.entries());
      await (0, _pMap.default)(indexBuckets, async indexBucket => updateByQuery(indexBucket, scopedClusterClient), {
        concurrency: _common.MAX_CONCURRENT_SEARCHES
      });
    } catch (error) {
      throw (0, _common2.createCaseError)({
        message: `Failed to update alert status ids: ${JSON.stringify(alerts)}: ${error}`,
        error,
        logger
      });
    }
  }

  async getAlerts({
    scopedClusterClient,
    alertsInfo,
    logger
  }) {
    try {
      const docs = alertsInfo.filter(alert => !isEmptyAlert(alert)).slice(0, _common.MAX_ALERTS_PER_SUB_CASE).map(alert => ({
        _id: alert.id,
        _index: alert.index
      }));

      if (docs.length <= 0) {
        return;
      }

      const results = await scopedClusterClient.mget({
        body: {
          docs
        }
      }); // @ts-expect-error @elastic/elasticsearch _source is optional

      return results.body;
    } catch (error) {
      throw (0, _common2.createCaseError)({
        message: `Failed to retrieve alerts ids: ${JSON.stringify(alertsInfo)}: ${error}`,
        error,
        logger
      });
    }
  }

}

exports.AlertService = AlertService;

function bucketAlertsByIndexAndStatus(alerts, logger) {
  return alerts.reduce((acc, alert) => {
    // skip any alerts that are empty
    if (isEmptyAlert(alert)) {
      return acc;
    }

    const translatedAlert = { ...alert,
      status: translateStatus({
        alert,
        logger
      })
    };
    const statusToAlertId = acc.get(translatedAlert.index); // if we haven't seen the index before

    if (!statusToAlertId) {
      // add a new index in the parent map, with an entry for the status the alert set to pointing
      // to an initial array of only the current alert
      acc.set(translatedAlert.index, createStatusToAlertMap(translatedAlert));
    } else {
      // We had the index in the map so check to see if we have a bucket for the
      // status, if not add a new status entry with the alert, if so update the status entry
      // with the alert
      updateIndexEntryWithStatus(statusToAlertId, translatedAlert);
    }

    return acc;
  }, new Map());
}

function translateStatus({
  alert,
  logger
}) {
  const translatedStatuses = {
    [_common.CaseStatuses.open]: 'open',
    [_common.CaseStatuses['in-progress']]: 'acknowledged',
    [_common.CaseStatuses.closed]: 'closed'
  };
  const translatedStatus = translatedStatuses[alert.status];

  if (!translatedStatus) {
    logger.error(`Unable to translate case status ${alert.status} during alert update: ${JSON.stringify(alert)}`);
  }

  return translatedStatus !== null && translatedStatus !== void 0 ? translatedStatus : 'open';
}

function createStatusToAlertMap(alert) {
  return new Map([[alert.status, [alert]]]);
}

function updateIndexEntryWithStatus(statusToAlerts, alert) {
  const statusBucket = statusToAlerts.get(alert.status);

  if (!statusBucket) {
    statusToAlerts.set(alert.status, [alert]);
  } else {
    statusBucket.push(alert);
  }
}

async function updateByQuery([index, statusToAlertMap], scopedClusterClient) {
  const statusBuckets = Array.from(statusToAlertMap);
  return Promise.all( // this will create three update by query calls one for each of the three statuses
  statusBuckets.map(([status, translatedAlerts]) => scopedClusterClient.updateByQuery({
    index,
    conflicts: 'abort',
    body: {
      script: {
        source: `if (ctx._source['${_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS}'] != null) {
              ctx._source['${_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS}'] = '${status}'
            }
            if (ctx._source.signal != null && ctx._source.signal.status != null) {
              ctx._source.signal.status = '${status}'
            }`,
        lang: 'painless'
      },
      // the query here will contain all the ids that have the same status for the same index
      // being updated
      query: {
        ids: {
          values: translatedAlerts.map(({
            id
          }) => id)
        }
      }
    },
    ignore_unavailable: true
  })));
}