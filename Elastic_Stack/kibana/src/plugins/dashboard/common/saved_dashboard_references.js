"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractReferences = extractReferences;
exports.injectReferences = injectReferences;

var _gt = _interopRequireDefault(require("semver/functions/gt"));

var _embeddable_saved_object_converters = require("./embeddable/embeddable_saved_object_converters");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isPre730Panel = panel => {
  return 'version' in panel ? (0, _gt.default)('7.3.0', panel.version) : true;
};

function dashboardAttributesToState(attributes) {
  let inputPanels = [];

  if (typeof attributes.panelsJSON === 'string') {
    inputPanels = JSON.parse(attributes.panelsJSON);
  }

  return {
    panels: inputPanels,
    state: {
      id: attributes.id,
      type: 'dashboard',
      panels: inputPanels.reduce((current, panel, index) => {
        const panelIndex = panel.panelIndex || `${index}`;
        current[panelIndex] = (0, _embeddable_saved_object_converters.convertSavedDashboardPanelToPanelState)(panel);
        return current;
      }, {})
    }
  };
}

function panelStatesToPanels(panelStates, originalPanels) {
  return Object.entries(panelStates).map(([id, panelState]) => {
    var _originalPanel;

    // Find matching original panel to get the version
    let originalPanel = originalPanels.find(p => p.panelIndex === id);

    if (!originalPanel) {
      // Maybe original panel doesn't have a panel index and it's just straight up based on it's index
      const numericId = parseInt(id, 10);
      originalPanel = isNaN(numericId) ? originalPanel : originalPanels[numericId];
    }

    return (0, _embeddable_saved_object_converters.convertPanelStateToSavedDashboardPanel)(panelState, (_originalPanel = originalPanel) !== null && _originalPanel !== void 0 && _originalPanel.version ? originalPanel.version : '');
  });
}

function extractReferences({
  attributes,
  references = []
}, deps) {
  if (typeof attributes.panelsJSON !== 'string') {
    return {
      attributes,
      references
    };
  }

  const {
    panels,
    state
  } = dashboardAttributesToState(attributes);

  if (!Array.isArray(panels)) {
    return {
      attributes,
      references
    };
  }

  if (panels.some(isPre730Panel)) {
    return pre730ExtractReferences({
      attributes,
      references
    }, deps);
  }

  const missingTypeIndex = panels.findIndex(panel => panel.type === undefined);

  if (missingTypeIndex >= 0) {
    throw new Error(`"type" attribute is missing from panel "${missingTypeIndex}"`);
  }

  const {
    state: extractedState,
    references: extractedReferences
  } = deps.embeddablePersistableStateService.extract(state);
  const extractedPanels = panelStatesToPanels(extractedState.panels, panels);
  return {
    references: [...references, ...extractedReferences],
    attributes: { ...attributes,
      panelsJSON: JSON.stringify(extractedPanels)
    }
  };
}

function injectReferences({
  attributes,
  references = []
}, deps) {
  // Skip if panelsJSON is missing otherwise this will cause saved object import to fail when
  // importing objects without panelsJSON. At development time of this, there is no guarantee each saved
  // object has panelsJSON in all previous versions of kibana.
  if (typeof attributes.panelsJSON !== 'string') {
    return attributes;
  }

  const parsedPanels = JSON.parse(attributes.panelsJSON); // Same here, prevent failing saved object import if ever panels aren't an array.

  if (!Array.isArray(parsedPanels)) {
    return attributes;
  }

  const {
    panels,
    state
  } = dashboardAttributesToState(attributes);
  const injectedState = deps.embeddablePersistableStateService.inject(state, references);
  const injectedPanels = panelStatesToPanels(injectedState.panels, panels);
  return { ...attributes,
    panelsJSON: JSON.stringify(injectedPanels)
  };
}

function pre730ExtractReferences({
  attributes,
  references = []
}, deps) {
  if (typeof attributes.panelsJSON !== 'string') {
    return {
      attributes,
      references
    };
  }

  const panelReferences = [];
  const panels = JSON.parse(String(attributes.panelsJSON));
  panels.forEach((panel, i) => {
    if (!panel.type) {
      throw new Error(`"type" attribute is missing from panel "${i}"`);
    }

    if (!panel.id) {
      // Embeddables are not required to be backed off a saved object.
      return;
    }

    panel.panelRefName = `panel_${i}`;
    panelReferences.push({
      name: `panel_${i}`,
      type: panel.type,
      id: panel.id
    });
    delete panel.type;
    delete panel.id;
  });
  return {
    references: [...references, ...panelReferences],
    attributes: { ...attributes,
      panelsJSON: JSON.stringify(panels)
    }
  };
}