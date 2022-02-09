"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _server = require("../../../../../../src/core/server");

var _common = require("../../../common");

var _helpers = require("../../services/user_actions/helpers");

var _authorization = require("../../authorization");

var _common2 = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates a new case.
 *
 * @ignore
 */


const create = async (data, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    userActionService,
    user,
    logger,
    authorization: auth
  } = clientArgs; // default to an individual case if the type is not defined.

  const {
    type = _common.CaseType.individual,
    ...nonTypeCaseFields
  } = data;

  if (!_common.ENABLE_CASE_CONNECTOR && type === _common.CaseType.collection) {
    throw _boom.default.badRequest('Case type cannot be collection when the case connector feature is disabled');
  }

  const query = (0, _pipeable.pipe)( // decode with the defaulted type field
  (0, _common.excess)(_common.CasesClientPostRequestRt).decode({
    type,
    ...nonTypeCaseFields
  }), (0, _Either.fold)((0, _common.throwErrors)(_boom.default.badRequest), _function.identity));

  if (query.title.length > _common.MAX_TITLE_LENGTH) {
    throw _boom.default.badRequest(`The length of the title is too long. The maximum length is ${_common.MAX_TITLE_LENGTH}.`);
  }

  try {
    const savedObjectID = _server.SavedObjectsUtils.generateId();

    await auth.ensureAuthorized({
      operation: _authorization.Operations.createCase,
      entities: [{
        owner: query.owner,
        id: savedObjectID
      }]
    }); // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      username,
      full_name,
      email
    } = user;
    const createdDate = new Date().toISOString();
    const newCase = await caseService.postNewCase({
      unsecuredSavedObjectsClient,
      attributes: (0, _common2.transformNewCase)({
        createdDate,
        newCase: query,
        username,
        full_name,
        email,
        connector: query.connector
      }),
      id: savedObjectID
    });
    await userActionService.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: [(0, _helpers.buildCaseUserActionItem)({
        action: 'create',
        actionAt: createdDate,
        actionBy: {
          username,
          full_name,
          email
        },
        caseId: newCase.id,
        fields: ['description', 'status', 'tags', 'title', 'connector', 'settings', _common.OWNER_FIELD],
        newValue: query,
        owner: newCase.attributes.owner
      })]
    });
    return _common.CaseResponseRt.encode((0, _common2.flattenCaseSavedObject)({
      savedObject: newCase
    }));
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to create case: ${error}`,
      error,
      logger
    });
  }
};

exports.create = create;