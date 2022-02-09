"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dupeFields = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const dupeFields = [{
  name: '1',
  type: 'integer',
  searchable: true,
  aggregatable: true,
  count: 0,
  indexed: true,
  readFromDocValues: true,
  scripted: false
}, {
  name: '2',
  type: 'integer',
  searchable: true,
  aggregatable: true,
  count: 0,
  indexed: true,
  readFromDocValues: true,
  scripted: false
}, {
  name: '3',
  type: 'integer',
  searchable: true,
  aggregatable: true,
  count: 0,
  indexed: true,
  readFromDocValues: true,
  scripted: false
}, {
  name: '1',
  type: 'integer',
  searchable: false,
  aggregatable: false,
  count: 2,
  indexed: true,
  readFromDocValues: true,
  scripted: false
}, {
  name: '1.1',
  type: 'integer',
  searchable: false,
  aggregatable: false,
  count: 0,
  indexed: true,
  readFromDocValues: true,
  scripted: false
}, {
  name: '4',
  type: 'integer',
  searchable: false,
  aggregatable: false,
  count: 0,
  indexed: true,
  readFromDocValues: true,
  scripted: false
}, {
  name: '2',
  type: 'integer',
  searchable: false,
  aggregatable: false,
  count: 0,
  indexed: true,
  readFromDocValues: true,
  scripted: false
}, {
  name: '1',
  type: 'integer',
  searchable: false,
  aggregatable: false,
  count: 1,
  indexed: true,
  readFromDocValues: true,
  scripted: false
}];
exports.dupeFields = dupeFields;