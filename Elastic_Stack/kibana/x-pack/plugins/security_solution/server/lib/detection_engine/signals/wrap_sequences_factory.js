"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapSequencesFactory = void 0;

var _build_bulk_body = require("./build_bulk_body");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const wrapSequencesFactory = ({
  ruleSO,
  signalsIndex,
  mergeStrategy,
  ignoreFields
}) => (sequences, buildReasonMessage) => sequences.reduce((acc, sequence) => [...acc, ...(0, _build_bulk_body.buildSignalGroupFromSequence)(sequence, ruleSO, signalsIndex, mergeStrategy, ignoreFields, buildReasonMessage)], []);

exports.wrapSequencesFactory = wrapSequencesFactory;