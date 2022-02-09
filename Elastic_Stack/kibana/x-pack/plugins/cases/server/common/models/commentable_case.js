"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentableCase = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _common = require("../../../common");

var _ = require("..");

var _error = require("../error");

var _index = require("../index");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This class represents a case that can have a comment attached to it. This includes
 * a Sub Case, Case, and Collection.
 */


class CommentableCase {
  constructor({
    collection,
    subCase,
    unsecuredSavedObjectsClient,
    caseService,
    attachmentService,
    logger,
    lensEmbeddableFactory
  }) {
    (0, _defineProperty2.default)(this, "collection", void 0);
    (0, _defineProperty2.default)(this, "subCase", void 0);
    (0, _defineProperty2.default)(this, "unsecuredSavedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "caseService", void 0);
    (0, _defineProperty2.default)(this, "attachmentService", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "lensEmbeddableFactory", void 0);
    this.collection = collection;
    this.subCase = subCase;
    this.unsecuredSavedObjectsClient = unsecuredSavedObjectsClient;
    this.caseService = caseService;
    this.attachmentService = attachmentService;
    this.logger = logger;
    this.lensEmbeddableFactory = lensEmbeddableFactory;
  }

  get status() {
    var _this$subCase$attribu, _this$subCase;

    return (_this$subCase$attribu = (_this$subCase = this.subCase) === null || _this$subCase === void 0 ? void 0 : _this$subCase.attributes.status) !== null && _this$subCase$attribu !== void 0 ? _this$subCase$attribu : this.collection.attributes.status;
  }
  /**
   * This property is used to abstract away which element is actually being acted upon in this class.
   * If the sub case was initialized then it will be the focus of creating comments. So if you want the id
   * of the saved object that the comment is primarily being attached to use this property.
   *
   * This is a little confusing because the created comment will have references to both the sub case and the
   * collection but from the UI's perspective only the sub case really has the comment attached to it.
   */


  get id() {
    var _this$subCase$id, _this$subCase2;

    return (_this$subCase$id = (_this$subCase2 = this.subCase) === null || _this$subCase2 === void 0 ? void 0 : _this$subCase2.id) !== null && _this$subCase$id !== void 0 ? _this$subCase$id : this.collection.id;
  }

  get settings() {
    return this.collection.attributes.settings;
  }
  /**
   * These functions break the abstraction of this class but they are needed to build the comment user action item.
   * Another potential solution would be to implement another function that handles creating the user action in this
   * class so that we don't need to expose these properties.
   */


  get caseId() {
    return this.collection.id;
  }

  get subCaseId() {
    var _this$subCase3;

    return (_this$subCase3 = this.subCase) === null || _this$subCase3 === void 0 ? void 0 : _this$subCase3.id;
  }

  get owner() {
    return this.collection.attributes.owner;
  }

  buildRefsToCase() {
    const subCaseSOType = _common.SUB_CASE_SAVED_OBJECT;
    const caseSOType = _common.CASE_SAVED_OBJECT;
    return [{
      type: caseSOType,
      name: `associated-${caseSOType}`,
      id: this.collection.id
    }, ...(this.subCase ? [{
      type: subCaseSOType,
      name: `associated-${subCaseSOType}`,
      id: this.subCase.id
    }] : [])];
  }

  async update({
    date,
    user
  }) {
    try {
      var _updatedCase$version;

      let updatedSubCaseAttributes;

      if (this.subCase) {
        var _updatedSubCase$versi;

        const updatedSubCase = await this.caseService.patchSubCase({
          unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
          subCaseId: this.subCase.id,
          updatedAttributes: {
            updated_at: date,
            updated_by: { ...user
            }
          },
          version: this.subCase.version
        });
        updatedSubCaseAttributes = { ...this.subCase,
          attributes: { ...this.subCase.attributes,
            ...updatedSubCase.attributes
          },
          version: (_updatedSubCase$versi = updatedSubCase.version) !== null && _updatedSubCase$versi !== void 0 ? _updatedSubCase$versi : this.subCase.version
        };
      }

      const updatedCase = await this.caseService.patchCase({
        originalCase: this.collection,
        unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
        caseId: this.collection.id,
        updatedAttributes: {
          updated_at: date,
          updated_by: { ...user
          }
        },
        version: this.collection.version
      }); // this will contain the updated sub case information if the sub case was defined initially

      return new CommentableCase({
        collection: { ...this.collection,
          attributes: { ...this.collection.attributes,
            ...updatedCase.attributes
          },
          version: (_updatedCase$version = updatedCase.version) !== null && _updatedCase$version !== void 0 ? _updatedCase$version : this.collection.version
        },
        subCase: updatedSubCaseAttributes,
        unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
        caseService: this.caseService,
        attachmentService: this.attachmentService,
        logger: this.logger,
        lensEmbeddableFactory: this.lensEmbeddableFactory
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update commentable case, sub case id: ${this.subCaseId} case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }
  /**
   * Update a comment and update the corresponding case's update_at and updated_by fields.
   */


  async updateComment({
    updateRequest,
    updatedAt,
    user
  }) {
    try {
      const {
        id,
        version,
        ...queryRestAttributes
      } = updateRequest;
      const options = {
        version
      };

      if (queryRestAttributes.type === _common.CommentType.user && queryRestAttributes !== null && queryRestAttributes !== void 0 && queryRestAttributes.comment) {
        const currentComment = await this.attachmentService.get({
          unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
          attachmentId: id
        });
        const updatedReferences = (0, _utils.getOrUpdateLensReferences)(this.lensEmbeddableFactory, queryRestAttributes.comment, currentComment);
        options.references = updatedReferences;
      }

      const [comment, commentableCase] = await Promise.all([this.attachmentService.update({
        unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
        attachmentId: id,
        updatedAttributes: { ...queryRestAttributes,
          updated_at: updatedAt,
          updated_by: user
        },
        options
      }), this.update({
        date: updatedAt,
        user
      })]);
      return {
        comment,
        commentableCase
      };
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update comment in commentable case, sub case id: ${this.subCaseId} case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }
  /**
   * Create a new comment on the appropriate case. This updates the case's updated_at and updated_by fields.
   */


  async createComment({
    createdDate,
    user,
    commentReq,
    id
  }) {
    try {
      if (commentReq.type === _common.CommentType.alert) {
        if (this.status === _common.CaseStatuses.closed) {
          throw _boom.default.badRequest('Alert cannot be attached to a closed case');
        }

        if (!this.subCase && this.collection.attributes.type === _common.CaseType.collection) {
          throw _boom.default.badRequest('Alert cannot be attached to a collection case');
        }
      }

      if (commentReq.owner !== this.owner) {
        throw _boom.default.badRequest('The owner field of the comment must match the case');
      }

      let references = this.buildRefsToCase();

      if (commentReq.type === _common.CommentType.user && commentReq !== null && commentReq !== void 0 && commentReq.comment) {
        const commentStringReferences = (0, _utils.getOrUpdateLensReferences)(this.lensEmbeddableFactory, commentReq.comment);
        references = [...references, ...commentStringReferences];
      }

      const [comment, commentableCase] = await Promise.all([this.attachmentService.create({
        unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
        attributes: (0, _.transformNewComment)({
          associationType: this.subCase ? _common.AssociationType.subCase : _common.AssociationType.case,
          createdDate,
          ...commentReq,
          ...user
        }),
        references,
        id
      }), this.update({
        date: createdDate,
        user
      })]);
      return {
        comment,
        commentableCase
      };
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed creating a comment on a commentable case, sub case id: ${this.subCaseId} case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  formatCollectionForEncoding(totalComment) {
    var _this$collection$vers;

    return {
      id: this.collection.id,
      version: (_this$collection$vers = this.collection.version) !== null && _this$collection$vers !== void 0 ? _this$collection$vers : '0',
      totalComment,
      ...this.collection.attributes
    };
  }

  async encode() {
    try {
      var _countAlertsForID;

      const collectionComments = await this.caseService.getAllCaseComments({
        unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
        id: this.collection.id,
        options: {
          fields: [],
          page: 1,
          perPage: _common.MAX_DOCS_PER_PAGE
        }
      });
      const collectionTotalAlerts = (_countAlertsForID = (0, _index.countAlertsForID)({
        comments: collectionComments,
        id: this.collection.id
      })) !== null && _countAlertsForID !== void 0 ? _countAlertsForID : 0;
      const caseResponse = {
        comments: (0, _.flattenCommentSavedObjects)(collectionComments.saved_objects),
        totalAlerts: collectionTotalAlerts,
        ...this.formatCollectionForEncoding(collectionComments.total)
      };

      if (this.subCase) {
        var _countAlertsForID2;

        const subCaseComments = await this.caseService.getAllSubCaseComments({
          unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
          id: this.subCase.id
        });
        const totalAlerts = (_countAlertsForID2 = (0, _index.countAlertsForID)({
          comments: subCaseComments,
          id: this.subCase.id
        })) !== null && _countAlertsForID2 !== void 0 ? _countAlertsForID2 : 0;
        return _common.CaseResponseRt.encode({ ...caseResponse,

          /**
           * For now we need the sub case comments and totals to be exposed on the top level of the response so that the UI
           * functionality can stay the same. Ideally in the future we can refactor this so that the UI will look for the
           * comments either in the top level for a case or a collection or in the subCases field if it is a sub case.
           *
           * If we ever need to return both the collection's comments and the sub case comments we'll need to refactor it then
           * as well.
           */
          comments: (0, _.flattenCommentSavedObjects)(subCaseComments.saved_objects),
          totalComment: subCaseComments.saved_objects.length,
          totalAlerts,
          subCases: [(0, _.flattenSubCaseSavedObject)({
            savedObject: this.subCase,
            totalComment: subCaseComments.saved_objects.length,
            totalAlerts
          })]
        });
      }

      return _common.CaseResponseRt.encode(caseResponse);
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed encoding the commentable case, sub case id: ${this.subCaseId} case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

}

exports.CommentableCase = CommentableCase;