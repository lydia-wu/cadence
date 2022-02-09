"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subCaseSavedObjectType = void 0;

var _common = require("../../common");

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const subCaseSavedObjectType = {
  name: _common.SUB_CASE_SAVED_OBJECT,
  hidden: true,
  namespaceType: 'single',
  mappings: {
    properties: {
      closed_at: {
        type: 'date'
      },
      closed_by: {
        properties: {
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          }
        }
      },
      created_at: {
        type: 'date'
      },
      created_by: {
        properties: {
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          }
        }
      },
      owner: {
        type: 'keyword'
      },
      status: {
        type: 'keyword'
      },
      updated_at: {
        type: 'date'
      },
      updated_by: {
        properties: {
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          }
        }
      }
    }
  },
  migrations: _migrations.subCasesMigrations
};
exports.subCaseSavedObjectType = subCaseSavedObjectType;