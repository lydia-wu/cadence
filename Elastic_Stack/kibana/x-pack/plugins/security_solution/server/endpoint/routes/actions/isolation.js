"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isolationRequestHandler = void 0;
exports.registerHostIsolationRoutes = registerHostIsolationRoutes;

var _moment = _interopRequireDefault(require("moment"));

var _uuid = _interopRequireDefault(require("uuid"));

var _common = require("../../../../../cases/common");

var _actions = require("../../../../common/endpoint/schema/actions");

var _constants = require("../../../../common/endpoint/constants");

var _common2 = require("../../../../../fleet/common");

var _services = require("../../services");

var _constants2 = require("../../../../common/constants");

var _actions2 = require("../../../../common/endpoint/actions");

var _utils = require("../../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Registers the Host-(un-)isolation routes
 */


function registerHostIsolationRoutes(router, endpointContext) {
  // perform isolation
  router.post({
    path: _constants.ISOLATE_HOST_ROUTE,
    validate: _actions.HostIsolationRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, isolationRequestHandler(endpointContext, true)); // perform UN-isolate

  router.post({
    path: _constants.UNISOLATE_HOST_ROUTE,
    validate: _actions.HostIsolationRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, isolationRequestHandler(endpointContext, false));
}

const createFailedActionResponseEntry = async ({
  context,
  doc,
  logger
}) => {
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    await esClient.index({
      index: `${_constants.ENDPOINT_ACTION_RESPONSES_DS}-default`,
      body: { ...doc,
        error: {
          code: _constants.failedFleetActionErrorCode,
          message: 'Failed to deliver action request to fleet'
        }
      }
    });
  } catch (e) {
    logger.error(e);
  }
};

const isolationRequestHandler = function (endpointContext, isolate) {
  return async (context, req, res) => {
    var _endpointContext$serv, _endpointContext$serv2, _req$body$case_ids, _req$body$comment; // only allow admin users


    const user = (_endpointContext$serv = endpointContext.service.security) === null || _endpointContext$serv === void 0 ? void 0 : _endpointContext$serv.authc.getCurrentUser(req);

    if (!(0, _actions2.userCanIsolate)(user === null || user === void 0 ? void 0 : user.roles)) {
      return res.forbidden({
        body: {
          message: 'You do not have permission to perform this action'
        }
      });
    } // isolation requires plat+


    if (isolate && !((_endpointContext$serv2 = endpointContext.service.getLicenseService()) !== null && _endpointContext$serv2 !== void 0 && _endpointContext$serv2.isPlatinumPlus())) {
      return res.forbidden({
        body: {
          message: 'Your license level does not allow for this action'
        }
      });
    } // fetch the Agent IDs to send the commands to


    const endpointIDs = [...new Set(req.body.endpoint_ids)]; // dedupe

    const endpointData = await (0, _services.getMetadataForEndpoints)(endpointIDs, context);
    const casesClient = await endpointContext.service.getCasesClient(req); // convert any alert IDs into cases

    let caseIDs = ((_req$body$case_ids = req.body.case_ids) === null || _req$body$case_ids === void 0 ? void 0 : _req$body$case_ids.slice()) || [];

    if (req.body.alert_ids && req.body.alert_ids.length > 0) {
      const newIDs = await Promise.all(req.body.alert_ids.map(async a => {
        const cases = await casesClient.cases.getCasesByAlertID({
          alertID: a,
          options: {
            owner: _constants2.APP_ID
          }
        });
        return cases.map(caseInfo => {
          return caseInfo.id;
        });
      }));
      caseIDs = caseIDs.concat(...newIDs);
    }

    caseIDs = [...new Set(caseIDs)]; // create an Action ID and dispatch it to ES & Fleet Server

    const actionID = _uuid.default.v4();

    let fleetActionIndexResult;
    let logsEndpointActionsResult;
    const agents = endpointData.map(endpoint => endpoint.elastic.agent.id);
    const doc = {
      '@timestamp': (0, _moment.default)().toISOString(),
      agent: {
        id: agents
      },
      EndpointActions: {
        action_id: actionID,
        expiration: (0, _moment.default)().add(2, 'weeks').toISOString(),
        type: 'INPUT_ACTION',
        input_type: 'endpoint',
        data: {
          command: isolate ? 'isolate' : 'unisolate',
          comment: (_req$body$comment = req.body.comment) !== null && _req$body$comment !== void 0 ? _req$body$comment : undefined
        }
      },
      user: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: user.username
      }
    }; // if .logs-endpoint.actions data stream exists
    // try to create action request record in .logs-endpoint.actions DS as the current user
    // (from >= v7.16, use this check to ensure the current user has privileges to write to the new index)
    // and allow only users with superuser privileges to write to fleet indices

    const logger = endpointContext.logFactory.get('host-isolation');
    const doesLogsEndpointActionsDsExist = await (0, _utils.doLogsEndpointActionDsExists)({
      context,
      logger,
      dataStreamName: _constants.ENDPOINT_ACTIONS_DS
    }); // if the new endpoint indices/data streams exists
    // write the action request to the new index as the current user

    if (doesLogsEndpointActionsDsExist) {
      try {
        const esClient = context.core.elasticsearch.client.asCurrentUser;
        logsEndpointActionsResult = await esClient.index({
          index: `${_constants.ENDPOINT_ACTIONS_DS}-default`,
          body: { ...doc
          }
        });

        if (logsEndpointActionsResult.statusCode !== 201) {
          return res.customError({
            statusCode: 500,
            body: {
              message: logsEndpointActionsResult.body.result
            }
          });
        }
      } catch (e) {
        return res.customError({
          statusCode: 500,
          body: {
            message: e
          }
        });
      }
    }

    try {
      const esClient = context.core.elasticsearch.client.asInternalUser; // write as the internal user if the new indices do not exist
      // 8.0+ requires internal user to write to system indices

      fleetActionIndexResult = await esClient.index({
        index: _common2.AGENT_ACTIONS_INDEX,
        body: { ...doc.EndpointActions,
          '@timestamp': doc['@timestamp'],
          agents,
          timeout: 300,
          // 5 minutes
          user_id: doc.user.id
        }
      });

      if (fleetActionIndexResult.statusCode !== 201) {
        return res.customError({
          statusCode: 500,
          body: {
            message: fleetActionIndexResult.body.result
          }
        });
      }
    } catch (e) {
      // create entry in .logs-endpoint.action.responses-default data stream
      // when writing to .fleet-actions fails
      if (doesLogsEndpointActionsDsExist) {
        await createFailedActionResponseEntry({
          context,
          doc: {
            '@timestamp': (0, _moment.default)().toISOString(),
            agent: doc.agent,
            EndpointActions: {
              action_id: doc.EndpointActions.action_id,
              completed_at: (0, _moment.default)().toISOString(),
              started_at: (0, _moment.default)().toISOString(),
              data: doc.EndpointActions.data
            }
          },
          logger
        });
      }

      return res.customError({
        statusCode: 500,
        body: {
          message: e
        }
      });
    } // Update all cases with a comment


    if (caseIDs.length > 0) {
      const targets = endpointData.map(endpt => ({
        hostname: endpt.host.hostname,
        endpointId: endpt.agent.id
      }));
      await Promise.all(caseIDs.map(caseId => casesClient.attachments.add({
        caseId,
        comment: {
          type: _common.CommentType.actions,
          comment: req.body.comment || '',
          actions: {
            targets,
            type: isolate ? 'isolate' : 'unisolate'
          },
          owner: _constants2.APP_ID
        }
      })));
    }

    return res.ok({
      body: {
        action: actionID
      }
    });
  };
};

exports.isolationRequestHandler = isolationRequestHandler;