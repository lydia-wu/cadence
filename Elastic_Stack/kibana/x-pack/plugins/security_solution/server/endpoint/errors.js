"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotFoundError = exports.EndpointLicenseError = exports.EndpointError = exports.EndpointAppContentServicesNotStartedError = exports.EndpointAppContentServicesNotSetUpError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class EndpointError extends Error {
  constructor(message, meta) {
    super(message); // For debugging - capture name of subclasses

    this.meta = meta;
    this.name = this.constructor.name;
  }

}

exports.EndpointError = EndpointError;

class NotFoundError extends EndpointError {}

exports.NotFoundError = NotFoundError;

class EndpointAppContentServicesNotSetUpError extends EndpointError {
  constructor() {
    super('EndpointAppContextService has not been set up (EndpointAppContextService.setup())');
  }

}

exports.EndpointAppContentServicesNotSetUpError = EndpointAppContentServicesNotSetUpError;

class EndpointAppContentServicesNotStartedError extends EndpointError {
  constructor() {
    super('EndpointAppContextService has not been started (EndpointAppContextService.start())');
  }

}

exports.EndpointAppContentServicesNotStartedError = EndpointAppContentServicesNotStartedError;

class EndpointLicenseError extends EndpointError {
  constructor() {
    super('Your license level does not allow for this action.');
  }

}

exports.EndpointLicenseError = EndpointLicenseError;