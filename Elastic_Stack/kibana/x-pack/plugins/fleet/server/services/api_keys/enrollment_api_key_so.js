"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnrollmentAPIKey = getEnrollmentAPIKey;
exports.listEnrollmentApiKeys = listEnrollmentApiKeys;

var _constants = require("../../constants");

var _app_context = require("../app_context");

var _saved_object = require("../saved_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function listEnrollmentApiKeys(soClient, options) {
  const {
    page = 1,
    perPage = 20,
    kuery
  } = options; // eslint-disable-next-line @typescript-eslint/naming-convention

  const {
    saved_objects,
    total
  } = await soClient.find({
    type: _constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE,
    page,
    perPage,
    sortField: 'created_at',
    sortOrder: 'desc',
    filter: kuery && kuery !== '' ? (0, _saved_object.normalizeKuery)(_constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE, kuery) : undefined
  });
  const items = saved_objects.map(savedObjectToEnrollmentApiKey);
  return {
    items,
    total,
    page,
    perPage
  };
}

async function getEnrollmentAPIKey(soClient, id) {
  const so = await _app_context.appContextService.getEncryptedSavedObjects().getDecryptedAsInternalUser(_constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE, id);
  return savedObjectToEnrollmentApiKey(so);
}

function savedObjectToEnrollmentApiKey({
  error,
  attributes,
  id
}) {
  if (error) {
    throw new Error(error.message);
  }

  return {
    id,
    ...attributes
  };
}