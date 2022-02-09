"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.push = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _common = require("../../../common");

var _helpers = require("../../services/user_actions/helpers");

var _utils = require("./utils");

var _common2 = require("../../common");

var _authorization = require("../../authorization");

var _connectors = require("../../connectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns true if the case should be closed based on the configuration settings and whether the case
 * is a collection. Collections are not closable because we aren't allowing their status to be changed.
 * In the future we could allow push to close all the sub cases of a collection but that's not currently supported.
 */


function shouldCloseByPush(configureSettings, caseInfo) {
  return configureSettings.total > 0 && configureSettings.saved_objects[0].attributes.closure_type === 'close-by-pushing' && caseInfo.attributes.type !== _common.CaseType.collection;
}
/**
 * Parameters for pushing a case to an external system
 */

/**
 * Push a case to an external service.
 *
 * @ignore
 */


const push = async ({
  connectorId,
  caseId
}, clientArgs, casesClient, casesClientInternal) => {
  const {
    unsecuredSavedObjectsClient,
    attachmentService,
    caseService,
    caseConfigureService,
    userActionService,
    actionsClient,
    user,
    logger,
    authorization
  } = clientArgs;

  try {
    var _connector$id, _theCase$totalComment;
    /* Start of push to external service */


    const [theCase, connector, userActions] = await Promise.all([casesClient.cases.get({
      id: caseId,
      includeComments: true,
      includeSubCaseComments: _common.ENABLE_CASE_CONNECTOR
    }), actionsClient.get({
      id: connectorId
    }), casesClient.userActions.getAll({
      caseId
    })]);
    await authorization.ensureAuthorized({
      entities: [{
        owner: theCase.owner,
        id: caseId
      }],
      operation: _authorization.Operations.pushCase
    }); // We need to change the logic when we support subcases

    if ((theCase === null || theCase === void 0 ? void 0 : theCase.status) === _common.CaseStatuses.closed) {
      throw _boom.default.conflict(`The ${theCase.title} case is closed. Pushing a closed case is not allowed.`);
    }

    const alertsInfo = (0, _common2.getAlertInfoFromComments)(theCase === null || theCase === void 0 ? void 0 : theCase.comments);
    const alerts = await casesClientInternal.alerts.get({
      alertsInfo
    });
    const getMappingsResponse = await casesClientInternal.configuration.getMappings({
      connector: theCase.connector
    });
    const mappings = getMappingsResponse.length === 0 ? await casesClientInternal.configuration.createMappings({
      connector: theCase.connector,
      owner: theCase.owner
    }) : getMappingsResponse[0].attributes.mappings;
    const externalServiceIncident = await (0, _utils.createIncident)({
      actionsClient,
      theCase,
      userActions,
      connector: connector,
      mappings,
      alerts,
      casesConnectors: _connectors.casesConnectors
    });
    const pushRes = await actionsClient.execute({
      actionId: (_connector$id = connector === null || connector === void 0 ? void 0 : connector.id) !== null && _connector$id !== void 0 ? _connector$id : '',
      params: {
        subAction: 'pushToService',
        subActionParams: externalServiceIncident
      }
    });

    if (pushRes.status === 'error') {
      var _ref, _pushRes$serviceMessa;

      throw _boom.default.failedDependency((_ref = (_pushRes$serviceMessa = pushRes.serviceMessage) !== null && _pushRes$serviceMessa !== void 0 ? _pushRes$serviceMessa : pushRes.message) !== null && _ref !== void 0 ? _ref : 'Error pushing to service');
    }
    /* End of push to external service */

    /* Start of update case with push information */


    const [myCase, myCaseConfigure, comments] = await Promise.all([caseService.getCase({
      unsecuredSavedObjectsClient,
      id: caseId
    }), caseConfigureService.find({
      unsecuredSavedObjectsClient
    }), caseService.getAllCaseComments({
      unsecuredSavedObjectsClient,
      id: caseId,
      options: {
        fields: [],
        page: 1,
        perPage: (_theCase$totalComment = theCase === null || theCase === void 0 ? void 0 : theCase.totalComment) !== null && _theCase$totalComment !== void 0 ? _theCase$totalComment : 0
      },
      includeSubCaseComments: _common.ENABLE_CASE_CONNECTOR
    })]); // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      username,
      full_name,
      email
    } = user;
    const pushedDate = new Date().toISOString();
    const externalServiceResponse = pushRes.data;
    const externalService = {
      pushed_at: pushedDate,
      pushed_by: {
        username,
        full_name,
        email
      },
      connector_id: connector.id,
      connector_name: connector.name,
      external_id: externalServiceResponse.id,
      external_title: externalServiceResponse.title,
      external_url: externalServiceResponse.url
    };
    const shouldMarkAsClosed = shouldCloseByPush(myCaseConfigure, myCase);
    const [updatedCase, updatedComments] = await Promise.all([caseService.patchCase({
      originalCase: myCase,
      unsecuredSavedObjectsClient,
      caseId,
      updatedAttributes: { ...(shouldMarkAsClosed ? {
          status: _common.CaseStatuses.closed,
          closed_at: pushedDate,
          closed_by: {
            email,
            full_name,
            username
          }
        } : {}),
        external_service: externalService,
        updated_at: pushedDate,
        updated_by: {
          username,
          full_name,
          email
        }
      },
      version: myCase.version
    }), attachmentService.bulkUpdate({
      unsecuredSavedObjectsClient,
      comments: comments.saved_objects.filter(comment => comment.attributes.pushed_at == null).map(comment => ({
        attachmentId: comment.id,
        updatedAttributes: {
          pushed_at: pushedDate,
          pushed_by: {
            username,
            full_name,
            email
          }
        },
        version: comment.version
      }))
    }), userActionService.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: [...(shouldMarkAsClosed ? [(0, _helpers.buildCaseUserActionItem)({
        action: 'update',
        actionAt: pushedDate,
        actionBy: {
          username,
          full_name,
          email
        },
        caseId,
        fields: ['status'],
        newValue: _common.CaseStatuses.closed,
        oldValue: myCase.attributes.status,
        owner: myCase.attributes.owner
      })] : []), (0, _helpers.buildCaseUserActionItem)({
        action: 'push-to-service',
        actionAt: pushedDate,
        actionBy: {
          username,
          full_name,
          email
        },
        caseId,
        fields: ['pushed'],
        newValue: externalService,
        owner: myCase.attributes.owner
      })]
    })]);
    /* End of update case with push information */

    return _common.CaseResponseRt.encode((0, _common2.flattenCaseSavedObject)({
      savedObject: { ...myCase,
        ...updatedCase,
        attributes: { ...myCase.attributes,
          ...(updatedCase === null || updatedCase === void 0 ? void 0 : updatedCase.attributes)
        },
        references: myCase.references
      },
      comments: comments.saved_objects.map(origComment => {
        var _updatedComment$versi, _origComment$referenc;

        const updatedComment = updatedComments.saved_objects.find(c => c.id === origComment.id);
        return { ...origComment,
          ...updatedComment,
          attributes: { ...origComment.attributes,
            ...(updatedComment === null || updatedComment === void 0 ? void 0 : updatedComment.attributes),
            ...(0, _utils.getCommentContextFromAttributes)(origComment.attributes)
          },
          version: (_updatedComment$versi = updatedComment === null || updatedComment === void 0 ? void 0 : updatedComment.version) !== null && _updatedComment$versi !== void 0 ? _updatedComment$versi : origComment.version,
          references: (_origComment$referenc = origComment === null || origComment === void 0 ? void 0 : origComment.references) !== null && _origComment$referenc !== void 0 ? _origComment$referenc : []
        };
      })
    }));
  } catch (error) {
    throw (0, _common2.createCaseError)({
      message: `Failed to push case: ${error}`,
      error,
      logger
    });
  }
};

exports.push = push;