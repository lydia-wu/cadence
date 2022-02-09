"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SecureSavedObjectsClientWrapper = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _server = require("../../../../../src/core/server");

var _constants = require("../../common/constants");

var _audit = require("../audit");

var _ensure_authorized = require("./ensure_authorized");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class SecureSavedObjectsClientWrapper {
  constructor({
    actions,
    legacyAuditLogger,
    auditLogger,
    baseClient,
    checkSavedObjectsPrivilegesAsCurrentUser,
    errors,
    getSpacesService
  }) {
    (0, _defineProperty2.default)(this, "actions", void 0);
    (0, _defineProperty2.default)(this, "legacyAuditLogger", void 0);
    (0, _defineProperty2.default)(this, "auditLogger", void 0);
    (0, _defineProperty2.default)(this, "baseClient", void 0);
    (0, _defineProperty2.default)(this, "checkSavedObjectsPrivilegesAsCurrentUser", void 0);
    (0, _defineProperty2.default)(this, "getSpacesService", void 0);
    (0, _defineProperty2.default)(this, "errors", void 0);
    this.errors = errors;
    this.actions = actions;
    this.legacyAuditLogger = legacyAuditLogger;
    this.auditLogger = auditLogger;
    this.baseClient = baseClient;
    this.checkSavedObjectsPrivilegesAsCurrentUser = checkSavedObjectsPrivilegesAsCurrentUser;
    this.getSpacesService = getSpacesService;
  }

  async create(type, attributes = {}, options = {}) {
    var _options$id;

    const optionsWithId = { ...options,
      id: (_options$id = options.id) !== null && _options$id !== void 0 ? _options$id : _server.SavedObjectsUtils.generateId()
    };
    const namespaces = [optionsWithId.namespace, ...(optionsWithId.initialNamespaces || [])];

    try {
      const args = {
        type,
        attributes,
        options: optionsWithId
      };
      await this.legacyEnsureAuthorized(type, 'create', namespaces, {
        args
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.CREATE,
        savedObject: {
          type,
          id: optionsWithId.id
        },
        error
      }));
      throw error;
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.CREATE,
      outcome: 'unknown',
      savedObject: {
        type,
        id: optionsWithId.id
      }
    }));
    const savedObject = await this.baseClient.create(type, attributes, optionsWithId);
    return await this.redactSavedObjectNamespaces(savedObject, namespaces);
  }

  async checkConflicts(objects = [], options = {}) {
    const args = {
      objects,
      options
    };
    const types = this.getUniqueObjectTypes(objects);
    await this.legacyEnsureAuthorized(types, 'bulk_create', options.namespace, {
      args,
      auditAction: 'checkConflicts'
    });
    const response = await this.baseClient.checkConflicts(objects, options);
    return response;
  }

  async bulkCreate(objects, options = {}) {
    const objectsWithId = objects.map(obj => {
      var _obj$id;

      return { ...obj,
        id: (_obj$id = obj.id) !== null && _obj$id !== void 0 ? _obj$id : _server.SavedObjectsUtils.generateId()
      };
    });
    const namespaces = objectsWithId.reduce((acc, {
      initialNamespaces = []
    }) => acc.concat(initialNamespaces), [options.namespace]);

    try {
      const args = {
        objects: objectsWithId,
        options
      };
      await this.legacyEnsureAuthorized(this.getUniqueObjectTypes(objectsWithId), 'bulk_create', namespaces, {
        args
      });
    } catch (error) {
      objectsWithId.forEach(({
        type,
        id
      }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.CREATE,
        savedObject: {
          type,
          id
        },
        error
      })));
      throw error;
    }

    objectsWithId.forEach(({
      type,
      id
    }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.CREATE,
      outcome: 'unknown',
      savedObject: {
        type,
        id
      }
    })));
    const response = await this.baseClient.bulkCreate(objectsWithId, options);
    return await this.redactSavedObjectsNamespaces(response, namespaces);
  }

  async delete(type, id, options = {}) {
    try {
      const args = {
        type,
        id,
        options
      };
      await this.legacyEnsureAuthorized(type, 'delete', options.namespace, {
        args
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.DELETE,
        savedObject: {
          type,
          id
        },
        error
      }));
      throw error;
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.DELETE,
      outcome: 'unknown',
      savedObject: {
        type,
        id
      }
    }));
    return await this.baseClient.delete(type, id, options);
  }

  async find(options) {
    var _options$namespaces;

    if (this.getSpacesService() == null && Array.isArray(options.namespaces) && options.namespaces.length > 0) {
      throw this.errors.createBadRequestError(`_find across namespaces is not permitted when the Spaces plugin is disabled.`);
    }

    const args = {
      options
    };
    const {
      status,
      typeMap
    } = await this.legacyEnsureAuthorized(options.type, 'find', options.namespaces, {
      args,
      requireFullAuthorization: false
    });

    if (status === 'unauthorized') {
      // return empty response
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.FIND,
        error: new Error(status)
      }));
      return _server.SavedObjectsUtils.createEmptyFindResponse(options);
    }

    const typeToNamespacesMap = Array.from(typeMap).reduce((acc, [type, {
      authorizedSpaces,
      isGloballyAuthorized
    }]) => isGloballyAuthorized ? acc.set(type, options.namespaces) : acc.set(type, authorizedSpaces), new Map());
    const response = await this.baseClient.find({ ...options,
      typeToNamespacesMap: undefined,
      // if the user is fully authorized, use `undefined` as the typeToNamespacesMap to prevent privilege escalation
      ...(status === 'partially_authorized' && {
        typeToNamespacesMap,
        type: '',
        namespaces: []
      }) // the repository requires that `type` and `namespaces` must be empty if `typeToNamespacesMap` is defined

    });
    response.saved_objects.forEach(({
      type,
      id
    }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.FIND,
      savedObject: {
        type,
        id
      }
    })));
    return await this.redactSavedObjectsNamespaces(response, (_options$namespaces = options.namespaces) !== null && _options$namespaces !== void 0 ? _options$namespaces : [undefined]);
  }

  async bulkGet(objects = [], options = {}) {
    try {
      const namespaces = objects.reduce((acc, {
        namespaces: objNamespaces = []
      }) => acc.concat(objNamespaces), [options.namespace]);
      const args = {
        objects,
        options
      };
      await this.legacyEnsureAuthorized(this.getUniqueObjectTypes(objects), 'bulk_get', namespaces, {
        args
      });
    } catch (error) {
      objects.forEach(({
        type,
        id
      }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.GET,
        savedObject: {
          type,
          id
        },
        error
      })));
      throw error;
    }

    const response = await this.baseClient.bulkGet(objects, options);
    response.saved_objects.forEach(({
      error,
      type,
      id
    }) => {
      if (!error) {
        this.auditLogger.log((0, _audit.savedObjectEvent)({
          action: _audit.SavedObjectAction.GET,
          savedObject: {
            type,
            id
          }
        }));
      }
    });
    return await this.redactSavedObjectsNamespaces(response, [options.namespace]);
  }

  async get(type, id, options = {}) {
    try {
      const args = {
        type,
        id,
        options
      };
      await this.legacyEnsureAuthorized(type, 'get', options.namespace, {
        args
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.GET,
        savedObject: {
          type,
          id
        },
        error
      }));
      throw error;
    }

    const savedObject = await this.baseClient.get(type, id, options);
    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.GET,
      savedObject: {
        type,
        id
      }
    }));
    return await this.redactSavedObjectNamespaces(savedObject, [options.namespace]);
  }

  async bulkResolve(objects, options = {}) {
    try {
      const args = {
        objects,
        options
      };
      await this.legacyEnsureAuthorized(this.getUniqueObjectTypes(objects), 'bulk_get', options.namespace, {
        args,
        auditAction: 'bulk_resolve'
      });
    } catch (error) {
      objects.forEach(({
        type,
        id
      }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.RESOLVE,
        savedObject: {
          type,
          id
        },
        error
      })));
      throw error;
    }

    const response = await this.baseClient.bulkResolve(objects, options);
    response.resolved_objects.forEach(({
      saved_object: {
        error,
        type,
        id
      }
    }) => {
      if (!error) {
        this.auditLogger.log((0, _audit.savedObjectEvent)({
          action: _audit.SavedObjectAction.RESOLVE,
          savedObject: {
            type,
            id
          }
        }));
      }
    }); // the generic redactSavedObjectsNamespaces function cannot be used here due to the nested structure of the
    // resolved objects, so we handle redaction in a bespoke manner for bulkResolve

    if (this.getSpacesService() === undefined) {
      return response;
    }

    const previouslyAuthorizedSpaceIds = [this.getSpacesService().namespaceToSpaceId(options.namespace)]; // all users can see the "all spaces" ID, and we don't need to recheck authorization for any namespaces that we just checked earlier

    const namespaces = uniq(response.resolved_objects.flatMap(resolved => resolved.saved_object.namespaces || [])).filter(x => x !== _constants.ALL_SPACES_ID && !previouslyAuthorizedSpaceIds.includes(x));
    const privilegeMap = await this.getNamespacesPrivilegeMap(namespaces, previouslyAuthorizedSpaceIds);
    return { ...response,
      resolved_objects: response.resolved_objects.map(resolved => ({ ...resolved,
        saved_object: { ...resolved.saved_object,
          namespaces: resolved.saved_object.namespaces && this.redactAndSortNamespaces(resolved.saved_object.namespaces, privilegeMap)
        }
      }))
    };
  }

  async resolve(type, id, options = {}) {
    try {
      const args = {
        type,
        id,
        options
      };
      await this.legacyEnsureAuthorized(type, 'get', options.namespace, {
        args,
        auditAction: 'resolve'
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.RESOLVE,
        savedObject: {
          type,
          id
        },
        error
      }));
      throw error;
    }

    const resolveResult = await this.baseClient.resolve(type, id, options);
    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.RESOLVE,
      savedObject: {
        type,
        id: resolveResult.saved_object.id
      }
    }));
    return { ...resolveResult,
      saved_object: await this.redactSavedObjectNamespaces(resolveResult.saved_object, [options.namespace])
    };
  }

  async update(type, id, attributes, options = {}) {
    try {
      const args = {
        type,
        id,
        attributes,
        options
      };
      await this.legacyEnsureAuthorized(type, 'update', options.namespace, {
        args
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.UPDATE,
        savedObject: {
          type,
          id
        },
        error
      }));
      throw error;
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.UPDATE,
      outcome: 'unknown',
      savedObject: {
        type,
        id
      }
    }));
    const savedObject = await this.baseClient.update(type, id, attributes, options);
    return await this.redactSavedObjectNamespaces(savedObject, [options.namespace]);
  }

  async bulkUpdate(objects = [], options = {}) {
    const objectNamespaces = objects // The repository treats an `undefined` object namespace is treated as the absence of a namespace, falling back to options.namespace;
    // in this case, filter it out here so we don't accidentally check for privileges in the Default space when we shouldn't be doing so.
    .filter(({
      namespace
    }) => namespace !== undefined).map(({
      namespace
    }) => namespace);
    const namespaces = [options === null || options === void 0 ? void 0 : options.namespace, ...objectNamespaces];

    try {
      const args = {
        objects,
        options
      };
      await this.legacyEnsureAuthorized(this.getUniqueObjectTypes(objects), 'bulk_update', namespaces, {
        args
      });
    } catch (error) {
      objects.forEach(({
        type,
        id
      }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.UPDATE,
        savedObject: {
          type,
          id
        },
        error
      })));
      throw error;
    }

    objects.forEach(({
      type,
      id
    }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.UPDATE,
      outcome: 'unknown',
      savedObject: {
        type,
        id
      }
    })));
    const response = await this.baseClient.bulkUpdate(objects, options);
    return await this.redactSavedObjectsNamespaces(response, namespaces);
  }

  async removeReferencesTo(type, id, options = {}) {
    try {
      const args = {
        type,
        id,
        options
      };
      await this.legacyEnsureAuthorized(type, 'delete', options.namespace, {
        args,
        auditAction: 'removeReferences'
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.REMOVE_REFERENCES,
        savedObject: {
          type,
          id
        },
        error
      }));
      throw error;
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.REMOVE_REFERENCES,
      savedObject: {
        type,
        id
      },
      outcome: 'unknown'
    }));
    return await this.baseClient.removeReferencesTo(type, id, options);
  }

  async openPointInTimeForType(type, options) {
    const args = {
      type,
      options
    };
    const {
      status,
      typeMap
    } = await this.legacyEnsureAuthorized(type, 'open_point_in_time', options === null || options === void 0 ? void 0 : options.namespaces, {
      args,
      // Partial authorization is acceptable in this case because this method is only designed
      // to be used with `find`, which already allows for partial authorization.
      requireFullAuthorization: false
    });

    if (status === 'unauthorized') {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.OPEN_POINT_IN_TIME,
        error: new Error(status)
      }));
      throw _server.SavedObjectsErrorHelpers.decorateForbiddenError(new Error(status));
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.OPEN_POINT_IN_TIME,
      outcome: 'unknown'
    }));
    const allowedTypes = [...typeMap.keys()]; // only allow the user to open a PIT against indices for type(s) they are authorized to access

    return await this.baseClient.openPointInTimeForType(allowedTypes, options);
  }

  async closePointInTime(id, options) {
    // We are intentionally omitting a call to `ensureAuthorized` here, because `closePointInTime`
    // doesn't take in `types`, which are required to perform authorization. As there is no way
    // to know what index/indices a PIT was created against, we have no practical means of
    // authorizing users. We've decided we are okay with this because:
    //   (a) Elasticsearch only requires `read` privileges on an index in order to open/close
    //       a PIT against it, and;
    //   (b) By the time a user is accessing this service, they are already authenticated
    //       to Kibana, which is our closest equivalent to Elasticsearch's `read`.
    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.CLOSE_POINT_IN_TIME,
      outcome: 'unknown'
    }));
    return await this.baseClient.closePointInTime(id, options);
  }

  createPointInTimeFinder(findOptions, dependencies) {
    // We don't need to perform an authorization check here or add an audit log, because
    // `createPointInTimeFinder` is simply a helper that calls `find`, `openPointInTimeForType`,
    // and `closePointInTime` internally, so authz checks and audit logs will already be applied.
    return this.baseClient.createPointInTimeFinder(findOptions, {
      client: this,
      // Include dependencies last so that subsequent SO client wrappers have their settings applied.
      ...dependencies
    });
  }

  async collectMultiNamespaceReferences(objects, options = {}) {
    const currentSpaceId = _server.SavedObjectsUtils.namespaceIdToString(options.namespace); // We need this whether the Spaces plugin is enabled or not.
    // We don't know the space(s) that each object exists in, so we'll collect the objects and references first, then check authorization.


    const response = await this.baseClient.collectMultiNamespaceReferences(objects, options);
    const uniqueTypes = this.getUniqueObjectTypes(response.objects);
    const uniqueSpaces = this.getUniqueSpaces(currentSpaceId, ...response.objects.flatMap(({
      spaces,
      spacesWithMatchingAliases = []
    }) => spaces.concat(spacesWithMatchingAliases)));
    const {
      typeActionMap
    } = await this.ensureAuthorized(uniqueTypes, options.purpose === 'updateObjectsSpaces' ? ['bulk_get', 'share_to_space'] : ['bulk_get'], uniqueSpaces, {
      requireFullAuthorization: false
    }); // The user must be authorized to access every requested object in the current space.
    // Note: non-multi-namespace object types will have an empty spaces array.

    const authAction = options.purpose === 'updateObjectsSpaces' ? 'share_to_space' : 'bulk_get';

    try {
      this.ensureAuthorizedInAllSpaces(objects, authAction, typeActionMap, [currentSpaceId]);
    } catch (error) {
      objects.forEach(({
        type,
        id
      }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.COLLECT_MULTINAMESPACE_REFERENCES,
        savedObject: {
          type,
          id
        },
        error
      })));
      throw error;
    } // The user is authorized to access all of the requested objects in the space(s) that they exist in.
    // Now: 1. omit any result objects that the user has no access to, 2. for the rest, redact any space(s) that the user is not authorized
    // for, and 3. create audit records for any objects that will be returned to the user.


    const requestedObjectsSet = objects.reduce((acc, {
      type,
      id
    }) => acc.add(`${type}:${id}`), new Set());
    const retrievedObjectsSet = response.objects.reduce((acc, {
      type,
      id
    }) => acc.add(`${type}:${id}`), new Set());
    const traversedObjects = new Set();
    const filteredObjectsMap = new Map();

    const getIsAuthorizedForInboundReference = inbound => {
      const found = filteredObjectsMap.get(`${inbound.type}:${inbound.id}`);
      return found && !found.isMissing; // If true, this object can be linked back to one of the requested objects
    };

    let objectsToProcess = [...response.objects];

    while (objectsToProcess.length > 0) {
      const obj = objectsToProcess.shift();
      const {
        type,
        id,
        spaces,
        inboundReferences
      } = obj;
      const objKey = `${type}:${id}`;
      traversedObjects.add(objKey); // Is the user authorized to access this object in all required space(s)?

      const isAuthorizedForObject = (0, _ensure_authorized.isAuthorizedForObjectInAllSpaces)(type, authAction, typeActionMap, [currentSpaceId]); // Redact the inbound references so we don't leak any info about other objects that the user is not authorized to access

      const redactedInboundReferences = inboundReferences.filter(inbound => {
        if (inbound.type === type && inbound.id === id) {
          // circular reference, don't redact it
          return true;
        }

        return getIsAuthorizedForInboundReference(inbound);
      }); // If the user is not authorized to access at least one inbound reference of this object, then we should omit this object.

      const isAuthorizedForGraph = requestedObjectsSet.has(objKey) || // If true, this is one of the requested objects, and we checked authorization above
      redactedInboundReferences.some(getIsAuthorizedForInboundReference);

      if (isAuthorizedForObject && isAuthorizedForGraph) {
        if (spaces.length) {
          // Don't generate audit records for "empty results" with zero spaces (requested object was a non-multi-namespace type or hidden type)
          this.auditLogger.log((0, _audit.savedObjectEvent)({
            action: _audit.SavedObjectAction.COLLECT_MULTINAMESPACE_REFERENCES,
            savedObject: {
              type,
              id
            }
          }));
        }

        filteredObjectsMap.set(objKey, obj);
      } else if (!isAuthorizedForObject && isAuthorizedForGraph) {
        filteredObjectsMap.set(objKey, { ...obj,
          spaces: [],
          isMissing: true
        });
      } else if (isAuthorizedForObject && !isAuthorizedForGraph) {
        const hasUntraversedInboundReferences = inboundReferences.some(ref => !traversedObjects.has(`${ref.type}:${ref.id}`) && retrievedObjectsSet.has(`${ref.type}:${ref.id}`));

        if (hasUntraversedInboundReferences) {
          // this object has inbound reference(s) that we haven't traversed yet; bump it to the back of the list
          objectsToProcess = [...objectsToProcess, obj];
        } else {
          // There should never be a missing inbound reference.
          // If there is, then something has gone terribly wrong.
          const missingInboundReference = inboundReferences.find(ref => !traversedObjects.has(`${ref.type}:${ref.id}`) && !retrievedObjectsSet.has(`${ref.type}:${ref.id}`));

          if (missingInboundReference) {
            throw new Error(`Unexpected inbound reference to "${missingInboundReference.type}:${missingInboundReference.id}"`);
          }
        }
      }
    }

    const filteredAndRedactedObjects = [...filteredObjectsMap.values()].map(obj => {
      const {
        type,
        id,
        spaces,
        spacesWithMatchingAliases,
        inboundReferences
      } = obj; // Redact the inbound references so we don't leak any info about other objects that the user is not authorized to access

      const redactedInboundReferences = inboundReferences.filter(inbound => {
        if (inbound.type === type && inbound.id === id) {
          // circular reference, don't redact it
          return true;
        }

        return getIsAuthorizedForInboundReference(inbound);
      });
      const redactedSpaces = getRedactedSpaces(type, 'bulk_get', typeActionMap, spaces);
      const redactedSpacesWithMatchingAliases = spacesWithMatchingAliases && getRedactedSpaces(type, 'bulk_get', typeActionMap, spacesWithMatchingAliases);
      return { ...obj,
        spaces: redactedSpaces,
        ...(redactedSpacesWithMatchingAliases && {
          spacesWithMatchingAliases: redactedSpacesWithMatchingAliases
        }),
        inboundReferences: redactedInboundReferences
      };
    });
    return {
      objects: filteredAndRedactedObjects
    };
  }

  async updateObjectsSpaces(objects, spacesToAdd, spacesToRemove, options = {}) {
    const {
      namespace
    } = options;

    const currentSpaceId = _server.SavedObjectsUtils.namespaceIdToString(namespace); // We need this whether the Spaces plugin is enabled or not.


    const allSpacesSet = new Set([currentSpaceId, ...spacesToAdd, ...spacesToRemove]);
    const bulkGetResponse = await this.baseClient.bulkGet(objects, {
      namespace
    });
    const objectsToUpdate = objects.map(({
      type,
      id
    }, i) => {
      const {
        namespaces: spaces = [],
        version
      } = bulkGetResponse.saved_objects[i]; // If 'namespaces' is undefined, the object was not found (or it is namespace-agnostic).
      // Either way, we will pass in an empty 'spaces' array to the base client, which will cause it to skip this object.

      for (const space of spaces) {
        if (space !== _constants.ALL_SPACES_ID) {
          // If this is a specific space, add it to the spaces we'll check privileges for (don't accidentally check for global privileges)
          allSpacesSet.add(space);
        }
      }

      return {
        type,
        id,
        spaces,
        version
      };
    });
    const uniqueTypes = this.getUniqueObjectTypes(objects);
    const {
      typeActionMap
    } = await this.ensureAuthorized(uniqueTypes, ['bulk_get', 'share_to_space'], Array.from(allSpacesSet), {
      requireFullAuthorization: false
    });
    const addToSpaces = spacesToAdd.length ? spacesToAdd : undefined;
    const deleteFromSpaces = spacesToRemove.length ? spacesToRemove : undefined;

    try {
      // The user must be authorized to share every requested object in each of: the current space, spacesToAdd, and spacesToRemove.
      const spaces = this.getUniqueSpaces(currentSpaceId, ...spacesToAdd, ...spacesToRemove);
      this.ensureAuthorizedInAllSpaces(objects, 'share_to_space', typeActionMap, spaces);
    } catch (error) {
      objects.forEach(({
        type,
        id
      }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.UPDATE_OBJECTS_SPACES,
        savedObject: {
          type,
          id
        },
        addToSpaces,
        deleteFromSpaces,
        error
      })));
      throw error;
    }

    for (const {
      type,
      id
    } of objectsToUpdate) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.UPDATE_OBJECTS_SPACES,
        outcome: 'unknown',
        savedObject: {
          type,
          id
        },
        addToSpaces,
        deleteFromSpaces
      }));
    }

    const response = await this.baseClient.updateObjectsSpaces(objectsToUpdate, spacesToAdd, spacesToRemove, {
      namespace
    }); // Now that we have updated the objects' spaces, redact any spaces that the user is not authorized to see from the response.

    const redactedObjects = response.objects.map(obj => {
      const {
        type,
        spaces
      } = obj;
      const redactedSpaces = getRedactedSpaces(type, 'bulk_get', typeActionMap, spaces);
      return { ...obj,
        spaces: redactedSpaces
      };
    });
    return {
      objects: redactedObjects
    };
  }

  async checkPrivileges(actions, namespaceOrNamespaces) {
    try {
      return await this.checkSavedObjectsPrivilegesAsCurrentUser(actions, namespaceOrNamespaces);
    } catch (error) {
      throw this.errors.decorateGeneralError(error, error.body && error.body.reason);
    }
  }

  async legacyEnsureAuthorized(typeOrTypes, action, namespaceOrNamespaces, options = {}) {
    const {
      args,
      auditAction = action,
      requireFullAuthorization = true
    } = options;
    const types = Array.isArray(typeOrTypes) ? typeOrTypes : [typeOrTypes];
    const actionsToTypesMap = new Map(types.map(type => [this.actions.savedObject.get(type, action), type]));
    const actions = Array.from(actionsToTypesMap.keys());
    const result = await this.checkPrivileges(actions, namespaceOrNamespaces);
    const {
      hasAllRequested,
      username,
      privileges
    } = result;
    const spaceIds = uniq(privileges.kibana.map(({
      resource
    }) => resource).filter(x => x !== undefined)).sort();
    const missingPrivileges = this.getMissingPrivileges(privileges);
    const typeMap = privileges.kibana.reduce((acc, {
      resource,
      privilege,
      authorized
    }) => {
      var _acc$get;

      if (!authorized) {
        return acc;
      }

      const type = actionsToTypesMap.get(privilege); // always defined

      const value = (_acc$get = acc.get(type)) !== null && _acc$get !== void 0 ? _acc$get : {
        authorizedSpaces: []
      };

      if (resource === undefined) {
        return acc.set(type, { ...value,
          isGloballyAuthorized: true
        });
      }

      const authorizedSpaces = value.authorizedSpaces.concat(resource);
      return acc.set(type, { ...value,
        authorizedSpaces
      });
    }, new Map());

    const logAuthorizationFailure = () => {
      this.legacyAuditLogger.savedObjectsAuthorizationFailure(username, auditAction, types, spaceIds, missingPrivileges, args);
    };

    const logAuthorizationSuccess = (typeArray, spaceIdArray) => {
      this.legacyAuditLogger.savedObjectsAuthorizationSuccess(username, auditAction, typeArray, spaceIdArray, args);
    };

    if (hasAllRequested) {
      logAuthorizationSuccess(types, spaceIds);
      return {
        typeMap,
        status: 'fully_authorized'
      };
    } else if (!requireFullAuthorization) {
      const isPartiallyAuthorized = privileges.kibana.some(({
        authorized
      }) => authorized);

      if (isPartiallyAuthorized) {
        for (const [type, {
          isGloballyAuthorized,
          authorizedSpaces
        }] of typeMap.entries()) {
          // generate an individual audit record for each authorized type
          logAuthorizationSuccess([type], isGloballyAuthorized ? spaceIds : authorizedSpaces);
        }

        return {
          typeMap,
          status: 'partially_authorized'
        };
      } else {
        logAuthorizationFailure();
        return {
          typeMap,
          status: 'unauthorized'
        };
      }
    } else {
      logAuthorizationFailure();
      const targetTypes = uniq(missingPrivileges.map(({
        privilege
      }) => actionsToTypesMap.get(privilege)).sort()).join(',');
      const msg = `Unable to ${action} ${targetTypes}`;
      throw this.errors.decorateForbiddenError(new Error(msg));
    }
  }
  /** Unlike `legacyEnsureAuthorized`, this accepts multiple actions, and it does not utilize legacy audit logging */


  async ensureAuthorized(types, actions, namespaces, options) {
    const ensureAuthorizedDependencies = {
      actions: this.actions,
      errors: this.errors,
      checkSavedObjectsPrivilegesAsCurrentUser: this.checkSavedObjectsPrivilegesAsCurrentUser
    };
    return (0, _ensure_authorized.ensureAuthorized)(ensureAuthorizedDependencies, types, actions, namespaces, options);
  }
  /**
   * If `ensureAuthorized` was called with `requireFullAuthorization: false`, this can be used with the result to ensure that a given
   * array of objects are authorized in the required space(s).
   */


  ensureAuthorizedInAllSpaces(objects, action, typeActionMap, spaces) {
    const uniqueTypes = uniq(objects.map(({
      type
    }) => type));
    const unauthorizedTypes = new Set();

    for (const type of uniqueTypes) {
      if (!(0, _ensure_authorized.isAuthorizedForObjectInAllSpaces)(type, action, typeActionMap, spaces)) {
        unauthorizedTypes.add(type);
      }
    }

    if (unauthorizedTypes.size > 0) {
      const targetTypes = Array.from(unauthorizedTypes).sort().join(',');
      const msg = `Unable to ${action} ${targetTypes}`;
      throw this.errors.decorateForbiddenError(new Error(msg));
    }
  }

  getMissingPrivileges(privileges) {
    return privileges.kibana.filter(({
      authorized
    }) => !authorized).map(({
      resource,
      privilege
    }) => ({
      spaceId: resource,
      privilege
    }));
  }

  getUniqueObjectTypes(objects) {
    return uniq(objects.map(o => o.type));
  }
  /**
   * Given a list of spaces, returns a unique array of spaces.
   * Excludes `'*'`, which is an identifier for All Spaces but is not an actual space.
   */


  getUniqueSpaces(...spaces) {
    const set = new Set(spaces);
    set.delete(_constants.ALL_SPACES_ID);
    return Array.from(set);
  }

  async getNamespacesPrivilegeMap(namespaces, previouslyAuthorizedSpaceIds) {
    const namespacesToCheck = namespaces.filter(namespace => !previouslyAuthorizedSpaceIds.includes(namespace));
    const initialPrivilegeMap = previouslyAuthorizedSpaceIds.reduce((acc, spaceId) => acc.set(spaceId, true), new Map());

    if (namespacesToCheck.length === 0) {
      return initialPrivilegeMap;
    }

    const action = this.actions.login;
    const checkPrivilegesResult = await this.checkPrivileges(action, namespacesToCheck); // check if the user can log into each namespace

    const map = checkPrivilegesResult.privileges.kibana.reduce((acc, {
      resource,
      authorized
    }) => {
      // there should never be a case where more than one privilege is returned for a given space
      // if there is, fail-safe (authorized + unauthorized = unauthorized)
      if (resource && (!authorized || !acc.has(resource))) {
        acc.set(resource, authorized);
      }

      return acc;
    }, initialPrivilegeMap);
    return map;
  }

  redactAndSortNamespaces(spaceIds, privilegeMap) {
    return spaceIds.map(x => x === _constants.ALL_SPACES_ID || privilegeMap.get(x) ? x : _constants.UNKNOWN_SPACE).sort(namespaceComparator);
  }

  async redactSavedObjectNamespaces(savedObject, previouslyAuthorizedNamespaces) {
    if (this.getSpacesService() === undefined || savedObject.namespaces == null || savedObject.namespaces.length === 0) {
      return savedObject;
    }

    const previouslyAuthorizedSpaceIds = previouslyAuthorizedNamespaces.map(x => this.getSpacesService().namespaceToSpaceId(x)); // all users can see the "all spaces" ID, and we don't need to recheck authorization for any namespaces that we just checked earlier

    const namespaces = savedObject.namespaces.filter(x => x !== _constants.ALL_SPACES_ID && !previouslyAuthorizedSpaceIds.includes(x));
    const privilegeMap = await this.getNamespacesPrivilegeMap(namespaces, previouslyAuthorizedSpaceIds);
    return { ...savedObject,
      namespaces: this.redactAndSortNamespaces(savedObject.namespaces, privilegeMap)
    };
  }

  async redactSavedObjectsNamespaces(response, previouslyAuthorizedNamespaces) {
    // WARNING: the bulkResolve function has a bespoke implementation of this; any changes here should be applied there too.
    if (this.getSpacesService() === undefined) {
      return response;
    }

    const previouslyAuthorizedSpaceIds = previouslyAuthorizedNamespaces.map(x => this.getSpacesService().namespaceToSpaceId(x));
    const {
      saved_objects: savedObjects
    } = response; // all users can see the "all spaces" ID, and we don't need to recheck authorization for any namespaces that we just checked earlier

    const namespaces = uniq(savedObjects.flatMap(savedObject => savedObject.namespaces || [])).filter(x => x !== _constants.ALL_SPACES_ID && !previouslyAuthorizedSpaceIds.includes(x));
    const privilegeMap = await this.getNamespacesPrivilegeMap(namespaces, previouslyAuthorizedSpaceIds);
    return { ...response,
      saved_objects: savedObjects.map(savedObject => ({ ...savedObject,
        namespaces: savedObject.namespaces && this.redactAndSortNamespaces(savedObject.namespaces, privilegeMap)
      }))
    };
  }

}
/**
 * Returns all unique elements of an array.
 */


exports.SecureSavedObjectsClientWrapper = SecureSavedObjectsClientWrapper;

function uniq(arr) {
  return Array.from(new Set(arr));
}
/**
 * Utility function to sort potentially redacted namespaces.
 * Sorts in a case-insensitive manner, and ensures that redacted namespaces ('?') always show up at the end of the array.
 */


function namespaceComparator(a, b) {
  const A = a.toUpperCase();
  const B = b.toUpperCase();

  if (A === _constants.UNKNOWN_SPACE && B !== _constants.UNKNOWN_SPACE) {
    return 1;
  } else if (A !== _constants.UNKNOWN_SPACE && B === _constants.UNKNOWN_SPACE) {
    return -1;
  }

  return A > B ? 1 : A < B ? -1 : 0;
}

function getRedactedSpaces(objectType, action, typeActionMap, spacesToRedact) {
  const actionResult = (0, _ensure_authorized.getEnsureAuthorizedActionResult)(objectType, action, typeActionMap);
  const {
    authorizedSpaces,
    isGloballyAuthorized
  } = actionResult;
  const authorizedSpacesSet = new Set(authorizedSpaces);
  return spacesToRedact.map(x => isGloballyAuthorized || x === _constants.ALL_SPACES_ID || authorizedSpacesSet.has(x) ? x : _constants.UNKNOWN_SPACE).sort(namespaceComparator);
}