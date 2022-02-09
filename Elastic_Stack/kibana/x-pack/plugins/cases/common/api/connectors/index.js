"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  ConnectorFieldsRt: true,
  ConnectorTypes: true,
  connectorTypes: true,
  noneConnectorId: true,
  ConnectorTypeFieldsRt: true,
  CaseUserActionConnectorRt: true,
  CaseConnectorRt: true
};
exports.noneConnectorId = exports.connectorTypes = exports.ConnectorTypes = exports.ConnectorTypeFieldsRt = exports.ConnectorFieldsRt = exports.CaseUserActionConnectorRt = exports.CaseConnectorRt = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _jira = require("./jira");

Object.keys(_jira).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _jira[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _jira[key];
    }
  });
});

var _resilient = require("./resilient");

Object.keys(_resilient).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _resilient[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _resilient[key];
    }
  });
});

var _servicenow_itsm = require("./servicenow_itsm");

Object.keys(_servicenow_itsm).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _servicenow_itsm[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _servicenow_itsm[key];
    }
  });
});

var _servicenow_sir = require("./servicenow_sir");

Object.keys(_servicenow_sir).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _servicenow_sir[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _servicenow_sir[key];
    }
  });
});

var _swimlane = require("./swimlane");

Object.keys(_swimlane).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _swimlane[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _swimlane[key];
    }
  });
});

var _mappings = require("./mappings");

Object.keys(_mappings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _mappings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mappings[key];
    }
  });
});

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


const ConnectorFieldsRt = rt.union([_jira.JiraFieldsRT, _resilient.ResilientFieldsRT, _servicenow_itsm.ServiceNowITSMFieldsRT, _servicenow_sir.ServiceNowSIRFieldsRT, rt.null]);
exports.ConnectorFieldsRt = ConnectorFieldsRt;
let ConnectorTypes;
exports.ConnectorTypes = ConnectorTypes;

(function (ConnectorTypes) {
  ConnectorTypes["jira"] = ".jira";
  ConnectorTypes["none"] = ".none";
  ConnectorTypes["resilient"] = ".resilient";
  ConnectorTypes["serviceNowITSM"] = ".servicenow";
  ConnectorTypes["serviceNowSIR"] = ".servicenow-sir";
  ConnectorTypes["swimlane"] = ".swimlane";
})(ConnectorTypes || (exports.ConnectorTypes = ConnectorTypes = {}));

const connectorTypes = Object.values(ConnectorTypes);
exports.connectorTypes = connectorTypes;
const ConnectorJiraTypeFieldsRt = rt.type({
  type: rt.literal(ConnectorTypes.jira),
  fields: rt.union([_jira.JiraFieldsRT, rt.null])
});
const ConnectorResillientTypeFieldsRt = rt.type({
  type: rt.literal(ConnectorTypes.resilient),
  fields: rt.union([_resilient.ResilientFieldsRT, rt.null])
});
const ConnectorServiceNowITSMTypeFieldsRt = rt.type({
  type: rt.literal(ConnectorTypes.serviceNowITSM),
  fields: rt.union([_servicenow_itsm.ServiceNowITSMFieldsRT, rt.null])
});
const ConnectorSwimlaneTypeFieldsRt = rt.type({
  type: rt.literal(ConnectorTypes.swimlane),
  fields: rt.union([_swimlane.SwimlaneFieldsRT, rt.null])
});
const ConnectorServiceNowSIRTypeFieldsRt = rt.type({
  type: rt.literal(ConnectorTypes.serviceNowSIR),
  fields: rt.union([_servicenow_sir.ServiceNowSIRFieldsRT, rt.null])
});
const ConnectorNoneTypeFieldsRt = rt.type({
  type: rt.literal(ConnectorTypes.none),
  fields: rt.null
});
const noneConnectorId = 'none';
exports.noneConnectorId = noneConnectorId;
const ConnectorTypeFieldsRt = rt.union([ConnectorJiraTypeFieldsRt, ConnectorNoneTypeFieldsRt, ConnectorResillientTypeFieldsRt, ConnectorServiceNowITSMTypeFieldsRt, ConnectorServiceNowSIRTypeFieldsRt, ConnectorSwimlaneTypeFieldsRt]);
/**
 * This type represents the connector's format when it is encoded within a user action.
 */

exports.ConnectorTypeFieldsRt = ConnectorTypeFieldsRt;
const CaseUserActionConnectorRt = rt.intersection([rt.type({
  name: rt.string
}), ConnectorTypeFieldsRt]);
exports.CaseUserActionConnectorRt = CaseUserActionConnectorRt;
const CaseConnectorRt = rt.intersection([rt.type({
  id: rt.string
}), CaseUserActionConnectorRt]);
exports.CaseConnectorRt = CaseConnectorRt;