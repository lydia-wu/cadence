"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PutTrustedAppUpdateRequestSchema = exports.PostTrustedAppCreateRequestSchema = exports.GetTrustedAppsSummaryRequestSchema = exports.GetTrustedAppsRequestSchema = exports.GetOneTrustedAppRequestSchema = exports.DeleteTrustedAppsRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _types = require("../types");

var _validations = require("../service/trusted_apps/validations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DeleteTrustedAppsRequestSchema = {
  params: _configSchema.schema.object({
    id: _configSchema.schema.string()
  })
};
exports.DeleteTrustedAppsRequestSchema = DeleteTrustedAppsRequestSchema;
const GetOneTrustedAppRequestSchema = {
  params: _configSchema.schema.object({
    id: _configSchema.schema.string()
  })
};
exports.GetOneTrustedAppRequestSchema = GetOneTrustedAppRequestSchema;
const GetTrustedAppsRequestSchema = {
  query: _configSchema.schema.object({
    page: _configSchema.schema.maybe(_configSchema.schema.number({
      defaultValue: 1,
      min: 1
    })),
    per_page: _configSchema.schema.maybe(_configSchema.schema.number({
      defaultValue: 20,
      min: 1
    })),
    kuery: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.GetTrustedAppsRequestSchema = GetTrustedAppsRequestSchema;
const GetTrustedAppsSummaryRequestSchema = {
  query: _configSchema.schema.object({
    kuery: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.GetTrustedAppsSummaryRequestSchema = GetTrustedAppsSummaryRequestSchema;

const ConditionEntryTypeSchema = _configSchema.schema.conditional(_configSchema.schema.siblingRef('field'), _types.ConditionEntryField.PATH, _configSchema.schema.oneOf([_configSchema.schema.literal('match'), _configSchema.schema.literal('wildcard')]), _configSchema.schema.literal('match'));

const ConditionEntryOperatorSchema = _configSchema.schema.literal('included');
/*
 * A generic Entry schema to be used for a specific entry schema depending on the OS
 */


const CommonEntrySchema = {
  field: _configSchema.schema.oneOf([_configSchema.schema.literal(_types.ConditionEntryField.HASH), _configSchema.schema.literal(_types.ConditionEntryField.PATH)]),
  type: ConditionEntryTypeSchema,
  operator: ConditionEntryOperatorSchema,
  // If field === HASH then validate hash with custom method, else validate string with minLength = 1
  value: _configSchema.schema.conditional(_configSchema.schema.siblingRef('field'), _types.ConditionEntryField.HASH, _configSchema.schema.string({
    validate: hash => (0, _validations.isValidHash)(hash) ? undefined : `invalidField.${_types.ConditionEntryField.HASH}`
  }), _configSchema.schema.conditional(_configSchema.schema.siblingRef('field'), _types.ConditionEntryField.PATH, _configSchema.schema.string({
    validate: field => field.length > 0 ? undefined : `invalidField.${_types.ConditionEntryField.PATH}`
  }), _configSchema.schema.string({
    validate: field => field.length > 0 ? undefined : `invalidField.${_types.ConditionEntryField.SIGNER}`
  })))
};

const WindowsEntrySchema = _configSchema.schema.object({ ...CommonEntrySchema,
  field: _configSchema.schema.oneOf([_configSchema.schema.literal(_types.ConditionEntryField.HASH), _configSchema.schema.literal(_types.ConditionEntryField.PATH), _configSchema.schema.literal(_types.ConditionEntryField.SIGNER)])
});

const LinuxEntrySchema = _configSchema.schema.object({ ...CommonEntrySchema
});

const MacEntrySchema = _configSchema.schema.object({ ...CommonEntrySchema
});

const entriesSchemaOptions = {
  minSize: 1,

  validate(entries) {
    return (0, _validations.getDuplicateFields)(entries).map(field => `duplicatedEntry.${field}`).join(', ') || undefined;
  }

};
/*
 * Entities array schema depending on Os type using schema.conditional.
 * If OS === WINDOWS then use Windows schema,
 * else if OS === LINUX then use Linux schema,
 * else use Mac schema
 *
 * The validate function checks there is no duplicated entry inside the array
 */

const EntriesSchema = _configSchema.schema.conditional(_configSchema.schema.siblingRef('os'), _types.OperatingSystem.WINDOWS, _configSchema.schema.arrayOf(WindowsEntrySchema, entriesSchemaOptions), _configSchema.schema.conditional(_configSchema.schema.siblingRef('os'), _types.OperatingSystem.LINUX, _configSchema.schema.arrayOf(LinuxEntrySchema, entriesSchemaOptions), _configSchema.schema.arrayOf(MacEntrySchema, entriesSchemaOptions)));

const getTrustedAppForOsScheme = (forUpdateFlow = false) => _configSchema.schema.object({
  name: _configSchema.schema.string({
    minLength: 1,
    maxLength: 256
  }),
  description: _configSchema.schema.maybe(_configSchema.schema.string({
    minLength: 0,
    maxLength: 256,
    defaultValue: ''
  })),
  os: _configSchema.schema.oneOf([_configSchema.schema.literal(_types.OperatingSystem.WINDOWS), _configSchema.schema.literal(_types.OperatingSystem.LINUX), _configSchema.schema.literal(_types.OperatingSystem.MAC)]),
  effectScope: _configSchema.schema.oneOf([_configSchema.schema.object({
    type: _configSchema.schema.literal('global')
  }), _configSchema.schema.object({
    type: _configSchema.schema.literal('policy'),
    policies: _configSchema.schema.arrayOf(_configSchema.schema.string({
      minLength: 1
    }))
  })]),
  entries: EntriesSchema,
  ...(forUpdateFlow ? {
    version: _configSchema.schema.maybe(_configSchema.schema.string())
  } : {})
});

const PostTrustedAppCreateRequestSchema = {
  body: getTrustedAppForOsScheme()
};
exports.PostTrustedAppCreateRequestSchema = PostTrustedAppCreateRequestSchema;
const PutTrustedAppUpdateRequestSchema = {
  params: _configSchema.schema.object({
    id: _configSchema.schema.string()
  }),
  body: getTrustedAppForOsScheme(true)
};
exports.PutTrustedAppUpdateRequestSchema = PutTrustedAppUpdateRequestSchema;