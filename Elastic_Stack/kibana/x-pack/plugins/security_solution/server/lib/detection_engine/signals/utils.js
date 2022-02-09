"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapSignal = exports.wrapBuildingBlocks = exports.sortExceptionItems = exports.shorthandMap = exports.ruleTypeMappings = exports.racFieldMappings = exports.parseInterval = exports.mergeSearchResults = exports.mergeReturns = exports.makeFloatString = exports.lastValidDate = exports.isWrappedSignalHit = exports.isWrappedRACAlert = exports.isWrappedEventHit = exports.isThresholdParams = exports.isThreatParams = exports.isSavedQueryParams = exports.isQueryParams = exports.isMachineLearningParams = exports.isEqlParams = exports.hasTimestampFields = exports.hasReadIndexPrivileges = exports.getValidDateFromDoc = exports.getTotalHitsValue = exports.getThresholdTermsHash = exports.getThresholdAggregationParts = exports.getSafeSortIds = exports.getRuleRangeTuples = exports.getNumCatchupIntervals = exports.getListsClient = exports.getGapBetweenRuns = exports.getField = exports.getExceptions = exports.getDriftTolerance = exports.getCatchupTuples = exports.generateSignalId = exports.generateId = exports.generateBuildingBlockIds = exports.errorAggregator = exports.createSearchResultReturnType = exports.createSearchAfterReturnTypeFromResponse = exports.createSearchAfterReturnType = exports.createErrorsFromShard = exports.checkPrivilegesFromEsClient = exports.checkPrivileges = exports.calculateTotal = exports.calculateThresholdSignalUuid = exports.buildChunkedOrFilter = exports.MAX_RULE_GAP_RATIO = void 0;

var _crypto = require("crypto");

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _v = _interopRequireDefault(require("uuid/v5"));

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _schemas = require("../../../../common/detection_engine/schemas/common/schemas");

var _server = require("../../../../../alerting/server");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAX_RULE_GAP_RATIO = 4;
exports.MAX_RULE_GAP_RATIO = MAX_RULE_GAP_RATIO;
const shorthandMap = {
  s: {
    momentString: 'seconds',
    asFn: duration => duration.asSeconds()
  },
  m: {
    momentString: 'minutes',
    asFn: duration => duration.asMinutes()
  },
  h: {
    momentString: 'hours',
    asFn: duration => duration.asHours()
  }
};
exports.shorthandMap = shorthandMap;

const hasReadIndexPrivileges = async args => {
  const {
    privileges,
    logger,
    buildRuleMessage,
    ruleStatusClient,
    ruleId,
    ruleName,
    ruleType,
    spaceId
  } = args;
  const indexNames = Object.keys(privileges.index);
  const [, indexesWithNoReadPrivileges] = (0, _lodash.partition)(indexNames, indexName => privileges.index[indexName].read);

  if (indexesWithNoReadPrivileges.length > 0) {
    // some indices have read privileges others do not.
    // set a warning status
    const errorString = `This rule may not have the required read privileges to the following indices/index patterns: ${JSON.stringify(indexesWithNoReadPrivileges)}`;
    logger.error(buildRuleMessage(errorString));
    await ruleStatusClient.logStatusChange({
      message: errorString,
      ruleId,
      ruleName,
      ruleType,
      spaceId,
      newStatus: _schemas.RuleExecutionStatus['partial failure']
    });
    return true;
  }

  return false;
};

exports.hasReadIndexPrivileges = hasReadIndexPrivileges;

const hasTimestampFields = async args => {
  var _timestampFieldCapsRe, _timestampFieldCapsRe2;

  const {
    timestampField,
    ruleName,
    timestampFieldCapsResponse,
    inputIndices,
    ruleStatusClient,
    ruleId,
    ruleType,
    spaceId,
    logger,
    buildRuleMessage
  } = args;

  if ((0, _lodash.isEmpty)(timestampFieldCapsResponse.body.indices)) {
    const errorString = `This rule is attempting to query data from Elasticsearch indices listed in the "Index pattern" section of the rule definition, however no index matching: ${JSON.stringify(inputIndices)} was found. This warning will continue to appear until a matching index is created or this rule is de-activated. ${ruleName === 'Endpoint Security' ? 'If you have recently enrolled agents enabled with Endpoint Security through Fleet, this warning should stop once an alert is sent from an agent.' : ''}`;
    logger.error(buildRuleMessage(errorString.trimEnd()));
    await ruleStatusClient.logStatusChange({
      message: errorString.trimEnd(),
      ruleId,
      ruleName,
      ruleType,
      spaceId,
      newStatus: _schemas.RuleExecutionStatus['partial failure']
    });
    return true;
  } else if ((0, _lodash.isEmpty)(timestampFieldCapsResponse.body.fields) || timestampFieldCapsResponse.body.fields[timestampField] == null || ((_timestampFieldCapsRe = timestampFieldCapsResponse.body.fields[timestampField]) === null || _timestampFieldCapsRe === void 0 ? void 0 : (_timestampFieldCapsRe2 = _timestampFieldCapsRe.unmapped) === null || _timestampFieldCapsRe2 === void 0 ? void 0 : _timestampFieldCapsRe2.indices) != null) {
    var _timestampFieldCapsRe3, _timestampFieldCapsRe4; // if there is a timestamp override and the unmapped array for the timestamp override key is not empty,
    // warning


    const errorString = `The following indices are missing the ${timestampField === '@timestamp' ? 'timestamp field "@timestamp"' : `timestamp override field "${timestampField}"`}: ${JSON.stringify((0, _lodash.isEmpty)(timestampFieldCapsResponse.body.fields) || (0, _lodash.isEmpty)(timestampFieldCapsResponse.body.fields[timestampField]) ? timestampFieldCapsResponse.body.indices : (_timestampFieldCapsRe3 = timestampFieldCapsResponse.body.fields[timestampField]) === null || _timestampFieldCapsRe3 === void 0 ? void 0 : (_timestampFieldCapsRe4 = _timestampFieldCapsRe3.unmapped) === null || _timestampFieldCapsRe4 === void 0 ? void 0 : _timestampFieldCapsRe4.indices)}`;
    logger.error(buildRuleMessage(errorString));
    await ruleStatusClient.logStatusChange({
      message: errorString,
      ruleId,
      ruleName,
      ruleType,
      spaceId,
      newStatus: _schemas.RuleExecutionStatus['partial failure']
    });
    return true;
  }

  return false;
};

exports.hasTimestampFields = hasTimestampFields;

const checkPrivileges = async (services, indices) => checkPrivilegesFromEsClient(services.scopedClusterClient.asCurrentUser, indices);

exports.checkPrivileges = checkPrivileges;

const checkPrivilegesFromEsClient = async (esClient, indices) => (await esClient.transport.request({
  path: '/_security/user/_has_privileges',
  method: 'POST',
  body: {
    index: [{
      names: indices !== null && indices !== void 0 ? indices : [],
      allow_restricted_indices: true,
      privileges: ['read']
    }]
  }
})).body;

exports.checkPrivilegesFromEsClient = checkPrivilegesFromEsClient;

const getNumCatchupIntervals = ({
  gap,
  intervalDuration
}) => {
  if (gap.asMilliseconds() <= 0 || intervalDuration.asMilliseconds() <= 0) {
    return 0;
  }

  const ratio = Math.ceil(gap.asMilliseconds() / intervalDuration.asMilliseconds()); // maxCatchup is to ensure we are not trying to catch up too far back.
  // This allows for a maximum of 4 consecutive rule execution misses
  // to be included in the number of signals generated.

  return ratio < MAX_RULE_GAP_RATIO ? ratio : MAX_RULE_GAP_RATIO;
};

exports.getNumCatchupIntervals = getNumCatchupIntervals;

const getListsClient = ({
  lists,
  spaceId,
  updatedByUser,
  services,
  savedObjectClient
}) => {
  if (lists == null) {
    throw new Error('lists plugin unavailable during rule execution');
  }

  const listClient = lists.getListClient(services.scopedClusterClient.asCurrentUser, spaceId, updatedByUser !== null && updatedByUser !== void 0 ? updatedByUser : 'elastic');
  const exceptionsClient = lists.getExceptionListClient(savedObjectClient, updatedByUser !== null && updatedByUser !== void 0 ? updatedByUser : 'elastic');
  return {
    listClient,
    exceptionsClient
  };
};

exports.getListsClient = getListsClient;

const getExceptions = async ({
  client,
  lists
}) => {
  if (lists.length > 0) {
    try {
      const listIds = lists.map(({
        list_id: listId
      }) => listId);
      const namespaceTypes = lists.map(({
        namespace_type: namespaceType
      }) => namespaceType);
      const items = await client.findExceptionListsItem({
        listId: listIds,
        namespaceType: namespaceTypes,
        page: 1,
        perPage: _securitysolutionListConstants.MAX_EXCEPTION_LIST_SIZE,
        filter: [],
        sortOrder: undefined,
        sortField: undefined
      });
      return items != null ? items.data : [];
    } catch {
      throw new Error('unable to fetch exception list items');
    }
  } else {
    return [];
  }
};

exports.getExceptions = getExceptions;

const sortExceptionItems = exceptions => {
  return exceptions.reduce((acc, exception) => {
    const {
      entries
    } = exception;
    const {
      exceptionsWithValueLists,
      exceptionsWithoutValueLists
    } = acc;

    if ((0, _securitysolutionListUtils.hasLargeValueList)(entries)) {
      return {
        exceptionsWithValueLists: [...exceptionsWithValueLists, { ...exception
        }],
        exceptionsWithoutValueLists
      };
    } else {
      return {
        exceptionsWithValueLists,
        exceptionsWithoutValueLists: [...exceptionsWithoutValueLists, { ...exception
        }]
      };
    }
  }, {
    exceptionsWithValueLists: [],
    exceptionsWithoutValueLists: []
  });
};

exports.sortExceptionItems = sortExceptionItems;

const generateId = (docIndex, docId, version, ruleId) => (0, _crypto.createHash)('sha256').update(docIndex.concat(docId, version, ruleId)).digest('hex'); // TODO: do we need to include version in the id? If it does matter then we should include it in signal.parents as well


exports.generateId = generateId;

const generateSignalId = signal => (0, _crypto.createHash)('sha256').update(signal.parents.reduce((acc, parent) => acc.concat(parent.id, parent.index), '').concat(signal.rule.id)).digest('hex');
/**
 * Generates unique doc ids for each building block signal within a sequence. The id of each building block
 * depends on the parents of every building block, so that a signal which appears in multiple different sequences
 * (e.g. if multiple rules build sequences that share a common event/signal) will get a unique id per sequence.
 * @param buildingBlocks The full list of building blocks in the sequence.
 */


exports.generateSignalId = generateSignalId;

const generateBuildingBlockIds = buildingBlocks => {
  const baseHashString = buildingBlocks.reduce((baseString, block) => baseString.concat(block.signal.parents.reduce((acc, parent) => acc.concat(parent.id, parent.index), '')).concat(block.signal.rule.id), '');
  return buildingBlocks.map((block, idx) => (0, _crypto.createHash)('sha256').update(baseHashString).update(String(idx)).digest('hex'));
};

exports.generateBuildingBlockIds = generateBuildingBlockIds;

const wrapBuildingBlocks = (buildingBlocks, index) => {
  const blockIds = generateBuildingBlockIds(buildingBlocks);
  return buildingBlocks.map((block, idx) => {
    return {
      _id: blockIds[idx],
      _index: index,
      _source: { ...block
      }
    };
  });
};

exports.wrapBuildingBlocks = wrapBuildingBlocks;

const wrapSignal = (signal, index) => {
  return {
    _id: generateSignalId(signal.signal),
    _index: index,
    _source: signal
  };
};

exports.wrapSignal = wrapSignal;

const parseInterval = intervalString => {
  try {
    return _moment.default.duration((0, _server.parseDuration)(intervalString));
  } catch (err) {
    return null;
  }
};

exports.parseInterval = parseInterval;

const getDriftTolerance = ({
  from,
  to,
  intervalDuration,
  now = (0, _moment.default)()
}) => {
  var _parseScheduleDates, _parseScheduleDates2;

  const toDate = (_parseScheduleDates = (0, _securitysolutionIoTsUtils.parseScheduleDates)(to)) !== null && _parseScheduleDates !== void 0 ? _parseScheduleDates : now;
  const fromDate = (_parseScheduleDates2 = (0, _securitysolutionIoTsUtils.parseScheduleDates)(from)) !== null && _parseScheduleDates2 !== void 0 ? _parseScheduleDates2 : _datemath.default.parse('now-6m');
  const timeSegment = toDate.diff(fromDate);

  const duration = _moment.default.duration(timeSegment);

  return duration.subtract(intervalDuration);
};

exports.getDriftTolerance = getDriftTolerance;

const getGapBetweenRuns = ({
  previousStartedAt,
  intervalDuration,
  from,
  to,
  now = (0, _moment.default)()
}) => {
  if (previousStartedAt == null) {
    return _moment.default.duration(0);
  }

  const driftTolerance = getDriftTolerance({
    from,
    to,
    intervalDuration
  });

  const diff = _moment.default.duration(now.diff(previousStartedAt));

  const drift = diff.subtract(intervalDuration);
  return drift.subtract(driftTolerance);
};

exports.getGapBetweenRuns = getGapBetweenRuns;

const makeFloatString = num => Number(num).toFixed(2);
/**
 * Given a BulkResponse this will return an aggregation based on the errors if any exist
 * from the BulkResponse. Errors are aggregated on the reason as the unique key.
 *
 * Example would be:
 * {
 *   'Parse Error': {
 *      count: 100,
 *      statusCode: 400,
 *   },
 *   'Internal server error': {
 *       count: 3,
 *       statusCode: 500,
 *   }
 * }
 * If this does not return any errors then you will get an empty object like so: {}
 * @param response The bulk response to aggregate based on the error message
 * @param ignoreStatusCodes Optional array of status codes to ignore when creating aggregate error messages
 * @returns The aggregated example as shown above.
 */


exports.makeFloatString = makeFloatString;

const errorAggregator = (response, ignoreStatusCodes) => {
  return response.items.reduce((accum, item) => {
    var _item$create;

    if (((_item$create = item.create) === null || _item$create === void 0 ? void 0 : _item$create.error) != null && !ignoreStatusCodes.includes(item.create.status)) {
      if (accum[item.create.error.reason] == null) {
        accum[item.create.error.reason] = {
          count: 1,
          statusCode: item.create.status
        };
      } else {
        accum[item.create.error.reason] = {
          count: accum[item.create.error.reason].count + 1,
          statusCode: item.create.status
        };
      }
    }

    return accum;
  }, Object.create(null));
};

exports.errorAggregator = errorAggregator;

const getRuleRangeTuples = ({
  logger,
  previousStartedAt,
  from,
  to,
  interval,
  maxSignals,
  buildRuleMessage
}) => {
  const originalTo = _datemath.default.parse(to);

  const originalFrom = _datemath.default.parse(from);

  if (originalTo == null || originalFrom == null) {
    throw new Error(buildRuleMessage('dateMath parse failed'));
  }

  const tuples = [{
    to: originalTo,
    from: originalFrom,
    maxSignals
  }];
  const intervalDuration = parseInterval(interval);

  if (intervalDuration == null) {
    logger.error(`Failed to compute gap between rule runs: could not parse rule interval`);
    return {
      tuples,
      remainingGap: _moment.default.duration(0)
    };
  }

  const gap = getGapBetweenRuns({
    previousStartedAt,
    intervalDuration,
    from,
    to
  });
  const catchup = getNumCatchupIntervals({
    gap,
    intervalDuration
  });
  const catchupTuples = getCatchupTuples({
    to: originalTo,
    from: originalFrom,
    ruleParamsMaxSignals: maxSignals,
    catchup,
    intervalDuration
  });
  tuples.push(...catchupTuples); // Each extra tuple adds one extra intervalDuration to the time range this rule will cover.

  const remainingGapMilliseconds = Math.max(gap.asMilliseconds() - catchup * intervalDuration.asMilliseconds(), 0);
  return {
    tuples: tuples.reverse(),
    remainingGap: _moment.default.duration(remainingGapMilliseconds)
  };
};
/**
 * Creates rule range tuples needed to cover gaps since the last rule run.
 * @param to moment.Moment representing the rules 'to' property
 * @param from moment.Moment representing the rules 'from' property
 * @param ruleParamsMaxSignals int representing the maxSignals property on the rule (usually unmodified at 100)
 * @param catchup number the number of additional rule run intervals to add
 * @param intervalDuration moment.Duration the interval which the rule runs
 */


exports.getRuleRangeTuples = getRuleRangeTuples;

const getCatchupTuples = ({
  to,
  from,
  ruleParamsMaxSignals,
  catchup,
  intervalDuration
}) => {
  const catchupTuples = [];
  const intervalInMilliseconds = intervalDuration.asMilliseconds();
  let currentTo = to;
  let currentFrom = from; // This loop will create tuples with overlapping time ranges, the same way rule runs have overlapping time
  // ranges due to the additional lookback. We could choose to create tuples that don't overlap here by using the
  // "from" value from one tuple as "to" in the next one, however, the overlap matters for rule types like EQL and
  // threshold rules that look for sets of documents within the query. Thus we keep the overlap so that these
  // extra tuples behave as similarly to the regular rule runs as possible.

  while (catchupTuples.length < catchup) {
    const nextTo = currentTo.clone().subtract(intervalInMilliseconds);
    const nextFrom = currentFrom.clone().subtract(intervalInMilliseconds);
    catchupTuples.push({
      to: nextTo,
      from: nextFrom,
      maxSignals: ruleParamsMaxSignals
    });
    currentTo = nextTo;
    currentFrom = nextFrom;
  }

  return catchupTuples;
};
/**
 * Given errors from a search query this will return an array of strings derived from the errors.
 * @param errors The errors to derive the strings from
 */


exports.getCatchupTuples = getCatchupTuples;

const createErrorsFromShard = ({
  errors
}) => {
  return errors.map(error => {
    const {
      index,
      reason: {
        reason,
        type,
        caused_by: {
          reason: causedByReason,
          type: causedByType
        } = {
          reason: undefined,
          type: undefined
        }
      } = {}
    } = error;
    return [...(index != null ? [`index: "${index}"`] : []), ...(reason != null ? [`reason: "${reason}"`] : []), ...(type != null ? [`type: "${type}"`] : []), ...(causedByReason != null ? [`caused by reason: "${causedByReason}"`] : []), ...(causedByType != null ? [`caused by type: "${causedByType}"`] : [])].join(' ');
  });
};
/**
 * Given a SignalSearchResponse this will return a valid last date if it can find one, otherwise it
 * will return undefined. This tries the "fields" first to get a formatted date time if it can, but if
 * it cannot it will resort to using the "_source" fields second which can be problematic if the date time
 * is not correctly ISO8601 or epoch milliseconds formatted.
 * @param searchResult The result to try and parse out the timestamp.
 * @param timestampOverride The timestamp override to use its values if we have it.
 */


exports.createErrorsFromShard = createErrorsFromShard;

const lastValidDate = ({
  searchResult,
  timestampOverride
}) => {
  if (searchResult.hits.hits.length === 0) {
    return undefined;
  } else {
    const lastRecord = searchResult.hits.hits[searchResult.hits.hits.length - 1];
    return getValidDateFromDoc({
      doc: lastRecord,
      timestampOverride
    });
  }
};
/**
 * Given a search hit this will return a valid last date if it can find one, otherwise it
 * will return undefined. This tries the "fields" first to get a formatted date time if it can, but if
 * it cannot it will resort to using the "_source" fields second which can be problematic if the date time
 * is not correctly ISO8601 or epoch milliseconds formatted.
 * @param searchResult The result to try and parse out the timestamp.
 * @param timestampOverride The timestamp override to use its values if we have it.
 */


exports.lastValidDate = lastValidDate;

const getValidDateFromDoc = ({
  doc,
  timestampOverride
}) => {
  const timestamp = timestampOverride !== null && timestampOverride !== void 0 ? timestampOverride : '@timestamp';
  const timestampValue = doc.fields != null && doc.fields[timestamp] != null ? doc.fields[timestamp][0] : doc._source != null ? doc._source[timestamp] : undefined;
  const lastTimestamp = typeof timestampValue === 'string' || typeof timestampValue === 'number' ? timestampValue : undefined;

  if (lastTimestamp != null) {
    const tempMoment = (0, _moment.default)(lastTimestamp);

    if (tempMoment.isValid()) {
      return tempMoment.toDate();
    } else if (typeof timestampValue === 'string') {
      // worse case we have a string from fields API or other areas of Elasticsearch that have given us a number as a string,
      // so we try one last time to parse this best we can by converting from string to a number
      const maybeDate = (0, _moment.default)(+lastTimestamp);

      if (maybeDate.isValid()) {
        return maybeDate.toDate();
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
};

exports.getValidDateFromDoc = getValidDateFromDoc;

const createSearchAfterReturnTypeFromResponse = ({
  searchResult,
  timestampOverride
}) => {
  var _searchResult$_shards;

  return createSearchAfterReturnType({
    success: searchResult._shards.failed === 0 || ((_searchResult$_shards = searchResult._shards.failures) === null || _searchResult$_shards === void 0 ? void 0 : _searchResult$_shards.every(failure => {
      var _failure$reason, _failure$reason$reaso, _failure$reason2, _failure$reason2$reas;

      return ((_failure$reason = failure.reason) === null || _failure$reason === void 0 ? void 0 : (_failure$reason$reaso = _failure$reason.reason) === null || _failure$reason$reaso === void 0 ? void 0 : _failure$reason$reaso.includes('No mapping found for [@timestamp] in order to sort on')) || ((_failure$reason2 = failure.reason) === null || _failure$reason2 === void 0 ? void 0 : (_failure$reason2$reas = _failure$reason2.reason) === null || _failure$reason2$reas === void 0 ? void 0 : _failure$reason2$reas.includes(`No mapping found for [${timestampOverride}] in order to sort on`));
    })),
    lastLookBackDate: lastValidDate({
      searchResult,
      timestampOverride
    })
  });
};

exports.createSearchAfterReturnTypeFromResponse = createSearchAfterReturnTypeFromResponse;

const createSearchAfterReturnType = ({
  success,
  warning,
  searchAfterTimes,
  bulkCreateTimes,
  lastLookBackDate,
  createdSignalsCount,
  createdSignals,
  errors,
  warningMessages
} = {}) => {
  return {
    success: success !== null && success !== void 0 ? success : true,
    warning: warning !== null && warning !== void 0 ? warning : false,
    searchAfterTimes: searchAfterTimes !== null && searchAfterTimes !== void 0 ? searchAfterTimes : [],
    bulkCreateTimes: bulkCreateTimes !== null && bulkCreateTimes !== void 0 ? bulkCreateTimes : [],
    lastLookBackDate: lastLookBackDate !== null && lastLookBackDate !== void 0 ? lastLookBackDate : null,
    createdSignalsCount: createdSignalsCount !== null && createdSignalsCount !== void 0 ? createdSignalsCount : 0,
    createdSignals: createdSignals !== null && createdSignals !== void 0 ? createdSignals : [],
    errors: errors !== null && errors !== void 0 ? errors : [],
    warningMessages: warningMessages !== null && warningMessages !== void 0 ? warningMessages : []
  };
};

exports.createSearchAfterReturnType = createSearchAfterReturnType;

const createSearchResultReturnType = () => {
  const hits = [];
  return {
    took: 0,
    timed_out: false,
    _shards: {
      total: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      failures: []
    },
    hits: {
      total: 0,
      max_score: 0,
      hits
    }
  };
};

exports.createSearchResultReturnType = createSearchResultReturnType;

const mergeReturns = searchAfters => {
  return searchAfters.reduce((prev, next) => {
    const {
      success: existingSuccess,
      warning: existingWarning,
      searchAfterTimes: existingSearchAfterTimes,
      bulkCreateTimes: existingBulkCreateTimes,
      lastLookBackDate: existingLastLookBackDate,
      createdSignalsCount: existingCreatedSignalsCount,
      createdSignals: existingCreatedSignals,
      errors: existingErrors,
      warningMessages: existingWarningMessages
    } = prev;
    const {
      success: newSuccess,
      warning: newWarning,
      searchAfterTimes: newSearchAfterTimes,
      bulkCreateTimes: newBulkCreateTimes,
      lastLookBackDate: newLastLookBackDate,
      createdSignalsCount: newCreatedSignalsCount,
      createdSignals: newCreatedSignals,
      errors: newErrors,
      warningMessages: newWarningMessages
    } = next;
    return {
      success: existingSuccess && newSuccess,
      warning: existingWarning || newWarning,
      searchAfterTimes: [...existingSearchAfterTimes, ...newSearchAfterTimes],
      bulkCreateTimes: [...existingBulkCreateTimes, ...newBulkCreateTimes],
      lastLookBackDate: newLastLookBackDate !== null && newLastLookBackDate !== void 0 ? newLastLookBackDate : existingLastLookBackDate,
      createdSignalsCount: existingCreatedSignalsCount + newCreatedSignalsCount,
      createdSignals: [...existingCreatedSignals, ...newCreatedSignals],
      errors: [...new Set([...existingErrors, ...newErrors])],
      warningMessages: [...existingWarningMessages, ...newWarningMessages]
    };
  });
};

exports.mergeReturns = mergeReturns;

const mergeSearchResults = searchResults => {
  return searchResults.reduce((prev, next) => {
    const {
      took: existingTook,
      timed_out: existingTimedOut,
      // _scroll_id: existingScrollId,
      _shards: existingShards,
      // aggregations: existingAggregations,
      hits: existingHits
    } = prev;
    const {
      took: newTook,
      timed_out: newTimedOut,
      _scroll_id: newScrollId,
      _shards: newShards,
      aggregations: newAggregations,
      hits: newHits
    } = next;
    return {
      took: Math.max(newTook, existingTook),
      timed_out: newTimedOut && existingTimedOut,
      _scroll_id: newScrollId,
      _shards: {
        total: newShards.total + existingShards.total,
        successful: newShards.successful + existingShards.successful,
        failed: newShards.failed + existingShards.failed,
        // @ts-expect-error @elastic/elaticsearch skipped is optional in ShardStatistics
        skipped: newShards.skipped + existingShards.skipped,
        failures: [...(existingShards.failures != null ? existingShards.failures : []), ...(newShards.failures != null ? newShards.failures : [])]
      },
      aggregations: newAggregations,
      hits: {
        total: calculateTotal(prev.hits.total, next.hits.total),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        max_score: Math.max(newHits.max_score, existingHits.max_score),
        hits: [...existingHits.hits, ...newHits.hits]
      }
    };
  });
};

exports.mergeSearchResults = mergeSearchResults;

const getTotalHitsValue = totalHits => typeof totalHits === 'undefined' ? -1 : typeof totalHits === 'number' ? totalHits : totalHits.value;

exports.getTotalHitsValue = getTotalHitsValue;

const calculateTotal = (prevTotal, nextTotal) => {
  const prevTotalHits = getTotalHitsValue(prevTotal);
  const nextTotalHits = getTotalHitsValue(nextTotal);

  if (prevTotalHits === -1 || nextTotalHits === -1) {
    return -1;
  }

  return prevTotalHits + nextTotalHits;
};

exports.calculateTotal = calculateTotal;

const calculateThresholdSignalUuid = (ruleId, startedAt, thresholdFields, key) => {
  // used to generate constant Threshold Signals ID when run with the same params
  const NAMESPACE_ID = '0684ec03-7201-4ee0-8ee0-3a3f6b2479b2';
  const startedAtString = startedAt.toISOString();
  const keyString = key !== null && key !== void 0 ? key : '';
  const baseString = `${ruleId}${startedAtString}${thresholdFields.join(',')}${keyString}`;
  return (0, _v.default)(baseString, NAMESPACE_ID);
};

exports.calculateThresholdSignalUuid = calculateThresholdSignalUuid;

const getThresholdAggregationParts = (data, index) => {
  const idx = index != null ? index.toString() : '\\d';
  const pattern = `threshold_(?<index>${idx}):(?<name>.*)`;

  for (const key of Object.keys(data)) {
    var _matches$groups, _matches$groups2;

    const matches = key.match(pattern);

    if (matches != null && ((_matches$groups = matches.groups) === null || _matches$groups === void 0 ? void 0 : _matches$groups.name) != null && ((_matches$groups2 = matches.groups) === null || _matches$groups2 === void 0 ? void 0 : _matches$groups2.index) != null) {
      return {
        field: matches.groups.name,
        index: parseInt(matches.groups.index, 10),
        name: key
      };
    }
  }
};

exports.getThresholdAggregationParts = getThresholdAggregationParts;

const getThresholdTermsHash = terms => {
  return (0, _crypto.createHash)('sha256').update(terms.sort((term1, term2) => term1.field > term2.field ? 1 : -1).map(field => {
    return field.value;
  }).join(',')).digest('hex');
};

exports.getThresholdTermsHash = getThresholdTermsHash;

const isEqlParams = params => params.type === 'eql';

exports.isEqlParams = isEqlParams;

const isThresholdParams = params => params.type === 'threshold';

exports.isThresholdParams = isThresholdParams;

const isQueryParams = params => params.type === 'query';

exports.isQueryParams = isQueryParams;

const isSavedQueryParams = params => params.type === 'saved_query';

exports.isSavedQueryParams = isSavedQueryParams;

const isThreatParams = params => params.type === 'threat_match';

exports.isThreatParams = isThreatParams;

const isMachineLearningParams = params => params.type === 'machine_learning';
/**
 * Prevent javascript from returning Number.MAX_SAFE_INTEGER when Elasticsearch expects
 * Java's Long.MAX_VALUE. This happens when sorting fields by date which are
 * unmapped in the provided index
 *
 * Ref: https://github.com/elastic/elasticsearch/issues/28806#issuecomment-369303620
 *
 * return stringified Long.MAX_VALUE if we receive Number.MAX_SAFE_INTEGER
 * @param sortIds estypes.SearchSortResults | undefined
 * @returns SortResults
 */


exports.isMachineLearningParams = isMachineLearningParams;

const getSafeSortIds = sortIds => {
  return sortIds === null || sortIds === void 0 ? void 0 : sortIds.map(sortId => {
    // haven't determined when we would receive a null value for a sort id
    // but in case we do, default to sending the stringified Java max_int
    if (sortId == null || sortId === '' || sortId >= Number.MAX_SAFE_INTEGER) {
      return '9223372036854775807';
    }

    return sortId;
  });
};

exports.getSafeSortIds = getSafeSortIds;

const buildChunkedOrFilter = (field, values, chunkSize = 1024) => {
  if (values.length === 0) {
    return undefined;
  }

  const chunkedValues = (0, _lodash.chunk)(values, chunkSize);
  return chunkedValues.map(subArray => {
    const joinedValues = subArray.map(value => `"${value}"`).join(' OR ');
    return `${field}: (${joinedValues})`;
  }).join(' OR ');
};

exports.buildChunkedOrFilter = buildChunkedOrFilter;

const isWrappedEventHit = event => {
  return !isWrappedSignalHit(event) && !isWrappedRACAlert(event);
};

exports.isWrappedEventHit = isWrappedEventHit;

const isWrappedSignalHit = event => {
  var _source;

  return (event === null || event === void 0 ? void 0 : (_source = event._source) === null || _source === void 0 ? void 0 : _source.signal) != null;
};

exports.isWrappedSignalHit = isWrappedSignalHit;

const isWrappedRACAlert = event => {
  var _source2;

  return (event === null || event === void 0 ? void 0 : (_source2 = event._source) === null || _source2 === void 0 ? void 0 : _source2[_ruleDataUtils.ALERT_INSTANCE_ID]) != null;
};

exports.isWrappedRACAlert = isWrappedRACAlert;
const racFieldMappings = {
  'signal.rule.id': _ruleDataUtils.ALERT_RULE_UUID
};
exports.racFieldMappings = racFieldMappings;

const getField = (event, field) => {
  if (isWrappedRACAlert(event)) {
    var _racFieldMappings$fie;

    const mappedField = (_racFieldMappings$fie = racFieldMappings[field]) !== null && _racFieldMappings$fie !== void 0 ? _racFieldMappings$fie : field.replace('signal', 'kibana.alert');
    return (0, _lodash.get)(event._source, mappedField);
  } else if (isWrappedSignalHit(event)) {
    return (0, _lodash.get)(event._source, field);
  } else if (isWrappedEventHit(event)) {
    return (0, _lodash.get)(event._source, field);
  }
};
/**
 * Maps legacy rule types to RAC rule type IDs.
 */


exports.getField = getField;
const ruleTypeMappings = {
  eql: _constants.EQL_RULE_TYPE_ID,
  machine_learning: _constants.ML_RULE_TYPE_ID,
  query: _constants.QUERY_RULE_TYPE_ID,
  saved_query: _constants.SIGNALS_ID,
  threat_match: _constants.INDICATOR_RULE_TYPE_ID,
  threshold: _constants.THRESHOLD_RULE_TYPE_ID
};
exports.ruleTypeMappings = ruleTypeMappings;