"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTableData = getTableData;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _build_request_body = require("./table/build_request_body");

var _handle_error_response = require("./handle_error_response");

var _process_bucket = require("./table/process_bucket");

var _fields_fetcher = require("../search_strategies/lib/fields_fetcher");

var _fields_utils = require("../../../common/fields_utils");

var _check_aggs = require("./helpers/check_aggs");

var _get_timerange_mode = require("./helpers/get_timerange_mode");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getTableData(requestContext, req, panel, services) {
  const panelIndex = await services.cachedIndexPatternFetcher(panel.index_pattern);
  const strategy = await services.searchStrategyRegistry.getViableStrategy(requestContext, req, panelIndex);

  if (!strategy) {
    throw new Error(_i18n.i18n.translate('visTypeTimeseries.searchStrategyUndefinedErrorMessage', {
      defaultMessage: 'Search strategy was not defined'
    }));
  }

  const {
    searchStrategy,
    capabilities
  } = strategy;
  const extractFields = (0, _fields_fetcher.createFieldsFetcher)(req, {
    indexPatternsService: services.indexPatternsService,
    cachedIndexPatternFetcher: services.cachedIndexPatternFetcher,
    searchStrategy,
    capabilities
  });

  const calculatePivotLabel = async () => {
    var _panelIndex$indexPatt;

    if (panel.pivot_id && (_panelIndex$indexPatt = panelIndex.indexPattern) !== null && _panelIndex$indexPatt !== void 0 && _panelIndex$indexPatt.id) {
      const fields = await extractFields({
        id: panelIndex.indexPattern.id
      });
      return (0, _fields_utils.extractFieldLabel)(fields, panel.pivot_id);
    }

    return panel.pivot_id;
  };

  const meta = {
    type: panel.type,
    uiRestrictions: capabilities.uiRestrictions
  };
  const handleError = (0, _handle_error_response.handleErrorResponse)(panel);

  try {
    var _panelIndex$indexPatt2, _panelIndex$indexPatt3;

    if ((0, _get_timerange_mode.isEntireTimeRangeMode)(panel)) {
      panel.series.forEach(column => {
        (0, _check_aggs.isAggSupported)(column.metrics);
      });
    }

    const body = await (0, _build_request_body.buildTableRequest)({
      req,
      panel,
      esQueryConfig: services.esQueryConfig,
      seriesIndex: panelIndex,
      capabilities,
      uiSettings: services.uiSettings,
      buildSeriesMetaParams: () => services.buildSeriesMetaParams(panelIndex, Boolean(panel.use_kibana_indexes))
    });
    const [resp] = await searchStrategy.search(requestContext, req, [{
      body: { ...body,
        runtime_mappings: (_panelIndex$indexPatt2 = (_panelIndex$indexPatt3 = panelIndex.indexPattern) === null || _panelIndex$indexPatt3 === void 0 ? void 0 : _panelIndex$indexPatt3.getComputedFields().runtimeFields) !== null && _panelIndex$indexPatt2 !== void 0 ? _panelIndex$indexPatt2 : {}
      },
      index: panelIndex.indexPatternString
    }]);
    const buckets = (0, _lodash.get)(resp.rawResponse ? resp.rawResponse : resp, 'aggregations.pivot.buckets', []);
    const series = await Promise.all(buckets.map((0, _process_bucket.processBucket)({
      panel,
      extractFields
    })));
    return { ...meta,
      pivot_label: panel.pivot_label || (await calculatePivotLabel()),
      series
    };
  } catch (err) {
    return { ...meta,
      ...handleError(err)
    };
  }
}