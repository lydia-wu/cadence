"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUserActionServiceMock = exports.createConfigureServiceMock = exports.createCaseServiceMock = exports.createAttachmentServiceMock = exports.createAlertServiceMock = exports.connectorMappingsServiceMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createCaseServiceMock = () => {
  const service = {
    createSubCase: jest.fn(),
    deleteCase: jest.fn(),
    deleteSubCase: jest.fn(),
    findCases: jest.fn(),
    findSubCases: jest.fn(),
    findSubCasesByCaseId: jest.fn(),
    getAllCaseComments: jest.fn(),
    getAllSubCaseComments: jest.fn(),
    getCase: jest.fn(),
    getCases: jest.fn(),
    getCaseIdsByAlertId: jest.fn(),
    getMostRecentSubCase: jest.fn(),
    getResolveCase: jest.fn(),
    getSubCase: jest.fn(),
    getSubCases: jest.fn(),
    getTags: jest.fn(),
    getReporters: jest.fn(),
    getUser: jest.fn(),
    postNewCase: jest.fn(),
    patchCase: jest.fn(),
    patchCases: jest.fn(),
    patchSubCase: jest.fn(),
    patchSubCases: jest.fn(),
    findSubCaseStatusStats: jest.fn(),
    getCommentsByAssociation: jest.fn(),
    getCaseCommentStats: jest.fn(),
    findSubCasesGroupByCase: jest.fn(),
    findCaseStatusStats: jest.fn(),
    findCasesGroupedByID: jest.fn()
  }; // the cast here is required because jest.Mocked tries to include private members and would throw an error

  return service;
};

exports.createCaseServiceMock = createCaseServiceMock;

const createConfigureServiceMock = () => {
  const service = {
    delete: jest.fn(),
    get: jest.fn(),
    find: jest.fn(),
    patch: jest.fn(),
    post: jest.fn()
  }; // the cast here is required because jest.Mocked tries to include private members and would throw an error

  return service;
};

exports.createConfigureServiceMock = createConfigureServiceMock;

const connectorMappingsServiceMock = () => {
  const service = {
    find: jest.fn(),
    post: jest.fn(),
    update: jest.fn()
  }; // the cast here is required because jest.Mocked tries to include private members and would throw an error

  return service;
};

exports.connectorMappingsServiceMock = connectorMappingsServiceMock;

const createUserActionServiceMock = () => {
  const service = {
    getAll: jest.fn(),
    bulkCreate: jest.fn()
  }; // the cast here is required because jest.Mocked tries to include private members and would throw an error

  return service;
};

exports.createUserActionServiceMock = createUserActionServiceMock;

const createAlertServiceMock = () => ({
  updateAlertsStatus: jest.fn(),
  getAlerts: jest.fn()
});

exports.createAlertServiceMock = createAlertServiceMock;

const createAttachmentServiceMock = () => {
  const service = {
    get: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    bulkUpdate: jest.fn(),
    getAllAlertsAttachToCase: jest.fn()
  }; // the cast here is required because jest.Mocked tries to include private members and would throw an error

  return service;
};

exports.createAttachmentServiceMock = createAttachmentServiceMock;