"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCloud = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCloud = ({
  isCloudEnabled
}) => {
  const cloud = {
    isCloudEnabled,
    baseUrl: 'https://base.url',
    cloudId: 'cloud-id',
    cname: 'found.io',
    deploymentUrl: 'https://deployment.url',
    organizationUrl: 'https://organization.url',
    profileUrl: 'https://profile.url',
    snapshotsUrl: 'https://snapshots.url'
  };
  return cloud;
};

exports.getCloud = getCloud;