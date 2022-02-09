"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpacesSavedObjectsClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _server = require("../../../../../src/core/server");

var _constants = require("../../common/constants");

var _namespace = require("../lib/utils/namespace");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isLeft = either => either.tag === 'Left';

const coerceToArray = param => {
  if (Array.isArray(param)) {
    return param;
  }

  return [param];
};

const throwErrorIfNamespaceSpecified = options => {
  if (options.namespace) {
    throw new Error('Spaces currently determines the namespaces');
  }
};

class SpacesSavedObjectsClient {
  constructor(options) {
    (0, _defineProperty2.default)(this, "client", void 0);
    (0, _defineProperty2.default)(this, "typeRegistry", void 0);
    (0, _defineProperty2.default)(this, "spaceId", void 0);
    (0, _defineProperty2.default)(this, "types", void 0);
    (0, _defineProperty2.default)(this, "spacesClient", void 0);
    (0, _defineProperty2.default)(this, "errors", void 0);
    const {
      baseClient,
      request,
      getSpacesService,
      typeRegistry
    } = options;
    const spacesService = getSpacesService();
    this.client = baseClient;
    this.typeRegistry = typeRegistry;
    this.spacesClient = spacesService.createSpacesClient(request);
    this.spaceId = spacesService.getSpaceId(request);
    this.types = typeRegistry.getAllTypes().map(t => t.name);
    this.errors = baseClient.errors;
  }

  async checkConflicts(objects = [], options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.checkConflicts(objects, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async create(type, attributes = {}, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.create(type, attributes, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async bulkCreate(objects, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.bulkCreate(objects, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async delete(type, id, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.delete(type, id, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async find(options) {
    let namespaces;

    try {
      namespaces = await this.getSearchableSpaces(options.namespaces);
    } catch (err) {
      if (_boom.default.isBoom(err) && err.output.payload.statusCode === 403) {
        // return empty response, since the user is unauthorized in any space, but we don't return forbidden errors for `find` operations
        return _server.SavedObjectsUtils.createEmptyFindResponse(options);
      }

      throw err;
    }

    if (namespaces.length === 0) {
      // return empty response, since the user is unauthorized in this space (or these spaces), but we don't return forbidden errors for `find` operations
      return _server.SavedObjectsUtils.createEmptyFindResponse(options);
    }

    return await this.client.find({ ...options,
      type: (options.type ? coerceToArray(options.type) : this.types).filter(type => type !== 'space'),
      namespaces
    });
  }

  async bulkGet(objects = [], options = {}) {
    throwErrorIfNamespaceSpecified(options);
    let availableSpacesPromise;

    const getAvailableSpaces = async () => {
      if (!availableSpacesPromise) {
        availableSpacesPromise = this.getSearchableSpaces([_constants.ALL_SPACES_ID]).catch(err => {
          if (_boom.default.isBoom(err) && err.output.payload.statusCode === 403) {
            return []; // the user doesn't have access to any spaces
          } else {
            throw err;
          }
        });
      }

      return availableSpacesPromise;
    };

    const expectedResults = await Promise.all(objects.map(async object => {
      const {
        namespaces,
        type
      } = object;

      if (namespaces !== null && namespaces !== void 0 && namespaces.includes(_constants.ALL_SPACES_ID)) {
        // If searching for an isolated object in all spaces, we may need to return a 400 error for consistency with the validation at the
        // repository level. This is needed if there is only one space available *and* the user is authorized to access the object in that
        // space; in that case, we don't want to unintentionally bypass the repository's validation by deconstructing the '*' identifier
        // into all available spaces.
        const tag = !this.typeRegistry.isNamespaceAgnostic(type) && !this.typeRegistry.isShareable(type) ? 'Left' : 'Right';
        return {
          tag,
          value: { ...object,
            namespaces: await getAvailableSpaces()
          }
        };
      }

      return {
        tag: 'Right',
        value: object
      };
    }));
    const objectsToGet = expectedResults.map(({
      value
    }) => value);
    const {
      saved_objects: responseObjects
    } = objectsToGet.length ? await this.client.bulkGet(objectsToGet, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    }) : {
      saved_objects: []
    };
    return {
      saved_objects: expectedResults.map((expectedResult, i) => {
        const actualResult = responseObjects[i];

        if (isLeft(expectedResult)) {
          const {
            type,
            id
          } = expectedResult.value;
          return {
            type,
            id,
            error: _server.SavedObjectsErrorHelpers.createBadRequestError('"namespaces" can only specify a single space when used with space-isolated types').output.payload
          };
        }

        return actualResult;
      })
    };
  }

  async get(type, id, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.get(type, id, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async bulkResolve(objects, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.bulkResolve(objects, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async resolve(type, id, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.resolve(type, id, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async update(type, id, attributes, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.update(type, id, attributes, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async bulkUpdate(objects = [], options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.bulkUpdate(objects, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async removeReferencesTo(type, id, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.removeReferencesTo(type, id, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async collectMultiNamespaceReferences(objects, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.collectMultiNamespaceReferences(objects, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async updateObjectsSpaces(objects, spacesToAdd, spacesToRemove, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.updateObjectsSpaces(objects, spacesToAdd, spacesToRemove, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  async openPointInTimeForType(type, options = {}) {
    let namespaces;

    try {
      namespaces = await this.getSearchableSpaces(options.namespaces);
    } catch (err) {
      if (_boom.default.isBoom(err) && err.output.payload.statusCode === 403) {
        // throw bad request since the user is unauthorized in any space
        throw _server.SavedObjectsErrorHelpers.createBadRequestError();
      }

      throw err;
    }

    if (namespaces.length === 0) {
      // throw bad request if no valid spaces were found.
      throw _server.SavedObjectsErrorHelpers.createBadRequestError();
    }

    return await this.client.openPointInTimeForType(type, { ...options,
      namespaces
    });
  }

  async closePointInTime(id, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.closePointInTime(id, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

  createPointInTimeFinder(findOptions, dependencies) {
    throwErrorIfNamespaceSpecified(findOptions); // We don't need to handle namespaces here, because `createPointInTimeFinder`
    // is simply a helper that calls `find`, `openPointInTimeForType`, and
    // `closePointInTime` internally, so namespaces will already be handled
    // in those methods.

    return this.client.createPointInTimeFinder(findOptions, {
      client: this,
      // Include dependencies last so that subsequent SO client wrappers have their settings applied.
      ...dependencies
    });
  }

  async getSearchableSpaces(namespaces) {
    if (namespaces) {
      const availableSpaces = await this.spacesClient.getAll({
        purpose: 'findSavedObjects'
      });

      if (namespaces.includes(_constants.ALL_SPACES_ID)) {
        return availableSpaces.map(space => space.id);
      } else {
        return namespaces.filter(namespace => availableSpaces.some(space => space.id === namespace));
      }
    } else {
      return [this.spaceId];
    }
  }

}

exports.SpacesSavedObjectsClient = SpacesSavedObjectsClient;