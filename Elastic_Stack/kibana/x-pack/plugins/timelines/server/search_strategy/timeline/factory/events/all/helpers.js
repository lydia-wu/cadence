"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatTimelineData = exports.buildObjectForFieldPath = exports.buildFieldsRequest = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _fp = require("lodash/fp");

var _to_array = require("../../../../../../common/utils/to_array");

var _field_formatters = require("../../../../../../common/utils/field_formatters");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTimestamp = hit => {
  if (hit.fields && hit.fields['@timestamp']) {
    var _hit$fields$Timestam;

    return `${(_hit$fields$Timestam = hit.fields['@timestamp'][0]) !== null && _hit$fields$Timestam !== void 0 ? _hit$fields$Timestam : ''}`;
  } else if (hit._source && hit._source['@timestamp']) {
    return hit._source['@timestamp'];
  }

  return '';
};

const buildFieldsRequest = (fields, excludeEcsData) => (0, _fp.uniq)([...fields.filter(f => !f.startsWith('_')), ...(excludeEcsData ? [] : _constants.TIMELINE_EVENTS_FIELDS)]).map(field => ({
  field,
  include_unmapped: true
}));

exports.buildFieldsRequest = buildFieldsRequest;

const formatTimelineData = async (dataFields, ecsFields, hit) => (0, _fp.uniq)([...ecsFields, ...dataFields]).reduce(async (acc, fieldName) => {
  const flattenedFields = await acc;
  flattenedFields.node._id = hit._id;
  flattenedFields.node._index = hit._index;
  flattenedFields.node.ecs._id = hit._id;
  flattenedFields.node.ecs.timestamp = getTimestamp(hit);
  flattenedFields.node.ecs._index = hit._index;

  if (hit.sort && hit.sort.length > 1) {
    flattenedFields.cursor.value = hit.sort[0];
    flattenedFields.cursor.tiebreaker = hit.sort[1];
  }

  const waitForIt = await mergeTimelineFieldsWithHit(fieldName, flattenedFields, hit, dataFields, ecsFields);
  return Promise.resolve(waitForIt);
}, Promise.resolve({
  node: {
    ecs: {
      _id: ''
    },
    data: [],
    _id: '',
    _index: ''
  },
  cursor: {
    value: '',
    tiebreaker: null
  }
}));

exports.formatTimelineData = formatTimelineData;
const specialFields = ['_id', '_index', '_type', '_score'];

const getValuesFromFields = async (fieldName, hit, nestedParentFieldName) => {
  if (specialFields.includes(fieldName)) {
    return [{
      field: fieldName,
      value: (0, _to_array.toStringArray)((0, _fp.get)(fieldName, hit))
    }];
  }

  let fieldToEval;

  if ((0, _fp.has)(fieldName, hit._source)) {
    fieldToEval = {
      [fieldName]: (0, _fp.get)(fieldName, hit._source)
    };
  } else {
    if (nestedParentFieldName == null) {
      fieldToEval = {
        [fieldName]: hit.fields[fieldName]
      };
    } else {
      fieldToEval = {
        [nestedParentFieldName]: hit.fields[nestedParentFieldName]
      };
    }
  }

  const formattedData = await (0, _field_formatters.getDataSafety)(_field_formatters.getDataFromFieldsHits, fieldToEval);
  return formattedData.reduce((acc, {
    field,
    values
  }) => // nested fields return all field values, pick only the one we asked for
  field.includes(fieldName) ? [...acc, {
    field,
    value: values
  }] : acc, []);
};

const buildObjectRecursive = (fieldPath, fields) => {
  var _get;

  const nestedParentPath = getNestedParentPath(fieldPath, fields);

  if (!nestedParentPath) {
    return (0, _saferLodashSet.set)({}, fieldPath, (0, _to_array.toStringArray)((0, _fp.get)(fieldPath, fields)));
  }

  const subPath = fieldPath.replace(`${nestedParentPath}.`, '');
  const subFields = (_get = (0, _fp.get)(nestedParentPath, fields)) !== null && _get !== void 0 ? _get : [];
  return (0, _saferLodashSet.set)({}, nestedParentPath, subFields.map(subField => buildObjectRecursive(subPath, subField)));
};

const buildObjectForFieldPath = (fieldPath, hit) => {
  if ((0, _fp.has)(fieldPath, hit._source)) {
    const value = (0, _fp.get)(fieldPath, hit._source);
    return (0, _saferLodashSet.set)({}, fieldPath, (0, _to_array.toStringArray)(value));
  }

  return buildObjectRecursive(fieldPath, hit.fields);
};
/**
 * If a prefix of our full field path is present as a field, we know that our field is nested
 */


exports.buildObjectForFieldPath = buildObjectForFieldPath;

const getNestedParentPath = (fieldPath, fields) => fields && Object.keys(fields).find(field => field !== fieldPath && fieldPath.startsWith(`${field}.`));

const mergeTimelineFieldsWithHit = async (fieldName, flattenedFields, hit, dataFields, ecsFields) => {
  if (fieldName != null) {
    const nestedParentPath = getNestedParentPath(fieldName, hit.fields);

    if (nestedParentPath != null || (0, _fp.has)(fieldName, hit._source) || (0, _fp.has)(fieldName, hit.fields) || specialFields.includes(fieldName)) {
      const objectWithProperty = {
        node: { ...(0, _fp.get)('node', flattenedFields),
          data: dataFields.includes(fieldName) ? [...(0, _fp.get)('node.data', flattenedFields), ...(await getValuesFromFields(fieldName, hit, nestedParentPath))] : (0, _fp.get)('node.data', flattenedFields),
          ecs: ecsFields.includes(fieldName) ? { ...(0, _fp.get)('node.ecs', flattenedFields),
            ...buildObjectForFieldPath(fieldName, hit)
          } : (0, _fp.get)('node.ecs', flattenedFields)
        }
      };
      return (0, _fp.merge)(flattenedFields, objectWithProperty);
    } else {
      return flattenedFields;
    }
  } else {
    return flattenedFields;
  }
};