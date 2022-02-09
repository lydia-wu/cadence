"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectMultiNamespaceReferences = collectMultiNamespaceReferences;

var esKuery = _interopRequireWildcard(require("@kbn/es-query"));

var _elasticsearch = require("../../../elasticsearch");

var _object_types = require("../../object_types");

var _errors = require("./errors");

var _included_fields = require("./included_fields");

var _internal_utils = require("./internal_utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * When we collect an object's outbound references, we will only go a maximum of this many levels deep before we throw an error.
 */
const MAX_REFERENCE_GRAPH_DEPTH = 20;
/**
 * How many aliases to search for per page. This is smaller than the PointInTimeFinder's default of 1000. We specify 100 for the page count
 * because this is a relatively unimportant operation, and we want to avoid blocking the Elasticsearch thread pool for longer than
 * necessary.
 */

const ALIAS_SEARCH_PER_PAGE = 100;
/**
 * An object to collect references for. It must be a multi-namespace type (in other words, the object type must be registered with the
 * `namespaceType: 'multiple'` or `namespaceType: 'multiple-isolated'` option).
 *
 * Note: if options.purpose is 'updateObjectsSpaces', it must be a shareable type (in other words, the object type must be registered with
 * the `namespaceType: 'multiple'`).
 *
 * @public
 */

/**
 * Gets all references and transitive references of the given objects. Ignores any object and/or reference that is not a multi-namespace
 * type.
 */
async function collectMultiNamespaceReferences(params) {
  const {
    createPointInTimeFinder,
    objects
  } = params;

  if (!objects.length) {
    return {
      objects: []
    };
  }

  const {
    objectMap,
    inboundReferencesMap
  } = await getObjectsAndReferences(params);
  const objectsWithContext = Array.from(inboundReferencesMap.entries()).map(([referenceKey, referenceVal]) => {
    var _object$namespaces;

    const inboundReferences = Array.from(referenceVal.entries()).map(([objectKey, name]) => {
      const {
        type,
        id
      } = parseKey(objectKey);
      return {
        type,
        id,
        name
      };
    });
    const {
      type,
      id
    } = parseKey(referenceKey);
    const object = objectMap.get(referenceKey);
    const spaces = (_object$namespaces = object === null || object === void 0 ? void 0 : object.namespaces) !== null && _object$namespaces !== void 0 ? _object$namespaces : [];
    return {
      type,
      id,
      spaces,
      inboundReferences,
      ...(object === null && {
        isMissing: true
      })
    };
  });
  const aliasesMap = await checkLegacyUrlAliases(createPointInTimeFinder, objectsWithContext);
  const results = objectsWithContext.map(obj => {
    const key = getKey(obj);
    const val = aliasesMap.get(key);
    const spacesWithMatchingAliases = val && Array.from(val);
    return { ...obj,
      spacesWithMatchingAliases
    };
  });
  return {
    objects: results
  };
}
/**
 * Recursively fetches objects and their references, returning a map of the retrieved objects and a map of all inbound references.
 */


async function getObjectsAndReferences({
  registry,
  allowedTypes,
  client,
  serializer,
  getIndexForType,
  objects,
  options = {}
}) {
  const {
    namespace,
    purpose
  } = options;
  const inboundReferencesMap = objects.reduce( // Add the input objects to the references map so they are returned with the results, even if they have no inbound references
  (acc, cur) => acc.set(getKey(cur), new Map()), new Map());
  const objectMap = new Map();
  const rootFields = (0, _included_fields.getRootFields)();

  const makeBulkGetDocs = objectsToGet => objectsToGet.map(({
    type,
    id
  }) => ({
    _id: serializer.generateRawId(undefined, type, id),
    _index: getIndexForType(type),
    _source: rootFields // Optimized to only retrieve root fields (ignoring type-specific fields)

  }));

  const validObjectTypesFilter = ({
    type
  }) => allowedTypes.includes(type) && (purpose === 'updateObjectsSpaces' ? registry.isShareable(type) : registry.isMultiNamespace(type));

  let bulkGetObjects = objects.filter(validObjectTypesFilter);
  let count = 0; // this is a circuit-breaker to ensure we don't hog too many resources; we should never have an object graph this deep

  while (bulkGetObjects.length) {
    if (count >= MAX_REFERENCE_GRAPH_DEPTH) {
      throw new Error(`Exceeded maximum reference graph depth of ${MAX_REFERENCE_GRAPH_DEPTH} objects!`);
    }

    const bulkGetResponse = await client.mget({
      body: {
        docs: makeBulkGetDocs(bulkGetObjects)
      }
    }, {
      ignore: [404]
    }); // exit early if we can't verify a 404 response is from Elasticsearch

    if ((0, _elasticsearch.isNotFoundFromUnsupportedServer)({
      statusCode: bulkGetResponse.statusCode,
      headers: bulkGetResponse.headers
    })) {
      throw _errors.SavedObjectsErrorHelpers.createGenericNotFoundEsUnavailableError();
    }

    const newObjectsToGet = new Set();

    for (let i = 0; i < bulkGetObjects.length; i++) {
      // For every element in bulkGetObjects, there should be a matching element in bulkGetResponse.body.docs
      const {
        type,
        id
      } = bulkGetObjects[i];
      const objectKey = getKey({
        type,
        id
      });
      const doc = bulkGetResponse.body.docs[i]; // @ts-expect-error MultiGetHit._source is optional

      if (!doc.found || !(0, _internal_utils.rawDocExistsInNamespace)(registry, doc, namespace)) {
        objectMap.set(objectKey, null);
        continue;
      } // @ts-expect-error MultiGetHit._source is optional


      const object = (0, _internal_utils.getSavedObjectFromSource)(registry, type, id, doc);
      objectMap.set(objectKey, object);

      for (const reference of object.references) {
        var _inboundReferencesMap;

        if (!validObjectTypesFilter(reference)) {
          continue;
        }

        const referenceKey = getKey(reference);
        const referenceVal = (_inboundReferencesMap = inboundReferencesMap.get(referenceKey)) !== null && _inboundReferencesMap !== void 0 ? _inboundReferencesMap : new Map();

        if (!referenceVal.has(objectKey)) {
          inboundReferencesMap.set(referenceKey, referenceVal.set(objectKey, reference.name));
        }

        if (!objectMap.has(referenceKey)) {
          newObjectsToGet.add(referenceKey);
        }
      }
    }

    bulkGetObjects = Array.from(newObjectsToGet).map(key => parseKey(key));
    count++;
  }

  return {
    objectMap,
    inboundReferencesMap
  };
}
/**
 * Fetches all legacy URL aliases that match the given objects, returning a map of the matching aliases and what space(s) they exist in.
 */


async function checkLegacyUrlAliases(createPointInTimeFinder, objects) {
  const filteredObjects = objects.filter(({
    spaces
  }) => spaces.length !== 0);

  if (!filteredObjects.length) {
    return new Map();
  }

  const filter = createAliasKueryFilter(filteredObjects);
  const finder = createPointInTimeFinder({
    type: _object_types.LEGACY_URL_ALIAS_TYPE,
    perPage: ALIAS_SEARCH_PER_PAGE,
    filter
  });
  const aliasesMap = new Map();
  let error;

  try {
    for await (const {
      saved_objects: savedObjects
    } of finder.find()) {
      for (const alias of savedObjects) {
        var _aliasesMap$get;

        const {
          sourceId,
          targetType,
          targetNamespace
        } = alias.attributes;
        const key = getKey({
          type: targetType,
          id: sourceId
        });
        const val = (_aliasesMap$get = aliasesMap.get(key)) !== null && _aliasesMap$get !== void 0 ? _aliasesMap$get : new Set();
        val.add(targetNamespace);
        aliasesMap.set(key, val);
      }
    }
  } catch (e) {
    error = e;
  }

  try {
    await finder.close();
  } catch (e) {
    if (!error) {
      error = e;
    }
  }

  if (error) {
    throw new Error(`Failed to retrieve legacy URL aliases: ${error.message}`);
  }

  return aliasesMap;
}

function createAliasKueryFilter(objects) {
  const {
    buildNode
  } = esKuery.nodeTypes.function;
  const kueryNodes = objects.reduce((acc, {
    type,
    id
  }) => {
    const match1 = buildNode('is', `${_object_types.LEGACY_URL_ALIAS_TYPE}.attributes.targetType`, type);
    const match2 = buildNode('is', `${_object_types.LEGACY_URL_ALIAS_TYPE}.attributes.sourceId`, id);
    acc.push(buildNode('and', [match1, match2]));
    return acc;
  }, []);
  return buildNode('and', [buildNode('not', buildNode('is', `${_object_types.LEGACY_URL_ALIAS_TYPE}.attributes.disabled`, true)), // ignore aliases that have been disabled
  buildNode('or', kueryNodes)]);
}
/** Takes an object with a `type` and `id` field and returns a key string */


function getKey({
  type,
  id
}) {
  return `${type}:${id}`;
}
/** Parses a 'type:id' key string and returns an object with a `type` field and an `id` field */


function parseKey(key) {
  const type = key.slice(0, key.indexOf(':'));
  const id = key.slice(type.length + 1);
  return {
    type,
    id
  };
}