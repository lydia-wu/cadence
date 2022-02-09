"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mlServicesMock = exports.mlAuthzMock = void 0;

var _mocks = require("../../../../ml/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const mlServicesMock = _mocks.mlPluginServerMock;
exports.mlServicesMock = mlServicesMock;
const mockValidateRuleType = jest.fn().mockResolvedValue({
  valid: true,
  message: undefined
});

const createBuildMlAuthzMock = () => jest.fn().mockReturnValue({
  validateRuleType: mockValidateRuleType
});

const mlAuthzMock = {
  create: () => ({
    buildMlAuthz: createBuildMlAuthzMock()
  })
};
exports.mlAuthzMock = mlAuthzMock;