"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IP_REPUTATION_LINKS_SETTING = exports.INTERNAL_RULE_ID_KEY = exports.INTERNAL_RULE_ALERT_ID_KEY = exports.INTERNAL_IMMUTABLE_KEY = exports.INTERNAL_IDENTIFIER = exports.INDICATOR_RULE_TYPE_ID = exports.HOST_ISOLATION_EXCEPTIONS_PATH = exports.HOSTS_PATH = exports.GLOBAL_HEADER_HEIGHT_WITH_GLOBAL_BANNER = exports.GLOBAL_HEADER_HEIGHT = exports.FULL_SCREEN_TOGGLED_CLASS_NAME = exports.FILTERS_GLOBAL_HEIGHT = exports.EXCEPTIONS_PATH = exports.EVENT_FILTERS_PATH = exports.EQL_RULE_TYPE_ID = exports.ENRICHMENT_DESTINATION_PATH = exports.ENDPOINT_METADATA_INDEX = exports.ENDPOINTS_PATH = exports.ENABLE_NEWS_FEED_SETTING = exports.ELASTIC_NAME = exports.DETECTION_ENGINE_URL = exports.DETECTION_ENGINE_TAGS_URL = exports.DETECTION_ENGINE_SIGNALS_URL = exports.DETECTION_ENGINE_SIGNALS_STATUS_URL = exports.DETECTION_ENGINE_SIGNALS_MIGRATION_URL = exports.DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL = exports.DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL = exports.DETECTION_ENGINE_RULES_URL = exports.DETECTION_ENGINE_RULES_STATUS_URL = exports.DETECTION_ENGINE_RULES_BULK_ACTION = exports.DETECTION_ENGINE_QUERY_SIGNALS_URL = exports.DETECTION_ENGINE_PRIVILEGES_URL = exports.DETECTION_ENGINE_PREPACKAGED_URL = exports.DETECTION_ENGINE_PREPACKAGED_RULES_STATUS_URL = exports.DETECTION_ENGINE_INDEX_URL = exports.DETECTIONS_PATH = exports.DEFAULT_TRANSFORMS_SETTING = exports.DEFAULT_TRANSFORMS = exports.DEFAULT_TO = exports.DEFAULT_TIME_RANGE = exports.DEFAULT_TIMEPICKER_QUICK_RANGES = exports.DEFAULT_THREAT_MATCH_QUERY = exports.DEFAULT_THREAT_INDEX_VALUE = exports.DEFAULT_THREAT_INDEX_KEY = exports.DEFAULT_SPACE_ID = exports.DEFAULT_SIGNALS_INDEX = exports.DEFAULT_SEARCH_AFTER_PAGE_SIZE = exports.DEFAULT_SCALE_DATE_FORMAT = exports.DEFAULT_RULE_REFRESH_INTERVAL_VALUE = exports.DEFAULT_RULE_REFRESH_INTERVAL_ON = exports.DEFAULT_RULE_REFRESH_IDLE_VALUE = exports.DEFAULT_RULE_NOTIFICATION_QUERY_SIZE = exports.DEFAULT_RULES_TABLE_REFRESH_SETTING = exports.DEFAULT_REFRESH_RATE_INTERVAL = exports.DEFAULT_NUMBER_FORMAT = exports.DEFAULT_MAX_TABLE_QUERY_SIZE = exports.DEFAULT_MAX_SIGNALS = exports.DEFAULT_LISTS_INDEX = exports.DEFAULT_ITEMS_INDEX = exports.DEFAULT_INTERVAL_VALUE = exports.DEFAULT_INTERVAL_TYPE = exports.DEFAULT_INTERVAL_PAUSE = exports.DEFAULT_INDICATOR_SOURCE_PATH = exports.DEFAULT_INDEX_PATTERN_EXPERIMENTAL = exports.DEFAULT_INDEX_PATTERN = exports.DEFAULT_INDEX_KEY = exports.DEFAULT_FROM = exports.DEFAULT_DATE_FORMAT_TZ = exports.DEFAULT_DATE_FORMAT = exports.DEFAULT_DARK_MODE = exports.DEFAULT_BYTES_FORMAT = exports.DEFAULT_APP_TIME_RANGE = exports.DEFAULT_APP_REFRESH_INTERVAL = exports.DEFAULT_ANOMALY_SCORE = exports.DEFAULT_ALERTS_INDEX = exports.CASES_PATH = exports.CASES_FEATURE_ID = exports.APP_UEBA_PATH = exports.APP_TRUSTED_APPS_PATH = exports.APP_TIMELINES_PATH = exports.APP_RULES_PATH = exports.APP_PATH = exports.APP_OVERVIEW_PATH = exports.APP_NETWORK_PATH = exports.APP_NAME = exports.APP_MANAGEMENT_PATH = exports.APP_ID = exports.APP_ICON_SOLUTION = exports.APP_ICON = exports.APP_HOST_ISOLATION_EXCEPTIONS_PATH = exports.APP_HOSTS_PATH = exports.APP_EXCEPTIONS_PATH = exports.APP_EVENT_FILTERS_PATH = exports.APP_ENDPOINTS_PATH = exports.APP_CASES_PATH = exports.APP_ALERTS_PATH = exports.ALERTS_PATH = exports.ALERTS_AS_DATA_URL = exports.ALERTS_AS_DATA_FIND_URL = exports.ADD_DATA_PATH = void 0;
exports.showAllOthersBucket = exports.defaultTransformsSetting = exports.WARNING_TRANSFORM_STATES = exports.UPDATE_OR_CREATE_LEGACY_ACTIONS = exports.UNAUTHENTICATED_USER = exports.UEBA_PATH = exports.TRUSTED_APPS_PATH = exports.TRANSFORM_STATES = exports.TIMELINE_URL = exports.TIMELINE_RESOLVE_URL = exports.TIMELINE_PREPACKAGED_URL = exports.TIMELINE_IMPORT_URL = exports.TIMELINE_FAVORITE_URL = exports.TIMELINE_EXPORT_URL = exports.TIMELINE_DRAFT_URL = exports.TIMELINES_URL = exports.TIMELINES_PATH = exports.THRESHOLD_RULE_TYPE_ID = exports.SecurityPageName = exports.SIGNALS_INDEX_KEY = exports.SIGNALS_ID = exports.SERVER_APP_ID = exports.SECURITY_FEATURE_ID = exports.SCROLLING_DISABLED_CLASS_NAME = exports.RULES_PATH = exports.RISKY_HOSTS_INDEX_PREFIX = exports.QUERY_RULE_TYPE_ID = exports.PINNED_EVENT_URL = exports.OVERVIEW_PATH = exports.NO_ALERT_INDEX = exports.NOTIFICATION_THROTTLE_RULE = exports.NOTIFICATION_THROTTLE_NO_ACTIONS = exports.NOTIFICATION_SUPPORTED_ACTION_TYPES_IDS = exports.NOTE_URL = exports.NEWS_FEED_URL_SETTING_DEFAULT = exports.NEWS_FEED_URL_SETTING = exports.NETWORK_PATH = exports.ML_RULE_TYPE_ID = exports.ML_GROUP_IDS = exports.ML_GROUP_ID = exports.MINIMUM_ML_LICENSE = exports.METADATA_TRANSFORM_STATS_URL = exports.MANAGEMENT_PATH = exports.LEGACY_NOTIFICATIONS_ID = exports.LEGACY_ML_GROUP_ID = exports.IP_REPUTATION_LINKS_SETTING_DEFAULT = exports.IP_REPUTATION_LINKS_SETTING = exports.INTERNAL_RULE_ID_KEY = exports.INTERNAL_RULE_ALERT_ID_KEY = exports.INTERNAL_IMMUTABLE_KEY = exports.INTERNAL_IDENTIFIER = exports.INDICATOR_RULE_TYPE_ID = exports.HOST_ISOLATION_EXCEPTIONS_PATH = exports.HOSTS_PATH = exports.GLOBAL_HEADER_HEIGHT_WITH_GLOBAL_BANNER = exports.GLOBAL_HEADER_HEIGHT = exports.FULL_SCREEN_TOGGLED_CLASS_NAME = exports.FILTERS_GLOBAL_HEIGHT = exports.EXCEPTIONS_PATH = exports.EVENT_FILTERS_PATH = exports.EQL_RULE_TYPE_ID = exports.ENRICHMENT_DESTINATION_PATH = exports.ENDPOINT_METADATA_INDEX = exports.ENDPOINTS_PATH = exports.ENABLE_NEWS_FEED_SETTING = exports.ELASTIC_NAME = exports.DETECTION_ENGINE_URL = exports.DETECTION_ENGINE_TAGS_URL = exports.DETECTION_ENGINE_SIGNALS_URL = exports.DETECTION_ENGINE_SIGNALS_STATUS_URL = exports.DETECTION_ENGINE_SIGNALS_MIGRATION_URL = exports.DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL = exports.DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL = exports.DETECTION_ENGINE_RULES_URL = exports.DETECTION_ENGINE_RULES_STATUS_URL = exports.DETECTION_ENGINE_RULES_BULK_ACTION = exports.DETECTION_ENGINE_QUERY_SIGNALS_URL = exports.DETECTION_ENGINE_PRIVILEGES_URL = exports.DETECTION_ENGINE_PREPACKAGED_URL = exports.DETECTION_ENGINE_PREPACKAGED_RULES_STATUS_URL = exports.DETECTION_ENGINE_INDEX_URL = exports.DETECTIONS_PATH = exports.DEFAULT_TRANSFORMS_SETTING = exports.DEFAULT_TRANSFORMS = exports.DEFAULT_TO = exports.DEFAULT_TIME_RANGE = exports.DEFAULT_TIMEPICKER_QUICK_RANGES = exports.DEFAULT_THREAT_MATCH_QUERY = exports.DEFAULT_THREAT_INDEX_VALUE = exports.DEFAULT_THREAT_INDEX_KEY = exports.DEFAULT_SPACE_ID = exports.DEFAULT_SIGNALS_INDEX = exports.DEFAULT_SEARCH_AFTER_PAGE_SIZE = exports.DEFAULT_SCALE_DATE_FORMAT = exports.DEFAULT_RULE_REFRESH_INTERVAL_VALUE = exports.DEFAULT_RULE_REFRESH_INTERVAL_ON = exports.DEFAULT_RULE_REFRESH_IDLE_VALUE = exports.DEFAULT_RULE_NOTIFICATION_QUERY_SIZE = exports.DEFAULT_RULES_TABLE_REFRESH_SETTING = exports.DEFAULT_REFRESH_RATE_INTERVAL = exports.DEFAULT_NUMBER_FORMAT = exports.DEFAULT_MAX_TABLE_QUERY_SIZE = exports.DEFAULT_MAX_SIGNALS = exports.DEFAULT_LISTS_INDEX = exports.DEFAULT_ITEMS_INDEX = exports.DEFAULT_INTERVAL_VALUE = exports.DEFAULT_INTERVAL_TYPE = exports.DEFAULT_INTERVAL_PAUSE = exports.DEFAULT_INDICATOR_SOURCE_PATH = exports.DEFAULT_INDEX_PATTERN_EXPERIMENTAL = exports.DEFAULT_INDEX_PATTERN = exports.DEFAULT_INDEX_KEY = exports.DEFAULT_FROM = exports.DEFAULT_DATE_FORMAT_TZ = exports.DEFAULT_DATE_FORMAT = exports.DEFAULT_DARK_MODE = exports.DEFAULT_BYTES_FORMAT = exports.DEFAULT_APP_TIME_RANGE = exports.DEFAULT_APP_REFRESH_INTERVAL = exports.DEFAULT_ANOMALY_SCORE = exports.DEFAULT_ALERTS_INDEX = exports.CASES_PATH = exports.CASES_FEATURE_ID = exports.APP_UEBA_PATH = exports.APP_TRUSTED_APPS_PATH = exports.APP_TIMELINES_PATH = exports.APP_RULES_PATH = exports.APP_PATH = exports.APP_OVERVIEW_PATH = exports.APP_NETWORK_PATH = exports.APP_NAME = exports.APP_MANAGEMENT_PATH = exports.APP_ID = exports.APP_ICON_SOLUTION = exports.APP_ICON = exports.APP_HOST_ISOLATION_EXCEPTIONS_PATH = exports.APP_HOSTS_PATH = exports.APP_EXCEPTIONS_PATH = exports.APP_EVENT_FILTERS_PATH = exports.APP_ENDPOINTS_PATH = exports.APP_CASES_PATH = exports.APP_ALERTS_PATH = exports.ALERTS_PATH = exports.ALERTS_AS_DATA_URL = exports.ALERTS_AS_DATA_FIND_URL = exports.ADD_DATA_PATH = void 0;

var _common = require("../../cases/common");

var _constants = require("./endpoint/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const APP_ID = 'securitySolution';
exports.APP_ID = APP_ID;
const CASES_FEATURE_ID = 'securitySolutionCases';
exports.CASES_FEATURE_ID = CASES_FEATURE_ID;
const SERVER_APP_ID = 'siem';
exports.SERVER_APP_ID = SERVER_APP_ID;
const APP_NAME = 'Security';
exports.APP_NAME = APP_NAME;
const APP_ICON = 'securityAnalyticsApp';
exports.APP_ICON = APP_ICON;
const APP_ICON_SOLUTION = 'logoSecurity';
exports.APP_ICON_SOLUTION = APP_ICON_SOLUTION;
const APP_PATH = `/app/security`;
exports.APP_PATH = APP_PATH;
const ADD_DATA_PATH = `/app/integrations/browse/security`;
exports.ADD_DATA_PATH = ADD_DATA_PATH;
const DEFAULT_BYTES_FORMAT = 'format:bytes:defaultPattern';
exports.DEFAULT_BYTES_FORMAT = DEFAULT_BYTES_FORMAT;
const DEFAULT_DATE_FORMAT = 'dateFormat';
exports.DEFAULT_DATE_FORMAT = DEFAULT_DATE_FORMAT;
const DEFAULT_DATE_FORMAT_TZ = 'dateFormat:tz';
exports.DEFAULT_DATE_FORMAT_TZ = DEFAULT_DATE_FORMAT_TZ;
const DEFAULT_DARK_MODE = 'theme:darkMode';
exports.DEFAULT_DARK_MODE = DEFAULT_DARK_MODE;
const DEFAULT_INDEX_KEY = 'securitySolution:defaultIndex';
exports.DEFAULT_INDEX_KEY = DEFAULT_INDEX_KEY;
const DEFAULT_NUMBER_FORMAT = 'format:number:defaultPattern';
exports.DEFAULT_NUMBER_FORMAT = DEFAULT_NUMBER_FORMAT;
const DEFAULT_TIME_RANGE = 'timepicker:timeDefaults';
exports.DEFAULT_TIME_RANGE = DEFAULT_TIME_RANGE;
const DEFAULT_REFRESH_RATE_INTERVAL = 'timepicker:refreshIntervalDefaults';
exports.DEFAULT_REFRESH_RATE_INTERVAL = DEFAULT_REFRESH_RATE_INTERVAL;
const DEFAULT_APP_TIME_RANGE = 'securitySolution:timeDefaults';
exports.DEFAULT_APP_TIME_RANGE = DEFAULT_APP_TIME_RANGE;
const DEFAULT_APP_REFRESH_INTERVAL = 'securitySolution:refreshIntervalDefaults';
exports.DEFAULT_APP_REFRESH_INTERVAL = DEFAULT_APP_REFRESH_INTERVAL;
const DEFAULT_ALERTS_INDEX = '.alerts-security.alerts';
exports.DEFAULT_ALERTS_INDEX = DEFAULT_ALERTS_INDEX;
const DEFAULT_SIGNALS_INDEX = '.siem-signals';
exports.DEFAULT_SIGNALS_INDEX = DEFAULT_SIGNALS_INDEX;
const DEFAULT_LISTS_INDEX = '.lists';
exports.DEFAULT_LISTS_INDEX = DEFAULT_LISTS_INDEX;
const DEFAULT_ITEMS_INDEX = '.items'; // The DEFAULT_MAX_SIGNALS value exists also in `x-pack/plugins/cases/common/constants.ts`
// If either changes, engineer should ensure both values are updated

exports.DEFAULT_ITEMS_INDEX = DEFAULT_ITEMS_INDEX;
const DEFAULT_MAX_SIGNALS = 100;
exports.DEFAULT_MAX_SIGNALS = DEFAULT_MAX_SIGNALS;
const DEFAULT_SEARCH_AFTER_PAGE_SIZE = 100;
exports.DEFAULT_SEARCH_AFTER_PAGE_SIZE = DEFAULT_SEARCH_AFTER_PAGE_SIZE;
const DEFAULT_ANOMALY_SCORE = 'securitySolution:defaultAnomalyScore';
exports.DEFAULT_ANOMALY_SCORE = DEFAULT_ANOMALY_SCORE;
const DEFAULT_MAX_TABLE_QUERY_SIZE = 10000;
exports.DEFAULT_MAX_TABLE_QUERY_SIZE = DEFAULT_MAX_TABLE_QUERY_SIZE;
const DEFAULT_SCALE_DATE_FORMAT = 'dateFormat:scaled';
exports.DEFAULT_SCALE_DATE_FORMAT = DEFAULT_SCALE_DATE_FORMAT;
const DEFAULT_FROM = 'now/d';
exports.DEFAULT_FROM = DEFAULT_FROM;
const DEFAULT_TO = 'now/d';
exports.DEFAULT_TO = DEFAULT_TO;
const DEFAULT_INTERVAL_PAUSE = true;
exports.DEFAULT_INTERVAL_PAUSE = DEFAULT_INTERVAL_PAUSE;
const DEFAULT_INTERVAL_TYPE = 'manual';
exports.DEFAULT_INTERVAL_TYPE = DEFAULT_INTERVAL_TYPE;
const DEFAULT_INTERVAL_VALUE = 300000; // ms

exports.DEFAULT_INTERVAL_VALUE = DEFAULT_INTERVAL_VALUE;
const DEFAULT_TIMEPICKER_QUICK_RANGES = 'timepicker:quickRanges';
exports.DEFAULT_TIMEPICKER_QUICK_RANGES = DEFAULT_TIMEPICKER_QUICK_RANGES;
const DEFAULT_TRANSFORMS = 'securitySolution:transforms';
exports.DEFAULT_TRANSFORMS = DEFAULT_TRANSFORMS;
const SCROLLING_DISABLED_CLASS_NAME = 'scrolling-disabled';
exports.SCROLLING_DISABLED_CLASS_NAME = SCROLLING_DISABLED_CLASS_NAME;
const GLOBAL_HEADER_HEIGHT = 96; // px

exports.GLOBAL_HEADER_HEIGHT = GLOBAL_HEADER_HEIGHT;
const GLOBAL_HEADER_HEIGHT_WITH_GLOBAL_BANNER = 128; // px

exports.GLOBAL_HEADER_HEIGHT_WITH_GLOBAL_BANNER = GLOBAL_HEADER_HEIGHT_WITH_GLOBAL_BANNER;
const FILTERS_GLOBAL_HEIGHT = 109; // px

exports.FILTERS_GLOBAL_HEIGHT = FILTERS_GLOBAL_HEIGHT;
const FULL_SCREEN_TOGGLED_CLASS_NAME = 'fullScreenToggled';
exports.FULL_SCREEN_TOGGLED_CLASS_NAME = FULL_SCREEN_TOGGLED_CLASS_NAME;
const NO_ALERT_INDEX = 'no-alert-index-049FC71A-4C2C-446F-9901-37XMC5024C51';
exports.NO_ALERT_INDEX = NO_ALERT_INDEX;
const ENDPOINT_METADATA_INDEX = 'metrics-endpoint.metadata-*';
exports.ENDPOINT_METADATA_INDEX = ENDPOINT_METADATA_INDEX;
const DEFAULT_RULE_REFRESH_INTERVAL_ON = true;
exports.DEFAULT_RULE_REFRESH_INTERVAL_ON = DEFAULT_RULE_REFRESH_INTERVAL_ON;
const DEFAULT_RULE_REFRESH_INTERVAL_VALUE = 60000; // ms

exports.DEFAULT_RULE_REFRESH_INTERVAL_VALUE = DEFAULT_RULE_REFRESH_INTERVAL_VALUE;
const DEFAULT_RULE_REFRESH_IDLE_VALUE = 2700000; // ms

exports.DEFAULT_RULE_REFRESH_IDLE_VALUE = DEFAULT_RULE_REFRESH_IDLE_VALUE;
const DEFAULT_RULE_NOTIFICATION_QUERY_SIZE = 100;
exports.DEFAULT_RULE_NOTIFICATION_QUERY_SIZE = DEFAULT_RULE_NOTIFICATION_QUERY_SIZE;
const SECURITY_FEATURE_ID = 'Security';
exports.SECURITY_FEATURE_ID = SECURITY_FEATURE_ID;
const DEFAULT_SPACE_ID = 'default'; // Document path where threat indicator fields are expected. Fields are used
// to enrich signals, and are copied to threat.enrichments.

exports.DEFAULT_SPACE_ID = DEFAULT_SPACE_ID;
const DEFAULT_INDICATOR_SOURCE_PATH = 'threatintel.indicator';
exports.DEFAULT_INDICATOR_SOURCE_PATH = DEFAULT_INDICATOR_SOURCE_PATH;
const ENRICHMENT_DESTINATION_PATH = 'threat.enrichments';
exports.ENRICHMENT_DESTINATION_PATH = ENRICHMENT_DESTINATION_PATH;
const DEFAULT_THREAT_INDEX_KEY = 'securitySolution:defaultThreatIndex';
exports.DEFAULT_THREAT_INDEX_KEY = DEFAULT_THREAT_INDEX_KEY;
const DEFAULT_THREAT_INDEX_VALUE = ['filebeat-*'];
exports.DEFAULT_THREAT_INDEX_VALUE = DEFAULT_THREAT_INDEX_VALUE;
const DEFAULT_THREAT_MATCH_QUERY = '@timestamp >= "now-30d"';
exports.DEFAULT_THREAT_MATCH_QUERY = DEFAULT_THREAT_MATCH_QUERY;
let SecurityPageName;
exports.SecurityPageName = SecurityPageName;

(function (SecurityPageName) {
  SecurityPageName["administration"] = "administration";
  SecurityPageName["alerts"] = "alerts";
  SecurityPageName["authentications"] = "authentications";
  SecurityPageName["case"] = "case";
  SecurityPageName["caseConfigure"] = "case-configure";
  SecurityPageName["caseCreate"] = "case-create";
  SecurityPageName["detections"] = "detections";
  SecurityPageName["endpoints"] = "endpoints";
  SecurityPageName["eventFilters"] = "event_filters";
  SecurityPageName["hostIsolationExceptions"] = "host_isolation_exceptions";
  SecurityPageName["events"] = "events";
  SecurityPageName["exceptions"] = "exceptions";
  SecurityPageName["explore"] = "explore";
  SecurityPageName["hosts"] = "hosts";
  SecurityPageName["hostsAnomalies"] = "hosts-anomalies";
  SecurityPageName["hostsExternalAlerts"] = "hosts-external_alerts";
  SecurityPageName["investigate"] = "investigate";
  SecurityPageName["network"] = "network";
  SecurityPageName["networkAnomalies"] = "network-anomalies";
  SecurityPageName["networkDns"] = "network-dns";
  SecurityPageName["networkExternalAlerts"] = "network-external_alerts";
  SecurityPageName["networkHttp"] = "network-http";
  SecurityPageName["networkTls"] = "network-tls";
  SecurityPageName["timelines"] = "timelines";
  SecurityPageName["timelinesTemplates"] = "timelines-templates";
  SecurityPageName["overview"] = "overview";
  SecurityPageName["policies"] = "policies";
  SecurityPageName["rules"] = "rules";
  SecurityPageName["trustedApps"] = "trusted_apps";
  SecurityPageName["ueba"] = "ueba";
  SecurityPageName["uncommonProcesses"] = "uncommon_processes";
})(SecurityPageName || (exports.SecurityPageName = SecurityPageName = {}));

const TIMELINES_PATH = '/timelines';
exports.TIMELINES_PATH = TIMELINES_PATH;
const CASES_PATH = '/cases';
exports.CASES_PATH = CASES_PATH;
const OVERVIEW_PATH = '/overview';
exports.OVERVIEW_PATH = OVERVIEW_PATH;
const DETECTIONS_PATH = '/detections';
exports.DETECTIONS_PATH = DETECTIONS_PATH;
const ALERTS_PATH = '/alerts';
exports.ALERTS_PATH = ALERTS_PATH;
const RULES_PATH = '/rules';
exports.RULES_PATH = RULES_PATH;
const EXCEPTIONS_PATH = '/exceptions';
exports.EXCEPTIONS_PATH = EXCEPTIONS_PATH;
const HOSTS_PATH = '/hosts';
exports.HOSTS_PATH = HOSTS_PATH;
const UEBA_PATH = '/ueba';
exports.UEBA_PATH = UEBA_PATH;
const NETWORK_PATH = '/network';
exports.NETWORK_PATH = NETWORK_PATH;
const MANAGEMENT_PATH = '/administration';
exports.MANAGEMENT_PATH = MANAGEMENT_PATH;
const ENDPOINTS_PATH = `${MANAGEMENT_PATH}/endpoints`;
exports.ENDPOINTS_PATH = ENDPOINTS_PATH;
const TRUSTED_APPS_PATH = `${MANAGEMENT_PATH}/trusted_apps`;
exports.TRUSTED_APPS_PATH = TRUSTED_APPS_PATH;
const EVENT_FILTERS_PATH = `${MANAGEMENT_PATH}/event_filters`;
exports.EVENT_FILTERS_PATH = EVENT_FILTERS_PATH;
const HOST_ISOLATION_EXCEPTIONS_PATH = `${MANAGEMENT_PATH}/host_isolation_exceptions`;
exports.HOST_ISOLATION_EXCEPTIONS_PATH = HOST_ISOLATION_EXCEPTIONS_PATH;
const APP_OVERVIEW_PATH = `${APP_PATH}${OVERVIEW_PATH}`;
exports.APP_OVERVIEW_PATH = APP_OVERVIEW_PATH;
const APP_MANAGEMENT_PATH = `${APP_PATH}${MANAGEMENT_PATH}`;
exports.APP_MANAGEMENT_PATH = APP_MANAGEMENT_PATH;
const APP_ALERTS_PATH = `${APP_PATH}${ALERTS_PATH}`;
exports.APP_ALERTS_PATH = APP_ALERTS_PATH;
const APP_RULES_PATH = `${APP_PATH}${RULES_PATH}`;
exports.APP_RULES_PATH = APP_RULES_PATH;
const APP_EXCEPTIONS_PATH = `${APP_PATH}${EXCEPTIONS_PATH}`;
exports.APP_EXCEPTIONS_PATH = APP_EXCEPTIONS_PATH;
const APP_HOSTS_PATH = `${APP_PATH}${HOSTS_PATH}`;
exports.APP_HOSTS_PATH = APP_HOSTS_PATH;
const APP_UEBA_PATH = `${APP_PATH}${UEBA_PATH}`;
exports.APP_UEBA_PATH = APP_UEBA_PATH;
const APP_NETWORK_PATH = `${APP_PATH}${NETWORK_PATH}`;
exports.APP_NETWORK_PATH = APP_NETWORK_PATH;
const APP_TIMELINES_PATH = `${APP_PATH}${TIMELINES_PATH}`;
exports.APP_TIMELINES_PATH = APP_TIMELINES_PATH;
const APP_CASES_PATH = `${APP_PATH}${CASES_PATH}`;
exports.APP_CASES_PATH = APP_CASES_PATH;
const APP_ENDPOINTS_PATH = `${APP_PATH}${ENDPOINTS_PATH}`;
exports.APP_ENDPOINTS_PATH = APP_ENDPOINTS_PATH;
const APP_TRUSTED_APPS_PATH = `${APP_PATH}${TRUSTED_APPS_PATH}`;
exports.APP_TRUSTED_APPS_PATH = APP_TRUSTED_APPS_PATH;
const APP_EVENT_FILTERS_PATH = `${APP_PATH}${EVENT_FILTERS_PATH}`;
exports.APP_EVENT_FILTERS_PATH = APP_EVENT_FILTERS_PATH;
const APP_HOST_ISOLATION_EXCEPTIONS_PATH = `${APP_PATH}${HOST_ISOLATION_EXCEPTIONS_PATH}`;
/** The comma-delimited list of Elasticsearch indices from which the SIEM app collects events */

exports.APP_HOST_ISOLATION_EXCEPTIONS_PATH = APP_HOST_ISOLATION_EXCEPTIONS_PATH;
const DEFAULT_INDEX_PATTERN = ['apm-*-transaction*', 'traces-apm*', 'auditbeat-*', 'endgame-*', 'filebeat-*', 'logs-*', 'packetbeat-*', 'winlogbeat-*'];
exports.DEFAULT_INDEX_PATTERN = DEFAULT_INDEX_PATTERN;
const DEFAULT_INDEX_PATTERN_EXPERIMENTAL = [// TODO: Steph/ueba TEMP for testing UEBA data
'ml_host_risk_score_*'];
/** This Kibana Advanced Setting enables the `Security news` feed widget */

exports.DEFAULT_INDEX_PATTERN_EXPERIMENTAL = DEFAULT_INDEX_PATTERN_EXPERIMENTAL;
const ENABLE_NEWS_FEED_SETTING = 'securitySolution:enableNewsFeed';
/** This Kibana Advanced Setting sets the auto refresh interval for the detections all rules table */

exports.ENABLE_NEWS_FEED_SETTING = ENABLE_NEWS_FEED_SETTING;
const DEFAULT_RULES_TABLE_REFRESH_SETTING = 'securitySolution:rulesTableRefresh';
/** This Kibana Advanced Setting specifies the URL of the News feed widget */

exports.DEFAULT_RULES_TABLE_REFRESH_SETTING = DEFAULT_RULES_TABLE_REFRESH_SETTING;
const NEWS_FEED_URL_SETTING = 'securitySolution:newsFeedUrl';
/** The default value for News feed widget */

exports.NEWS_FEED_URL_SETTING = NEWS_FEED_URL_SETTING;
const NEWS_FEED_URL_SETTING_DEFAULT = 'https://feeds.elastic.co/security-solution';
/** This Kibana Advanced Setting specifies the URLs of `IP Reputation Links`*/

exports.NEWS_FEED_URL_SETTING_DEFAULT = NEWS_FEED_URL_SETTING_DEFAULT;
const IP_REPUTATION_LINKS_SETTING = 'securitySolution:ipReputationLinks';
/** The default value for `IP Reputation Links` */

exports.IP_REPUTATION_LINKS_SETTING = IP_REPUTATION_LINKS_SETTING;
const IP_REPUTATION_LINKS_SETTING_DEFAULT = `[
  { "name": "virustotal.com", "url_template": "https://www.virustotal.com/gui/search/{{ip}}" },
  { "name": "talosIntelligence.com", "url_template": "https://talosintelligence.com/reputation_center/lookup?search={{ip}}" }
]`;
/** The default settings for the transforms */

exports.IP_REPUTATION_LINKS_SETTING_DEFAULT = IP_REPUTATION_LINKS_SETTING_DEFAULT;
const defaultTransformsSetting = {
  enabled: false,
  auto_start: true,
  auto_create: true,
  query: {
    range: {
      '@timestamp': {
        gte: 'now-1d/d',
        format: 'strict_date_optional_time'
      }
    }
  },
  retention_policy: {
    time: {
      field: '@timestamp',
      max_age: '1w'
    }
  },
  max_page_search_size: 5000,
  settings: [{
    prefix: 'all',
    indices: ['auditbeat-*', 'endgame-*', 'filebeat-*', 'logs-*', 'packetbeat-*', 'winlogbeat-*'],
    data_sources: [['auditbeat-*', 'endgame-*', 'filebeat-*', 'logs-*', 'packetbeat-*', 'winlogbeat-*']]
  }]
};
exports.defaultTransformsSetting = defaultTransformsSetting;
const DEFAULT_TRANSFORMS_SETTING = JSON.stringify(defaultTransformsSetting, null, 2);
/**
 * Id for the signals alerting type
 */

exports.DEFAULT_TRANSFORMS_SETTING = DEFAULT_TRANSFORMS_SETTING;
const SIGNALS_ID = `siem.signals`;
/**
 * IDs for RAC rule types
 */

exports.SIGNALS_ID = SIGNALS_ID;
const RULE_TYPE_PREFIX = `siem`;
const EQL_RULE_TYPE_ID = `${RULE_TYPE_PREFIX}.eqlRule`;
exports.EQL_RULE_TYPE_ID = EQL_RULE_TYPE_ID;
const INDICATOR_RULE_TYPE_ID = `${RULE_TYPE_PREFIX}.indicatorRule`;
exports.INDICATOR_RULE_TYPE_ID = INDICATOR_RULE_TYPE_ID;
const ML_RULE_TYPE_ID = `${RULE_TYPE_PREFIX}.mlRule`;
exports.ML_RULE_TYPE_ID = ML_RULE_TYPE_ID;
const QUERY_RULE_TYPE_ID = `${RULE_TYPE_PREFIX}.queryRule`;
exports.QUERY_RULE_TYPE_ID = QUERY_RULE_TYPE_ID;
const THRESHOLD_RULE_TYPE_ID = `${RULE_TYPE_PREFIX}.thresholdRule`;
/**
 * Id for the notifications alerting type
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */

exports.THRESHOLD_RULE_TYPE_ID = THRESHOLD_RULE_TYPE_ID;
const LEGACY_NOTIFICATIONS_ID = `siem.notifications`;
/**
 * Special internal structure for tags for signals. This is used
 * to filter out tags that have internal structures within them.
 */

exports.LEGACY_NOTIFICATIONS_ID = LEGACY_NOTIFICATIONS_ID;
const INTERNAL_IDENTIFIER = '__internal';
exports.INTERNAL_IDENTIFIER = INTERNAL_IDENTIFIER;
const INTERNAL_RULE_ID_KEY = `${INTERNAL_IDENTIFIER}_rule_id`;
exports.INTERNAL_RULE_ID_KEY = INTERNAL_RULE_ID_KEY;
const INTERNAL_RULE_ALERT_ID_KEY = `${INTERNAL_IDENTIFIER}_rule_alert_id`;
exports.INTERNAL_RULE_ALERT_ID_KEY = INTERNAL_RULE_ALERT_ID_KEY;
const INTERNAL_IMMUTABLE_KEY = `${INTERNAL_IDENTIFIER}_immutable`;
/**
 * Internal actions route
 */

exports.INTERNAL_IMMUTABLE_KEY = INTERNAL_IMMUTABLE_KEY;
const UPDATE_OR_CREATE_LEGACY_ACTIONS = '/internal/api/detection/legacy/notifications';
/**
 * Detection engine routes
 */

exports.UPDATE_OR_CREATE_LEGACY_ACTIONS = UPDATE_OR_CREATE_LEGACY_ACTIONS;
const DETECTION_ENGINE_URL = '/api/detection_engine';
exports.DETECTION_ENGINE_URL = DETECTION_ENGINE_URL;
const DETECTION_ENGINE_RULES_URL = `${DETECTION_ENGINE_URL}/rules`;
exports.DETECTION_ENGINE_RULES_URL = DETECTION_ENGINE_RULES_URL;
const DETECTION_ENGINE_PREPACKAGED_URL = `${DETECTION_ENGINE_RULES_URL}/prepackaged`;
exports.DETECTION_ENGINE_PREPACKAGED_URL = DETECTION_ENGINE_PREPACKAGED_URL;
const DETECTION_ENGINE_PRIVILEGES_URL = `${DETECTION_ENGINE_URL}/privileges`;
exports.DETECTION_ENGINE_PRIVILEGES_URL = DETECTION_ENGINE_PRIVILEGES_URL;
const DETECTION_ENGINE_INDEX_URL = `${DETECTION_ENGINE_URL}/index`;
exports.DETECTION_ENGINE_INDEX_URL = DETECTION_ENGINE_INDEX_URL;
const DETECTION_ENGINE_TAGS_URL = `${DETECTION_ENGINE_URL}/tags`;
exports.DETECTION_ENGINE_TAGS_URL = DETECTION_ENGINE_TAGS_URL;
const DETECTION_ENGINE_RULES_STATUS_URL = `${DETECTION_ENGINE_RULES_URL}/_find_statuses`;
exports.DETECTION_ENGINE_RULES_STATUS_URL = DETECTION_ENGINE_RULES_STATUS_URL;
const DETECTION_ENGINE_PREPACKAGED_RULES_STATUS_URL = `${DETECTION_ENGINE_RULES_URL}/prepackaged/_status`;
exports.DETECTION_ENGINE_PREPACKAGED_RULES_STATUS_URL = DETECTION_ENGINE_PREPACKAGED_RULES_STATUS_URL;
const DETECTION_ENGINE_RULES_BULK_ACTION = `${DETECTION_ENGINE_RULES_URL}/_bulk_action`;
exports.DETECTION_ENGINE_RULES_BULK_ACTION = DETECTION_ENGINE_RULES_BULK_ACTION;
const TIMELINE_RESOLVE_URL = '/api/timeline/resolve';
exports.TIMELINE_RESOLVE_URL = TIMELINE_RESOLVE_URL;
const TIMELINE_URL = '/api/timeline';
exports.TIMELINE_URL = TIMELINE_URL;
const TIMELINES_URL = '/api/timelines';
exports.TIMELINES_URL = TIMELINES_URL;
const TIMELINE_FAVORITE_URL = '/api/timeline/_favorite';
exports.TIMELINE_FAVORITE_URL = TIMELINE_FAVORITE_URL;
const TIMELINE_DRAFT_URL = `${TIMELINE_URL}/_draft`;
exports.TIMELINE_DRAFT_URL = TIMELINE_DRAFT_URL;
const TIMELINE_EXPORT_URL = `${TIMELINE_URL}/_export`;
exports.TIMELINE_EXPORT_URL = TIMELINE_EXPORT_URL;
const TIMELINE_IMPORT_URL = `${TIMELINE_URL}/_import`;
exports.TIMELINE_IMPORT_URL = TIMELINE_IMPORT_URL;
const TIMELINE_PREPACKAGED_URL = `${TIMELINE_URL}/_prepackaged`;
exports.TIMELINE_PREPACKAGED_URL = TIMELINE_PREPACKAGED_URL;
const NOTE_URL = '/api/note';
exports.NOTE_URL = NOTE_URL;
const PINNED_EVENT_URL = '/api/pinned_event';
/**
 * Default signals index key for kibana.dev.yml
 */

exports.PINNED_EVENT_URL = PINNED_EVENT_URL;
const SIGNALS_INDEX_KEY = 'signalsIndex';
exports.SIGNALS_INDEX_KEY = SIGNALS_INDEX_KEY;
const DETECTION_ENGINE_SIGNALS_URL = `${DETECTION_ENGINE_URL}/signals`;
exports.DETECTION_ENGINE_SIGNALS_URL = DETECTION_ENGINE_SIGNALS_URL;
const DETECTION_ENGINE_SIGNALS_STATUS_URL = `${DETECTION_ENGINE_SIGNALS_URL}/status`;
exports.DETECTION_ENGINE_SIGNALS_STATUS_URL = DETECTION_ENGINE_SIGNALS_STATUS_URL;
const DETECTION_ENGINE_QUERY_SIGNALS_URL = `${DETECTION_ENGINE_SIGNALS_URL}/search`;
exports.DETECTION_ENGINE_QUERY_SIGNALS_URL = DETECTION_ENGINE_QUERY_SIGNALS_URL;
const DETECTION_ENGINE_SIGNALS_MIGRATION_URL = `${DETECTION_ENGINE_SIGNALS_URL}/migration`;
exports.DETECTION_ENGINE_SIGNALS_MIGRATION_URL = DETECTION_ENGINE_SIGNALS_MIGRATION_URL;
const DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL = `${DETECTION_ENGINE_SIGNALS_URL}/migration_status`;
exports.DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL = DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL;
const DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL = `${DETECTION_ENGINE_SIGNALS_URL}/finalize_migration`;
exports.DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL = DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL;
const ALERTS_AS_DATA_URL = '/internal/rac/alerts';
exports.ALERTS_AS_DATA_URL = ALERTS_AS_DATA_URL;
const ALERTS_AS_DATA_FIND_URL = `${ALERTS_AS_DATA_URL}/find`;
/**
 * Common naming convention for an unauthenticated user
 */

exports.ALERTS_AS_DATA_FIND_URL = ALERTS_AS_DATA_FIND_URL;
const UNAUTHENTICATED_USER = 'Unauthenticated';
/*
  Licensing requirements
 */

exports.UNAUTHENTICATED_USER = UNAUTHENTICATED_USER;
const MINIMUM_ML_LICENSE = 'platinum';
/*
  Machine Learning constants
 */

exports.MINIMUM_ML_LICENSE = MINIMUM_ML_LICENSE;
const ML_GROUP_ID = 'security';
exports.ML_GROUP_ID = ML_GROUP_ID;
const LEGACY_ML_GROUP_ID = 'siem';
exports.LEGACY_ML_GROUP_ID = LEGACY_ML_GROUP_ID;
const ML_GROUP_IDS = [ML_GROUP_ID, LEGACY_ML_GROUP_ID];
/*
  Rule notifications options
*/

exports.ML_GROUP_IDS = ML_GROUP_IDS;
const NOTIFICATION_SUPPORTED_ACTION_TYPES_IDS = ['.email', '.index', '.jira', '.pagerduty', '.resilient', '.servicenow', '.servicenow-sir', '.servicenow-itom', '.slack', '.swimlane', '.teams', '.webhook'];
exports.NOTIFICATION_SUPPORTED_ACTION_TYPES_IDS = NOTIFICATION_SUPPORTED_ACTION_TYPES_IDS;

if (_common.ENABLE_CASE_CONNECTOR) {
  NOTIFICATION_SUPPORTED_ACTION_TYPES_IDS.push('.case');
}

const NOTIFICATION_THROTTLE_NO_ACTIONS = 'no_actions';
exports.NOTIFICATION_THROTTLE_NO_ACTIONS = NOTIFICATION_THROTTLE_NO_ACTIONS;
const NOTIFICATION_THROTTLE_RULE = 'rule';
exports.NOTIFICATION_THROTTLE_RULE = NOTIFICATION_THROTTLE_RULE;
const showAllOthersBucket = ['destination.ip', 'event.action', 'event.category', 'event.dataset', 'event.module', 'signal.rule.threat.tactic.name', 'source.ip', 'destination.ip', 'user.name'];
/**
 * Used for transforms for metrics_entities. If the security_solutions pulls in
 * the metrics_entities plugin, then it should pull this constant from there rather
 * than use it from here.
 */

exports.showAllOthersBucket = showAllOthersBucket;
const ELASTIC_NAME = 'estc';
exports.ELASTIC_NAME = ELASTIC_NAME;
const METADATA_TRANSFORM_STATS_URL = `/api/transform/transforms/${_constants.METADATA_TRANSFORMS_PATTERN}/_stats`;
exports.METADATA_TRANSFORM_STATS_URL = METADATA_TRANSFORM_STATS_URL;
const RISKY_HOSTS_INDEX_PREFIX = 'ml_host_risk_score_latest_';
exports.RISKY_HOSTS_INDEX_PREFIX = RISKY_HOSTS_INDEX_PREFIX;
const TRANSFORM_STATES = {
  ABORTING: 'aborting',
  FAILED: 'failed',
  INDEXING: 'indexing',
  STARTED: 'started',
  STOPPED: 'stopped',
  STOPPING: 'stopping',
  WAITING: 'waiting'
};
exports.TRANSFORM_STATES = TRANSFORM_STATES;
const WARNING_TRANSFORM_STATES = new Set([TRANSFORM_STATES.ABORTING, TRANSFORM_STATES.FAILED, TRANSFORM_STATES.STOPPED, TRANSFORM_STATES.STOPPING]);
exports.WARNING_TRANSFORM_STATES = WARNING_TRANSFORM_STATES;