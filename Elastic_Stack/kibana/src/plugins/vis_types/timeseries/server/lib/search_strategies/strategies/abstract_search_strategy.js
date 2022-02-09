"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractSearchStrategy = void 0;

var _fields_utils = require("../../../../common/fields_utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class AbstractSearchStrategy {
  async search(requestContext, req, bodies, indexType) {
    const requests = [];
    bodies.forEach(body => {
      requests.push(requestContext.search.search({
        indexType,
        params: { ...body
        }
      }, req.body.searchSession).toPromise());
    });
    return Promise.all(requests);
  }

  checkForViability(requestContext, req, fetchedIndexPattern) {
    throw new TypeError('Must override method');
  }

  async getFieldsForWildcard(fetchedIndexPattern, indexPatternsService, capabilities, options) {
    var _fetchedIndexPattern$;

    return (0, _fields_utils.toSanitizedFieldType)(fetchedIndexPattern.indexPattern ? fetchedIndexPattern.indexPattern.getNonScriptedFields() : await indexPatternsService.getFieldsForWildcard({
      pattern: (_fetchedIndexPattern$ = fetchedIndexPattern.indexPatternString) !== null && _fetchedIndexPattern$ !== void 0 ? _fetchedIndexPattern$ : '',
      metaFields: [],
      ...options
    }));
  }

}

exports.AbstractSearchStrategy = AbstractSearchStrategy;