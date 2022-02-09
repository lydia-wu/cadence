"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLicenseServiceMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createLicenseServiceMock = () => {
  return {
    start: jest.fn(),
    stop: jest.fn(),
    getLicenseInformation: jest.fn(),
    getLicenseInformation$: jest.fn(),
    isAtLeast: jest.fn(),
    isGoldPlus: jest.fn().mockReturnValue(true),
    isPlatinumPlus: jest.fn().mockReturnValue(true),
    isEnterprise: jest.fn().mockReturnValue(true)
  };
};

exports.createLicenseServiceMock = createLicenseServiceMock;