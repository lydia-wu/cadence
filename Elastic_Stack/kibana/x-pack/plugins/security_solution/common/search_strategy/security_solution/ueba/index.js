"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  UebaQueries: true
};
exports.UebaQueries = void 0;

var _common = require("./common");

Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _common[key];
    }
  });
});

var _host_rules = require("./host_rules");

Object.keys(_host_rules).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _host_rules[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _host_rules[key];
    }
  });
});

var _host_tactics = require("./host_tactics");

Object.keys(_host_tactics).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _host_tactics[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _host_tactics[key];
    }
  });
});

var _risk_score = require("./risk_score");

Object.keys(_risk_score).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _risk_score[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _risk_score[key];
    }
  });
});

var _user_rules = require("./user_rules");

Object.keys(_user_rules).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _user_rules[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _user_rules[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let UebaQueries;
exports.UebaQueries = UebaQueries;

(function (UebaQueries) {
  UebaQueries["hostRules"] = "hostRules";
  UebaQueries["hostTactics"] = "hostTactics";
  UebaQueries["riskScore"] = "riskScore";
  UebaQueries["userRules"] = "userRules";
})(UebaQueries || (exports.UebaQueries = UebaQueries = {}));