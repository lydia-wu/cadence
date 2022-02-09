"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeTables = void 0;

var _i18n = require("@kbn/i18n");

var _common = require("../../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const mergeTables = {
  name: 'lens_merge_tables',
  type: 'lens_multitable',
  help: _i18n.i18n.translate('xpack.lens.functions.mergeTables.help', {
    defaultMessage: 'A helper to merge any number of kibana tables into a single table and expose it via inspector adapter'
  }),
  args: {
    layerIds: {
      types: ['string'],
      help: '',
      multi: true
    },
    tables: {
      types: ['datatable'],
      help: '',
      multi: true
    }
  },
  inputTypes: ['kibana_context', 'null'],

  fn(input, {
    layerIds,
    tables
  }, context) {
    const resultTables = {};
    tables.forEach((table, index) => {
      var _context$inspectorAda;

      resultTables[layerIds[index]] = table; // adapter is always defined at that point because we make sure by the beginning of the function

      if (context !== null && context !== void 0 && (_context$inspectorAda = context.inspectorAdapters) !== null && _context$inspectorAda !== void 0 && _context$inspectorAda.tables) {
        context.inspectorAdapters.tables.allowCsvExport = true;
        context.inspectorAdapters.tables.logDatatable(layerIds[index], table);
      }
    });
    return {
      type: 'lens_multitable',
      tables: resultTables,
      dateRange: getDateRange(input)
    };
  }

};
exports.mergeTables = mergeTables;

function getDateRange(value) {
  if (!value || !value.timeRange) {
    return;
  }

  const dateRange = (0, _common.toAbsoluteDates)(value.timeRange);

  if (!dateRange) {
    return;
  }

  return {
    fromDate: dateRange.from,
    toDate: dateRange.to
  };
}