"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidHash = exports.isPathValid = exports.getDuplicateFields = void 0;

var _types = require("../../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const HASH_LENGTHS = [32, // MD5
40, // SHA1
64 // SHA256
];
const INVALID_CHARACTERS_PATTERN = /[^0-9a-f]/i;

const isValidHash = value => HASH_LENGTHS.includes(value.length) && !INVALID_CHARACTERS_PATTERN.test(value);

exports.isValidHash = isValidHash;

const getDuplicateFields = entries => {
  const groupedFields = new Map();
  entries.forEach(entry => {
    groupedFields.set(entry.field, [...(groupedFields.get(entry.field) || []), entry]);
  });
  return [...groupedFields.entries()].filter(entry => entry[1].length > 1).map(entry => entry[0]);
};

exports.getDuplicateFields = getDuplicateFields;

const isPathValid = ({
  os,
  field,
  type,
  value
}) => {
  if (field === _types.ConditionEntryField.PATH) {
    if (type === 'wildcard') {
      return os === _types.OperatingSystem.WINDOWS ? isWindowsWildcardPathValid(value) : isLinuxMacWildcardPathValid(value);
    }

    return doesPathMatchRegex({
      value,
      os
    });
  }

  return true;
};

exports.isPathValid = isPathValid;

const doesPathMatchRegex = ({
  os,
  value
}) => {
  if (os === _types.OperatingSystem.WINDOWS) {
    const filePathRegex = /^[a-z]:(?:|\\\\[^<>:"'/\\|?*]+\\[^<>:"'/\\|?*]+|%\w+%|)[\\](?:[^<>:"'/\\|?*]+[\\/])*([^<>:"'/\\|?*])+$/i;
    return filePathRegex.test(value);
  }

  return /^(\/|(\/[\w\-]+)+|\/[\w\-]+\.[\w]+|(\/[\w-]+)+\/[\w\-]+\.[\w]+)$/i.test(value);
};

const isWindowsWildcardPathValid = path => {
  const firstCharacter = path[0];
  const lastCharacter = path.slice(-1);
  const trimmedValue = path.trim();
  const hasSlash = /\//.test(trimmedValue);

  if (path.length === 0) {
    return false;
  } else if (hasSlash || trimmedValue.length !== path.length || firstCharacter === '^' || lastCharacter === '\\' || !hasWildcard({
    path,
    isWindowsPath: true
  })) {
    return false;
  } else {
    return true;
  }
};

const isLinuxMacWildcardPathValid = path => {
  const firstCharacter = path[0];
  const lastCharacter = path.slice(-1);
  const trimmedValue = path.trim();

  if (path.length === 0) {
    return false;
  } else if (trimmedValue.length !== path.length || firstCharacter !== '/' || lastCharacter === '/' || path.length > 1024 === true || path.includes('//') === true || !hasWildcard({
    path,
    isWindowsPath: false
  })) {
    return false;
  } else {
    return true;
  }
};

const hasWildcard = ({
  path,
  isWindowsPath
}) => {
  for (const pathComponent of path.split(isWindowsPath ? '\\' : '/')) {
    if (/[\*|\?]+/.test(pathComponent) === true) {
      return true;
    }
  }

  return false;
};