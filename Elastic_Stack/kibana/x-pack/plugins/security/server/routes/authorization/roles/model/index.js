"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getPutPayloadSchema", {
  enumerable: true,
  get: function () {
    return _put_payload.getPutPayloadSchema;
  }
});
Object.defineProperty(exports, "transformElasticsearchRoleToRole", {
  enumerable: true,
  get: function () {
    return _authorization.transformElasticsearchRoleToRole;
  }
});
Object.defineProperty(exports, "transformPutPayloadToElasticsearchRole", {
  enumerable: true,
  get: function () {
    return _put_payload.transformPutPayloadToElasticsearchRole;
  }
});

var _authorization = require("../../../../authorization");

var _put_payload = require("./put_payload");