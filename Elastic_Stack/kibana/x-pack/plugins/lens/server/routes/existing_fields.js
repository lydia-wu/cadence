"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildFieldList = buildFieldList;
exports.existingFields = existingFields;
exports.existingFieldsRoute = existingFieldsRoute;
exports.isBoomError = isBoomError;

var _elasticsearch = require("@elastic/elasticsearch");

var _configSchema = require("@kbn/config-schema");

var _common = require("../../common");

var _server = require("../../../../../src/plugins/data/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isBoomError(error) {
  return error.isBoom === true;
}
/**
 * The number of docs to sample to determine field empty status.
 */


const SAMPLE_SIZE = 500;

async function existingFieldsRoute(setup, logger) {
  const router = setup.http.createRouter();
  router.post({
    path: `${_common.BASE_API_URL}/existing_fields/{indexPatternId}`,
    validate: {
      params: _configSchema.schema.object({
        indexPatternId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        dslQuery: _configSchema.schema.object({}, {
          unknowns: 'allow'
        }),
        fromDate: _configSchema.schema.maybe(_configSchema.schema.string()),
        toDate: _configSchema.schema.maybe(_configSchema.schema.string()),
        timeFieldName: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, req, res) => {
    const [{
      savedObjects,
      elasticsearch
    }, {
      data
    }] = await setup.getStartServices();
    const savedObjectsClient = savedObjects.getScopedClient(req);
    const esClient = elasticsearch.client.asScoped(req).asCurrentUser;

    try {
      return res.ok({
        body: await fetchFieldExistence({ ...req.params,
          ...req.body,
          indexPatternsService: await data.indexPatterns.indexPatternsServiceFactory(savedObjectsClient, esClient),
          context
        })
      });
    } catch (e) {
      if (e instanceof _elasticsearch.errors.TimeoutError) {
        logger.info(`Field existence check timed out on ${req.params.indexPatternId}`); // 408 is Request Timeout

        return res.customError({
          statusCode: 408,
          body: e.message
        });
      }

      logger.info(`Field existence check failed on ${req.params.indexPatternId}: ${isBoomError(e) ? e.output.payload.message : e.message}`);

      if (e instanceof _elasticsearch.errors.ResponseError && e.statusCode === 404) {
        return res.notFound({
          body: e.message
        });
      }

      if (isBoomError(e)) {
        if (e.output.statusCode === 404) {
          return res.notFound({
            body: e.output.payload.message
          });
        }

        throw new Error(e.output.payload.message);
      } else {
        throw e;
      }
    }
  });
}

async function fetchFieldExistence({
  context,
  indexPatternId,
  indexPatternsService,
  dslQuery = {
    match_all: {}
  },
  fromDate,
  toDate,
  timeFieldName
}) {
  const metaFields = await context.core.uiSettings.client.get(_server.UI_SETTINGS.META_FIELDS);
  const indexPattern = await indexPatternsService.get(indexPatternId);
  const fields = buildFieldList(indexPattern, metaFields);
  const docs = await fetchIndexPatternStats({
    fromDate,
    toDate,
    dslQuery,
    client: context.core.elasticsearch.client.asCurrentUser,
    index: indexPattern.title,
    timeFieldName: timeFieldName || indexPattern.timeFieldName,
    fields
  });
  return {
    indexPatternTitle: indexPattern.title,
    existingFieldNames: existingFields(docs, fields)
  };
}
/**
 * Exported only for unit tests.
 */


function buildFieldList(indexPattern, metaFields) {
  return indexPattern.fields.map(field => {
    return {
      name: field.name,
      isScript: !!field.scripted,
      lang: field.lang,
      script: field.script,
      // id is a special case - it doesn't show up in the meta field list,
      // but as it's not part of source, it has to be handled separately.
      isMeta: metaFields.includes(field.name) || field.name === '_id',
      runtimeField: !field.isMapped ? field.runtimeField : undefined
    };
  });
}

async function fetchIndexPatternStats({
  client,
  index,
  dslQuery,
  timeFieldName,
  fromDate,
  toDate,
  fields
}) {
  const filter = timeFieldName && fromDate && toDate ? [{
    range: {
      [timeFieldName]: {
        gte: fromDate,
        lte: toDate
      }
    }
  }, dslQuery] : [dslQuery];
  const query = {
    bool: {
      filter
    }
  };
  const scriptedFields = fields.filter(f => f.isScript);
  const runtimeFields = fields.filter(f => f.runtimeField);
  const {
    body: result
  } = await client.search({
    index,
    body: {
      size: SAMPLE_SIZE,
      query,
      // Sorted queries are usually able to skip entire shards that don't match
      sort: timeFieldName && fromDate && toDate ? [{
        [timeFieldName]: 'desc'
      }] : [],
      fields: ['*'],
      _source: false,
      runtime_mappings: runtimeFields.reduce((acc, field) => {
        if (!field.runtimeField) return acc;
        acc[field.name] = field.runtimeField;
        return acc;
      }, {}),
      script_fields: scriptedFields.reduce((acc, field) => {
        acc[field.name] = {
          script: {
            lang: field.lang,
            source: field.script
          }
        };
        return acc;
      }, {}),
      // Small improvement because there is overhead in counting
      track_total_hits: false,
      // Per-shard timeout, must be lower than overall. Shards return partial results on timeout
      timeout: '4500ms'
    }
  }, {
    // Global request timeout. Will cancel the request if exceeded. Overrides the elasticsearch.requestTimeout
    requestTimeout: '5000ms',
    // Fails fast instead of retrying- default is to retry
    maxRetries: 0
  });
  return result.hits.hits;
}
/**
 * Exported only for unit tests.
 */


function existingFields(docs, fields) {
  const missingFields = new Set(fields);

  for (const doc of docs) {
    if (missingFields.size === 0) {
      break;
    }

    missingFields.forEach(field => {
      let fieldStore = doc.fields;

      if (field.isMeta) {
        fieldStore = doc;
      }

      const value = fieldStore[field.name];

      if (Array.isArray(value) && value.length) {
        missingFields.delete(field);
      } else if (!Array.isArray(value) && value) {
        missingFields.delete(field);
      }
    });
  }

  return fields.filter(field => !missingFields.has(field)).map(f => f.name);
}