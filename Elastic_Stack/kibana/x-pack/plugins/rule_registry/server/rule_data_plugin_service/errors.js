"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleDataWriterInitializationError = exports.RuleDataWriteDisabledError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class RuleDataWriteDisabledError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'RuleDataWriteDisabledError';
  }

}

exports.RuleDataWriteDisabledError = RuleDataWriteDisabledError;

class RuleDataWriterInitializationError extends Error {
  constructor(resourceType, registrationContext, error) {
    super(`There has been a catastrophic error trying to install ${resourceType} level resources for the following registration context: ${registrationContext}. 
    This may have been due to a non-additive change to the mappings, removal and type changes are not permitted. Full error: ${error.toString()}`);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'RuleDataWriterInitializationError';
  }

}

exports.RuleDataWriterInitializationError = RuleDataWriterInitializationError;