"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logMissingSavedObjectError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This will log a warning that we are missing an object reference.
 * @param logger The kibana injected logger
 * @param exceptionItem The exception item to log the warning out as
 */

const logMissingSavedObjectError = ({
  logger,
  exceptionItem
}) => {
  logger.error(['The saved object references were not found for our exception list when we were expecting to find it. ', 'Kibana migrations might not have run correctly or someone might have removed the saved object references manually. ', 'Returning the last known good exception list id which might not work. exceptionItem with its id being returned is: ', JSON.stringify(exceptionItem)].join(''));
};

exports.logMissingSavedObjectError = logMissingSavedObjectError;