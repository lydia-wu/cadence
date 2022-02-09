"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solutionNames = exports.projects = exports.projectIDs = exports.isProjectEnabledByStatus = exports.getProjectIDs = exports.environmentNames = exports.LABS_PROJECT_PREFIX = exports.DEFER_BELOW_FOLD = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const LABS_PROJECT_PREFIX = 'labs:';
exports.LABS_PROJECT_PREFIX = LABS_PROJECT_PREFIX;
const DEFER_BELOW_FOLD = `${LABS_PROJECT_PREFIX}dashboard:deferBelowFold`;
exports.DEFER_BELOW_FOLD = DEFER_BELOW_FOLD;
const projectIDs = [DEFER_BELOW_FOLD];
exports.projectIDs = projectIDs;
const environmentNames = ['kibana', 'browser', 'session'];
exports.environmentNames = environmentNames;
const solutionNames = ['canvas', 'dashboard', 'presentation'];
/**
 * This is a list of active Labs Projects for the Presentation Team.  It is the "source of truth" for all projects
 * provided to users of our solutions in Kibana.
 */

exports.solutionNames = solutionNames;
const projects = {
  [DEFER_BELOW_FOLD]: {
    id: DEFER_BELOW_FOLD,
    isActive: false,
    isDisplayed: true,
    environments: ['kibana', 'browser', 'session'],
    name: _i18n.i18n.translate('presentationUtil.labs.enableDeferBelowFoldProjectName', {
      defaultMessage: 'Defer loading panels below "the fold"'
    }),
    description: _i18n.i18n.translate('presentationUtil.labs.enableDeferBelowFoldProjectDescription', {
      defaultMessage: 'Any panels below "the fold"-- the area hidden beyond the bottom of the window, accessed by scrolling-- will not be loaded immediately, but only when they enter the viewport'
    }),
    solutions: ['dashboard']
  }
};
exports.projects = projects;

const getProjectIDs = () => projectIDs;

exports.getProjectIDs = getProjectIDs;

const isProjectEnabledByStatus = (active, status) => {
  // If the project is enabled by default, then any false flag will flip the switch, and vice-versa.
  return active ? Object.values(status).every(value => value === true) : Object.values(status).some(value => value === true);
};

exports.isProjectEnabledByStatus = isProjectEnabledByStatus;