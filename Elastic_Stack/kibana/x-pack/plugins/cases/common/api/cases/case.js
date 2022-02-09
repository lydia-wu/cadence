"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.caseTypeField = exports.GetCaseIdsByAlertIdAggsRt = exports.ExternalServiceResponseRt = exports.CasesResponseRt = exports.CasesPatchRequestRt = exports.CasesFindResponseRt = exports.CasesFindRequestRt = exports.CasesClientPostRequestRt = exports.CasesByAlertIdRt = exports.CasesByAlertIDRequestRt = exports.CaseUserActionExternalServiceRt = exports.CaseType = exports.CaseResponseRt = exports.CaseResolveResponseRt = exports.CasePushRequestParamsRt = exports.CasePostRequestRt = exports.CasePatchRequestRt = exports.CaseFullExternalServiceRt = exports.CaseExternalServiceBasicRt = exports.CaseAttributesRt = exports.AllTagsFindRequestRt = exports.AllReportersFindRequestRt = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _saved_object = require("../saved_object");

var _user = require("../user");

var _comment = require("./comment");

var _status = require("./status");

var _connectors = require("../connectors");

var _sub_case = require("./sub_case");

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


const BucketsAggs = rt.array(rt.type({
  key: rt.string
}));
const GetCaseIdsByAlertIdAggsRt = rt.type({
  references: rt.type({
    doc_count: rt.number,
    caseIds: rt.type({
      buckets: BucketsAggs
    })
  })
});
exports.GetCaseIdsByAlertIdAggsRt = GetCaseIdsByAlertIdAggsRt;
const CasesByAlertIdRt = rt.array(rt.type({
  id: rt.string,
  title: rt.string
}));
exports.CasesByAlertIdRt = CasesByAlertIdRt;
let CaseType;
/**
 * Exposing the field used to define the case type so that it can be used for filtering in saved object find queries.
 */

exports.CaseType = CaseType;

(function (CaseType) {
  CaseType["collection"] = "collection";
  CaseType["individual"] = "individual";
})(CaseType || (exports.CaseType = CaseType = {}));

const caseTypeField = 'type';
exports.caseTypeField = caseTypeField;
const CaseTypeRt = rt.union([rt.literal(CaseType.collection), rt.literal(CaseType.individual)]);
const SettingsRt = rt.type({
  syncAlerts: rt.boolean
});
const CaseBasicRt = rt.type({
  /**
   * The description of the case
   */
  description: rt.string,

  /**
   * The current status of the case (open, closed, in-progress)
   */
  status: _status.CaseStatusRt,

  /**
   * The identifying strings for filter a case
   */
  tags: rt.array(rt.string),

  /**
   * The title of a case
   */
  title: rt.string,

  /**
   * The type of a case (individual or collection)
   */
  [caseTypeField]: CaseTypeRt,

  /**
   * The external system that the case can be synced with
   */
  connector: _connectors.CaseConnectorRt,

  /**
   * The alert sync settings
   */
  settings: SettingsRt,

  /**
   * The plugin owner of the case
   */
  owner: rt.string
});
/**
 * This represents the push to service UserAction. It lacks the connector_id because that is stored in a different field
 * within the user action object in the API response.
 */

const CaseUserActionExternalServiceRt = rt.type({
  connector_name: rt.string,
  external_id: rt.string,
  external_title: rt.string,
  external_url: rt.string,
  pushed_at: rt.string,
  pushed_by: _user.UserRT
});
exports.CaseUserActionExternalServiceRt = CaseUserActionExternalServiceRt;
const CaseExternalServiceBasicRt = rt.intersection([rt.type({
  connector_id: rt.union([rt.string, rt.null])
}), CaseUserActionExternalServiceRt]);
exports.CaseExternalServiceBasicRt = CaseExternalServiceBasicRt;
const CaseFullExternalServiceRt = rt.union([CaseExternalServiceBasicRt, rt.null]);
exports.CaseFullExternalServiceRt = CaseFullExternalServiceRt;
const CaseAttributesRt = rt.intersection([CaseBasicRt, rt.type({
  closed_at: rt.union([rt.string, rt.null]),
  closed_by: rt.union([_user.UserRT, rt.null]),
  created_at: rt.string,
  created_by: _user.UserRT,
  external_service: CaseFullExternalServiceRt,
  updated_at: rt.union([rt.string, rt.null]),
  updated_by: rt.union([_user.UserRT, rt.null])
})]);
exports.CaseAttributesRt = CaseAttributesRt;
const CasePostRequestNoTypeRt = rt.type({
  /**
   * Description of the case
   */
  description: rt.string,

  /**
   * Identifiers for the case.
   */
  tags: rt.array(rt.string),

  /**
   * Title of the case
   */
  title: rt.string,

  /**
   * The external configuration for the case
   */
  connector: _connectors.CaseConnectorRt,

  /**
   * Sync settings for alerts
   */
  settings: SettingsRt,

  /**
   * The owner here must match the string used when a plugin registers a feature with access to the cases plugin. The user
   * creating this case must also be granted access to that plugin's feature.
   */
  owner: rt.string
});
/**
 * This type is used for validating a create case request. It requires that the type field be defined.
 */

const CasesClientPostRequestRt = rt.type({ ...CasePostRequestNoTypeRt.props,
  [caseTypeField]: CaseTypeRt
});
/**
 * This type is not used for validation when decoding a request because intersection does not have props defined which
 * required for the excess function. Instead we use this as the type used by the UI. This allows the type field to be
 * optional and the server will handle setting it to a default value before validating that the request
 * has all the necessary fields. CasesClientPostRequestRt is used for validation.
 */

exports.CasesClientPostRequestRt = CasesClientPostRequestRt;
const CasePostRequestRt = rt.intersection([
/**
 * The case type: an individual case (one without children) or a collection case (one with children)
 */
rt.partial({
  [caseTypeField]: CaseTypeRt
}), CasePostRequestNoTypeRt]);
exports.CasePostRequestRt = CasePostRequestRt;
const CasesFindRequestRt = rt.partial({
  /**
   * Type of a case (individual, or collection)
   */
  type: CaseTypeRt,

  /**
   * Tags to filter by
   */
  tags: rt.union([rt.array(rt.string), rt.string]),

  /**
   * The status of the case (open, closed, in-progress)
   */
  status: _status.CaseStatusRt,

  /**
   * The reporters to filter by
   */
  reporters: rt.union([rt.array(rt.string), rt.string]),

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
  searchFields: rt.union([rt.array(rt.string), rt.string]),

  /**
   * The field to use for sorting the found objects.
   *
   * This only supports, `create_at`, `closed_at`, and `status`
   */
  sortField: rt.string,

  /**
   * The order to sort by
   */
  sortOrder: rt.union([rt.literal('desc'), rt.literal('asc')]),

  /**
   * The owner(s) to filter by. The user making the request must have privileges to retrieve cases of that
   * ownership or they will be ignored. If no owner is included, then all ownership types will be included in the response
   * that the user has access to.
   */
  owner: rt.union([rt.array(rt.string), rt.string])
});
exports.CasesFindRequestRt = CasesFindRequestRt;
const CasesByAlertIDRequestRt = rt.partial({
  /**
   * The type of cases to retrieve given an alert ID. If no owner is provided, all cases
   * that the user has access to will be returned.
   */
  owner: rt.union([rt.array(rt.string), rt.string])
});
exports.CasesByAlertIDRequestRt = CasesByAlertIDRequestRt;
const CaseResponseRt = rt.intersection([CaseAttributesRt, rt.type({
  id: rt.string,
  totalComment: rt.number,
  totalAlerts: rt.number,
  version: rt.string
}), rt.partial({
  subCaseIds: rt.array(rt.string),
  subCases: rt.array(_sub_case.SubCaseResponseRt),
  comments: rt.array(_comment.CommentResponseRt)
})]);
exports.CaseResponseRt = CaseResponseRt;
const CaseResolveResponseRt = rt.intersection([rt.type({
  case: CaseResponseRt,
  outcome: rt.union([rt.literal('exactMatch'), rt.literal('aliasMatch'), rt.literal('conflict')])
}), rt.partial({
  alias_target_id: rt.string
})]);
exports.CaseResolveResponseRt = CaseResolveResponseRt;
const CasesFindResponseRt = rt.intersection([rt.type({
  cases: rt.array(CaseResponseRt),
  page: rt.number,
  per_page: rt.number,
  total: rt.number
}), _status.CasesStatusResponseRt]);
exports.CasesFindResponseRt = CasesFindResponseRt;
const CasePatchRequestRt = rt.intersection([rt.partial(CaseBasicRt.props),
/**
 * The saved object ID and version
 */
rt.type({
  id: rt.string,
  version: rt.string
})]);
exports.CasePatchRequestRt = CasePatchRequestRt;
const CasesPatchRequestRt = rt.type({
  cases: rt.array(CasePatchRequestRt)
});
exports.CasesPatchRequestRt = CasesPatchRequestRt;
const CasesResponseRt = rt.array(CaseResponseRt);
exports.CasesResponseRt = CasesResponseRt;
const CasePushRequestParamsRt = rt.type({
  case_id: rt.string,
  connector_id: rt.string
});
exports.CasePushRequestParamsRt = CasePushRequestParamsRt;
const ExternalServiceResponseRt = rt.intersection([rt.type({
  title: rt.string,
  id: rt.string,
  pushedDate: rt.string,
  url: rt.string
}), rt.partial({
  comments: rt.array(rt.intersection([rt.type({
    commentId: rt.string,
    pushedDate: rt.string
  }), rt.partial({
    externalCommentId: rt.string
  })]))
})]);
exports.ExternalServiceResponseRt = ExternalServiceResponseRt;
const AllTagsFindRequestRt = rt.partial({
  /**
   * The owner of the cases to retrieve the tags from. If no owner is provided the tags from all cases
   * that the user has access to will be returned.
   */
  owner: rt.union([rt.array(rt.string), rt.string])
});
exports.AllTagsFindRequestRt = AllTagsFindRequestRt;
const AllReportersFindRequestRt = AllTagsFindRequestRt;
exports.AllReportersFindRequestRt = AllReportersFindRequestRt;