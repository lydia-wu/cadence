"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttachmentService = void 0;

var _common = require("../../../common");

var _utils = require("../../client/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class AttachmentService {
  constructor(log) {
    this.log = log;
  }
  /**
   * Retrieves all the alerts attached to a case.
   */


  async getAllAlertsAttachToCase({
    unsecuredSavedObjectsClient,
    caseId,
    filter
  }) {
    try {
      this.log.debug(`Attempting to GET all alerts for case id ${caseId}`);
      const alertsFilter = (0, _utils.buildFilter)({
        filters: [_common.CommentType.alert, _common.CommentType.generatedAlert],
        field: 'type',
        operator: 'or',
        type: _common.CASE_COMMENT_SAVED_OBJECT
      });
      const combinedFilter = (0, _utils.combineFilters)([alertsFilter, filter]);
      const finder = unsecuredSavedObjectsClient.createPointInTimeFinder({
        type: _common.CASE_COMMENT_SAVED_OBJECT,
        hasReference: {
          type: _common.CASE_SAVED_OBJECT,
          id: caseId
        },
        sortField: 'created_at',
        sortOrder: 'asc',
        filter: combinedFilter,
        perPage: _common.MAX_DOCS_PER_PAGE
      });
      let result = [];

      for await (const userActionSavedObject of finder.find()) {
        result = result.concat(userActionSavedObject.saved_objects);
      }

      return result;
    } catch (error) {
      this.log.error(`Error on GET all alerts for case id ${caseId}: ${error}`);
      throw error;
    }
  }

  async get({
    unsecuredSavedObjectsClient,
    attachmentId
  }) {
    try {
      this.log.debug(`Attempting to GET attachment ${attachmentId}`);
      return await unsecuredSavedObjectsClient.get(_common.CASE_COMMENT_SAVED_OBJECT, attachmentId);
    } catch (error) {
      this.log.error(`Error on GET attachment ${attachmentId}: ${error}`);
      throw error;
    }
  }

  async delete({
    unsecuredSavedObjectsClient,
    attachmentId
  }) {
    try {
      this.log.debug(`Attempting to DELETE attachment ${attachmentId}`);
      return await unsecuredSavedObjectsClient.delete(_common.CASE_COMMENT_SAVED_OBJECT, attachmentId);
    } catch (error) {
      this.log.error(`Error on DELETE attachment ${attachmentId}: ${error}`);
      throw error;
    }
  }

  async create({
    unsecuredSavedObjectsClient,
    attributes,
    references,
    id
  }) {
    try {
      this.log.debug(`Attempting to POST a new comment`);
      return await unsecuredSavedObjectsClient.create(_common.CASE_COMMENT_SAVED_OBJECT, attributes, {
        references,
        id
      });
    } catch (error) {
      this.log.error(`Error on POST a new comment: ${error}`);
      throw error;
    }
  }

  async update({
    unsecuredSavedObjectsClient,
    attachmentId,
    updatedAttributes,
    options
  }) {
    try {
      this.log.debug(`Attempting to UPDATE comment ${attachmentId}`);
      return await unsecuredSavedObjectsClient.update(_common.CASE_COMMENT_SAVED_OBJECT, attachmentId, updatedAttributes, options);
    } catch (error) {
      this.log.error(`Error on UPDATE comment ${attachmentId}: ${error}`);
      throw error;
    }
  }

  async bulkUpdate({
    unsecuredSavedObjectsClient,
    comments
  }) {
    try {
      this.log.debug(`Attempting to UPDATE comments ${comments.map(c => c.attachmentId).join(', ')}`);
      return await unsecuredSavedObjectsClient.bulkUpdate(comments.map(c => ({
        type: _common.CASE_COMMENT_SAVED_OBJECT,
        id: c.attachmentId,
        attributes: c.updatedAttributes,
        ...c.options
      })));
    } catch (error) {
      this.log.error(`Error on UPDATE comments ${comments.map(c => c.attachmentId).join(', ')}: ${error}`);
      throw error;
    }
  }

}

exports.AttachmentService = AttachmentService;