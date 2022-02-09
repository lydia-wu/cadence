"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mlSavedObjectType = void 0;

var _types = require("../../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const mlSavedObjectType = {
  name: _types.ML_UPGRADE_OP_TYPE,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: {
    properties: {
      nodeId: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword',
            ignore_above: 256
          }
        }
      },
      snapshotId: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword',
            ignore_above: 256
          }
        }
      },
      jobId: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword',
            ignore_above: 256
          }
        }
      },
      status: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword',
            ignore_above: 256
          }
        }
      }
    }
  }
};
exports.mlSavedObjectType = mlSavedObjectType;