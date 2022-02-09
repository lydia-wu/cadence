"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visualizeEmbeddableFactory = void 0;

var _lodash = require("lodash");

var _visualization_common_migrations = require("../migrations/visualization_common_migrations");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const byValueAddSupportOfDualIndexSelectionModeInTSVB = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonAddSupportOfDualIndexSelectionModeInTSVB)(state.savedVis)
  };
};

const byValueHideTSVBLastValueIndicator = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonHideTSVBLastValueIndicator)(state.savedVis)
  };
};

const byValueAddDropLastBucketIntoTSVBModel = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonAddDropLastBucketIntoTSVBModel)(state.savedVis)
  };
};

const byValueRemoveDefaultIndexPatternAndTimeFieldFromTSVBModel = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonRemoveDefaultIndexPatternAndTimeFieldFromTSVBModel)(state.savedVis)
  };
};

const byValueAddEmptyValueColorRule = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonAddEmptyValueColorRule)(state.savedVis)
  };
};

const byValueMigrateVislibPie = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonMigrateVislibPie)(state.savedVis)
  };
};

const byValueMigrateTagcloud = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonMigrateTagCloud)(state.savedVis)
  };
};

const visualizeEmbeddableFactory = () => {
  return {
    id: 'visualization',
    migrations: {
      // These migrations are run in 7.13.1 for `by value` panels because the 7.13 release window was missed.
      '7.13.1': state => (0, _lodash.flow)(byValueAddSupportOfDualIndexSelectionModeInTSVB, byValueHideTSVBLastValueIndicator, byValueRemoveDefaultIndexPatternAndTimeFieldFromTSVBModel)(state),
      '7.14.0': state => (0, _lodash.flow)(byValueAddEmptyValueColorRule, byValueMigrateVislibPie, byValueMigrateTagcloud, byValueAddDropLastBucketIntoTSVBModel)(state)
    }
  };
};

exports.visualizeEmbeddableFactory = visualizeEmbeddableFactory;