"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createObservabilityServerRouteRepository = void 0;

var _serverRouteRepository = require("@kbn/server-route-repository");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createObservabilityServerRouteRepository = () => {
  return (0, _serverRouteRepository.createServerRouteRepository)();
};

exports.createObservabilityServerRouteRepository = createObservabilityServerRouteRepository;