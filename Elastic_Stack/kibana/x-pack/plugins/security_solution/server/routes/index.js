"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRoutes = void 0;

var _create_rules_route = require("../lib/detection_engine/routes/rules/create_rules_route");

var _create_index_route = require("../lib/detection_engine/routes/index/create_index_route");

var _read_index_route = require("../lib/detection_engine/routes/index/read_index_route");

var _read_rules_route = require("../lib/detection_engine/routes/rules/read_rules_route");

var _find_rules_route = require("../lib/detection_engine/routes/rules/find_rules_route");

var _delete_rules_route = require("../lib/detection_engine/routes/rules/delete_rules_route");

var _update_rules_route = require("../lib/detection_engine/routes/rules/update_rules_route");

var _patch_rules_route = require("../lib/detection_engine/routes/rules/patch_rules_route");

var _create_signals_migration_route = require("../lib/detection_engine/routes/signals/create_signals_migration_route");

var _delete_signals_migration_route = require("../lib/detection_engine/routes/signals/delete_signals_migration_route");

var _finalize_signals_migration_route = require("../lib/detection_engine/routes/signals/finalize_signals_migration_route");

var _get_signals_migration_status_route = require("../lib/detection_engine/routes/signals/get_signals_migration_status_route");

var _query_signals_route = require("../lib/detection_engine/routes/signals/query_signals_route");

var _open_close_signals_route = require("../lib/detection_engine/routes/signals/open_close_signals_route");

var _delete_index_route = require("../lib/detection_engine/routes/index/delete_index_route");

var _read_tags_route = require("../lib/detection_engine/routes/tags/read_tags_route");

var _read_privileges_route = require("../lib/detection_engine/routes/privileges/read_privileges_route");

var _add_prepackaged_rules_route = require("../lib/detection_engine/routes/rules/add_prepackaged_rules_route");

var _create_rules_bulk_route = require("../lib/detection_engine/routes/rules/create_rules_bulk_route");

var _update_rules_bulk_route = require("../lib/detection_engine/routes/rules/update_rules_bulk_route");

var _patch_rules_bulk_route = require("../lib/detection_engine/routes/rules/patch_rules_bulk_route");

var _delete_rules_bulk_route = require("../lib/detection_engine/routes/rules/delete_rules_bulk_route");

var _perform_bulk_action_route = require("../lib/detection_engine/routes/rules/perform_bulk_action_route");

var _import_rules_route = require("../lib/detection_engine/routes/rules/import_rules_route");

var _export_rules_route = require("../lib/detection_engine/routes/rules/export_rules_route");

var _find_rules_status_route = require("../lib/detection_engine/routes/rules/find_rules_status_route");

var _get_prepackaged_rules_status_route = require("../lib/detection_engine/routes/rules/get_prepackaged_rules_status_route");

var _timelines = require("../lib/timeline/routes/timelines");

var _get_draft_timelines = require("../lib/timeline/routes/draft_timelines/get_draft_timelines");

var _clean_draft_timelines = require("../lib/timeline/routes/draft_timelines/clean_draft_timelines");

var _notes = require("../lib/timeline/routes/notes");

var _pinned_events = require("../lib/timeline/routes/pinned_events");

var _install_prepackaged_timelines = require("../lib/timeline/routes/prepackaged_timelines/install_prepackaged_timelines");

var _legacy_create_legacy_notification = require("../lib/detection_engine/routes/rules/legacy_create_legacy_notification");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line no-restricted-imports


const initRoutes = (router, config, hasEncryptionKey, security, telemetrySender, ml, logger, isRuleRegistryEnabled) => {
  // Detection Engine Rule routes that have the REST endpoints of /api/detection_engine/rules
  // All REST rule creation, deletion, updating, etc......
  (0, _create_rules_route.createRulesRoute)(router, ml, isRuleRegistryEnabled);
  (0, _read_rules_route.readRulesRoute)(router, logger, isRuleRegistryEnabled);
  (0, _update_rules_route.updateRulesRoute)(router, ml, isRuleRegistryEnabled);
  (0, _patch_rules_route.patchRulesRoute)(router, ml, isRuleRegistryEnabled);
  (0, _delete_rules_route.deleteRulesRoute)(router, isRuleRegistryEnabled);
  (0, _find_rules_route.findRulesRoute)(router, logger, isRuleRegistryEnabled); // Once we no longer have the legacy notifications system/"side car actions" this should be removed.

  (0, _legacy_create_legacy_notification.legacyCreateLegacyNotificationRoute)(router, logger); // TODO: pass isRuleRegistryEnabled to all relevant routes

  (0, _add_prepackaged_rules_route.addPrepackedRulesRoute)(router);
  (0, _get_prepackaged_rules_status_route.getPrepackagedRulesStatusRoute)(router, config, security, isRuleRegistryEnabled);
  (0, _create_rules_bulk_route.createRulesBulkRoute)(router, ml, isRuleRegistryEnabled);
  (0, _update_rules_bulk_route.updateRulesBulkRoute)(router, ml, isRuleRegistryEnabled);
  (0, _patch_rules_bulk_route.patchRulesBulkRoute)(router, ml, isRuleRegistryEnabled);
  (0, _delete_rules_bulk_route.deleteRulesBulkRoute)(router, isRuleRegistryEnabled);
  (0, _perform_bulk_action_route.performBulkActionRoute)(router, ml, logger, isRuleRegistryEnabled);
  (0, _timelines.createTimelinesRoute)(router, config, security);
  (0, _timelines.patchTimelinesRoute)(router, config, security);
  (0, _import_rules_route.importRulesRoute)(router, config, ml, isRuleRegistryEnabled);
  (0, _export_rules_route.exportRulesRoute)(router, config, logger, isRuleRegistryEnabled);
  (0, _timelines.importTimelinesRoute)(router, config, security);
  (0, _timelines.exportTimelinesRoute)(router, config, security);
  (0, _get_draft_timelines.getDraftTimelinesRoute)(router, config, security);
  (0, _timelines.getTimelineRoute)(router, config, security);
  (0, _timelines.resolveTimelineRoute)(router, config, security);
  (0, _timelines.getTimelinesRoute)(router, config, security);
  (0, _clean_draft_timelines.cleanDraftTimelinesRoute)(router, config, security);
  (0, _timelines.deleteTimelinesRoute)(router, config, security);
  (0, _timelines.persistFavoriteRoute)(router, config, security);
  (0, _install_prepackaged_timelines.installPrepackedTimelinesRoute)(router, config, security);
  (0, _notes.persistNoteRoute)(router, config, security);
  (0, _pinned_events.persistPinnedEventRoute)(router, config, security);
  (0, _find_rules_status_route.findRulesStatusesRoute)(router); // Detection Engine Signals routes that have the REST endpoints of /api/detection_engine/signals
  // POST /api/detection_engine/signals/status
  // Example usage can be found in security_solution/server/lib/detection_engine/scripts/signals

  (0, _open_close_signals_route.setSignalsStatusRoute)(router, logger, security, telemetrySender);
  (0, _query_signals_route.querySignalsRoute)(router, config);
  (0, _get_signals_migration_status_route.getSignalsMigrationStatusRoute)(router);
  (0, _create_signals_migration_route.createSignalsMigrationRoute)(router, security);
  (0, _finalize_signals_migration_route.finalizeSignalsMigrationRoute)(router, security);
  (0, _delete_signals_migration_route.deleteSignalsMigrationRoute)(router, security); // Detection Engine index routes that have the REST endpoints of /api/detection_engine/index
  // All REST index creation, policy management for spaces

  (0, _create_index_route.createIndexRoute)(router);
  (0, _read_index_route.readIndexRoute)(router, config);
  (0, _delete_index_route.deleteIndexRoute)(router); // Detection Engine tags routes that have the REST endpoints of /api/detection_engine/tags

  (0, _read_tags_route.readTagsRoute)(router, isRuleRegistryEnabled); // Privileges API to get the generic user privileges

  (0, _read_privileges_route.readPrivilegesRoute)(router, hasEncryptionKey);
};

exports.initRoutes = initRoutes;