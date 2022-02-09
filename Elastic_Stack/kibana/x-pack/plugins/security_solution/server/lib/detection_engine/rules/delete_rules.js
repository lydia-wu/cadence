"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteRules = void 0;

var _std = require("@kbn/std");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteRules = async ({
  rulesClient,
  ruleStatusClient,
  ruleStatuses,
  id
}) => {
  await rulesClient.delete({
    id
  });
  await (0, _std.asyncForEach)(ruleStatuses, async obj => {
    await ruleStatusClient.delete(obj.id);
  });
};

exports.deleteRules = deleteRules;