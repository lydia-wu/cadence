"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xpackMocks = void 0;

var _mocks = require("../../../../src/core/server/mocks");

var _mocks2 = require("../../licensing/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createCoreRequestHandlerContextMock() {
  return {
    core: _mocks.coreMock.createRequestHandlerContext(),
    licensing: _mocks2.licensingMock.createRequestHandlerContext()
  };
}

const xpackMocks = {
  createRequestHandlerContext: createCoreRequestHandlerContextMock
};
exports.xpackMocks = xpackMocks;