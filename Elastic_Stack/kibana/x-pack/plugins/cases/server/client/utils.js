"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineAuthorizedAndOwnerFilter = exports.buildFilter = exports.addStatusFilter = void 0;
exports.combineFilters = combineFilters;
exports.sortToSnake = exports.isTwoArraysDifference = exports.getCaseToUpdate = exports.getAlertIds = exports.decodeCommentRequest = exports.constructQueryOptions = exports.compareArrays = void 0;
exports.stringToKueryNode = stringToKueryNode;

var _boom = require("@hapi/boom");

var _lodash = require("lodash");

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _pipeable = require("fp-ts/lib/pipeable");

var _common = require("../../../../../src/plugins/data/common");

var _server = require("../../../../../src/plugins/data/server");

var _common2 = require("../../common");

var _utils = require("../authorization/utils");

var _common3 = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const decodeCommentRequest = comment => {
  if ((0, _common3.isCommentRequestTypeUser)(comment)) {
    (0, _pipeable.pipe)((0, _common2.excess)(_common2.ContextTypeUserRt).decode(comment), (0, _Either.fold)((0, _common2.throwErrors)(_boom.badRequest), _function.identity));
  } else if ((0, _common3.isCommentRequestTypeActions)(comment)) {
    (0, _pipeable.pipe)((0, _common2.excess)(_common2.ActionsCommentRequestRt).decode(comment), (0, _Either.fold)((0, _common2.throwErrors)(_boom.badRequest), _function.identity));
  } else if ((0, _common3.isCommentRequestTypeAlertOrGenAlert)(comment)) {
    (0, _pipeable.pipe)((0, _common2.excess)(_common2.AlertCommentRequestRt).decode(comment), (0, _Either.fold)((0, _common2.throwErrors)(_boom.badRequest), _function.identity));
    const {
      ids,
      indices
    } = (0, _common3.getIDsAndIndicesAsArrays)(comment);
    /**
     * The alertId and index field must either be both of type string or they must both be string[] and be the same length.
     * Having a one-to-one relationship between the id and index of an alert avoids accidentally updating or
     * retrieving the wrong alert. Elasticsearch only guarantees that the _id (the field we use for alertId) to be
     * unique within a single index. So if we attempt to update or get a specific alert across multiple indices we could
     * update or receive the wrong one.
     *
     * Consider the situation where we have a alert1 with _id = '100' in index 'my-index-awesome' and also in index
     *  'my-index-hi'.
     * If we attempt to update the status of alert1 using an index pattern like `my-index-*` or even providing multiple
     * indices, there's a chance we'll accidentally update too many alerts.
     *
     * This check doesn't enforce that the API request has the correct alert ID to index relationship it just guards
     * against accidentally making a request like:
     * {
     *  alertId: [1,2,3],
     *  index: awesome,
     * }
     *
     * Instead this requires the requestor to provide:
     * {
     *  alertId: [1,2,3],
     *  index: [awesome, awesome, awesome]
     * }
     *
     * Ideally we'd change the format of the comment request to be an array of objects like:
     * {
     *  alerts: [{id: 1, index: awesome}, {id: 2, index: awesome}]
     * }
     *
     * But we'd need to also implement a migration because the saved object document currently stores the id and index
     * in separate fields.
     */

    if (ids.length !== indices.length) {
      throw (0, _boom.badRequest)(`Received an alert comment with ids and indices arrays of different lengths ids: ${JSON.stringify(ids)} indices: ${JSON.stringify(indices)}`);
    }
  }
};
/**
 * Return the alert IDs from the comment if it is an alert style comment. Otherwise return an empty array.
 */


exports.decodeCommentRequest = decodeCommentRequest;

const getAlertIds = comment => {
  if ((0, _common3.isCommentRequestTypeAlertOrGenAlert)(comment)) {
    return Array.isArray(comment.alertId) ? comment.alertId : [comment.alertId];
  }

  return [];
};

exports.getAlertIds = getAlertIds;

const addStatusFilter = ({
  status,
  appendFilter,
  type = _common2.CASE_SAVED_OBJECT
}) => {
  const filters = [];
  filters.push(_common.nodeBuilder.is(`${type}.attributes.status`, status));

  if (appendFilter) {
    filters.push(appendFilter);
  }

  return filters.length > 1 ? _common.nodeBuilder.and(filters) : filters[0];
};

exports.addStatusFilter = addStatusFilter;

const buildFilter = ({
  filters,
  field,
  operator,
  type = _common2.CASE_SAVED_OBJECT
}) => {
  if (filters === undefined) {
    return;
  }

  const filtersAsArray = Array.isArray(filters) ? filters : [filters];

  if (filtersAsArray.length === 0) {
    return;
  }

  return _common.nodeBuilder[operator](filtersAsArray.map(filter => _common.nodeBuilder.is(`${type}.attributes.${field}`, filter)));
};
/**
 * Combines the authorized filters with the requested owners.
 */


exports.buildFilter = buildFilter;

const combineAuthorizedAndOwnerFilter = (owner, authorizationFilter, savedObjectType) => {
  const ownerFilter = buildFilter({
    filters: owner,
    field: _common2.OWNER_FIELD,
    operator: 'or',
    type: savedObjectType
  });
  return (0, _utils.combineFilterWithAuthorizationFilter)(ownerFilter, authorizationFilter);
};
/**
 * Combines Kuery nodes and accepts an array with a mixture of undefined and KueryNodes. This will filter out the undefined
 * filters and return a KueryNode with the filters and'd together.
 */


exports.combineAuthorizedAndOwnerFilter = combineAuthorizedAndOwnerFilter;

function combineFilters(nodes) {
  const filters = nodes.filter(node => node !== undefined);

  if (filters.length <= 0) {
    return;
  }

  return _common.nodeBuilder.and(filters);
}
/**
 * Creates a KueryNode from a string expression. Returns undefined if the expression is undefined.
 */


function stringToKueryNode(expression) {
  if (!expression) {
    return;
  }

  return _server.esKuery.fromKueryExpression(expression);
}
/**
 * Constructs the filters used for finding cases and sub cases.
 * There are a few scenarios that this function tries to handle when constructing the filters used for finding cases
 * and sub cases.
 *
 * Scenario 1:
 *  Type == Individual
 *  If the API request specifies that it wants only individual cases (aka not collections) then we need to add that
 *  specific filter when call the saved objects find api. This will filter out any collection cases.
 *
 * Scenario 2:
 *  Type == collection
 *  If the API request specifies that it only wants collection cases (cases that have sub cases) then we need to add
 *  the filter for collections AND we need to ignore any status filter for the case find call. This is because a
 *  collection's status is no longer relevant when it has sub cases. The user cannot change the status for a collection
 *  only for its sub cases. The status filter will be applied to the find request when looking for sub cases.
 *
 * Scenario 3:
 *  No Type is specified
 *  If the API request does not want to filter on type but instead get both collections and regular individual cases then
 *  we need to find all cases that match the other filter criteria and sub cases. To do this we construct the following query:
 *
 *    ((status == some_status and type === individual) or type == collection) and (tags == blah) and (reporter == yo)
 *  This forces us to honor the status request for individual cases but gets us ALL collection cases that match the other
 *  filter criteria. When we search for sub cases we will use that status filter in that find call as well.
 */


const constructQueryOptions = ({
  tags,
  reporters,
  status,
  sortByField,
  caseType,
  owner,
  authorizationFilter
}) => {
  const kueryNodeExists = filter => filter != null;

  const tagsFilter = buildFilter({
    filters: tags !== null && tags !== void 0 ? tags : [],
    field: 'tags',
    operator: 'or'
  });
  const reportersFilter = buildFilter({
    filters: reporters !== null && reporters !== void 0 ? reporters : [],
    field: 'created_by.username',
    operator: 'or'
  });
  const sortField = sortToSnake(sortByField);
  const ownerFilter = buildFilter({
    filters: owner !== null && owner !== void 0 ? owner : [],
    field: _common2.OWNER_FIELD,
    operator: 'or'
  });

  switch (caseType) {
    case _common2.CaseType.individual:
      {
        // The cases filter will result in this structure "status === oh and (type === individual) and (tags === blah) and (reporter === yo)"
        // The subCase filter will be undefined because we don't need to find sub cases if type === individual
        // We do not want to support multiple type's being used, so force it to be a single filter value
        const typeFilter = _common.nodeBuilder.is(`${_common2.CASE_SAVED_OBJECT}.attributes.type`, _common2.CaseType.individual);

        const filters = [typeFilter, tagsFilter, reportersFilter, ownerFilter].filter(kueryNodeExists);
        const caseFilters = status != null ? addStatusFilter({
          status,
          appendFilter: filters.length > 1 ? _common.nodeBuilder.and(filters) : filters[0]
        }) : undefined;
        return {
          case: {
            filter: (0, _utils.combineFilterWithAuthorizationFilter)(caseFilters, authorizationFilter),
            sortField
          }
        };
      }

    case _common2.CaseType.collection:
      {
        // The cases filter will result in this structure "(type == parent) and (tags == blah) and (reporter == yo)"
        // The sub case filter will use the query.status if it exists
        const typeFilter = _common.nodeBuilder.is(`${_common2.CASE_SAVED_OBJECT}.attributes.type`, _common2.CaseType.collection);

        const filters = [typeFilter, tagsFilter, reportersFilter, ownerFilter].filter(kueryNodeExists);
        const caseFilters = filters.length > 1 ? _common.nodeBuilder.and(filters) : filters[0];
        const subCaseFilters = status != null ? addStatusFilter({
          status,
          type: _common2.SUB_CASE_SAVED_OBJECT
        }) : undefined;
        return {
          case: {
            filter: (0, _utils.combineFilterWithAuthorizationFilter)(caseFilters, authorizationFilter),
            sortField
          },
          subCase: {
            filter: (0, _utils.combineFilterWithAuthorizationFilter)(subCaseFilters, authorizationFilter),
            sortField
          }
        };
      }

    default:
      {
        /**
         * In this scenario no type filter was sent, so we want to honor the status filter if one exists.
         * To construct the filter and honor the status portion we need to find all individual cases that
         * have that particular status. We also need to find cases that have sub cases but we want to ignore the
         * case collection's status because it is not relevant. We only care about the status of the sub cases if the
         * case is a collection.
         *
         * The cases filter will result in this structure "((status == open and type === individual) or type == parent) and (tags == blah) and (reporter == yo)"
         * The sub case filter will use the query.status if it exists
         */
        const typeIndividual = _common.nodeBuilder.is(`${_common2.CASE_SAVED_OBJECT}.attributes.type`, _common2.CaseType.individual);

        const typeParent = _common.nodeBuilder.is(`${_common2.CASE_SAVED_OBJECT}.attributes.type`, _common2.CaseType.collection);

        const statusFilter = status != null ? _common.nodeBuilder.and([addStatusFilter({
          status
        }), typeIndividual]) : typeIndividual;

        const statusAndType = _common.nodeBuilder.or([statusFilter, typeParent]);

        const filters = [statusAndType, tagsFilter, reportersFilter, ownerFilter].filter(kueryNodeExists);
        const caseFilters = filters.length > 1 ? _common.nodeBuilder.and(filters) : filters[0];
        const subCaseFilters = status != null ? addStatusFilter({
          status,
          type: _common2.SUB_CASE_SAVED_OBJECT
        }) : undefined;
        return {
          case: {
            filter: (0, _utils.combineFilterWithAuthorizationFilter)(caseFilters, authorizationFilter),
            sortField
          },
          subCase: {
            filter: (0, _utils.combineFilterWithAuthorizationFilter)(subCaseFilters, authorizationFilter),
            sortField
          }
        };
      }
  }
};

exports.constructQueryOptions = constructQueryOptions;

const compareArrays = ({
  originalValue,
  updatedValue
}) => {
  const result = {
    addedItems: [],
    deletedItems: []
  };
  originalValue.forEach(origVal => {
    if (!updatedValue.includes(origVal)) {
      result.deletedItems = [...result.deletedItems, origVal];
    }
  });
  updatedValue.forEach(updatedVal => {
    if (!originalValue.includes(updatedVal)) {
      result.addedItems = [...result.addedItems, updatedVal];
    }
  });
  return result;
};

exports.compareArrays = compareArrays;

const isTwoArraysDifference = (originalValue, updatedValue) => {
  if (originalValue != null && updatedValue != null && Array.isArray(updatedValue) && Array.isArray(originalValue)) {
    const compObj = compareArrays({
      originalValue,
      updatedValue
    });

    if (compObj.addedItems.length > 0 || compObj.deletedItems.length > 0) {
      return compObj;
    }
  }

  return null;
};

exports.isTwoArraysDifference = isTwoArraysDifference;

const getCaseToUpdate = (currentCase, queryCase) => Object.entries(queryCase).reduce((acc, [key, value]) => {
  const currentValue = (0, _lodash.get)(currentCase, key);

  if (Array.isArray(currentValue) && Array.isArray(value)) {
    if (isTwoArraysDifference(value, currentValue)) {
      return { ...acc,
        [key]: value
      };
    }

    return acc;
  } else if ((0, _lodash.isPlainObject)(currentValue) && (0, _lodash.isPlainObject)(value)) {
    if (!(0, _fastDeepEqual.default)(currentValue, value)) {
      return { ...acc,
        [key]: value
      };
    }

    return acc;
  } else if (currentValue != null && value !== currentValue) {
    return { ...acc,
      [key]: value
    };
  }

  return acc;
}, {
  id: queryCase.id,
  version: queryCase.version
});

exports.getCaseToUpdate = getCaseToUpdate;
var SortFieldCase;

(function (SortFieldCase) {
  SortFieldCase["closedAt"] = "closed_at";
  SortFieldCase["createdAt"] = "created_at";
  SortFieldCase["status"] = "status";
})(SortFieldCase || (SortFieldCase = {}));

const sortToSnake = sortField => {
  switch (sortField) {
    case 'status':
      return SortFieldCase.status;

    case 'createdAt':
    case 'created_at':
      return SortFieldCase.createdAt;

    case 'closedAt':
    case 'closed_at':
      return SortFieldCase.closedAt;

    default:
      return SortFieldCase.createdAt;
  }
};

exports.sortToSnake = sortToSnake;