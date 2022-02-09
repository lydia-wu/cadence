"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchAfterAndBulkCreate = void 0;

var _lodash = require("lodash");

var _single_search_after = require("./single_search_after");

var _filter_events_against_list = require("./filters/filter_events_against_list");

var _send_telemetry_events = require("./send_telemetry_events");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// search_after through documents and re-index using bulk endpoint.


const searchAfterAndBulkCreate = async ({
  tuple,
  ruleSO,
  exceptionsList,
  services,
  listClient,
  logger,
  eventsTelemetry,
  inputIndexPattern,
  filter,
  pageSize,
  buildRuleMessage,
  buildReasonMessage,
  enrichment = _lodash.identity,
  bulkCreate,
  wrapHits,
  sortOrder,
  trackTotalHits
}) => {
  const ruleParams = ruleSO.attributes.params;
  let toReturn = (0, _utils.createSearchAfterReturnType)(); // sortId tells us where to start our next consecutive search_after query

  let sortIds;
  let hasSortId = true; // default to true so we execute the search on initial run
  // signalsCreatedCount keeps track of how many signals we have created,
  // to ensure we don't exceed maxSignals

  let signalsCreatedCount = 0;

  if (tuple == null || tuple.to == null || tuple.from == null) {
    logger.error(buildRuleMessage(`[-] malformed date tuple`));
    return (0, _utils.createSearchAfterReturnType)({
      success: false,
      errors: ['malformed date tuple']
    });
  }

  signalsCreatedCount = 0;

  while (signalsCreatedCount < tuple.maxSignals) {
    try {
      let mergedSearchResults = (0, _utils.createSearchResultReturnType)();
      logger.debug(buildRuleMessage(`sortIds: ${sortIds}`));

      if (hasSortId) {
        var _searchResult$hits$hi;

        const {
          searchResult,
          searchDuration,
          searchErrors
        } = await (0, _single_search_after.singleSearchAfter)({
          buildRuleMessage,
          searchAfterSortIds: sortIds,
          index: inputIndexPattern,
          from: tuple.from.toISOString(),
          to: tuple.to.toISOString(),
          services,
          logger,
          // @ts-expect-error please, declare a type explicitly instead of unknown
          filter,
          pageSize: Math.ceil(Math.min(tuple.maxSignals, pageSize)),
          timestampOverride: ruleParams.timestampOverride,
          trackTotalHits,
          sortOrder
        });
        mergedSearchResults = (0, _utils.mergeSearchResults)([mergedSearchResults, searchResult]);
        toReturn = (0, _utils.mergeReturns)([toReturn, (0, _utils.createSearchAfterReturnTypeFromResponse)({
          searchResult: mergedSearchResults,
          timestampOverride: ruleParams.timestampOverride
        }), (0, _utils.createSearchAfterReturnType)({
          searchAfterTimes: [searchDuration],
          errors: searchErrors
        })]);
        const lastSortIds = (0, _utils.getSafeSortIds)((_searchResult$hits$hi = searchResult.hits.hits[searchResult.hits.hits.length - 1]) === null || _searchResult$hits$hi === void 0 ? void 0 : _searchResult$hits$hi.sort);

        if (lastSortIds != null && lastSortIds.length !== 0) {
          sortIds = lastSortIds;
          hasSortId = true;
        } else {
          hasSortId = false;
        }
      } // determine if there are any candidate signals to be processed


      const totalHits = (0, _utils.getTotalHitsValue)(mergedSearchResults.hits.total);
      logger.debug(buildRuleMessage(`totalHits: ${totalHits}`));
      logger.debug(buildRuleMessage(`searchResult.hit.hits.length: ${mergedSearchResults.hits.hits.length}`));

      if (totalHits === 0 || mergedSearchResults.hits.hits.length === 0) {
        logger.debug(buildRuleMessage(`${totalHits === 0 ? 'totalHits' : 'searchResult.hits.hits.length'} was 0, exiting early`));
        break;
      } // filter out the search results that match with the values found in the list.
      // the resulting set are signals to be indexed, given they are not duplicates
      // of signals already present in the signals index.


      const filteredEvents = await (0, _filter_events_against_list.filterEventsAgainstList)({
        listClient,
        exceptionsList,
        logger,
        eventSearchResult: mergedSearchResults,
        buildRuleMessage
      }); // only bulk create if there are filteredEvents leftover
      // if there isn't anything after going through the value list filter
      // skip the call to bulk create and proceed to the next search_after,
      // if there is a sort id to continue the search_after with.

      if (filteredEvents.hits.hits.length !== 0) {
        // make sure we are not going to create more signals than maxSignals allows
        if (signalsCreatedCount + filteredEvents.hits.hits.length > tuple.maxSignals) {
          filteredEvents.hits.hits = filteredEvents.hits.hits.slice(0, tuple.maxSignals - signalsCreatedCount);
        }

        const enrichedEvents = await enrichment(filteredEvents);
        const wrappedDocs = wrapHits(enrichedEvents.hits.hits, buildReasonMessage);
        const {
          bulkCreateDuration: bulkDuration,
          createdItemsCount: createdCount,
          createdItems,
          success: bulkSuccess,
          errors: bulkErrors
        } = await bulkCreate(wrappedDocs);
        toReturn = (0, _utils.mergeReturns)([toReturn, (0, _utils.createSearchAfterReturnType)({
          success: bulkSuccess,
          createdSignalsCount: createdCount,
          createdSignals: createdItems,
          bulkCreateTimes: bulkDuration ? [bulkDuration] : undefined,
          errors: bulkErrors
        })]);
        signalsCreatedCount += createdCount;
        logger.debug(buildRuleMessage(`created ${createdCount} signals`));
        logger.debug(buildRuleMessage(`signalsCreatedCount: ${signalsCreatedCount}`));
        logger.debug(buildRuleMessage(`enrichedEvents.hits.hits: ${enrichedEvents.hits.hits.length}`));
        (0, _send_telemetry_events.sendAlertTelemetryEvents)(logger, eventsTelemetry, enrichedEvents, buildRuleMessage);
      }

      if (!hasSortId) {
        logger.debug(buildRuleMessage('ran out of sort ids to sort on'));
        break;
      }
    } catch (exc) {
      logger.error(buildRuleMessage(`[-] search_after_bulk_create threw an error ${exc}`));
      return (0, _utils.mergeReturns)([toReturn, (0, _utils.createSearchAfterReturnType)({
        success: false,
        errors: [`${exc}`]
      })]);
    }
  }

  logger.debug(buildRuleMessage(`[+] completed bulk index of ${toReturn.createdSignalsCount}`));
  return toReturn;
};

exports.searchAfterAndBulkCreate = searchAfterAndBulkCreate;