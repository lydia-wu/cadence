"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAUTH_CLIENT_CREDENTIALS_GRANT_TYPE = void 0;
exports.requestOAuthClientCredentialsToken = requestOAuthClientCredentialsToken;

var _queryString = _interopRequireDefault(require("query-string"));

var _axios = _interopRequireDefault(require("axios"));

var _jsonStableStringify = _interopRequireDefault(require("json-stable-stringify"));

var _axios_utils = require("./axios_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const OAUTH_CLIENT_CREDENTIALS_GRANT_TYPE = 'client_credentials';
exports.OAUTH_CLIENT_CREDENTIALS_GRANT_TYPE = OAUTH_CLIENT_CREDENTIALS_GRANT_TYPE;

async function requestOAuthClientCredentialsToken(tokenUrl, logger, params, configurationUtilities) {
  const axiosInstance = _axios.default.create();

  const {
    clientId,
    clientSecret,
    scope
  } = params;
  const res = await (0, _axios_utils.request)({
    axios: axiosInstance,
    url: tokenUrl,
    method: 'post',
    logger,
    data: _queryString.default.stringify({
      scope,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: OAUTH_CLIENT_CREDENTIALS_GRANT_TYPE
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    configurationUtilities,
    validateStatus: () => true
  });

  if (res.status === 200) {
    return {
      tokenType: res.data.token_type,
      accessToken: res.data.access_token,
      expiresIn: res.data.expires_in
    };
  } else {
    const errString = (0, _jsonStableStringify.default)(res.data);
    logger.warn(`error thrown getting the access token from ${tokenUrl} for clientID: ${clientId}: ${errString}`);
    throw new Error(errString);
  }
}