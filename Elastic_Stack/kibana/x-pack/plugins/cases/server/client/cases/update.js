"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = void 0;

var _pMap = _interopRequireDefault(require("p-map"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _common = require("../../../../../../src/plugins/data/common");

var _common2 = require("../../../common");

var _helpers = require("../../services/user_actions/helpers");

var _utils = require("../utils");

var _common3 = require("../../common");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Throws an error if any of the requests attempt to update a collection style cases' status field.
 */


function throwIfUpdateStatusOfCollection(requests) {
  const requestsUpdatingStatusOfCollection = requests.filter(({
    updateReq,
    originalCase
  }) => updateReq.status !== undefined && originalCase.attributes.type === _common2.CaseType.collection);

  if (requestsUpdatingStatusOfCollection.length > 0) {
    const ids = requestsUpdatingStatusOfCollection.map(({
      updateReq
    }) => updateReq.id);
    throw _boom.default.badRequest(`Updating the status of a collection is not allowed ids: [${ids.join(', ')}]`);
  }
}
/**
 * Throws an error if any of the requests attempt to update a collection style case to an individual one.
 */


function throwIfUpdateTypeCollectionToIndividual(requests) {
  const requestsUpdatingTypeCollectionToInd = requests.filter(({
    updateReq,
    originalCase
  }) => updateReq.type === _common2.CaseType.individual && originalCase.attributes.type === _common2.CaseType.collection);

  if (requestsUpdatingTypeCollectionToInd.length > 0) {
    const ids = requestsUpdatingTypeCollectionToInd.map(({
      updateReq
    }) => updateReq.id);
    throw _boom.default.badRequest(`Converting a collection to an individual case is not allowed ids: [${ids.join(', ')}]`);
  }
}
/**
 * Throws an error if any of the requests attempt to update the type of a case.
 */


function throwIfUpdateType(requests) {
  const requestsUpdatingType = requests.filter(({
    updateReq
  }) => updateReq.type !== undefined);

  if (requestsUpdatingType.length > 0) {
    const ids = requestsUpdatingType.map(({
      updateReq
    }) => updateReq.id);
    throw _boom.default.badRequest(`Updating the type of a case when sub cases are disabled is not allowed ids: [${ids.join(', ')}]`);
  }
}
/**
 * Throws an error if any of the requests attempt to update the owner of a case.
 */


function throwIfUpdateOwner(requests) {
  const requestsUpdatingOwner = requests.filter(({
    updateReq
  }) => updateReq.owner !== undefined);

  if (requestsUpdatingOwner.length > 0) {
    const ids = requestsUpdatingOwner.map(({
      updateReq
    }) => updateReq.id);
    throw _boom.default.badRequest(`Updating the owner of a case  is not allowed ids: [${ids.join(', ')}]`);
  }
}
/**
 * Throws an error if any of the requests attempt to update an individual style cases' type field to a collection
 * when alerts are attached to the case.
 */


async function throwIfInvalidUpdateOfTypeWithAlerts({
  requests,
  caseService,
  unsecuredSavedObjectsClient
}) {
  const getAlertsForID = async ({
    updateReq
  }) => {
    const alerts = await caseService.getAllCaseComments({
      unsecuredSavedObjectsClient,
      id: updateReq.id,
      options: {
        fields: [],
        // there should never be generated alerts attached to an individual case but we'll check anyway
        filter: _common.nodeBuilder.or([_common.nodeBuilder.is(`${_common2.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _common2.CommentType.alert), _common.nodeBuilder.is(`${_common2.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _common2.CommentType.generatedAlert)]),
        page: 1,
        perPage: 1
      }
    });
    return {
      id: updateReq.id,
      alerts
    };
  };

  const requestsUpdatingTypeField = requests.filter(({
    updateReq
  }) => updateReq.type === _common2.CaseType.collection);

  const getAlertsMapper = async caseToUpdate => getAlertsForID(caseToUpdate); // Ensuring we don't too many concurrent get running.


  const casesAlertTotals = await (0, _pMap.default)(requestsUpdatingTypeField, getAlertsMapper, {
    concurrency: _common2.MAX_CONCURRENT_SEARCHES
  }); // grab the cases that have at least one alert comment attached to them

  const typeUpdateWithAlerts = casesAlertTotals.filter(caseInfo => caseInfo.alerts.total > 0);

  if (typeUpdateWithAlerts.length > 0) {
    const ids = typeUpdateWithAlerts.map(req => req.id);
    throw _boom.default.badRequest(`Converting a case to a collection is not allowed when it has alert comments, ids: [${ids.join(', ')}]`);
  }
}
/**
 * Throws an error if any of the requests updates a title and the length is over MAX_TITLE_LENGTH.
 */


function throwIfTitleIsInvalid(requests) {
  const requestsInvalidTitle = requests.filter(({
    updateReq
  }) => updateReq.title !== undefined && updateReq.title.length > _common2.MAX_TITLE_LENGTH);

  if (requestsInvalidTitle.length > 0) {
    const ids = requestsInvalidTitle.map(({
      updateReq
    }) => updateReq.id);
    throw _boom.default.badRequest(`The length of the title is too long. The maximum length is ${_common2.MAX_TITLE_LENGTH}, ids: [${ids.join(', ')}]`);
  }
}
/**
 * Get the id from a reference in a comment for a specific type.
 */


function getID(comment, type) {
  var _comment$references$f;

  return (_comment$references$f = comment.references.find(ref => ref.type === type)) === null || _comment$references$f === void 0 ? void 0 : _comment$references$f.id;
}
/**
 * Gets all the alert comments (generated or user alerts) for the requested cases.
 */


async function getAlertComments({
  casesToSync,
  caseService,
  unsecuredSavedObjectsClient
}) {
  const idsOfCasesToSync = casesToSync.map(({
    updateReq
  }) => updateReq.id); // getAllCaseComments will by default get all the comments, unless page or perPage fields are set

  return caseService.getAllCaseComments({
    unsecuredSavedObjectsClient,
    id: idsOfCasesToSync,
    includeSubCaseComments: true,
    options: {
      filter: _common.nodeBuilder.or([_common.nodeBuilder.is(`${_common2.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _common2.CommentType.alert), _common.nodeBuilder.is(`${_common2.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _common2.CommentType.generatedAlert)])
    }
  });
}
/**
 * Returns a map of sub case IDs to their status. This uses a group of alert comments to determine which sub cases should
 * be retrieved. This is based on whether the comment is associated to a sub case.
 */


async function getSubCasesToStatus({
  totalAlerts,
  caseService,
  unsecuredSavedObjectsClient
}) {
  const subCasesToRetrieve = totalAlerts.saved_objects.reduce((acc, alertComment) => {
    if ((0, _common3.isCommentRequestTypeAlertOrGenAlert)(alertComment.attributes) && alertComment.attributes.associationType === _common2.AssociationType.subCase) {
      const id = getID(alertComment, _common2.SUB_CASE_SAVED_OBJECT);

      if (id !== undefined) {
        acc.add(id);
      }
    }

    return acc;
  }, new Set());
  const subCases = await caseService.getSubCases({
    ids: Array.from(subCasesToRetrieve.values()),
    unsecuredSavedObjectsClient
  });
  return subCases.saved_objects.reduce((acc, subCase) => {
    // log about the sub cases that we couldn't find
    if (!subCase.error) {
      acc.set(subCase.id, subCase.attributes.status);
    }

    return acc;
  }, new Map());
}
/**
 * Returns what status the alert comment should have based on whether it is associated to a case or sub case.
 */


function getSyncStatusForComment({
  alertComment,
  casesToSyncToStatus,
  subCasesToStatus
}) {
  let status = _common2.CaseStatuses.open;

  if (alertComment.attributes.associationType === _common2.AssociationType.case) {
    var _casesToSyncToStatus$;

    const id = getID(alertComment, _common2.CASE_SAVED_OBJECT); // We should log if we can't find the status
    // attempt to get the case status from our cases to sync map if we found the ID otherwise default to open

    status = id !== undefined ? (_casesToSyncToStatus$ = casesToSyncToStatus.get(id)) !== null && _casesToSyncToStatus$ !== void 0 ? _casesToSyncToStatus$ : _common2.CaseStatuses.open : _common2.CaseStatuses.open;
  } else if (alertComment.attributes.associationType === _common2.AssociationType.subCase) {
    var _subCasesToStatus$get;

    const id = getID(alertComment, _common2.SUB_CASE_SAVED_OBJECT);
    status = id !== undefined ? (_subCasesToStatus$get = subCasesToStatus.get(id)) !== null && _subCasesToStatus$get !== void 0 ? _subCasesToStatus$get : _common2.CaseStatuses.open : _common2.CaseStatuses.open;
  }

  return status;
}
/**
 * Updates the alert ID's status field based on the patch requests
 */


async function updateAlerts({
  casesWithSyncSettingChangedToOn,
  casesWithStatusChangedAndSynced,
  caseService,
  unsecuredSavedObjectsClient,
  casesClientInternal
}) {
  /**
   * It's possible that a case ID can appear multiple times in each array. I'm intentionally placing the status changes
   * last so when the map is built we will use the last status change as the source of truth.
   */
  const casesToSync = [...casesWithSyncSettingChangedToOn, ...casesWithStatusChangedAndSynced]; // build a map of case id to the status it has
  // this will have collections in it but the alerts should be associated to sub cases and not collections so it shouldn't
  // matter.

  const casesToSyncToStatus = casesToSync.reduce((acc, {
    updateReq,
    originalCase
  }) => {
    var _ref, _updateReq$status;

    acc.set(updateReq.id, (_ref = (_updateReq$status = updateReq.status) !== null && _updateReq$status !== void 0 ? _updateReq$status : originalCase.attributes.status) !== null && _ref !== void 0 ? _ref : _common2.CaseStatuses.open);
    return acc;
  }, new Map()); // get all the alerts for all the alert comments for all cases and collections. Collections themselves won't have any
  // but their sub cases could

  const totalAlerts = await getAlertComments({
    casesToSync,
    caseService,
    unsecuredSavedObjectsClient
  }); // get a map of sub case id to the sub case status

  const subCasesToStatus = await getSubCasesToStatus({
    totalAlerts,
    unsecuredSavedObjectsClient,
    caseService
  }); // create an array of requests that indicate the id, index, and status to update an alert

  const alertsToUpdate = totalAlerts.saved_objects.reduce((acc, alertComment) => {
    if ((0, _common3.isCommentRequestTypeAlertOrGenAlert)(alertComment.attributes)) {
      const status = getSyncStatusForComment({
        alertComment,
        casesToSyncToStatus,
        subCasesToStatus
      });
      acc.push(...(0, _common3.createAlertUpdateRequest)({
        comment: alertComment.attributes,
        status
      }));
    }

    return acc;
  }, []);
  await casesClientInternal.alerts.updateStatus({
    alerts: alertsToUpdate
  });
}

function partitionPatchRequest(casesMap, patchReqCases) {
  const nonExistingCases = [];
  const conflictedCases = [];
  const casesToAuthorize = new Map();

  for (const reqCase of patchReqCases) {
    const foundCase = casesMap.get(reqCase.id);

    if (!foundCase || foundCase.error) {
      nonExistingCases.push(reqCase);
    } else if (foundCase.version !== reqCase.version) {
      conflictedCases.push(reqCase); // let's try to authorize the conflicted case even though we'll fail after afterwards just in case

      casesToAuthorize.set(foundCase.id, {
        id: foundCase.id,
        owner: foundCase.attributes.owner
      });
    } else {
      casesToAuthorize.set(foundCase.id, {
        id: foundCase.id,
        owner: foundCase.attributes.owner
      });
    }
  }

  return {
    nonExistingCases,
    conflictedCases,
    casesToAuthorize: Array.from(casesToAuthorize.values())
  };
}
/**
 * Updates the specified cases with new values
 *
 * @ignore
 */


const update = async (cases, clientArgs, casesClientInternal) => {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    userActionService,
    user,
    logger,
    authorization
  } = clientArgs;
  const query = (0, _pipeable.pipe)((0, _common2.excess)(_common2.CasesPatchRequestRt).decode(cases), (0, _Either.fold)((0, _common2.throwErrors)(_boom.default.badRequest), _function.identity));

  try {
    const myCases = await caseService.getCases({
      unsecuredSavedObjectsClient,
      caseIds: query.cases.map(q => q.id)
    });
    const casesMap = myCases.saved_objects.reduce((acc, so) => {
      acc.set(so.id, so);
      return acc;
    }, new Map());
    const {
      nonExistingCases,
      conflictedCases,
      casesToAuthorize
    } = partitionPatchRequest(casesMap, query.cases);
    await authorization.ensureAuthorized({
      entities: casesToAuthorize,
      operation: _authorization.Operations.updateCase
    });

    if (nonExistingCases.length > 0) {
      throw _boom.default.notFound(`These cases ${nonExistingCases.map(c => c.id).join(', ')} do not exist. Please check you have the correct ids.`);
    }

    if (conflictedCases.length > 0) {
      throw _boom.default.conflict(`These cases ${conflictedCases.map(c => c.id).join(', ')} has been updated. Please refresh before saving additional updates.`);
    }

    const updateCases = query.cases.reduce((acc, updateCase) => {
      const originalCase = casesMap.get(updateCase.id);

      if (!originalCase) {
        return acc;
      }

      const fieldsToUpdate = (0, _utils.getCaseToUpdate)(originalCase.attributes, updateCase);
      const {
        id,
        version,
        ...restFields
      } = fieldsToUpdate;

      if (Object.keys(restFields).length > 0) {
        acc.push({
          originalCase,
          updateReq: fieldsToUpdate
        });
      }

      return acc;
    }, []);

    if (updateCases.length <= 0) {
      throw _boom.default.notAcceptable('All update fields are identical to current version.');
    }

    if (!_common2.ENABLE_CASE_CONNECTOR) {
      throwIfUpdateType(updateCases);
    }

    throwIfUpdateOwner(updateCases);
    throwIfTitleIsInvalid(updateCases);
    throwIfUpdateStatusOfCollection(updateCases);
    throwIfUpdateTypeCollectionToIndividual(updateCases);
    await throwIfInvalidUpdateOfTypeWithAlerts({
      requests: updateCases,
      caseService,
      unsecuredSavedObjectsClient
    }); // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      username,
      full_name,
      email
    } = user;
    const updatedDt = new Date().toISOString();
    const updatedCases = await caseService.patchCases({
      unsecuredSavedObjectsClient,
      cases: updateCases.map(({
        updateReq,
        originalCase
      }) => {
        // intentionally removing owner from the case so that we don't accidentally allow it to be updated
        const {
          id: caseId,
          version,
          owner,
          ...updateCaseAttributes
        } = updateReq;
        let closedInfo = {};

        if (updateCaseAttributes.status && updateCaseAttributes.status === _common2.CaseStatuses.closed) {
          closedInfo = {
            closed_at: updatedDt,
            closed_by: {
              email,
              full_name,
              username
            }
          };
        } else if (updateCaseAttributes.status && (updateCaseAttributes.status === _common2.CaseStatuses.open || updateCaseAttributes.status === _common2.CaseStatuses['in-progress'])) {
          closedInfo = {
            closed_at: null,
            closed_by: null
          };
        }

        return {
          caseId,
          originalCase,
          updatedAttributes: { ...updateCaseAttributes,
            ...closedInfo,
            updated_at: updatedDt,
            updated_by: {
              email,
              full_name,
              username
            }
          },
          version
        };
      })
    }); // If a status update occurred and the case is synced then we need to update all alerts' status
    // attached to the case to the new status.

    const casesWithStatusChangedAndSynced = updateCases.filter(({
      updateReq,
      originalCase
    }) => {
      return originalCase != null && updateReq.status != null && originalCase.attributes.status !== updateReq.status && originalCase.attributes.settings.syncAlerts;
    }); // If syncAlerts setting turned on we need to update all alerts' status
    // attached to the case to the current status.

    const casesWithSyncSettingChangedToOn = updateCases.filter(({
      updateReq,
      originalCase
    }) => {
      var _updateReq$settings;

      return originalCase != null && ((_updateReq$settings = updateReq.settings) === null || _updateReq$settings === void 0 ? void 0 : _updateReq$settings.syncAlerts) != null && originalCase.attributes.settings.syncAlerts !== updateReq.settings.syncAlerts && updateReq.settings.syncAlerts;
    }); // Update the alert's status to match any case status or sync settings changes

    await updateAlerts({
      casesWithStatusChangedAndSynced,
      casesWithSyncSettingChangedToOn,
      caseService,
      unsecuredSavedObjectsClient,
      casesClientInternal
    });
    const returnUpdatedCase = myCases.saved_objects.filter(myCase => updatedCases.saved_objects.some(updatedCase => updatedCase.id === myCase.id)).map(myCase => {
      var _updatedCase$version;

      const updatedCase = updatedCases.saved_objects.find(c => c.id === myCase.id);
      return (0, _common3.flattenCaseSavedObject)({
        savedObject: { ...myCase,
          ...updatedCase,
          attributes: { ...myCase.attributes,
            ...(updatedCase === null || updatedCase === void 0 ? void 0 : updatedCase.attributes)
          },
          references: myCase.references,
          version: (_updatedCase$version = updatedCase === null || updatedCase === void 0 ? void 0 : updatedCase.version) !== null && _updatedCase$version !== void 0 ? _updatedCase$version : myCase.version
        }
      });
    });
    await userActionService.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: (0, _helpers.buildCaseUserActions)({
        originalCases: myCases.saved_objects,
        updatedCases: updatedCases.saved_objects,
        actionDate: updatedDt,
        actionBy: {
          email,
          full_name,
          username
        }
      })
    });
    return _common2.CasesResponseRt.encode(returnUpdatedCase);
  } catch (error) {
    const idVersions = cases.cases.map(caseInfo => ({
      id: caseInfo.id,
      version: caseInfo.version
    }));
    throw (0, _common3.createCaseError)({
      message: `Failed to update case, ids: ${JSON.stringify(idVersions)}: ${error}`,
      error,
      logger
    });
  }
};

exports.update = update;