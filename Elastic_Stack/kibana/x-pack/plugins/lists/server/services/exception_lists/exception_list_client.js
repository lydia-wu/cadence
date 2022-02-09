"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExceptionListClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _get_exception_list = require("./get_exception_list");

var _export_exception_list_and_items = require("./export_exception_list_and_items");

var _get_exception_list_summary = require("./get_exception_list_summary");

var _create_exception_list = require("./create_exception_list");

var _get_exception_list_item = require("./get_exception_list_item");

var _create_exception_list_item = require("./create_exception_list_item");

var _update_exception_list = require("./update_exception_list");

var _update_exception_list_item = require("./update_exception_list_item");

var _delete_exception_list = require("./delete_exception_list");

var _delete_exception_list_item = require("./delete_exception_list_item");

var _find_exception_list_item = require("./find_exception_list_item");

var _find_exception_list = require("./find_exception_list");

var _find_exception_list_items = require("./find_exception_list_items");

var _create_endpoint_list = require("./create_endpoint_list");

var _create_endpoint_trusted_apps_list = require("./create_endpoint_trusted_apps_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ExceptionListClient {
  constructor({
    user: _user,
    savedObjectsClient: _savedObjectsClient
  }) {
    (0, _defineProperty2.default)(this, "user", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "getExceptionList", async ({
      listId,
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _get_exception_list.getExceptionList)({
        id,
        listId,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "getExceptionListSummary", async ({
      listId,
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _get_exception_list_summary.getExceptionListSummary)({
        id,
        listId,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "getExceptionListItem", async ({
      itemId,
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _get_exception_list_item.getExceptionListItem)({
        id,
        itemId,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "createEndpointList", async () => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _create_endpoint_list.createEndpointList)({
        savedObjectsClient,
        user,
        version: 1
      });
    });
    (0, _defineProperty2.default)(this, "createTrustedAppsList", async () => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _create_endpoint_trusted_apps_list.createEndpointTrustedAppsList)({
        savedObjectsClient,
        user,
        version: 1
      });
    });
    (0, _defineProperty2.default)(this, "createEndpointListItem", async ({
      comments,
      description,
      entries,
      itemId,
      meta,
      name,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      await this.createEndpointList();
      return (0, _create_exception_list_item.createExceptionListItem)({
        comments,
        description,
        entries,
        itemId,
        listId: _securitysolutionListConstants.ENDPOINT_LIST_ID,
        meta,
        name,
        namespaceType: 'agnostic',
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user
      });
    });
    (0, _defineProperty2.default)(this, "updateEndpointListItem", async ({
      _version,
      comments,
      description,
      entries,
      id,
      itemId,
      meta,
      name,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      await this.createEndpointList();
      return (0, _update_exception_list_item.updateExceptionListItem)({
        _version,
        comments,
        description,
        entries,
        id,
        itemId,
        meta,
        name,
        namespaceType: 'agnostic',
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user
      });
    });
    (0, _defineProperty2.default)(this, "getEndpointListItem", async ({
      itemId,
      id
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _get_exception_list_item.getExceptionListItem)({
        id,
        itemId,
        namespaceType: 'agnostic',
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "createExceptionList", async ({
      description,
      immutable,
      listId,
      meta,
      name,
      namespaceType,
      tags,
      type,
      version
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _create_exception_list.createExceptionList)({
        description,
        immutable,
        listId,
        meta,
        name,
        namespaceType,
        savedObjectsClient,
        tags,
        type,
        user,
        version
      });
    });
    (0, _defineProperty2.default)(this, "updateExceptionList", async ({
      _version,
      id,
      description,
      listId,
      meta,
      name,
      namespaceType,
      osTypes,
      tags,
      type,
      version
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _update_exception_list.updateExceptionList)({
        _version,
        description,
        id,
        listId,
        meta,
        name,
        namespaceType,
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user,
        version
      });
    });
    (0, _defineProperty2.default)(this, "deleteExceptionList", async ({
      id,
      listId,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _delete_exception_list.deleteExceptionList)({
        id,
        listId,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "createExceptionListItem", async ({
      comments,
      description,
      entries,
      itemId,
      listId,
      meta,
      name,
      namespaceType,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _create_exception_list_item.createExceptionListItem)({
        comments,
        description,
        entries,
        itemId,
        listId,
        meta,
        name,
        namespaceType,
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user
      });
    });
    (0, _defineProperty2.default)(this, "updateExceptionListItem", async ({
      _version,
      comments,
      description,
      entries,
      id,
      itemId,
      meta,
      name,
      namespaceType,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _update_exception_list_item.updateExceptionListItem)({
        _version,
        comments,
        description,
        entries,
        id,
        itemId,
        meta,
        name,
        namespaceType,
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user
      });
    });
    (0, _defineProperty2.default)(this, "deleteExceptionListItem", async ({
      id,
      itemId,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _delete_exception_list_item.deleteExceptionListItem)({
        id,
        itemId,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "deleteExceptionListItemById", async ({
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _delete_exception_list_item.deleteExceptionListItemById)({
        id,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "deleteEndpointListItem", async ({
      id,
      itemId
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _delete_exception_list_item.deleteExceptionListItem)({
        id,
        itemId,
        namespaceType: 'agnostic',
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "findExceptionListItem", async ({
      listId,
      filter,
      perPage,
      page,
      sortField,
      sortOrder,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list_item.findExceptionListItem)({
        filter,
        listId,
        namespaceType,
        page,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "findExceptionListsItem", async ({
      listId,
      filter,
      perPage,
      page,
      sortField,
      sortOrder,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list_items.findExceptionListsItem)({
        filter,
        listId,
        namespaceType,
        page,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "findValueListExceptionListItems", async ({
      perPage,
      page,
      sortField,
      sortOrder,
      valueListId
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list_items.findValueListExceptionListItems)({
        page,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder,
        valueListId
      });
    });
    (0, _defineProperty2.default)(this, "findExceptionList", async ({
      filter,
      perPage,
      page,
      sortField,
      sortOrder,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list.findExceptionList)({
        filter,
        namespaceType,
        page,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "findEndpointListItem", async ({
      filter,
      perPage,
      page,
      sortField,
      sortOrder
    }) => {
      const {
        savedObjectsClient
      } = this;
      await this.createEndpointList();
      return (0, _find_exception_list_item.findExceptionListItem)({
        filter,
        listId: _securitysolutionListConstants.ENDPOINT_LIST_ID,
        namespaceType: 'agnostic',
        page,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "exportExceptionListAndItems", async ({
      listId,
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _export_exception_list_and_items.exportExceptionListAndItems)({
        id,
        listId,
        namespaceType,
        savedObjectsClient
      });
    });
    this.user = _user;
    this.savedObjectsClient = _savedObjectsClient;
  }

}

exports.ExceptionListClient = ExceptionListClient;