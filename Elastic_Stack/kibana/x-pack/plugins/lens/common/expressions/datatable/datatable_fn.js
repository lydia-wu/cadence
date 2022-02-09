"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datatableFn = void 0;

var _lodash = require("lodash");

var _transpose_helpers = require("./transpose_helpers");

var _summary = require("./summary");

var _sorting = require("./sorting");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isRange(meta) {
  var _meta$params;

  return (meta === null || meta === void 0 ? void 0 : (_meta$params = meta.params) === null || _meta$params === void 0 ? void 0 : _meta$params.id) === 'range';
}

const datatableFn = getFormatFactory => async (data, args, context) => {
  let untransposedData; // do the sorting at this level to propagate it also at CSV download

  const [firstTable] = Object.values(data.tables);
  const [layerId] = Object.keys(context.inspectorAdapters.tables || {});
  const formatters = {};
  const formatFactory = await getFormatFactory(context);
  firstTable.columns.forEach(column => {
    var _column$meta;

    formatters[column.id] = formatFactory((_column$meta = column.meta) === null || _column$meta === void 0 ? void 0 : _column$meta.params);
  });
  const hasTransposedColumns = args.columns.some(c => c.isTransposed);

  if (hasTransposedColumns) {
    // store original shape of data separately
    untransposedData = (0, _lodash.cloneDeep)(data); // transposes table and args inplace

    (0, _transpose_helpers.transposeTable)(args, firstTable, formatters);
  }

  const {
    sortingColumnId: sortBy,
    sortingDirection: sortDirection
  } = args;
  const columnsReverseLookup = firstTable.columns.reduce((memo, {
    id,
    name,
    meta
  }, i) => {
    memo[id] = {
      name,
      index: i,
      meta
    };
    return memo;
  }, {});
  const columnsWithSummary = args.columns.filter(c => c.summaryRow);

  for (const column of columnsWithSummary) {
    column.summaryRowValue = (0, _summary.computeSummaryRowForColumn)(column, firstTable, formatters, formatFactory({
      id: 'number'
    }));
  }

  if (sortBy && columnsReverseLookup[sortBy] && sortDirection !== 'none') {
    var _columnsReverseLookup, _columnsReverseLookup2, _columnsReverseLookup3; // Sort on raw values for these types, while use the formatted value for the rest


    const sortingCriteria = (0, _sorting.getSortingCriteria)(isRange((_columnsReverseLookup = columnsReverseLookup[sortBy]) === null || _columnsReverseLookup === void 0 ? void 0 : _columnsReverseLookup.meta) ? 'range' : (_columnsReverseLookup2 = columnsReverseLookup[sortBy]) === null || _columnsReverseLookup2 === void 0 ? void 0 : (_columnsReverseLookup3 = _columnsReverseLookup2.meta) === null || _columnsReverseLookup3 === void 0 ? void 0 : _columnsReverseLookup3.type, sortBy, formatters[sortBy], sortDirection); // replace the table here

    context.inspectorAdapters.tables[layerId].rows = (firstTable.rows || []).slice().sort(sortingCriteria); // replace also the local copy

    firstTable.rows = context.inspectorAdapters.tables[layerId].rows;
  } else {
    args.sortingColumnId = undefined;
    args.sortingDirection = 'none';
  }

  return {
    type: 'render',
    as: 'lens_datatable_renderer',
    value: {
      data,
      untransposedData,
      args
    }
  };
};

exports.datatableFn = datatableFn;