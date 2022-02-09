"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventCode = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let EventCode;
exports.EventCode = EventCode;

(function (EventCode) {
  EventCode["MALICIOUS_FILE"] = "malicious_file";
  EventCode["RANSOMWARE"] = "ransomware";
  EventCode["MEMORY_SIGNATURE"] = "memory_signature";
  EventCode["SHELLCODE_THREAD"] = "shellcode_thread";
  EventCode["BEHAVIOR"] = "behavior";
})(EventCode || (exports.EventCode = EventCode = {}));