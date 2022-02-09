"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeZoneFactory = exports.getFormatFactory = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getUiSettings = (coreStart, context) => {
  var _context$getKibanaReq;

  const kibanaRequest = (_context$getKibanaReq = context.getKibanaRequest) === null || _context$getKibanaReq === void 0 ? void 0 : _context$getKibanaReq.call(context);

  if (!kibanaRequest) {
    throw new Error('expression function cannot be executed without a KibanaRequest');
  }

  return coreStart.uiSettings.asScopedToClient(coreStart.savedObjects.getScopedClient(kibanaRequest));
};
/** @internal **/


const getFormatFactory = core => async context => {
  const [coreStart, {
    fieldFormats: fieldFormatsStart
  }] = await core.getStartServices();
  const fieldFormats = await fieldFormatsStart.fieldFormatServiceFactory(getUiSettings(coreStart, context));
  return fieldFormats.deserialize;
};
/** @internal **/


exports.getFormatFactory = getFormatFactory;

const getTimeZoneFactory = core => async context => {
  const [coreStart] = await core.getStartServices();
  const uiSettings = await getUiSettings(coreStart, context);
  const timezone = await uiSettings.get('dateFormat:tz');
  /** if `Browser`, hardcode it to 'UTC' so the export has data that makes sense **/

  return timezone === 'Browser' ? 'UTC' : timezone;
};

exports.getTimeZoneFactory = getTimeZoneFactory;