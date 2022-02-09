"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.persistNoteRoute = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _constants = require("../../../../../common/constants");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _utils = require("../../../detection_engine/routes/utils");

var _common = require("../../utils/common");

var _notes = require("../../schemas/notes");

var _notes2 = require("../../saved_object/notes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const persistNoteRoute = (router, config, security) => {
  router.patch({
    path: _constants.NOTE_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidationWithExcess)(_notes.persistNoteSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      var _request$body$noteId, _request$body;

      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const {
        note
      } = request.body;
      const noteId = (_request$body$noteId = (_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.noteId) !== null && _request$body$noteId !== void 0 ? _request$body$noteId : null;
      const res = await (0, _notes2.persistNote)({
        request: frameworkRequest,
        noteId,
        note: { ...note,
          timelineId: note.timelineId || null
        },
        overrideOwner: true
      });
      return response.ok({
        body: {
          data: {
            persistNote: res
          }
        }
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.persistNoteRoute = persistNoteRoute;