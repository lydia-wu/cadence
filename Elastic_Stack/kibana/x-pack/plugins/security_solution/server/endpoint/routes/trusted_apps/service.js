"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTrustedApp = exports.getTrustedAppsSummary = exports.getTrustedAppsList = exports.getTrustedApp = exports.findTrustedAppExceptionItemByIdOrItemId = exports.deleteTrustedApp = exports.createTrustedApp = void 0;

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _fp = require("lodash/fp");

var _mapping = require("./mapping");

var _errors = require("./errors");

var _errors2 = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getNonExistingPoliciesFromTrustedApp = async (savedObjectClient, packagePolicyClient, trustedApp) => {
  if (!trustedApp.effectScope || trustedApp.effectScope.type === 'global' || trustedApp.effectScope.type === 'policy' && (0, _fp.isEmpty)(trustedApp.effectScope.policies)) {
    return [];
  }

  const policies = await packagePolicyClient.getByIDs(savedObjectClient, trustedApp.effectScope.policies);

  if (!policies) {
    return [];
  }

  return policies.filter(policy => policy.version === undefined);
};

const isUserTryingToModifyEffectScopeWithoutPermissions = (currentTrustedApp, updatedTrustedApp, isAtLeastPlatinum) => {
  if (updatedTrustedApp.effectScope.type === 'global') {
    return false;
  } else if (isAtLeastPlatinum) {
    return false;
  } else if ((0, _fp.isEqual)(currentTrustedApp.effectScope.type === 'policy' && currentTrustedApp.effectScope.policies.sort(), updatedTrustedApp.effectScope.policies.sort())) {
    return false;
  } else {
    return true;
  }
};
/**
 * Attempts to first fine the ExceptionItem using `item_id` and if not found, then a second attempt wil be done
 * against the Saved Object `id`.
 * @param exceptionsListClient
 * @param id
 */


const findTrustedAppExceptionItemByIdOrItemId = async (exceptionsListClient, id) => {
  const trustedAppExceptionItem = await exceptionsListClient.getExceptionListItem({
    itemId: id,
    id: undefined,
    namespaceType: 'agnostic'
  });

  if (trustedAppExceptionItem) {
    return trustedAppExceptionItem;
  }

  return exceptionsListClient.getExceptionListItem({
    itemId: undefined,
    id,
    namespaceType: 'agnostic'
  });
};

exports.findTrustedAppExceptionItemByIdOrItemId = findTrustedAppExceptionItemByIdOrItemId;

const deleteTrustedApp = async (exceptionsListClient, {
  id
}) => {
  const trustedAppExceptionItem = await findTrustedAppExceptionItemByIdOrItemId(exceptionsListClient, id);

  if (!trustedAppExceptionItem) {
    throw new _errors.TrustedAppNotFoundError(id);
  }

  await exceptionsListClient.deleteExceptionListItem({
    id: trustedAppExceptionItem.id,
    itemId: undefined,
    namespaceType: 'agnostic'
  });
};

exports.deleteTrustedApp = deleteTrustedApp;

const getTrustedApp = async (exceptionsListClient, id) => {
  const trustedAppExceptionItem = await findTrustedAppExceptionItemByIdOrItemId(exceptionsListClient, id);

  if (!trustedAppExceptionItem) {
    throw new _errors.TrustedAppNotFoundError(id);
  }

  return {
    data: (0, _mapping.exceptionListItemToTrustedApp)(trustedAppExceptionItem)
  };
};

exports.getTrustedApp = getTrustedApp;

const getTrustedAppsList = async (exceptionsListClient, {
  page,
  per_page: perPage,
  kuery
}) => {
  var _results$data$map, _results$total, _results$page, _results$per_page; // Ensure list is created if it does not exist


  await exceptionsListClient.createTrustedAppsList();
  const results = await exceptionsListClient.findExceptionListItem({
    listId: _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_ID,
    page,
    perPage,
    filter: kuery,
    namespaceType: 'agnostic',
    sortField: 'name',
    sortOrder: 'asc'
  });
  return {
    data: (_results$data$map = results === null || results === void 0 ? void 0 : results.data.map(_mapping.exceptionListItemToTrustedApp)) !== null && _results$data$map !== void 0 ? _results$data$map : [],
    total: (_results$total = results === null || results === void 0 ? void 0 : results.total) !== null && _results$total !== void 0 ? _results$total : 0,
    page: (_results$page = results === null || results === void 0 ? void 0 : results.page) !== null && _results$page !== void 0 ? _results$page : 1,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    per_page: (_results$per_page = results === null || results === void 0 ? void 0 : results.per_page) !== null && _results$per_page !== void 0 ? _results$per_page : perPage
  };
};

exports.getTrustedAppsList = getTrustedAppsList;

const createTrustedApp = async (exceptionsListClient, savedObjectClient, packagePolicyClient, newTrustedApp, isAtLeastPlatinum) => {
  // Ensure list is created if it does not exist
  await exceptionsListClient.createTrustedAppsList();

  if (newTrustedApp.effectScope.type === 'policy' && !isAtLeastPlatinum) {
    throw new _errors2.EndpointLicenseError();
  }

  const unexistingPolicies = await getNonExistingPoliciesFromTrustedApp(savedObjectClient, packagePolicyClient, newTrustedApp);

  if (!(0, _fp.isEmpty)(unexistingPolicies)) {
    throw new _errors.TrustedAppPolicyNotExistsError(newTrustedApp.name, unexistingPolicies.map(policy => policy.id));
  }

  const createdTrustedAppExceptionItem = await exceptionsListClient.createExceptionListItem((0, _mapping.newTrustedAppToCreateExceptionListItemOptions)(newTrustedApp));
  return {
    data: (0, _mapping.exceptionListItemToTrustedApp)(createdTrustedAppExceptionItem)
  };
};

exports.createTrustedApp = createTrustedApp;

const updateTrustedApp = async (exceptionsListClient, savedObjectClient, packagePolicyClient, id, updatedTrustedApp, isAtLeastPlatinum) => {
  const currentTrustedAppExceptionItem = await findTrustedAppExceptionItemByIdOrItemId(exceptionsListClient, id);

  if (!currentTrustedAppExceptionItem) {
    throw new _errors.TrustedAppNotFoundError(id);
  }

  if (isUserTryingToModifyEffectScopeWithoutPermissions((0, _mapping.exceptionListItemToTrustedApp)(currentTrustedAppExceptionItem), updatedTrustedApp, isAtLeastPlatinum)) {
    throw new _errors2.EndpointLicenseError();
  }

  const unexistingPolicies = await getNonExistingPoliciesFromTrustedApp(savedObjectClient, packagePolicyClient, updatedTrustedApp);

  if (!(0, _fp.isEmpty)(unexistingPolicies)) {
    throw new _errors.TrustedAppPolicyNotExistsError(updatedTrustedApp.name, unexistingPolicies.map(policy => policy.id));
  }

  let updatedTrustedAppExceptionItem;

  try {
    updatedTrustedAppExceptionItem = await exceptionsListClient.updateExceptionListItem((0, _mapping.updatedTrustedAppToUpdateExceptionListItemOptions)(currentTrustedAppExceptionItem, updatedTrustedApp));
  } catch (e) {
    var _e$output;

    if ((e === null || e === void 0 ? void 0 : (_e$output = e.output) === null || _e$output === void 0 ? void 0 : _e$output.statusCode) === 409) {
      throw new _errors.TrustedAppVersionConflictError(id, e);
    }

    throw e;
  } // If `null` is returned, then that means the TA does not exist (could happen in race conditions)


  if (!updatedTrustedAppExceptionItem) {
    throw new _errors.TrustedAppNotFoundError(id);
  }

  return {
    data: (0, _mapping.exceptionListItemToTrustedApp)(updatedTrustedAppExceptionItem)
  };
};

exports.updateTrustedApp = updateTrustedApp;

const getTrustedAppsSummary = async (exceptionsListClient, {
  kuery
}) => {
  // Ensure list is created if it does not exist
  await exceptionsListClient.createTrustedAppsList();
  const summary = {
    linux: 0,
    windows: 0,
    macos: 0,
    total: 0
  };
  const perPage = 100;
  let paging = true;
  let page = 1;

  while (paging) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const {
      data,
      total
    } = await exceptionsListClient.findExceptionListItem({
      listId: _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_ID,
      page,
      perPage,
      filter: kuery,
      namespaceType: 'agnostic',
      sortField: undefined,
      sortOrder: undefined
    });
    summary.total = total;

    for (const item of data) {
      summary[(0, _mapping.osFromExceptionItem)(item)]++;
    }

    paging = (page - 1) * perPage + data.length < total;
    page++;
  }

  return summary;
};

exports.getTrustedAppsSummary = getTrustedAppsSummary;