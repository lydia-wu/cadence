"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpaceAuditAction = exports.SavedObjectAction = void 0;
exports.httpRequestEvent = httpRequestEvent;
exports.savedObjectEvent = savedObjectEvent;
exports.spaceAuditEvent = spaceAuditEvent;
exports.userLoginEvent = userLoginEvent;
exports.userLogoutEvent = userLogoutEvent;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Audit event schema using ECS format: https://www.elastic.co/guide/en/ecs/1.12/index.html
 *
 * If you add additional fields to the schema ensure you update the Kibana Filebeat module:
 * https://github.com/elastic/beats/tree/master/filebeat/module/kibana
 *
 * @public
 */

function httpRequestEvent({
  request
}) {
  var _request$rewrittenUrl;

  const url = (_request$rewrittenUrl = request.rewrittenUrl) !== null && _request$rewrittenUrl !== void 0 ? _request$rewrittenUrl : request.url;
  return {
    message: `User is requesting [${url.pathname}] endpoint`,
    event: {
      action: 'http_request',
      category: ['web'],
      outcome: 'unknown'
    },
    http: {
      request: {
        method: request.route.method
      }
    },
    url: {
      domain: url.hostname,
      path: url.pathname,
      port: url.port ? parseInt(url.port, 10) : undefined,
      query: url.search ? url.search.slice(1) : undefined,
      scheme: url.protocol ? url.protocol.substr(0, url.protocol.length - 1) : undefined
    }
  };
}

function userLoginEvent({
  authenticationResult,
  authenticationProvider,
  authenticationType
}) {
  var _authenticationResult, _authenticationResult2;

  return {
    message: authenticationResult.user ? `User [${authenticationResult.user.username}] has logged in using ${authenticationType} provider [name=${authenticationProvider}]` : `Failed attempt to login using ${authenticationType} provider [name=${authenticationProvider}]`,
    event: {
      action: 'user_login',
      category: ['authentication'],
      outcome: authenticationResult.user ? 'success' : 'failure'
    },
    user: authenticationResult.user && {
      name: authenticationResult.user.username,
      roles: authenticationResult.user.roles
    },
    kibana: {
      space_id: undefined,
      // Ensure this does not get populated by audit service
      authentication_provider: authenticationProvider,
      authentication_type: authenticationType,
      authentication_realm: (_authenticationResult = authenticationResult.user) === null || _authenticationResult === void 0 ? void 0 : _authenticationResult.authentication_realm.name,
      lookup_realm: (_authenticationResult2 = authenticationResult.user) === null || _authenticationResult2 === void 0 ? void 0 : _authenticationResult2.lookup_realm.name
    },
    error: authenticationResult.error && {
      code: authenticationResult.error.name,
      message: authenticationResult.error.message
    }
  };
}

function userLogoutEvent({
  username,
  provider
}) {
  return {
    message: `User [${username}] is logging out using ${provider.type} provider [name=${provider.name}]`,
    event: {
      action: 'user_logout',
      category: ['authentication'],
      outcome: 'unknown'
    },
    user: username ? {
      name: username
    } : undefined,
    kibana: {
      authentication_provider: provider.name,
      authentication_type: provider.type
    }
  };
}

let SavedObjectAction;
exports.SavedObjectAction = SavedObjectAction;

(function (SavedObjectAction) {
  SavedObjectAction["CREATE"] = "saved_object_create";
  SavedObjectAction["GET"] = "saved_object_get";
  SavedObjectAction["RESOLVE"] = "saved_object_resolve";
  SavedObjectAction["UPDATE"] = "saved_object_update";
  SavedObjectAction["DELETE"] = "saved_object_delete";
  SavedObjectAction["FIND"] = "saved_object_find";
  SavedObjectAction["ADD_TO_SPACES"] = "saved_object_add_to_spaces";
  SavedObjectAction["DELETE_FROM_SPACES"] = "saved_object_delete_from_spaces";
  SavedObjectAction["REMOVE_REFERENCES"] = "saved_object_remove_references";
  SavedObjectAction["OPEN_POINT_IN_TIME"] = "saved_object_open_point_in_time";
  SavedObjectAction["CLOSE_POINT_IN_TIME"] = "saved_object_close_point_in_time";
  SavedObjectAction["COLLECT_MULTINAMESPACE_REFERENCES"] = "saved_object_collect_multinamespace_references";
  SavedObjectAction["UPDATE_OBJECTS_SPACES"] = "saved_object_update_objects_spaces";
})(SavedObjectAction || (exports.SavedObjectAction = SavedObjectAction = {}));

const savedObjectAuditVerbs = {
  saved_object_create: ['create', 'creating', 'created'],
  saved_object_get: ['access', 'accessing', 'accessed'],
  saved_object_resolve: ['resolve', 'resolving', 'resolved'],
  saved_object_update: ['update', 'updating', 'updated'],
  saved_object_delete: ['delete', 'deleting', 'deleted'],
  saved_object_find: ['access', 'accessing', 'accessed'],
  saved_object_add_to_spaces: ['update', 'updating', 'updated'],
  saved_object_delete_from_spaces: ['update', 'updating', 'updated'],
  saved_object_open_point_in_time: ['open point-in-time', 'opening point-in-time', 'opened point-in-time'],
  saved_object_close_point_in_time: ['close point-in-time', 'closing point-in-time', 'closed point-in-time'],
  saved_object_remove_references: ['remove references to', 'removing references to', 'removed references to'],
  saved_object_collect_multinamespace_references: ['collect references and spaces of', 'collecting references and spaces of', 'collected references and spaces of'],
  saved_object_update_objects_spaces: ['update spaces of', 'updating spaces of', 'updated spaces of']
};
const savedObjectAuditTypes = {
  saved_object_create: 'creation',
  saved_object_get: 'access',
  saved_object_resolve: 'access',
  saved_object_update: 'change',
  saved_object_delete: 'deletion',
  saved_object_find: 'access',
  saved_object_add_to_spaces: 'change',
  saved_object_delete_from_spaces: 'change',
  saved_object_open_point_in_time: 'creation',
  saved_object_close_point_in_time: 'deletion',
  saved_object_remove_references: 'change',
  saved_object_collect_multinamespace_references: 'access',
  saved_object_update_objects_spaces: 'change'
};

function savedObjectEvent({
  action,
  savedObject,
  addToSpaces,
  deleteFromSpaces,
  outcome,
  error
}) {
  const doc = savedObject ? `${savedObject.type} [id=${savedObject.id}]` : 'saved objects';
  const [present, progressive, past] = savedObjectAuditVerbs[action];
  const message = error ? `Failed attempt to ${present} ${doc}` : outcome === 'unknown' ? `User is ${progressive} ${doc}` : `User has ${past} ${doc}`;
  const type = savedObjectAuditTypes[action];

  if (type === 'access' && savedObject && (savedObject.type === 'config' || savedObject.type === 'telemetry')) {
    return;
  }

  return {
    message,
    event: {
      action,
      category: ['database'],
      type: [type],
      outcome: outcome !== null && outcome !== void 0 ? outcome : error ? 'failure' : 'success'
    },
    kibana: {
      saved_object: savedObject,
      add_to_spaces: addToSpaces,
      delete_from_spaces: deleteFromSpaces
    },
    error: error && {
      code: error.name,
      message: error.message
    }
  };
}

let SpaceAuditAction;
exports.SpaceAuditAction = SpaceAuditAction;

(function (SpaceAuditAction) {
  SpaceAuditAction["CREATE"] = "space_create";
  SpaceAuditAction["GET"] = "space_get";
  SpaceAuditAction["UPDATE"] = "space_update";
  SpaceAuditAction["DELETE"] = "space_delete";
  SpaceAuditAction["FIND"] = "space_find";
})(SpaceAuditAction || (exports.SpaceAuditAction = SpaceAuditAction = {}));

const spaceAuditVerbs = {
  space_create: ['create', 'creating', 'created'],
  space_get: ['access', 'accessing', 'accessed'],
  space_update: ['update', 'updating', 'updated'],
  space_delete: ['delete', 'deleting', 'deleted'],
  space_find: ['access', 'accessing', 'accessed']
};
const spaceAuditTypes = {
  space_create: 'creation',
  space_get: 'access',
  space_update: 'change',
  space_delete: 'deletion',
  space_find: 'access'
};

function spaceAuditEvent({
  action,
  savedObject,
  outcome,
  error
}) {
  const doc = savedObject ? `space [id=${savedObject.id}]` : 'spaces';
  const [present, progressive, past] = spaceAuditVerbs[action];
  const message = error ? `Failed attempt to ${present} ${doc}` : outcome === 'unknown' ? `User is ${progressive} ${doc}` : `User has ${past} ${doc}`;
  const type = spaceAuditTypes[action];
  return {
    message,
    event: {
      action,
      category: ['database'],
      type: [type],
      outcome: outcome !== null && outcome !== void 0 ? outcome : error ? 'failure' : 'success'
    },
    kibana: {
      saved_object: savedObject
    },
    error: error && {
      code: error.name,
      message: error.message
    }
  };
}