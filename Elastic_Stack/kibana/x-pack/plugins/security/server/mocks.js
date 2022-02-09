"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.securityMock = void 0;

var _index = require("../common/licensing/index.mock");

var _authenticated_user = require("../common/model/authenticated_user.mock");

var _index2 = require("./audit/index.mock");

var _authentication_service = require("./authentication/authentication_service.mock");

var _index3 = require("./authorization/index.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createSetupMock() {
  const mockAuthz = _index3.authorizationMock.create();

  return {
    audit: _index2.auditServiceMock.create(),
    authc: {
      getCurrentUser: jest.fn()
    },
    authz: {
      actions: mockAuthz.actions,
      checkPrivilegesWithRequest: mockAuthz.checkPrivilegesWithRequest,
      checkPrivilegesDynamicallyWithRequest: mockAuthz.checkPrivilegesDynamicallyWithRequest,
      checkSavedObjectsPrivilegesWithRequest: mockAuthz.checkSavedObjectsPrivilegesWithRequest,
      mode: mockAuthz.mode
    },
    registerSpacesService: jest.fn(),
    license: _index.licenseMock.create(),
    privilegeDeprecationsService: {
      getKibanaRoles: jest.fn()
    }
  };
}

function createStartMock() {
  const mockAuthz = _index3.authorizationMock.create();

  const mockAuthc = _authentication_service.authenticationServiceMock.createStart();

  return {
    authc: {
      apiKeys: mockAuthc.apiKeys,
      getCurrentUser: mockAuthc.getCurrentUser
    },
    authz: {
      actions: mockAuthz.actions,
      checkPrivilegesWithRequest: mockAuthz.checkPrivilegesWithRequest,
      checkPrivilegesDynamicallyWithRequest: mockAuthz.checkPrivilegesDynamicallyWithRequest,
      checkSavedObjectsPrivilegesWithRequest: mockAuthz.checkSavedObjectsPrivilegesWithRequest,
      mode: mockAuthz.mode
    }
  };
}

function createApiResponseMock(apiResponse) {
  return {
    statusCode: null,
    headers: null,
    warnings: null,
    meta: {},
    ...apiResponse
  };
}

const securityMock = {
  createSetup: createSetupMock,
  createStart: createStartMock,
  createApiResponse: createApiResponseMock,
  createMockAuthenticatedUser: (props = {}) => (0, _authenticated_user.mockAuthenticatedUser)(props)
};
exports.securityMock = securityMock;