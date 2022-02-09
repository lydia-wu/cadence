"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;

var _get_alert_by_id = require("./get_alert_by_id");

var _update_alert_by_id = require("./update_alert_by_id");

var _get_alert_index = require("./get_alert_index");

var _bulk_update_alerts = require("./bulk_update_alerts");

var _find = require("./find");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineRoutes(router) {
  (0, _get_alert_by_id.getAlertByIdRoute)(router);
  (0, _update_alert_by_id.updateAlertByIdRoute)(router);
  (0, _get_alert_index.getAlertsIndexRoute)(router);
  (0, _bulk_update_alerts.bulkUpdateAlertsRoute)(router);
  (0, _find.findAlertsByQueryRoute)(router);
}