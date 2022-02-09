"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCasesByAlertID = exports.get = void 0;
exports.getReporters = getReporters;
exports.getTags = getTags;
exports.resolve = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _common = require("../../../common");

var _common2 = require("../../common");

var _authorization = require("../../authorization");

var _utils = require("../utils");

var _services = require("../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Case Client wrapper function for retrieving the case IDs and titles that have a particular alert ID
 * attached to them. This handles RBAC before calling the saved object API.
 *
 * @ignore
 */


const getCasesByAlertID = async ({
  alertID,
  options
}, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    logger,
    authorization
  } = clientArgs;

  try {
    const queryParams = (0, _pipeable.pipe)((0, _common.excess)(_common.CasesByAlertIDRequestRt).decode(options), (0, _Either.fold)((0, _common.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.getCaseIDsByAlertID);
    const filter = (0, _utils.combineAuthorizedAndOwnerFilter)(queryParams.owner, authorizationFilter, _authorization.Operations.getCaseIDsByAlertID.savedObjectType); // This will likely only return one comment saved object, the response aggregation will contain
    // the keys we need to retrieve the cases

    const commentsWithAlert = await caseService.getCaseIdsByAlertId({
      unsecuredSavedObjectsClient,
      alertId: alertID,
      filter
    }); // make sure the comments returned have the right owner

    ensureSavedObjectsAreAuthorized(commentsWithAlert.saved_objects.map(comment => ({
      owner: comment.attributes.owner,
      id: comment.id
    })));

    const caseIds = _services.CasesService.getCaseIDsFromAlertAggs(commentsWithAlert); // if we didn't find any case IDs then let's return early because there's nothing to request


    if (caseIds.length <= 0) {
      return [];
    }

    const casesInfo = await caseService.getCases({
      unsecuredSavedObjectsClient,
      caseIds
    }); // if there was an error retrieving one of the cases (maybe it was deleted, but the alert comment still existed)
    // just ignore it

    const validCasesInfo = casesInfo.saved_objects.filter(caseInfo => caseInfo.error === undefined);
    ensureSavedObjectsAreAuthorized(validCasesInfo.map(caseInfo => ({
      owner: caseInfo.attributes.owner,
      id: caseInfo.id
    })));
    return _common.CasesByAlertIdRt.encode(validCasesInfo.map(caseInfo => ({
      id: caseInfo.id,
      title: caseInfo.attributes.title
    })));
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to get case IDs using alert ID: ${alertID} options: ${JSON.stringify(options)}: ${error}`,
      error,
      logger
    });
  }
};
/**
 * The parameters for retrieving a case
 */


exports.getCasesByAlertID = getCasesByAlertID;
/**
 * Retrieves a case and optionally its comments and sub case comments.
 *
 * @ignore
 */

const get = async ({
  id,
  includeComments,
  includeSubCaseComments
}, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    logger,
    authorization
  } = clientArgs;

  try {
    if (!_common.ENABLE_CASE_CONNECTOR && includeSubCaseComments) {
      throw _boom.default.badRequest('The `includeSubCaseComments` is not supported when the case connector feature is disabled');
    }

    let theCase;
    let subCaseIds = [];

    if (_common.ENABLE_CASE_CONNECTOR) {
      const [caseInfo, subCasesForCaseId] = await Promise.all([caseService.getCase({
        unsecuredSavedObjectsClient,
        id
      }), caseService.findSubCasesByCaseId({
        unsecuredSavedObjectsClient,
        ids: [id]
      })]);
      theCase = caseInfo;
      subCaseIds = subCasesForCaseId.saved_objects.map(so => so.id);
    } else {
      theCase = await caseService.getCase({
        unsecuredSavedObjectsClient,
        id
      });
    }

    await authorization.ensureAuthorized({
      operation: _authorization.Operations.getCase,
      entities: [{
        owner: theCase.attributes.owner,
        id: theCase.id
      }]
    });

    if (!includeComments) {
      return _common.CaseResponseRt.encode((0, _common2.flattenCaseSavedObject)({
        savedObject: theCase,
        subCaseIds
      }));
    }

    const theComments = await caseService.getAllCaseComments({
      unsecuredSavedObjectsClient,
      id,
      options: {
        sortField: 'created_at',
        sortOrder: 'asc'
      },
      includeSubCaseComments: _common.ENABLE_CASE_CONNECTOR && includeSubCaseComments
    });
    return _common.CaseResponseRt.encode((0, _common2.flattenCaseSavedObject)({
      savedObject: theCase,
      comments: theComments.saved_objects,
      subCaseIds,
      totalComment: theComments.total,
      totalAlerts: (0, _common2.countAlertsForID)({
        comments: theComments,
        id
      })
    }));
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to get case id: ${id}: ${error}`,
      error,
      logger
    });
  }
};
/**
 * Retrieves a case resolving its ID and optionally loading its comments and sub case comments.
 *
 * @experimental
 */


exports.get = get;

const resolve = async ({
  id,
  includeComments,
  includeSubCaseComments
}, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    logger,
    authorization
  } = clientArgs;

  try {
    if (!_common.ENABLE_CASE_CONNECTOR && includeSubCaseComments) {
      throw _boom.default.badRequest('The `includeSubCaseComments` is not supported when the case connector feature is disabled');
    }

    const {
      saved_object: savedObject,
      ...resolveData
    } = await caseService.getResolveCase({
      unsecuredSavedObjectsClient,
      id
    });
    await authorization.ensureAuthorized({
      operation: _authorization.Operations.resolveCase,
      entities: [{
        id: savedObject.id,
        owner: savedObject.attributes.owner
      }]
    });
    let subCaseIds = [];

    if (_common.ENABLE_CASE_CONNECTOR) {
      const subCasesForCaseId = await caseService.findSubCasesByCaseId({
        unsecuredSavedObjectsClient,
        ids: [id]
      });
      subCaseIds = subCasesForCaseId.saved_objects.map(so => so.id);
    }

    if (!includeComments) {
      return _common.CaseResolveResponseRt.encode({ ...resolveData,
        case: (0, _common2.flattenCaseSavedObject)({
          savedObject,
          subCaseIds
        })
      });
    }

    const theComments = await caseService.getAllCaseComments({
      unsecuredSavedObjectsClient,
      id,
      options: {
        sortField: 'created_at',
        sortOrder: 'asc'
      },
      includeSubCaseComments: _common.ENABLE_CASE_CONNECTOR && includeSubCaseComments
    });
    return _common.CaseResolveResponseRt.encode({ ...resolveData,
      case: (0, _common2.flattenCaseSavedObject)({
        savedObject,
        subCaseIds,
        comments: theComments.saved_objects,
        totalComment: theComments.total,
        totalAlerts: (0, _common2.countAlertsForID)({
          comments: theComments,
          id
        })
      })
    });
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to resolve case id: ${id}: ${error}`,
      error,
      logger
    });
  }
};
/**
 * Retrieves the tags from all the cases.
 */


exports.resolve = resolve;

async function getTags(params, clientArgs) {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    logger,
    authorization
  } = clientArgs;

  try {
    const queryParams = (0, _pipeable.pipe)((0, _common.excess)(_common.AllTagsFindRequestRt).decode(params), (0, _Either.fold)((0, _common.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.findCases);
    const filter = (0, _utils.combineAuthorizedAndOwnerFilter)(queryParams.owner, authorizationFilter);
    const cases = await caseService.getTags({
      unsecuredSavedObjectsClient,
      filter
    });
    const tags = new Set();
    const mappedCases = []; // Gather all necessary information in one pass

    cases.saved_objects.forEach(theCase => {
      theCase.attributes.tags.forEach(tag => tags.add(tag));
      mappedCases.push({
        id: theCase.id,
        owner: theCase.attributes.owner
      });
    });
    ensureSavedObjectsAreAuthorized(mappedCases);
    return [...tags.values()];
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to get tags: ${error}`,
      error,
      logger
    });
  }
}
/**
 * Retrieves the reporters from all the cases.
 */


async function getReporters(params, clientArgs) {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    logger,
    authorization
  } = clientArgs;

  try {
    const queryParams = (0, _pipeable.pipe)((0, _common.excess)(_common.AllReportersFindRequestRt).decode(params), (0, _Either.fold)((0, _common.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.getReporters);
    const filter = (0, _utils.combineAuthorizedAndOwnerFilter)(queryParams.owner, authorizationFilter);
    const cases = await caseService.getReporters({
      unsecuredSavedObjectsClient,
      filter
    });
    const reporters = new Map();
    const mappedCases = []; // Gather all necessary information in one pass

    cases.saved_objects.forEach(theCase => {
      const user = theCase.attributes.created_by;

      if (user.username != null) {
        reporters.set(user.username, user);
      }

      mappedCases.push({
        id: theCase.id,
        owner: theCase.attributes.owner
      });
    });
    ensureSavedObjectsAreAuthorized(mappedCases);
    return _common.UsersRt.encode([...reporters.values()]);
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to get reporters: ${error}`,
      error,
      logger
    });
  }
}