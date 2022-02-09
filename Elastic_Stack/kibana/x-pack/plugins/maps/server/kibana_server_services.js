"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setInternalRepository = exports.setIndexPatternsService = exports.getInternalRepository = exports.getIndexPatternsService = void 0;

var _server = require("../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let internalRepository;

const setInternalRepository = createInternalRepository => {
  internalRepository = createInternalRepository();
};

exports.setInternalRepository = setInternalRepository;

const getInternalRepository = () => internalRepository;

exports.getInternalRepository = getInternalRepository;
let indexPatternsService;

const setIndexPatternsService = async (indexPatternsServiceFactory, elasticsearchClient) => {
  indexPatternsService = await indexPatternsServiceFactory(new _server.SavedObjectsClient(getInternalRepository()), elasticsearchClient);
};

exports.setIndexPatternsService = setIndexPatternsService;

const getIndexPatternsService = () => indexPatternsService;

exports.getIndexPatternsService = getIndexPatternsService;