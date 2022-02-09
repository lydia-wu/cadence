"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noteType = exports.noteSavedObjectType = exports.noteSavedObjectMappings = void 0;

var _notes = require("./migrations/notes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const noteSavedObjectType = 'siem-ui-timeline-note';
exports.noteSavedObjectType = noteSavedObjectType;
const noteSavedObjectMappings = {
  properties: {
    eventId: {
      type: 'keyword'
    },
    note: {
      type: 'text'
    },
    created: {
      type: 'date'
    },
    createdBy: {
      type: 'text'
    },
    updated: {
      type: 'date'
    },
    updatedBy: {
      type: 'text'
    }
  }
};
exports.noteSavedObjectMappings = noteSavedObjectMappings;
const noteType = {
  name: noteSavedObjectType,
  hidden: false,
  namespaceType: 'single',
  mappings: noteSavedObjectMappings,
  migrations: _notes.notesMigrations
};
exports.noteType = noteType;