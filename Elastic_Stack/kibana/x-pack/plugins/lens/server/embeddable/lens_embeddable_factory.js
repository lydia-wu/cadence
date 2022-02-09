"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lensEmbeddableFactory = void 0;

var _common = require("../../common");

var _common_migrations = require("../migrations/common_migrations");

var _embeddable_factory = require("../../common/embeddable_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const lensEmbeddableFactory = () => {
  return {
    id: _common.DOC_TYPE,
    migrations: {
      // This migration is run in 7.13.1 for `by value` panels because the 7.13 release window was missed.
      '7.13.1': state => {
        const lensState = state;
        const migratedLensState = (0, _common_migrations.commonRenameOperationsForFormula)(lensState.attributes);
        return { ...lensState,
          attributes: migratedLensState
        };
      },
      '7.14.0': state => {
        const lensState = state;
        const migratedLensState = (0, _common_migrations.commonRemoveTimezoneDateHistogramParam)(lensState.attributes);
        return { ...lensState,
          attributes: migratedLensState
        };
      },
      '7.15.0': state => {
        const lensState = state;
        const migratedLensState = (0, _common_migrations.commonUpdateVisLayerType)(lensState.attributes);
        return { ...lensState,
          attributes: migratedLensState
        };
      },
      '7.16.0': state => {
        const lensState = state;
        const migratedLensState = (0, _common_migrations.commonMakeReversePaletteAsCustom)(lensState.attributes);
        return { ...lensState,
          attributes: migratedLensState
        };
      }
    },
    extract: _embeddable_factory.extract,
    inject: _embeddable_factory.inject
  };
};

exports.lensEmbeddableFactory = lensEmbeddableFactory;