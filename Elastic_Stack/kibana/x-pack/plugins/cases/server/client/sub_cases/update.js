"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _common = require("../../../../../../src/plugins/data/common");

var _common2 = require("../../../common");

var _utils = require("../utils");

var _helpers = require("../../services/user_actions/helpers");

var _common3 = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function checkNonExistingOrConflict(toUpdate, fromStorage) {
  const nonExistingSubCases = [];
  const conflictedSubCases = [];

  for (const subCaseToUpdate of toUpdate) {
    const bulkEntry = fromStorage.get(subCaseToUpdate.id);

    if (bulkEntry && bulkEntry.error) {
      nonExistingSubCases.push(subCaseToUpdate);
    }

    if (!bulkEntry || bulkEntry.version !== subCaseToUpdate.version) {
      conflictedSubCases.push(subCaseToUpdate);
    }
  }

  if (nonExistingSubCases.length > 0) {
    throw _boom.default.notFound(`These sub cases ${nonExistingSubCases.map(c => c.id).join(', ')} do not exist. Please check you have the correct ids.`);
  }

  if (conflictedSubCases.length > 0) {
    throw _boom.default.conflict(`These sub cases ${conflictedSubCases.map(c => c.id).join(', ')} has been updated. Please refresh before saving additional updates.`);
  }
}

function getParentIDs({
  subCasesMap,
  subCaseIDs
}) {
  return subCaseIDs.reduce((acc, id) => {
    const subCase = subCasesMap.get(id);

    if (subCase && subCase.references.length > 0) {
      const parentID = subCase.references[0].id;
      acc.ids.push(parentID);
      let subIDs = acc.parentIDToSubID.get(parentID);

      if (subIDs === undefined) {
        subIDs = [];
      }

      subIDs.push(id);
      acc.parentIDToSubID.set(parentID, subIDs);
    }

    return acc;
  }, {
    ids: [],
    parentIDToSubID: new Map()
  });
}

async function getParentCases({
  caseService,
  unsecuredSavedObjectsClient,
  subCaseIDs,
  subCasesMap
}) {
  const parentIDInfo = getParentIDs({
    subCaseIDs,
    subCasesMap
  });
  const parentCases = await caseService.getCases({
    unsecuredSavedObjectsClient,
    caseIds: parentIDInfo.ids
  });
  const parentCaseErrors = parentCases.saved_objects.filter(so => so.error !== undefined);

  if (parentCaseErrors.length > 0) {
    throw _boom.default.badRequest(`Unable to find parent cases: ${parentCaseErrors.map(c => c.id).join(', ')} for sub cases: ${subCaseIDs.join(', ')}`);
  }

  return parentCases.saved_objects.reduce((acc, so) => {
    const subCaseIDsWithParent = parentIDInfo.parentIDToSubID.get(so.id);
    subCaseIDsWithParent === null || subCaseIDsWithParent === void 0 ? void 0 : subCaseIDsWithParent.forEach(subCaseId => {
      acc.set(subCaseId, so);
    });
    return acc;
  }, new Map());
}

function getValidUpdateRequests(toUpdate, subCasesMap) {
  const validatedSubCaseAttributes = toUpdate.map(updateCase => {
    const currentCase = subCasesMap.get(updateCase.id);
    return currentCase != null ? (0, _utils.getCaseToUpdate)(currentCase.attributes, { ...updateCase
    }) : {
      id: updateCase.id,
      version: updateCase.version
    };
  });
  return validatedSubCaseAttributes.filter(updateCase => {
    const {
      id,
      version,
      ...updateCaseAttributes
    } = updateCase;
    return Object.keys(updateCaseAttributes).length > 0;
  });
}
/**
 * Get the id from a reference in a comment for a sub case
 */


function getID(comment) {
  var _comment$references$f;

  return (_comment$references$f = comment.references.find(ref => ref.type === _common2.SUB_CASE_SAVED_OBJECT)) === null || _comment$references$f === void 0 ? void 0 : _comment$references$f.id;
}
/**
 * Get all the alert comments for a set of sub cases
 */


async function getAlertComments({
  subCasesToSync,
  caseService,
  unsecuredSavedObjectsClient
}) {
  const ids = subCasesToSync.map(subCase => subCase.id);
  return caseService.getAllSubCaseComments({
    unsecuredSavedObjectsClient,
    id: ids,
    options: {
      filter: _common.nodeBuilder.or([_common.nodeBuilder.is(`${_common2.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _common2.CommentType.alert), _common.nodeBuilder.is(`${_common2.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _common2.CommentType.generatedAlert)])
    }
  });
}
/**
 * Updates the status of alerts for the specified sub cases.
 */


async function updateAlerts({
  caseService,
  unsecuredSavedObjectsClient,
  casesClientInternal,
  logger,
  subCasesToSync
}) {
  try {
    const subCasesToSyncMap = subCasesToSync.reduce((acc, subCase) => {
      acc.set(subCase.id, subCase);
      return acc;
    }, new Map()); // get all the alerts for all sub cases that need to be synced

    const totalAlerts = await getAlertComments({
      caseService,
      unsecuredSavedObjectsClient,
      subCasesToSync
    }); // create a map of the status (open, closed, etc) to alert info that needs to be updated

    const alertsToUpdate = totalAlerts.saved_objects.reduce((acc, alertComment) => {
      if ((0, _common3.isCommentRequestTypeAlertOrGenAlert)(alertComment.attributes)) {
        var _subCasesToSyncMap$ge, _subCasesToSyncMap$ge2;

        const id = getID(alertComment);
        const status = id !== undefined ? (_subCasesToSyncMap$ge = (_subCasesToSyncMap$ge2 = subCasesToSyncMap.get(id)) === null || _subCasesToSyncMap$ge2 === void 0 ? void 0 : _subCasesToSyncMap$ge2.status) !== null && _subCasesToSyncMap$ge !== void 0 ? _subCasesToSyncMap$ge : _common2.CaseStatuses.open : _common2.CaseStatuses.open;
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
  } catch (error) {
    throw (0, _common3.createCaseError)({
      message: `Failed to update alert status while updating sub cases: ${JSON.stringify(subCasesToSync)}: ${error}`,
      logger,
      error
    });
  }
}
/**
 * Handles updating the fields in a sub case.
 */


async function update({
  subCases,
  clientArgs,
  casesClientInternal
}) {
  const query = (0, _pipeable.pipe)((0, _common2.excess)(_common2.SubCasesPatchRequestRt).decode(subCases), (0, _Either.fold)((0, _common2.throwErrors)(_boom.default.badRequest), _function.identity));

  try {
    const {
      unsecuredSavedObjectsClient,
      user,
      caseService,
      userActionService
    } = clientArgs;
    const bulkSubCases = await caseService.getSubCases({
      unsecuredSavedObjectsClient,
      ids: query.subCases.map(q => q.id)
    });
    const subCasesMap = bulkSubCases.saved_objects.reduce((acc, so) => {
      acc.set(so.id, so);
      return acc;
    }, new Map());
    checkNonExistingOrConflict(query.subCases, subCasesMap);
    const nonEmptySubCaseRequests = getValidUpdateRequests(query.subCases, subCasesMap);

    if (nonEmptySubCaseRequests.length <= 0) {
      throw _boom.default.notAcceptable('All update fields are identical to current version.');
    }

    const subIDToParentCase = await getParentCases({
      unsecuredSavedObjectsClient,
      caseService,
      subCaseIDs: nonEmptySubCaseRequests.map(subCase => subCase.id),
      subCasesMap
    });
    const updatedAt = new Date().toISOString();
    const updatedCases = await caseService.patchSubCases({
      unsecuredSavedObjectsClient,
      subCases: nonEmptySubCaseRequests.map(thisCase => {
        const {
          id: subCaseId,
          version,
          ...updateSubCaseAttributes
        } = thisCase;
        let closedInfo = {
          closed_at: null,
          closed_by: null
        };

        if (updateSubCaseAttributes.status && updateSubCaseAttributes.status === _common2.CaseStatuses.closed) {
          closedInfo = {
            closed_at: updatedAt,
            closed_by: user
          };
        } else if (updateSubCaseAttributes.status && (updateSubCaseAttributes.status === _common2.CaseStatuses.open || updateSubCaseAttributes.status === _common2.CaseStatuses['in-progress'])) {
          closedInfo = {
            closed_at: null,
            closed_by: null
          };
        }

        return {
          subCaseId,
          updatedAttributes: { ...updateSubCaseAttributes,
            ...closedInfo,
            updated_at: updatedAt,
            updated_by: user
          },
          version
        };
      })
    });
    const subCasesToSyncAlertsFor = nonEmptySubCaseRequests.filter(subCaseToUpdate => {
      const storedSubCase = subCasesMap.get(subCaseToUpdate.id);
      const parentCase = subIDToParentCase.get(subCaseToUpdate.id);
      return storedSubCase !== undefined && subCaseToUpdate.status !== undefined && storedSubCase.attributes.status !== subCaseToUpdate.status && (parentCase === null || parentCase === void 0 ? void 0 : parentCase.attributes.settings.syncAlerts);
    });
    await updateAlerts({
      caseService,
      unsecuredSavedObjectsClient,
      casesClientInternal,
      subCasesToSync: subCasesToSyncAlertsFor,
      logger: clientArgs.logger
    });
    const returnUpdatedSubCases = updatedCases.saved_objects.reduce((acc, updatedSO) => {
      const originalSubCase = subCasesMap.get(updatedSO.id);

      if (originalSubCase) {
        var _updatedSO$version;

        acc.push((0, _common3.flattenSubCaseSavedObject)({
          savedObject: { ...originalSubCase,
            ...updatedSO,
            attributes: { ...originalSubCase.attributes,
              ...updatedSO.attributes
            },
            references: originalSubCase.references,
            version: (_updatedSO$version = updatedSO.version) !== null && _updatedSO$version !== void 0 ? _updatedSO$version : originalSubCase.version
          }
        }));
      }

      return acc;
    }, []);
    await userActionService.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: (0, _helpers.buildSubCaseUserActions)({
        originalSubCases: bulkSubCases.saved_objects,
        updatedSubCases: updatedCases.saved_objects,
        actionDate: updatedAt,
        actionBy: user
      })
    });
    return _common2.SubCasesResponseRt.encode(returnUpdatedSubCases);
  } catch (error) {
    const idVersions = query.subCases.map(subCase => ({
      id: subCase.id,
      version: subCase.version
    }));
    throw (0, _common3.createCaseError)({
      message: `Failed to update sub cases: ${JSON.stringify(idVersions)}: ${error}`,
      error,
      logger: clientArgs.logger
    });
  }
}