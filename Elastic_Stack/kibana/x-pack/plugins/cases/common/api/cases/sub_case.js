"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubCasesResponseRt = exports.SubCasesPatchRequestRt = exports.SubCasesFindResponseRt = exports.SubCasesFindRequestRt = exports.SubCaseResponseRt = exports.SubCasePatchRequestRt = exports.SubCaseAttributesRt = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _saved_object = require("../saved_object");

var _user = require("../user");

var _comment = require("./comment");

var _status = require("./status");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SubCaseBasicRt = rt.type({
  /**
   * The status of the sub case (open, closed, in-progress)
   */
  status: _status.CaseStatusRt
});
const SubCaseAttributesRt = rt.intersection([SubCaseBasicRt, rt.type({
  closed_at: rt.union([rt.string, rt.null]),
  closed_by: rt.union([_user.UserRT, rt.null]),
  created_at: rt.string,
  created_by: rt.union([_user.UserRT, rt.null]),
  updated_at: rt.union([rt.string, rt.null]),
  updated_by: rt.union([_user.UserRT, rt.null]),
  owner: rt.string
})]);
exports.SubCaseAttributesRt = SubCaseAttributesRt;
const SubCasesFindRequestRt = rt.partial({
  /**
   * The status of the sub case (open, closed, in-progress)
   */
  status: _status.CaseStatusRt,

  /**
   * Operator to use for the `search` field
   */
  defaultSearchOperator: rt.union([rt.literal('AND'), rt.literal('OR')]),

  /**
   * The fields in the entity to return in the response
   */
  fields: rt.array(rt.string),

  /**
   * The page of objects to return
   */
  page: _saved_object.NumberFromString,

  /**
   * The number of objects to include in each page
   */
  perPage: _saved_object.NumberFromString,

  /**
   * An Elasticsearch simple_query_string
   */
  search: rt.string,

  /**
   * The fields to perform the simple_query_string parsed query against
   */
  searchFields: rt.array(rt.string),

  /**
   * The field to use for sorting the found objects.
   */
  sortField: rt.string,

  /**
   * The order to sort by
   */
  sortOrder: rt.union([rt.literal('desc'), rt.literal('asc')]),
  owner: rt.string
});
exports.SubCasesFindRequestRt = SubCasesFindRequestRt;
const SubCaseResponseRt = rt.intersection([SubCaseAttributesRt, rt.type({
  id: rt.string,
  totalComment: rt.number,
  totalAlerts: rt.number,
  version: rt.string
}), rt.partial({
  comments: rt.array(_comment.CommentResponseRt)
})]);
exports.SubCaseResponseRt = SubCaseResponseRt;
const SubCasesFindResponseRt = rt.intersection([rt.type({
  subCases: rt.array(SubCaseResponseRt),
  page: rt.number,
  per_page: rt.number,
  total: rt.number
}), _status.CasesStatusResponseRt]);
exports.SubCasesFindResponseRt = SubCasesFindResponseRt;
const SubCasePatchRequestRt = rt.intersection([rt.partial(SubCaseBasicRt.props), rt.type({
  id: rt.string,
  version: rt.string
})]);
exports.SubCasePatchRequestRt = SubCasePatchRequestRt;
const SubCasesPatchRequestRt = rt.type({
  subCases: rt.array(SubCasePatchRequestRt)
});
exports.SubCasesPatchRequestRt = SubCasesPatchRequestRt;
const SubCasesResponseRt = rt.array(SubCaseResponseRt);
exports.SubCasesResponseRt = SubCasesResponseRt;