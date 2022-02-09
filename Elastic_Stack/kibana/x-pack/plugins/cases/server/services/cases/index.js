"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CasesService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pMap = _interopRequireDefault(require("p-map"));

var _common = require("../../../../../../src/plugins/data/common");

var _common2 = require("../../../common");

var _common3 = require("../../common");

var _api = require("../../routes/api");

var _utils = require("../../client/utils");

var _utils2 = require("../../authorization/utils");

var _transform = require("./transform");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const transformNewSubCase = ({
  createdAt,
  createdBy,
  owner
}) => {
  return {
    closed_at: null,
    closed_by: null,
    created_at: createdAt,
    created_by: createdBy,
    status: _common2.CaseStatuses.open,
    updated_at: null,
    updated_by: null,
    owner
  };
};

class CasesService {
  constructor(log, authentication) {
    (0, _defineProperty2.default)(this, "buildCaseIdsAggs", (size = 100) => ({
      references: {
        nested: {
          path: `${_common2.CASE_COMMENT_SAVED_OBJECT}.references`
        },
        aggregations: {
          caseIds: {
            terms: {
              field: `${_common2.CASE_COMMENT_SAVED_OBJECT}.references.id`,
              size
            }
          }
        }
      }
    }));
    this.log = log;
    this.authentication = authentication;
  }

  async getCaseIdsByAlertId({
    unsecuredSavedObjectsClient,
    alertId,
    filter
  }) {
    try {
      this.log.debug(`Attempting to GET all cases for alert id ${alertId}`);
      const combinedFilter = (0, _utils.combineFilters)([_common.nodeBuilder.is(`${_common2.CASE_COMMENT_SAVED_OBJECT}.attributes.alertId`, alertId), filter]);
      const response = await unsecuredSavedObjectsClient.find({
        type: _common2.CASE_COMMENT_SAVED_OBJECT,
        fields: (0, _utils2.includeFieldsRequiredForAuthentication)(),
        page: 1,
        perPage: 1,
        sortField: _common3.defaultSortField,
        aggs: this.buildCaseIdsAggs(_common2.MAX_DOCS_PER_PAGE),
        filter: combinedFilter
      });
      return response;
    } catch (error) {
      this.log.error(`Error on GET all cases for alert id ${alertId}: ${error}`);
      throw error;
    }
  }
  /**
   * Extracts the case IDs from the alert aggregation
   */


  static getCaseIDsFromAlertAggs(result) {
    var _result$aggregations$, _result$aggregations;

    return (_result$aggregations$ = (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : _result$aggregations.references.caseIds.buckets.map(b => b.key)) !== null && _result$aggregations$ !== void 0 ? _result$aggregations$ : [];
  }
  /**
   * Returns a map of all cases combined with their sub cases if they are collections.
   */


  async findCasesGroupedByID({
    unsecuredSavedObjectsClient,
    caseOptions,
    subCaseOptions
  }) {
    const cases = await this.findCases({
      unsecuredSavedObjectsClient,
      options: caseOptions
    });
    const subCasesResp = _common2.ENABLE_CASE_CONNECTOR ? await this.findSubCasesGroupByCase({
      unsecuredSavedObjectsClient,
      options: subCaseOptions,
      ids: cases.saved_objects.filter(caseInfo => caseInfo.attributes.type === _common2.CaseType.collection).map(caseInfo => caseInfo.id)
    }) : {
      subCasesMap: new Map(),
      page: 0,
      perPage: 0
    };
    const casesMap = cases.saved_objects.reduce((accMap, caseInfo) => {
      const subCasesForCase = subCasesResp.subCasesMap.get(caseInfo.id);
      /**
       * If this case is an individual add it to the return map
       * If it is a collection and it has sub cases add it to the return map
       * If it is a collection and it does not have sub cases, check and see if we're filtering on a status,
       *  if we're filtering on a status then exclude the empty collection from the results
       *  if we're not filtering on a status then include the empty collection (that way we can display all the collections
       *  when the UI isn't doing any filtering)
       */

      if (caseInfo.attributes.type === _common2.CaseType.individual || subCasesForCase !== undefined || !caseOptions.status) {
        accMap.set(caseInfo.id, {
          case: caseInfo,
          subCases: subCasesForCase
        });
      }

      return accMap;
    }, new Map());
    /**
     * One potential optimization here is to get all comment stats for individual cases, parent cases, and sub cases
     * in a single request. This can be done because comments that are for sub cases have a reference to both the sub case
     * and the parent. The associationType field allows us to determine which type of case the comment is attached to.
     *
     * So we could use the ids for all the valid cases (individual cases and parents with sub cases) to grab everything.
     * Once we have it we can build the maps.
     *
     * Currently we get all comment stats for all sub cases in one go and we get all comment stats for cases (individual and parent)
     * in another request (the one below this comment).
     */

    const totalCommentsForCases = await this.getCaseCommentStats({
      unsecuredSavedObjectsClient,
      ids: Array.from(casesMap.keys()),
      associationType: _common2.AssociationType.case
    });
    const casesWithComments = new Map();

    for (const [id, caseInfo] of casesMap.entries()) {
      var _totalCommentsForCase, _totalCommentsForCase2;

      casesWithComments.set(id, (0, _common3.flattenCaseSavedObject)({
        savedObject: caseInfo.case,
        totalComment: (_totalCommentsForCase = totalCommentsForCases.commentTotals.get(id)) !== null && _totalCommentsForCase !== void 0 ? _totalCommentsForCase : 0,
        totalAlerts: (_totalCommentsForCase2 = totalCommentsForCases.alertTotals.get(id)) !== null && _totalCommentsForCase2 !== void 0 ? _totalCommentsForCase2 : 0,
        subCases: caseInfo.subCases
      }));
    }

    return {
      casesMap: casesWithComments,
      page: cases.page,
      perPage: cases.per_page,
      total: cases.total
    };
  }
  /**
   * Retrieves the number of cases that exist with a given status (open, closed, etc).
   * This also counts sub cases. Parent cases are excluded from the statistics.
   */


  async findCaseStatusStats({
    unsecuredSavedObjectsClient,
    caseOptions,
    subCaseOptions,
    ensureSavedObjectsAreAuthorized
  }) {
    /**
     * This could be made more performant. What we're doing here is retrieving all cases
     * that match the API request's filters instead of just counts. This is because we need to grab
     * the ids for the parent cases that match those filters. Then we use those IDS to count how many
     * sub cases those parents have to calculate the total amount of cases that are open, closed, or in-progress.
     *
     * Another solution would be to store ALL filterable fields on both a case and sub case. That we could do a single
     * query for each type to calculate the totals using the filters. This has drawbacks though:
     *
     * We'd have to sync up the parent case's editable attributes with the sub case any time they were change to avoid
     * them getting out of sync and causing issues when we do these types of stats aggregations. This would result in a lot
     * of update requests if the user is editing their case details often. Which could potentially cause conflict failures.
     *
     * Another option is to prevent the ability from update the parent case's details all together once it's created. A user
     * could instead modify the sub case details directly. This could be weird though because individual sub cases for the same
     * parent would have different titles, tags, etc.
     *
     * Another potential issue with this approach is when you push a case and all its sub case information. If the sub cases
     * don't have the same title and tags, we'd need to account for that as well.
     */
    const cases = await this.findCases({
      unsecuredSavedObjectsClient,
      options: { ...caseOptions,
        fields: (0, _utils2.includeFieldsRequiredForAuthentication)([_common2.caseTypeField]),
        page: 1,
        perPage: _common2.MAX_DOCS_PER_PAGE
      }
    }); // make sure that the retrieved cases were correctly filtered by owner

    ensureSavedObjectsAreAuthorized(cases.saved_objects.map(caseInfo => ({
      id: caseInfo.id,
      owner: caseInfo.attributes.owner
    })));
    const caseIds = cases.saved_objects.filter(caseInfo => caseInfo.attributes.type === _common2.CaseType.collection).map(caseInfo => caseInfo.id);
    let subCasesTotal = 0;

    if (_common2.ENABLE_CASE_CONNECTOR && subCaseOptions) {
      subCasesTotal = await this.findSubCaseStatusStats({
        unsecuredSavedObjectsClient,
        options: subCaseOptions,
        ids: caseIds
      });
    }

    const total = cases.saved_objects.filter(caseInfo => caseInfo.attributes.type !== _common2.CaseType.collection).length + subCasesTotal;
    return total;
  }
  /**
   * Retrieves the comments attached to a case or sub case.
   */


  async getCommentsByAssociation({
    unsecuredSavedObjectsClient,
    id,
    associationType,
    options
  }) {
    if (associationType === _common2.AssociationType.subCase) {
      return this.getAllSubCaseComments({
        unsecuredSavedObjectsClient,
        id,
        options
      });
    } else {
      return this.getAllCaseComments({
        unsecuredSavedObjectsClient,
        id,
        options
      });
    }
  }
  /**
   * Returns the number of total comments and alerts for a case (or sub case)
   */


  async getCaseCommentStats({
    unsecuredSavedObjectsClient,
    ids,
    associationType
  }) {
    if (ids.length <= 0) {
      return {
        commentTotals: new Map(),
        alertTotals: new Map()
      };
    }

    const refType = associationType === _common2.AssociationType.case ? _common2.CASE_SAVED_OBJECT : _common2.SUB_CASE_SAVED_OBJECT;

    const getCommentsMapper = async id => this.getCommentsByAssociation({
      unsecuredSavedObjectsClient,
      associationType,
      id,
      options: {
        page: 1,
        perPage: 1
      }
    }); // Ensuring we don't too many concurrent get running.


    const allComments = await (0, _pMap.default)(ids, getCommentsMapper, {
      concurrency: _common2.MAX_CONCURRENT_SEARCHES
    });
    const alerts = await this.getCommentsByAssociation({
      unsecuredSavedObjectsClient,
      associationType,
      id: ids,
      options: {
        filter: _common.nodeBuilder.or([_common.nodeBuilder.is(`${_common2.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _common2.CommentType.alert), _common.nodeBuilder.is(`${_common2.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _common2.CommentType.generatedAlert)])
      }
    });

    const getID = comments => {
      var _comments$saved_objec;

      return comments.saved_objects.length > 0 ? (_comments$saved_objec = comments.saved_objects[0].references.find(ref => ref.type === refType)) === null || _comments$saved_objec === void 0 ? void 0 : _comments$saved_objec.id : undefined;
    };

    const groupedComments = allComments.reduce((acc, comments) => {
      const id = getID(comments);

      if (id) {
        acc.set(id, comments.total);
      }

      return acc;
    }, new Map());
    const groupedAlerts = (0, _common3.groupTotalAlertsByID)({
      comments: alerts
    });
    return {
      commentTotals: groupedComments,
      alertTotals: groupedAlerts
    };
  }
  /**
   * Returns all the sub cases for a set of case IDs. Comment statistics are also returned.
   */


  async findSubCasesGroupByCase({
    unsecuredSavedObjectsClient,
    options,
    ids
  }) {
    const getCaseID = subCase => {
      return subCase.references.length > 0 ? subCase.references[0].id : undefined;
    };

    const emptyResponse = {
      subCasesMap: new Map(),
      page: 0,
      perPage: 0,
      total: 0
    };

    if (!options) {
      return emptyResponse;
    }

    if (ids.length <= 0) {
      return emptyResponse;
    }

    const subCases = await this.findSubCases({
      unsecuredSavedObjectsClient,
      options: { ...options,
        hasReference: ids.map(id => {
          return {
            id,
            type: _common2.CASE_SAVED_OBJECT
          };
        })
      }
    });
    const subCaseComments = await this.getCaseCommentStats({
      unsecuredSavedObjectsClient,
      ids: subCases.saved_objects.map(subCase => subCase.id),
      associationType: _common2.AssociationType.subCase
    });
    const subCasesMap = subCases.saved_objects.reduce((accMap, subCase) => {
      const parentCaseID = getCaseID(subCase);

      if (parentCaseID) {
        const subCaseFromMap = accMap.get(parentCaseID);

        if (subCaseFromMap === undefined) {
          var _subCaseComments$comm, _subCaseComments$aler;

          const subCasesForID = [(0, _common3.flattenSubCaseSavedObject)({
            savedObject: subCase,
            totalComment: (_subCaseComments$comm = subCaseComments.commentTotals.get(subCase.id)) !== null && _subCaseComments$comm !== void 0 ? _subCaseComments$comm : 0,
            totalAlerts: (_subCaseComments$aler = subCaseComments.alertTotals.get(subCase.id)) !== null && _subCaseComments$aler !== void 0 ? _subCaseComments$aler : 0
          })];
          accMap.set(parentCaseID, subCasesForID);
        } else {
          var _subCaseComments$comm2, _subCaseComments$aler2;

          subCaseFromMap.push((0, _common3.flattenSubCaseSavedObject)({
            savedObject: subCase,
            totalComment: (_subCaseComments$comm2 = subCaseComments.commentTotals.get(subCase.id)) !== null && _subCaseComments$comm2 !== void 0 ? _subCaseComments$comm2 : 0,
            totalAlerts: (_subCaseComments$aler2 = subCaseComments.alertTotals.get(subCase.id)) !== null && _subCaseComments$aler2 !== void 0 ? _subCaseComments$aler2 : 0
          }));
        }
      }

      return accMap;
    }, new Map());
    return {
      subCasesMap,
      page: subCases.page,
      perPage: subCases.per_page,
      total: subCases.total
    };
  }
  /**
   * Calculates the number of sub cases for a given set of options for a set of case IDs.
   */


  async findSubCaseStatusStats({
    unsecuredSavedObjectsClient,
    options,
    ids
  }) {
    if (ids.length <= 0) {
      return 0;
    }

    const subCases = await this.findSubCases({
      unsecuredSavedObjectsClient,
      options: { ...options,
        page: 1,
        perPage: 1,
        fields: [],
        hasReference: ids.map(id => {
          return {
            id,
            type: _common2.CASE_SAVED_OBJECT
          };
        })
      }
    });
    return subCases.total;
  }

  async createSubCase({
    unsecuredSavedObjectsClient,
    createdAt,
    caseId,
    createdBy
  }) {
    try {
      this.log.debug(`Attempting to POST a new sub case`);
      return unsecuredSavedObjectsClient.create(_common2.SUB_CASE_SAVED_OBJECT, // ENABLE_CASE_CONNECTOR: populate the owner field correctly
      transformNewSubCase({
        createdAt,
        createdBy,
        owner: ''
      }), {
        references: [{
          type: _common2.CASE_SAVED_OBJECT,
          name: `associated-${_common2.CASE_SAVED_OBJECT}`,
          id: caseId
        }]
      });
    } catch (error) {
      this.log.error(`Error on POST a new sub case for id ${caseId}: ${error}`);
      throw error;
    }
  }

  async getMostRecentSubCase(unsecuredSavedObjectsClient, caseId) {
    try {
      this.log.debug(`Attempting to find most recent sub case for caseID: ${caseId}`);
      const subCases = await unsecuredSavedObjectsClient.find({
        perPage: 1,
        sortField: 'created_at',
        sortOrder: 'desc',
        type: _common2.SUB_CASE_SAVED_OBJECT,
        hasReference: {
          type: _common2.CASE_SAVED_OBJECT,
          id: caseId
        }
      });

      if (subCases.saved_objects.length <= 0) {
        return;
      }

      return subCases.saved_objects[0];
    } catch (error) {
      this.log.error(`Error finding the most recent sub case for case: ${caseId}: ${error}`);
      throw error;
    }
  }

  async deleteSubCase(unsecuredSavedObjectsClient, id) {
    try {
      this.log.debug(`Attempting to DELETE sub case ${id}`);
      return await unsecuredSavedObjectsClient.delete(_common2.SUB_CASE_SAVED_OBJECT, id);
    } catch (error) {
      this.log.error(`Error on DELETE sub case ${id}: ${error}`);
      throw error;
    }
  }

  async deleteCase({
    unsecuredSavedObjectsClient,
    id: caseId
  }) {
    try {
      this.log.debug(`Attempting to DELETE case ${caseId}`);
      return await unsecuredSavedObjectsClient.delete(_common2.CASE_SAVED_OBJECT, caseId);
    } catch (error) {
      this.log.error(`Error on DELETE case ${caseId}: ${error}`);
      throw error;
    }
  }

  async getCase({
    unsecuredSavedObjectsClient,
    id: caseId
  }) {
    try {
      this.log.debug(`Attempting to GET case ${caseId}`);
      const caseSavedObject = await unsecuredSavedObjectsClient.get(_common2.CASE_SAVED_OBJECT, caseId);
      return (0, _transform.transformSavedObjectToExternalModel)(caseSavedObject);
    } catch (error) {
      this.log.error(`Error on GET case ${caseId}: ${error}`);
      throw error;
    }
  }

  async getResolveCase({
    unsecuredSavedObjectsClient,
    id: caseId
  }) {
    try {
      this.log.debug(`Attempting to resolve case ${caseId}`);
      const resolveCaseResult = await unsecuredSavedObjectsClient.resolve(_common2.CASE_SAVED_OBJECT, caseId);
      return { ...resolveCaseResult,
        saved_object: (0, _transform.transformSavedObjectToExternalModel)(resolveCaseResult.saved_object)
      };
    } catch (error) {
      this.log.error(`Error on resolve case ${caseId}: ${error}`);
      throw error;
    }
  }

  async getSubCase({
    unsecuredSavedObjectsClient,
    id
  }) {
    try {
      this.log.debug(`Attempting to GET sub case ${id}`);
      return await unsecuredSavedObjectsClient.get(_common2.SUB_CASE_SAVED_OBJECT, id);
    } catch (error) {
      this.log.error(`Error on GET sub case ${id}: ${error}`);
      throw error;
    }
  }

  async getSubCases({
    unsecuredSavedObjectsClient,
    ids
  }) {
    try {
      this.log.debug(`Attempting to GET sub cases ${ids.join(', ')}`);
      return await unsecuredSavedObjectsClient.bulkGet(ids.map(id => ({
        type: _common2.SUB_CASE_SAVED_OBJECT,
        id
      })));
    } catch (error) {
      this.log.error(`Error on GET cases ${ids.join(', ')}: ${error}`);
      throw error;
    }
  }

  async getCases({
    unsecuredSavedObjectsClient,
    caseIds
  }) {
    try {
      this.log.debug(`Attempting to GET cases ${caseIds.join(', ')}`);
      const cases = await unsecuredSavedObjectsClient.bulkGet(caseIds.map(caseId => ({
        type: _common2.CASE_SAVED_OBJECT,
        id: caseId
      })));
      return (0, _transform.transformBulkResponseToExternalModel)(cases);
    } catch (error) {
      this.log.error(`Error on GET cases ${caseIds.join(', ')}: ${error}`);
      throw error;
    }
  }

  async findCases({
    unsecuredSavedObjectsClient,
    options
  }) {
    try {
      this.log.debug(`Attempting to find cases`);
      const cases = await unsecuredSavedObjectsClient.find({
        sortField: _common3.defaultSortField,
        ...options,
        type: _common2.CASE_SAVED_OBJECT
      });
      return (0, _transform.transformFindResponseToExternalModel)(cases);
    } catch (error) {
      this.log.error(`Error on find cases: ${error}`);
      throw error;
    }
  }

  async findSubCases({
    unsecuredSavedObjectsClient,
    options
  }) {
    try {
      this.log.debug(`Attempting to find sub cases`); // if the page or perPage options are set then respect those instead of trying to
      // grab all sub cases

      if ((options === null || options === void 0 ? void 0 : options.page) !== undefined || (options === null || options === void 0 ? void 0 : options.perPage) !== undefined) {
        return unsecuredSavedObjectsClient.find({
          sortField: _common3.defaultSortField,
          ...options,
          type: _common2.SUB_CASE_SAVED_OBJECT
        });
      }

      return unsecuredSavedObjectsClient.find({
        page: 1,
        perPage: _common2.MAX_DOCS_PER_PAGE,
        sortField: _common3.defaultSortField,
        ...options,
        type: _common2.SUB_CASE_SAVED_OBJECT
      });
    } catch (error) {
      this.log.error(`Error on find sub cases: ${error}`);
      throw error;
    }
  }
  /**
   * Find sub cases using a collection's ID. This would try to retrieve the maximum amount of sub cases
   * by default.
   *
   * @param id the saved object ID of the parent collection to find sub cases for.
   */


  async findSubCasesByCaseId({
    unsecuredSavedObjectsClient,
    ids,
    options
  }) {
    if (ids.length <= 0) {
      var _options$page, _options$perPage;

      return {
        total: 0,
        saved_objects: [],
        page: (_options$page = options === null || options === void 0 ? void 0 : options.page) !== null && _options$page !== void 0 ? _options$page : _api.defaultPage,
        per_page: (_options$perPage = options === null || options === void 0 ? void 0 : options.perPage) !== null && _options$perPage !== void 0 ? _options$perPage : _api.defaultPerPage
      };
    }

    try {
      this.log.debug(`Attempting to GET sub cases for case collection id ${ids.join(', ')}`);
      return this.findSubCases({
        unsecuredSavedObjectsClient,
        options: { ...options,
          hasReference: ids.map(id => ({
            type: _common2.CASE_SAVED_OBJECT,
            id
          }))
        }
      });
    } catch (error) {
      this.log.error(`Error on GET all sub cases for case collection id ${ids.join(', ')}: ${error}`);
      throw error;
    }
  }

  asArray(id) {
    if (id === undefined) {
      return [];
    } else if (Array.isArray(id)) {
      return id;
    } else {
      return [id];
    }
  }

  async getAllComments({
    unsecuredSavedObjectsClient,
    id,
    options
  }) {
    try {
      this.log.debug(`Attempting to GET all comments internal for id ${JSON.stringify(id)}`);

      if ((options === null || options === void 0 ? void 0 : options.page) !== undefined || (options === null || options === void 0 ? void 0 : options.perPage) !== undefined) {
        return unsecuredSavedObjectsClient.find({
          type: _common2.CASE_COMMENT_SAVED_OBJECT,
          sortField: _common3.defaultSortField,
          ...options
        });
      }

      return unsecuredSavedObjectsClient.find({
        type: _common2.CASE_COMMENT_SAVED_OBJECT,
        page: 1,
        perPage: _common2.MAX_DOCS_PER_PAGE,
        sortField: _common3.defaultSortField,
        ...options
      });
    } catch (error) {
      this.log.error(`Error on GET all comments internal for ${JSON.stringify(id)}: ${error}`);
      throw error;
    }
  }
  /**
   * Default behavior is to retrieve all comments that adhere to a given filter (if one is included).
   * to override this pass in the either the page or perPage options.
   *
   * @param includeSubCaseComments is a flag to indicate that sub case comments should be included as well, by default
   *  sub case comments are excluded. If the `filter` field is included in the options, it will override this behavior
   */


  async getAllCaseComments({
    unsecuredSavedObjectsClient,
    id,
    options,
    includeSubCaseComments = false
  }) {
    try {
      const refs = this.asArray(id).map(caseID => ({
        type: _common2.CASE_SAVED_OBJECT,
        id: caseID
      }));

      if (refs.length <= 0) {
        var _options$perPage2, _options$page2;

        return {
          saved_objects: [],
          total: 0,
          per_page: (_options$perPage2 = options === null || options === void 0 ? void 0 : options.perPage) !== null && _options$perPage2 !== void 0 ? _options$perPage2 : _api.defaultPerPage,
          page: (_options$page2 = options === null || options === void 0 ? void 0 : options.page) !== null && _options$page2 !== void 0 ? _options$page2 : _api.defaultPage
        };
      }

      let filter;

      if (!includeSubCaseComments) {
        // if other filters were passed in then combine them to filter out sub case comments
        const associationTypeFilter = _common.nodeBuilder.is(`${_common2.CASE_COMMENT_SAVED_OBJECT}.attributes.associationType`, _common2.AssociationType.case);

        filter = (options === null || options === void 0 ? void 0 : options.filter) != null ? _common.nodeBuilder.and([options.filter, associationTypeFilter]) : associationTypeFilter;
      }

      this.log.debug(`Attempting to GET all comments for case caseID ${JSON.stringify(id)}`);
      return await this.getAllComments({
        unsecuredSavedObjectsClient,
        id,
        options: {
          hasReferenceOperator: 'OR',
          hasReference: refs,
          filter,
          ...options
        }
      });
    } catch (error) {
      this.log.error(`Error on GET all comments for case ${JSON.stringify(id)}: ${error}`);
      throw error;
    }
  }

  async getAllSubCaseComments({
    unsecuredSavedObjectsClient,
    id,
    options
  }) {
    try {
      const refs = this.asArray(id).map(caseID => ({
        type: _common2.SUB_CASE_SAVED_OBJECT,
        id: caseID
      }));

      if (refs.length <= 0) {
        var _options$perPage3, _options$page3;

        return {
          saved_objects: [],
          total: 0,
          per_page: (_options$perPage3 = options === null || options === void 0 ? void 0 : options.perPage) !== null && _options$perPage3 !== void 0 ? _options$perPage3 : _api.defaultPerPage,
          page: (_options$page3 = options === null || options === void 0 ? void 0 : options.page) !== null && _options$page3 !== void 0 ? _options$page3 : _api.defaultPage
        };
      }

      this.log.debug(`Attempting to GET all comments for sub case caseID ${JSON.stringify(id)}`);
      return await this.getAllComments({
        unsecuredSavedObjectsClient,
        id,
        options: {
          hasReferenceOperator: 'OR',
          hasReference: refs,
          ...options
        }
      });
    } catch (error) {
      this.log.error(`Error on GET all comments for sub case ${JSON.stringify(id)}: ${error}`);
      throw error;
    }
  }

  async getReporters({
    unsecuredSavedObjectsClient,
    filter
  }) {
    try {
      this.log.debug(`Attempting to GET all reporters`);
      return await unsecuredSavedObjectsClient.find({
        type: _common2.CASE_SAVED_OBJECT,
        fields: ['created_by', _common2.OWNER_FIELD],
        page: 1,
        perPage: _common2.MAX_DOCS_PER_PAGE,
        filter
      });
    } catch (error) {
      this.log.error(`Error on GET all reporters: ${error}`);
      throw error;
    }
  }

  async getTags({
    unsecuredSavedObjectsClient,
    filter
  }) {
    try {
      this.log.debug(`Attempting to GET all cases`);
      return await unsecuredSavedObjectsClient.find({
        type: _common2.CASE_SAVED_OBJECT,
        fields: ['tags', _common2.OWNER_FIELD],
        page: 1,
        perPage: _common2.MAX_DOCS_PER_PAGE,
        filter
      });
    } catch (error) {
      this.log.error(`Error on GET tags: ${error}`);
      throw error;
    }
  }

  getUser({
    request
  }) {
    try {
      this.log.debug(`Attempting to authenticate a user`);

      if (this.authentication != null) {
        const user = this.authentication.getCurrentUser(request);

        if (!user) {
          return {
            username: null,
            full_name: null,
            email: null
          };
        }

        return user;
      }

      return {
        username: null,
        full_name: null,
        email: null
      };
    } catch (error) {
      this.log.error(`Error on GET user: ${error}`);
      throw error;
    }
  }

  async postNewCase({
    unsecuredSavedObjectsClient,
    attributes,
    id
  }) {
    try {
      this.log.debug(`Attempting to POST a new case`);
      const transformedAttributes = (0, _transform.transformAttributesToESModel)(attributes);
      const createdCase = await unsecuredSavedObjectsClient.create(_common2.CASE_SAVED_OBJECT, transformedAttributes.attributes, {
        id,
        references: transformedAttributes.referenceHandler.build()
      });
      return (0, _transform.transformSavedObjectToExternalModel)(createdCase);
    } catch (error) {
      this.log.error(`Error on POST a new case: ${error}`);
      throw error;
    }
  }

  async patchCase({
    unsecuredSavedObjectsClient,
    caseId,
    updatedAttributes,
    originalCase,
    version
  }) {
    try {
      this.log.debug(`Attempting to UPDATE case ${caseId}`);
      const transformedAttributes = (0, _transform.transformAttributesToESModel)(updatedAttributes);
      const updatedCase = await unsecuredSavedObjectsClient.update(_common2.CASE_SAVED_OBJECT, caseId, transformedAttributes.attributes, {
        version,
        references: transformedAttributes.referenceHandler.build(originalCase.references)
      });
      return (0, _transform.transformUpdateResponseToExternalModel)(updatedCase);
    } catch (error) {
      this.log.error(`Error on UPDATE case ${caseId}: ${error}`);
      throw error;
    }
  }

  async patchCases({
    unsecuredSavedObjectsClient,
    cases
  }) {
    try {
      this.log.debug(`Attempting to UPDATE case ${cases.map(c => c.caseId).join(', ')}`);
      const bulkUpdate = cases.map(({
        caseId,
        updatedAttributes,
        version,
        originalCase
      }) => {
        const {
          attributes,
          referenceHandler
        } = (0, _transform.transformAttributesToESModel)(updatedAttributes);
        return {
          type: _common2.CASE_SAVED_OBJECT,
          id: caseId,
          attributes,
          references: referenceHandler.build(originalCase.references),
          version
        };
      });
      const updatedCases = await unsecuredSavedObjectsClient.bulkUpdate(bulkUpdate);
      return (0, _transform.transformUpdateResponsesToExternalModels)(updatedCases);
    } catch (error) {
      this.log.error(`Error on UPDATE case ${cases.map(c => c.caseId).join(', ')}: ${error}`);
      throw error;
    }
  }

  async patchSubCase({
    unsecuredSavedObjectsClient,
    subCaseId,
    updatedAttributes,
    version
  }) {
    try {
      this.log.debug(`Attempting to UPDATE sub case ${subCaseId}`);
      return await unsecuredSavedObjectsClient.update(_common2.SUB_CASE_SAVED_OBJECT, subCaseId, { ...updatedAttributes
      }, {
        version
      });
    } catch (error) {
      this.log.error(`Error on UPDATE sub case ${subCaseId}: ${error}`);
      throw error;
    }
  }

  async patchSubCases({
    unsecuredSavedObjectsClient,
    subCases
  }) {
    try {
      this.log.debug(`Attempting to UPDATE sub case ${subCases.map(c => c.subCaseId).join(', ')}`);
      return await unsecuredSavedObjectsClient.bulkUpdate(subCases.map(c => ({
        type: _common2.SUB_CASE_SAVED_OBJECT,
        id: c.subCaseId,
        attributes: c.updatedAttributes,
        version: c.version
      })));
    } catch (error) {
      this.log.error(`Error on UPDATE sub case ${subCases.map(c => c.subCaseId).join(', ')}: ${error}`);
      throw error;
    }
  }

}

exports.CasesService = CasesService;