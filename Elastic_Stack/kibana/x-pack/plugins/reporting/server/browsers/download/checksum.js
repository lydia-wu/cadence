"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.md5 = md5;

var _crypto = require("crypto");

var _fs = require("fs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function readableEnd(stream) {
  return new Promise((resolve, reject) => {
    stream.on('error', reject).on('end', resolve);
  });
}

async function md5(path) {
  const hash = (0, _crypto.createHash)('md5');
  await readableEnd((0, _fs.createReadStream)(path).on('data', chunk => hash.update(chunk)));
  return hash.digest('hex');
}