"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compatibilityShim = compatibilityShim;

var _server = require("../../../../../../../src/plugins/kibana_utils/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isLegacyJob(jobParams) {
  return jobParams.savedObjectId != null;
}

const getSavedObjectTitle = async (objectType, savedObjectId, savedObjectsClient) => {
  const savedObject = await savedObjectsClient.get(objectType, savedObjectId);
  return savedObject.attributes.title;
};

const getSavedObjectRelativeUrl = (objectType, savedObjectId, queryString) => {
  const appPrefixes = {
    dashboard: '/dashboard/',
    visualization: '/visualize/edit/',
    search: '/discover/'
  };
  const appPrefix = appPrefixes[objectType];
  if (!appPrefix) throw new Error('Unexpected app type: ' + objectType);

  const hash = appPrefix + _server.url.encodeUriQuery(savedObjectId, true);

  return `/app/kibana#${hash}?${queryString || ''}`;
};
/*
 * The compatibility shim is responsible for migrating an older shape of the
 * PDF Job Params into a newer shape, by deriving a report title and relative
 * URL from a savedObjectId and queryString.
 */


function compatibilityShim(createJobFn, logger) {
  return async function (jobParams, context) {
    let kibanaRelativeUrls = jobParams.relativeUrls;
    let reportTitle = jobParams.title;
    let isDeprecated = false;

    if (jobParams.savedObjectId && jobParams.relativeUrls) {
      throw new Error(`savedObjectId should not be provided if relativeUrls are provided`);
    }

    if (isLegacyJob(jobParams)) {
      const {
        savedObjectId,
        objectType,
        queryString
      } = jobParams; // input validation and deprecation logging

      if (typeof savedObjectId !== 'string') {
        throw new Error('Invalid savedObjectId (deprecated). String is expected.');
      }

      if (typeof objectType !== 'string') {
        throw new Error('Invalid objectType (deprecated). String is expected.');
      } // legacy parameters need to be converted into a relative URL


      kibanaRelativeUrls = [getSavedObjectRelativeUrl(objectType, savedObjectId, queryString)];
      logger.warn(`The relativeUrls have been derived from saved object parameters. ` + `This functionality will be removed with the next major version.`); // legacy parameters might need to get the title from the saved object

      if (!reportTitle) {
        try {
          reportTitle = await getSavedObjectTitle(objectType, savedObjectId, context.core.savedObjects.client);
          logger.warn(`The title has been derived from saved object parameters. This ` + `functionality will be removed with the next major version.`);
        } catch (err) {
          logger.error(err); // 404 for the savedObjectId, etc

          throw err;
        }
      }

      isDeprecated = true;
    }

    if (typeof reportTitle !== 'string') {
      logger.warn(`A title parameter should be provided with the job generation ` + `request. Please use Kibana to regenerate your POST URL to have a ` + `title included in the PDF.`);
      reportTitle = '';
    }

    const transformedJobParams = { ...jobParams,
      title: reportTitle,
      relativeUrls: kibanaRelativeUrls,
      isDeprecated // tack on this flag so it will be saved the TaskPayload

    };
    return await createJobFn(transformedJobParams, context);
  };
}