"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildArtifact = buildArtifact;
exports.getEndpointEventFiltersList = getEndpointEventFiltersList;
exports.getEndpointExceptionList = getEndpointExceptionList;
exports.getEndpointTrustedAppsList = getEndpointTrustedAppsList;
exports.getFilteredEndpointExceptionList = getFilteredEndpointExceptionList;
exports.getHostIsolationExceptionsList = getHostIsolationExceptionsList;
exports.translateToEndpointExceptions = translateToEndpointExceptions;

var _crypto = require("crypto");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _schemas = require("../../schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function buildArtifact(exceptions, schemaVersion, os, name) {
  const exceptionsBuffer = Buffer.from(JSON.stringify(exceptions));
  const sha256 = (0, _crypto.createHash)('sha256').update(exceptionsBuffer.toString()).digest('hex'); // Keep compression info empty in case its a duplicate. Lazily compress before committing if needed.

  return {
    identifier: `${name}-${os}-${schemaVersion}`,
    compressionAlgorithm: 'none',
    encryptionAlgorithm: 'none',
    decodedSha256: sha256,
    encodedSha256: sha256,
    decodedSize: exceptionsBuffer.byteLength,
    encodedSize: exceptionsBuffer.byteLength,
    body: exceptionsBuffer.toString('base64')
  };
}

async function getFilteredEndpointExceptionList(eClient, schemaVersion, filter, listId) {
  const exceptions = {
    entries: []
  };
  let page = 1;
  let paging = true;

  while (paging) {
    const response = await eClient.findExceptionListItem({
      listId,
      namespaceType: 'agnostic',
      filter,
      perPage: 100,
      page,
      sortField: 'created_at',
      sortOrder: 'desc'
    });

    if ((response === null || response === void 0 ? void 0 : response.data) !== undefined) {
      exceptions.entries = exceptions.entries.concat(translateToEndpointExceptions(response.data, schemaVersion));
      paging = (page - 1) * 100 + response.data.length < response.total;
      page++;
    } else {
      break;
    }
  }

  const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(exceptions, _schemas.wrappedTranslatedExceptionList);

  if (errors != null) {
    throw new Error(errors);
  }

  return validated;
}

async function getEndpointExceptionList(eClient, schemaVersion, os) {
  const filter = `exception-list-agnostic.attributes.os_types:\"${os}\"`;
  return getFilteredEndpointExceptionList(eClient, schemaVersion, filter, _securitysolutionListConstants.ENDPOINT_LIST_ID);
}

async function getEndpointTrustedAppsList(eClient, schemaVersion, os, policyId) {
  const osFilter = `exception-list-agnostic.attributes.os_types:\"${os}\"`;
  const policyFilter = `(exception-list-agnostic.attributes.tags:\"policy:all\"${policyId ? ` or exception-list-agnostic.attributes.tags:\"policy:${policyId}\"` : ''})`;
  return getFilteredEndpointExceptionList(eClient, schemaVersion, `${osFilter} and ${policyFilter}`, _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_ID);
}

async function getEndpointEventFiltersList(eClient, schemaVersion, os, policyId) {
  const osFilter = `exception-list-agnostic.attributes.os_types:\"${os}\"`;
  const policyFilter = `(exception-list-agnostic.attributes.tags:\"policy:all\"${policyId ? ` or exception-list-agnostic.attributes.tags:\"policy:${policyId}\"` : ''})`;
  return getFilteredEndpointExceptionList(eClient, schemaVersion, `${osFilter} and ${policyFilter}`, _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_ID);
}

async function getHostIsolationExceptionsList(eClient, schemaVersion, os, policyId) {
  const osFilter = `exception-list-agnostic.attributes.os_types:\"${os}\"`;
  const policyFilter = `(exception-list-agnostic.attributes.tags:\"policy:all\"${policyId ? ` or exception-list-agnostic.attributes.tags:\"policy:${policyId}\"` : ''})`;
  return getFilteredEndpointExceptionList(eClient, schemaVersion, `${osFilter} and ${policyFilter}`, _securitysolutionListConstants.ENDPOINT_HOST_ISOLATION_EXCEPTIONS_LIST_ID);
}
/**
 * Translates Exception list items to Exceptions the endpoint can understand
 * @param exceptions
 * @param schemaVersion
 */


function translateToEndpointExceptions(exceptions, schemaVersion) {
  const entrySet = new Set();
  const entriesFiltered = [];

  if (schemaVersion === 'v1') {
    exceptions.forEach(entry => {
      const translatedItem = translateItem(schemaVersion, entry);
      const entryHash = (0, _crypto.createHash)('sha256').update(JSON.stringify(translatedItem)).digest('hex');

      if (!entrySet.has(entryHash)) {
        entriesFiltered.push(translatedItem);
        entrySet.add(entryHash);
      }
    });
    return entriesFiltered;
  } else {
    throw new Error('unsupported schemaVersion');
  }
}

function getMatcherFunction(field, matchAny) {
  return matchAny ? field.endsWith('.caseless') ? 'exact_caseless_any' : 'exact_cased_any' : field.endsWith('.caseless') ? 'exact_caseless' : 'exact_cased';
}

function getMatcherWildcardFunction(field) {
  return field.endsWith('.caseless') ? 'wildcard_caseless' : 'wildcard_cased';
}

function normalizeFieldName(field) {
  return field.endsWith('.caseless') ? field.substring(0, field.lastIndexOf('.')) : field;
}

function translateItem(schemaVersion, item) {
  const itemSet = new Set();
  return {
    type: item.type,
    entries: item.entries.reduce((translatedEntries, entry) => {
      const translatedEntry = translateEntry(schemaVersion, entry);

      if (translatedEntry !== undefined && _schemas.translatedEntry.is(translatedEntry)) {
        const itemHash = (0, _crypto.createHash)('sha256').update(JSON.stringify(translatedEntry)).digest('hex');

        if (!itemSet.has(itemHash)) {
          translatedEntries.push(translatedEntry);
          itemSet.add(itemHash);
        }
      }

      return translatedEntries;
    }, [])
  };
}

function translateEntry(schemaVersion, entry) {
  switch (entry.type) {
    case 'nested':
      {
        const nestedEntries = entry.entries.reduce((entries, nestedEntry) => {
          const translatedEntry = translateEntry(schemaVersion, nestedEntry);

          if (nestedEntry !== undefined && _schemas.translatedEntryNestedEntry.is(translatedEntry)) {
            entries.push(translatedEntry);
          }

          return entries;
        }, []);
        return {
          entries: nestedEntries,
          field: entry.field,
          type: 'nested'
        };
      }

    case 'match':
      {
        const matcher = getMatcherFunction(entry.field);
        return _schemas.translatedEntryMatchMatcher.is(matcher) ? {
          field: normalizeFieldName(entry.field),
          operator: entry.operator,
          type: matcher,
          value: entry.value
        } : undefined;
      }

    case 'match_any':
      {
        const matcher = getMatcherFunction(entry.field, true);
        return _schemas.translatedEntryMatchAnyMatcher.is(matcher) ? {
          field: normalizeFieldName(entry.field),
          operator: entry.operator,
          type: matcher,
          value: entry.value
        } : undefined;
      }

    case 'wildcard':
      {
        const matcher = getMatcherWildcardFunction(entry.field);
        return _schemas.translatedEntryMatchWildcardMatcher.is(matcher) ? {
          field: normalizeFieldName(entry.field),
          operator: entry.operator,
          type: matcher,
          value: entry.value
        } : undefined;
      }
  }
}