"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteIndexTemplates = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Deletes old index templates that were used in 6.x as those will no longer be supported in ES 8.
 */
const deleteIndexTemplates = async ({
  client,
  log
}) => {
  const {
    body
  } = await client.indices.getTemplate({
    name: 'kibana_index_template*'
  }, {
    ignore: [404]
  });
  const templateNames = Object.keys(body);
  log.debug(`Deleting index templates: ${templateNames.join(', ')}`);
  return await Promise.all(templateNames.map(templateName => {
    return client.indices.deleteTemplate({
      name: templateName
    }).catch(() => undefined);
  }));
};

exports.deleteIndexTemplates = deleteIndexTemplates;