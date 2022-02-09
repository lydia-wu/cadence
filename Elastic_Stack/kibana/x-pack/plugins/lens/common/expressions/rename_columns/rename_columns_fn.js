"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renameColumnFn = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getColumnName(originalColumn, newColumn) {
  if ((originalColumn === null || originalColumn === void 0 ? void 0 : originalColumn.operationType) === 'date_histogram') {
    const fieldName = originalColumn.sourceField; // HACK: This is a hack, and introduces some fragility into
    // column naming. Eventually, this should be calculated and
    // built more systematically.

    return newColumn.name.replace(fieldName, originalColumn.label);
  }

  return originalColumn.label;
}

const renameColumnFn = (data, {
  idMap: encodedIdMap
}) => {
  const idMap = JSON.parse(encodedIdMap);
  return {
    type: 'datatable',
    rows: data.rows.map(row => {
      const mappedRow = {};
      Object.entries(idMap).forEach(([fromId, toId]) => {
        mappedRow[toId.id] = row[fromId];
      });
      Object.entries(row).forEach(([id, value]) => {
        if (id in idMap) {
          mappedRow[idMap[id].id] = value;
        } else {
          mappedRow[id] = value;
        }
      });
      return mappedRow;
    }),
    columns: data.columns.map(column => {
      const mappedItem = idMap[column.id];

      if (!mappedItem) {
        return column;
      }

      return { ...column,
        id: mappedItem.id,
        name: getColumnName(mappedItem, column)
      };
    })
  };
};

exports.renameColumnFn = renameColumnFn;