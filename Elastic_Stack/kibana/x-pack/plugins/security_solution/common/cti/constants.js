"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REFERENCE = exports.PROVIDER = exports.MATCHED_TYPE = exports.MATCHED_ID = exports.MATCHED_FIELD = exports.MATCHED_ATOMIC = exports.LAST_SEEN = exports.INDICATOR_REFERENCE = exports.INDICATOR_PROVIDER = exports.INDICATOR_MATCH_SUBFIELDS = exports.INDICATOR_MATCHED_TYPE = exports.INDICATOR_MATCHED_FIELD = exports.INDICATOR_MATCHED_ATOMIC = exports.INDICATOR_LASTSEEN = exports.INDICATOR_FIRSTSEEN = exports.FIRST_SEEN = exports.EVENT_ENRICHMENT_INDICATOR_FIELD_MAP = exports.EVENT_DATASET = exports.ENRICHMENT_TYPES = exports.DEFAULT_EVENT_ENRICHMENT_TO = exports.DEFAULT_EVENT_ENRICHMENT_FROM = exports.CTI_ROW_RENDERER_FIELDS = exports.CTI_DATASET_KEY_MAP = void 0;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MATCHED_ATOMIC = 'matched.atomic';
exports.MATCHED_ATOMIC = MATCHED_ATOMIC;
const MATCHED_FIELD = 'matched.field';
exports.MATCHED_FIELD = MATCHED_FIELD;
const MATCHED_ID = 'matched.id';
exports.MATCHED_ID = MATCHED_ID;
const MATCHED_TYPE = 'matched.type';
exports.MATCHED_TYPE = MATCHED_TYPE;
const INDICATOR_MATCH_SUBFIELDS = [MATCHED_ATOMIC, MATCHED_FIELD, MATCHED_TYPE];
exports.INDICATOR_MATCH_SUBFIELDS = INDICATOR_MATCH_SUBFIELDS;
const INDICATOR_MATCHED_ATOMIC = `${_constants.ENRICHMENT_DESTINATION_PATH}.${MATCHED_ATOMIC}`;
exports.INDICATOR_MATCHED_ATOMIC = INDICATOR_MATCHED_ATOMIC;
const INDICATOR_MATCHED_FIELD = `${_constants.ENRICHMENT_DESTINATION_PATH}.${MATCHED_FIELD}`;
exports.INDICATOR_MATCHED_FIELD = INDICATOR_MATCHED_FIELD;
const INDICATOR_MATCHED_TYPE = `${_constants.ENRICHMENT_DESTINATION_PATH}.${MATCHED_TYPE}`;
exports.INDICATOR_MATCHED_TYPE = INDICATOR_MATCHED_TYPE;
const EVENT_DATASET = 'event.dataset';
exports.EVENT_DATASET = EVENT_DATASET;
const FIRST_SEEN = 'indicator.first_seen';
exports.FIRST_SEEN = FIRST_SEEN;
const LAST_SEEN = 'indicator.last_seen';
exports.LAST_SEEN = LAST_SEEN;
const PROVIDER = 'indicator.provider';
exports.PROVIDER = PROVIDER;
const REFERENCE = 'indicator.reference';
exports.REFERENCE = REFERENCE;
const INDICATOR_FIRSTSEEN = `${_constants.ENRICHMENT_DESTINATION_PATH}.${FIRST_SEEN}`;
exports.INDICATOR_FIRSTSEEN = INDICATOR_FIRSTSEEN;
const INDICATOR_LASTSEEN = `${_constants.ENRICHMENT_DESTINATION_PATH}.${LAST_SEEN}`;
exports.INDICATOR_LASTSEEN = INDICATOR_LASTSEEN;
const INDICATOR_PROVIDER = `${_constants.ENRICHMENT_DESTINATION_PATH}.${PROVIDER}`;
exports.INDICATOR_PROVIDER = INDICATOR_PROVIDER;
const INDICATOR_REFERENCE = `${_constants.ENRICHMENT_DESTINATION_PATH}.${REFERENCE}`;
exports.INDICATOR_REFERENCE = INDICATOR_REFERENCE;
const CTI_ROW_RENDERER_FIELDS = [INDICATOR_MATCHED_ATOMIC, INDICATOR_MATCHED_FIELD, INDICATOR_MATCHED_TYPE, INDICATOR_REFERENCE, INDICATOR_PROVIDER];
exports.CTI_ROW_RENDERER_FIELDS = CTI_ROW_RENDERER_FIELDS;
let ENRICHMENT_TYPES;
exports.ENRICHMENT_TYPES = ENRICHMENT_TYPES;

(function (ENRICHMENT_TYPES) {
  ENRICHMENT_TYPES["InvestigationTime"] = "investigation_time";
  ENRICHMENT_TYPES["IndicatorMatchRule"] = "indicator_match_rule";
})(ENRICHMENT_TYPES || (exports.ENRICHMENT_TYPES = ENRICHMENT_TYPES = {}));

const EVENT_ENRICHMENT_INDICATOR_FIELD_MAP = {
  'file.hash.md5': 'threatintel.indicator.file.hash.md5',
  'file.hash.sha1': 'threatintel.indicator.file.hash.sha1',
  'file.hash.sha256': 'threatintel.indicator.file.hash.sha256',
  'file.pe.imphash': 'threatintel.indicator.file.pe.imphash',
  'file.elf.telfhash': 'threatintel.indicator.file.elf.telfhash',
  'file.hash.ssdeep': 'threatintel.indicator.file.hash.ssdeep',
  'source.ip': 'threatintel.indicator.ip',
  'destination.ip': 'threatintel.indicator.ip',
  'url.full': 'threatintel.indicator.url.full',
  'registry.path': 'threatintel.indicator.registry.path'
};
exports.EVENT_ENRICHMENT_INDICATOR_FIELD_MAP = EVENT_ENRICHMENT_INDICATOR_FIELD_MAP;
const DEFAULT_EVENT_ENRICHMENT_FROM = 'now-30d';
exports.DEFAULT_EVENT_ENRICHMENT_FROM = DEFAULT_EVENT_ENRICHMENT_FROM;
const DEFAULT_EVENT_ENRICHMENT_TO = 'now';
exports.DEFAULT_EVENT_ENRICHMENT_TO = DEFAULT_EVENT_ENRICHMENT_TO;
const CTI_DATASET_KEY_MAP = {
  'Abuse URL': 'threatintel.abuseurl',
  'Abuse Malware': 'threatintel.abusemalware',
  'AlienVault OTX': 'threatintel.otx',
  Anomali: 'threatintel.anomali',
  'Malware Bazaar': 'threatintel.malwarebazaar',
  MISP: 'threatintel.misp',
  'Recorded Future': 'threatintel.recordedfuture'
};
exports.CTI_DATASET_KEY_MAP = CTI_DATASET_KEY_MAP;