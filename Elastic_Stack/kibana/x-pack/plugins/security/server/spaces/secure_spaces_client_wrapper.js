"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SecureSpacesClientWrapper = exports.LEGACY_URL_ALIAS_TYPE = void 0;
exports.getAliasId = getAliasId;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _audit = require("../audit");

var _saved_objects = require("../saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PURPOSE_PRIVILEGE_MAP = {
  any: authorization => [authorization.actions.login],
  copySavedObjectsIntoSpace: authorization => [authorization.actions.ui.get('savedObjectsManagement', 'copyIntoSpace')],
  findSavedObjects: authorization => {
    return [authorization.actions.login, authorization.actions.savedObject.get('config', 'find')];
  },
  shareSavedObjectsIntoSpace: authorization => [authorization.actions.ui.get('savedObjectsManagement', 'shareIntoSpace')]
};
/** @internal */

const LEGACY_URL_ALIAS_TYPE = 'legacy-url-alias';
exports.LEGACY_URL_ALIAS_TYPE = LEGACY_URL_ALIAS_TYPE;

class SecureSpacesClientWrapper {
  constructor(spacesClient, request, authorization, auditLogger, legacyAuditLogger, errors) {
    (0, _defineProperty2.default)(this, "useRbac", void 0);
    this.spacesClient = spacesClient;
    this.request = request;
    this.authorization = authorization;
    this.auditLogger = auditLogger;
    this.legacyAuditLogger = legacyAuditLogger;
    this.errors = errors;
    this.useRbac = this.authorization.mode.useRbacForRequest(this.request);
  }

  async getAll({
    purpose = 'any',
    includeAuthorizedPurposes
  } = {}) {
    const allSpaces = await this.spacesClient.getAll({
      purpose,
      includeAuthorizedPurposes
    });

    if (!this.useRbac) {
      allSpaces.forEach(({
        id
      }) => this.auditLogger.log((0, _audit.spaceAuditEvent)({
        action: _audit.SpaceAuditAction.FIND,
        savedObject: {
          type: 'space',
          id
        }
      })));
      return allSpaces;
    }

    const spaceIds = allSpaces.map(space => space.id);
    const checkPrivileges = this.authorization.checkPrivilegesWithRequest(this.request); // Collect all privileges which need to be checked

    const allPrivileges = Object.entries(PURPOSE_PRIVILEGE_MAP).reduce((acc, [getSpacesPurpose, privilegeFactory]) => !includeAuthorizedPurposes && getSpacesPurpose !== purpose ? acc : { ...acc,
      [getSpacesPurpose]: privilegeFactory(this.authorization)
    }, {}); // Check all privileges against all spaces

    const {
      username,
      privileges
    } = await checkPrivileges.atSpaces(spaceIds, {
      kibana: Object.values(allPrivileges).flat()
    }); // Determine which purposes the user is authorized for within each space.
    // Remove any spaces for which user is fully unauthorized.

    const checkHasAllRequired = (space, actions) => actions.every(action => privileges.kibana.some(({
      resource,
      privilege,
      authorized
    }) => resource === space.id && privilege === action && authorized));

    const authorizedSpaces = allSpaces.map(space => {
      if (!includeAuthorizedPurposes) {
        // Check if the user is authorized for a single purpose
        const requiredActions = PURPOSE_PRIVILEGE_MAP[purpose](this.authorization);
        return checkHasAllRequired(space, requiredActions) ? space : null;
      } // Check if the user is authorized for each purpose


      let hasAnyAuthorization = false;
      const authorizedPurposes = Object.entries(PURPOSE_PRIVILEGE_MAP).reduce((acc, [purposeKey, privilegeFactory]) => {
        const requiredActions = privilegeFactory(this.authorization);
        const hasAllRequired = checkHasAllRequired(space, requiredActions);
        hasAnyAuthorization = hasAnyAuthorization || hasAllRequired;
        return { ...acc,
          [purposeKey]: hasAllRequired
        };
      }, {});

      if (!hasAnyAuthorization) {
        return null;
      }

      return { ...space,
        authorizedPurposes
      };
    }).filter(this.filterUnauthorizedSpaceResults);

    if (authorizedSpaces.length === 0) {
      const error = _boom.default.forbidden();

      this.legacyAuditLogger.spacesAuthorizationFailure(username, 'getAll');
      this.auditLogger.log((0, _audit.spaceAuditEvent)({
        action: _audit.SpaceAuditAction.FIND,
        error
      }));
      throw error; // Note: there is a catch for this in `SpacesSavedObjectsClient.find`; if we get rid of this error, remove that too
    }

    const authorizedSpaceIds = authorizedSpaces.map(space => space.id);
    this.legacyAuditLogger.spacesAuthorizationSuccess(username, 'getAll', authorizedSpaceIds);
    authorizedSpaces.forEach(({
      id
    }) => this.auditLogger.log((0, _audit.spaceAuditEvent)({
      action: _audit.SpaceAuditAction.FIND,
      savedObject: {
        type: 'space',
        id
      }
    })));
    return authorizedSpaces;
  }

  async get(id) {
    if (this.useRbac) {
      try {
        await this.ensureAuthorizedAtSpace(id, this.authorization.actions.login, 'get', `Unauthorized to get ${id} space`);
      } catch (error) {
        this.auditLogger.log((0, _audit.spaceAuditEvent)({
          action: _audit.SpaceAuditAction.GET,
          savedObject: {
            type: 'space',
            id
          },
          error
        }));
        throw error;
      }
    }

    const space = this.spacesClient.get(id);
    this.auditLogger.log((0, _audit.spaceAuditEvent)({
      action: _audit.SpaceAuditAction.GET,
      savedObject: {
        type: 'space',
        id
      }
    }));
    return space;
  }

  async create(space) {
    if (this.useRbac) {
      try {
        await this.ensureAuthorizedGlobally(this.authorization.actions.space.manage, 'create', 'Unauthorized to create spaces');
      } catch (error) {
        this.auditLogger.log((0, _audit.spaceAuditEvent)({
          action: _audit.SpaceAuditAction.CREATE,
          savedObject: {
            type: 'space',
            id: space.id
          },
          error
        }));
        throw error;
      }
    }

    this.auditLogger.log((0, _audit.spaceAuditEvent)({
      action: _audit.SpaceAuditAction.CREATE,
      outcome: 'unknown',
      savedObject: {
        type: 'space',
        id: space.id
      }
    }));
    return this.spacesClient.create(space);
  }

  async update(id, space) {
    if (this.useRbac) {
      try {
        await this.ensureAuthorizedGlobally(this.authorization.actions.space.manage, 'update', 'Unauthorized to update spaces');
      } catch (error) {
        this.auditLogger.log((0, _audit.spaceAuditEvent)({
          action: _audit.SpaceAuditAction.UPDATE,
          savedObject: {
            type: 'space',
            id
          },
          error
        }));
        throw error;
      }
    }

    this.auditLogger.log((0, _audit.spaceAuditEvent)({
      action: _audit.SpaceAuditAction.UPDATE,
      outcome: 'unknown',
      savedObject: {
        type: 'space',
        id
      }
    }));
    return this.spacesClient.update(id, space);
  }

  async delete(id) {
    if (this.useRbac) {
      try {
        await this.ensureAuthorizedGlobally(this.authorization.actions.space.manage, 'delete', 'Unauthorized to delete spaces');
      } catch (error) {
        this.auditLogger.log((0, _audit.spaceAuditEvent)({
          action: _audit.SpaceAuditAction.DELETE,
          savedObject: {
            type: 'space',
            id
          },
          error
        }));
        throw error;
      }
    }

    this.auditLogger.log((0, _audit.spaceAuditEvent)({
      action: _audit.SpaceAuditAction.DELETE,
      outcome: 'unknown',
      savedObject: {
        type: 'space',
        id
      }
    }));
    return this.spacesClient.delete(id);
  }

  async disableLegacyUrlAliases(aliases) {
    if (this.useRbac) {
      try {
        const [uniqueSpaces, uniqueTypes, typesAndSpacesMap] = aliases.reduce(([spaces, types, typesAndSpaces], {
          targetSpace,
          targetType
        }) => {
          var _typesAndSpaces$get;

          const spacesForType = (_typesAndSpaces$get = typesAndSpaces.get(targetType)) !== null && _typesAndSpaces$get !== void 0 ? _typesAndSpaces$get : new Set();
          return [spaces.add(targetSpace), types.add(targetType), typesAndSpaces.set(targetType, spacesForType.add(targetSpace))];
        }, [new Set(), new Set(), new Map()]);
        const action = 'bulk_update';
        const {
          typeActionMap
        } = await this.ensureAuthorizedForSavedObjects(Array.from(uniqueTypes), [action], Array.from(uniqueSpaces), {
          requireFullAuthorization: false
        });
        const unauthorizedTypes = new Set();

        for (const type of uniqueTypes) {
          const spaces = Array.from(typesAndSpacesMap.get(type));

          if (!(0, _saved_objects.isAuthorizedForObjectInAllSpaces)(type, action, typeActionMap, spaces)) {
            unauthorizedTypes.add(type);
          }
        }

        if (unauthorizedTypes.size > 0) {
          const targetTypes = Array.from(unauthorizedTypes).sort().join(',');
          const msg = `Unable to disable aliases for ${targetTypes}`;
          throw this.errors.decorateForbiddenError(new Error(msg));
        }
      } catch (error) {
        aliases.forEach(alias => {
          const id = getAliasId(alias);
          this.auditLogger.log((0, _audit.savedObjectEvent)({
            action: _audit.SavedObjectAction.UPDATE,
            savedObject: {
              type: LEGACY_URL_ALIAS_TYPE,
              id
            },
            error
          }));
        });
        throw error;
      }
    }

    aliases.forEach(alias => {
      const id = getAliasId(alias);
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.UPDATE,
        outcome: 'unknown',
        savedObject: {
          type: LEGACY_URL_ALIAS_TYPE,
          id
        }
      }));
    });
    return this.spacesClient.disableLegacyUrlAliases(aliases);
  }

  async ensureAuthorizedForSavedObjects(types, actions, namespaces, options) {
    const ensureAuthorizedDependencies = {
      actions: this.authorization.actions,
      errors: this.errors,
      checkSavedObjectsPrivilegesAsCurrentUser: this.authorization.checkSavedObjectsPrivilegesWithRequest(this.request)
    };
    return (0, _saved_objects.ensureAuthorized)(ensureAuthorizedDependencies, types, actions, namespaces, options);
  }

  async ensureAuthorizedGlobally(action, method, forbiddenMessage) {
    const checkPrivileges = this.authorization.checkPrivilegesWithRequest(this.request);
    const {
      username,
      hasAllRequested
    } = await checkPrivileges.globally({
      kibana: action
    });

    if (hasAllRequested) {
      this.legacyAuditLogger.spacesAuthorizationSuccess(username, method);
    } else {
      this.legacyAuditLogger.spacesAuthorizationFailure(username, method);
      throw _boom.default.forbidden(forbiddenMessage);
    }
  }

  async ensureAuthorizedAtSpace(spaceId, action, method, forbiddenMessage) {
    const checkPrivileges = this.authorization.checkPrivilegesWithRequest(this.request);
    const {
      username,
      hasAllRequested
    } = await checkPrivileges.atSpace(spaceId, {
      kibana: action
    });

    if (hasAllRequested) {
      this.legacyAuditLogger.spacesAuthorizationSuccess(username, method, [spaceId]);
    } else {
      this.legacyAuditLogger.spacesAuthorizationFailure(username, method, [spaceId]);
      throw _boom.default.forbidden(forbiddenMessage);
    }
  }

  filterUnauthorizedSpaceResults(value) {
    return value !== null;
  }

}
/** @internal This is only exported for testing purposes. */


exports.SecureSpacesClientWrapper = SecureSpacesClientWrapper;

function getAliasId({
  targetSpace,
  targetType,
  sourceId
}) {
  return `${targetSpace}:${targetType}:${sourceId}`;
}