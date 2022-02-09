"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.persistNote = exports.getNotesByTimelineId = exports.getNotesByEventId = exports.getNote = exports.getAllNotes = exports.deleteNoteByTimelineId = exports.deleteNote = exports.convertSavedObjectToSavedNote = void 0;

var _PathReporter = require("io-ts/lib/PathReporter");

var _fp = require("lodash/fp");

var _uuid = _interopRequireDefault(require("uuid"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _constants = require("../../../../../common/constants");

var _note = require("../../../../../common/types/timeline/note");

var _notes = require("../../saved_object_mappings/notes");

var _timelines = require("../timelines");

var _saved_object_mappings = require("../../saved_object_mappings");

var _field_migrator = require("./field_migrator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteNote = async (request, noteIds) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  await Promise.all(noteIds.map(noteId => savedObjectsClient.delete(_notes.noteSavedObjectType, noteId)));
};

exports.deleteNote = deleteNote;

const deleteNoteByTimelineId = async (request, timelineId) => {
  const options = {
    type: _notes.noteSavedObjectType,
    hasReference: {
      type: _saved_object_mappings.timelineSavedObjectType,
      id: timelineId
    }
  };
  const notesToBeDeleted = await getAllSavedNote(request, options);
  const savedObjectsClient = request.context.core.savedObjects.client;
  await Promise.all(notesToBeDeleted.notes.map(note => savedObjectsClient.delete(_notes.noteSavedObjectType, note.noteId)));
};

exports.deleteNoteByTimelineId = deleteNoteByTimelineId;

const getNote = async (request, noteId) => {
  return getSavedNote(request, noteId);
};

exports.getNote = getNote;

const getNotesByEventId = async (request, eventId) => {
  const options = {
    type: _notes.noteSavedObjectType,
    search: eventId,
    searchFields: ['eventId']
  };
  const notesByEventId = await getAllSavedNote(request, options);
  return notesByEventId.notes;
};

exports.getNotesByEventId = getNotesByEventId;

const getNotesByTimelineId = async (request, timelineId) => {
  const options = {
    type: _notes.noteSavedObjectType,
    hasReference: {
      type: _saved_object_mappings.timelineSavedObjectType,
      id: timelineId
    }
  };
  const notesByTimelineId = await getAllSavedNote(request, options);
  return notesByTimelineId.notes;
};

exports.getNotesByTimelineId = getNotesByTimelineId;

const getAllNotes = async (request, pageInfo, search, sort) => {
  const options = {
    type: _notes.noteSavedObjectType,
    perPage: pageInfo != null ? pageInfo.pageSize : undefined,
    page: pageInfo != null ? pageInfo.pageIndex : undefined,
    search: search != null ? search : undefined,
    searchFields: ['note'],
    sortField: sort != null ? sort.sortField : undefined,
    sortOrder: sort != null ? sort.sortOrder : undefined
  };
  return getAllSavedNote(request, options);
};

exports.getAllNotes = getAllNotes;

const persistNote = async ({
  request,
  noteId,
  note,
  overrideOwner = true
}) => {
  try {
    if (noteId == null) {
      return await createNote({
        request,
        noteId,
        note,
        overrideOwner
      });
    } // Update existing note


    return await updateNote({
      request,
      noteId,
      note,
      overrideOwner
    });
  } catch (err) {
    if ((0, _fp.getOr)(null, 'output.statusCode', err) === 403) {
      const noteToReturn = { ...note,
        noteId: _uuid.default.v1(),
        version: '',
        timelineId: '',
        timelineVersion: ''
      };
      return {
        code: 403,
        message: err.message,
        note: noteToReturn
      };
    }

    throw err;
  }
};

exports.persistNote = persistNote;

const createNote = async ({
  request,
  noteId,
  note,
  overrideOwner = true
}) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  const userInfo = request.user;
  const shallowCopyOfNote = { ...note
  };
  let timelineVersion;

  if (note.timelineId == null) {
    const {
      timeline: timelineResult
    } = await (0, _timelines.createTimeline)({
      timelineId: null,
      timeline: {},
      savedObjectsClient,
      userInfo
    });
    shallowCopyOfNote.timelineId = timelineResult.savedObjectId;
    timelineVersion = timelineResult.version;
  }

  const noteWithCreator = overrideOwner ? pickSavedNote(noteId, shallowCopyOfNote, userInfo) : shallowCopyOfNote;

  const {
    transformedFields: migratedAttributes,
    references
  } = _field_migrator.noteFieldsMigrator.extractFieldsToReferences({
    data: noteWithCreator
  });

  const createdNote = await savedObjectsClient.create(_notes.noteSavedObjectType, migratedAttributes, {
    references
  });

  const repopulatedSavedObject = _field_migrator.noteFieldsMigrator.populateFieldsFromReferences(createdNote);

  const convertedNote = convertSavedObjectToSavedNote(repopulatedSavedObject, timelineVersion); // Create new note

  return {
    code: 200,
    message: 'success',
    note: convertedNote
  };
};

const updateNote = async ({
  request,
  noteId,
  note,
  overrideOwner = true
}) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  const userInfo = request.user;
  const existingNote = await savedObjectsClient.get(_notes.noteSavedObjectType, noteId);
  const noteWithCreator = overrideOwner ? pickSavedNote(noteId, note, userInfo) : note;

  const {
    transformedFields: migratedPatchAttributes,
    references
  } = _field_migrator.noteFieldsMigrator.extractFieldsToReferences({
    data: noteWithCreator,
    existingReferences: existingNote.references
  });

  const updatedNote = await savedObjectsClient.update(_notes.noteSavedObjectType, noteId, migratedPatchAttributes, {
    version: existingNote.version || undefined,
    references
  });

  const populatedNote = _field_migrator.noteFieldsMigrator.populateFieldsFromReferencesForPatch({
    dataBeforeRequest: note,
    dataReturnedFromRequest: updatedNote
  });

  const convertedNote = convertSavedObjectToSavedNote(populatedNote);
  return {
    code: 200,
    message: 'success',
    note: convertedNote
  };
};

const getSavedNote = async (request, NoteId) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  const savedObject = await savedObjectsClient.get(_notes.noteSavedObjectType, NoteId);

  const populatedNote = _field_migrator.noteFieldsMigrator.populateFieldsFromReferences(savedObject);

  return convertSavedObjectToSavedNote(populatedNote);
};

const getAllSavedNote = async (request, options) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  const savedObjects = await savedObjectsClient.find(options);
  return {
    totalCount: savedObjects.total,
    notes: savedObjects.saved_objects.map(savedObject => {
      const populatedNote = _field_migrator.noteFieldsMigrator.populateFieldsFromReferences(savedObject);

      return convertSavedObjectToSavedNote(populatedNote);
    })
  };
};

const convertSavedObjectToSavedNote = (savedObject, timelineVersion) => (0, _pipeable.pipe)(_note.NoteSavedObjectRuntimeType.decode(savedObject), (0, _Either.map)(savedNote => ({
  noteId: savedNote.id,
  version: savedNote.version,
  timelineVersion,
  ...savedNote.attributes
})), (0, _Either.fold)(errors => {
  throw new Error((0, _PathReporter.failure)(errors).join('\n'));
}, _function.identity)); // we have to use any here because the SavedObjectAttributes interface is like below
// export interface SavedObjectAttributes {
//   [key: string]: SavedObjectAttributes | string | number | boolean | null;
// }
// then this interface does not allow types without index signature
// this is limiting us with our type for now so the easy way was to use any


exports.convertSavedObjectToSavedNote = convertSavedObjectToSavedNote;

const pickSavedNote = (noteId, savedNote, userInfo) => {
  var _userInfo$username2;

  if (noteId == null) {
    var _userInfo$username;

    savedNote.created = new Date().valueOf();
    savedNote.createdBy = (_userInfo$username = userInfo === null || userInfo === void 0 ? void 0 : userInfo.username) !== null && _userInfo$username !== void 0 ? _userInfo$username : _constants.UNAUTHENTICATED_USER;
  }

  savedNote.updated = new Date().valueOf();
  savedNote.updatedBy = (_userInfo$username2 = userInfo === null || userInfo === void 0 ? void 0 : userInfo.username) !== null && _userInfo$username2 !== void 0 ? _userInfo$username2 : _constants.UNAUTHENTICATED_USER;
  return savedNote;
};