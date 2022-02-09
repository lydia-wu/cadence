"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexAlerts = indexAlerts;

var _ecs_safety_helpers = require("../models/ecs_safety_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Indexes Alerts/Events into elasticsarch
 *
 * @param client
 * @param eventIndex
 * @param alertIndex
 * @param generator
 * @param numAlerts
 * @param options
 */


async function indexAlerts({
  client,
  eventIndex,
  alertIndex,
  generator,
  numAlerts,
  options = {}
}) {
  const alertGenerator = generator.alertsGenerator(numAlerts, options);
  let result = alertGenerator.next();

  while (!result.done) {
    let k = 0;
    const resolverDocs = [];

    while (k < 1000 && !result.done) {
      resolverDocs.push(result.value);
      result = alertGenerator.next();
      k++;
    }

    const body = resolverDocs.reduce( // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (array, doc) => {
      var _doc$event;

      let index = eventIndex;

      if ((0, _ecs_safety_helpers.firstNonNullValue)((_doc$event = doc.event) === null || _doc$event === void 0 ? void 0 : _doc$event.kind) === 'alert') {
        index = alertIndex;
      }

      array.push({
        create: {
          _index: index
        }
      }, doc);
      return array;
    }, []);
    await client.bulk({
      body,
      refresh: true
    });
  }

  await client.indices.refresh({
    index: eventIndex
  }); // TODO: Unclear why the documents are not showing up after the call to refresh.
  // Waiting 5 seconds allows the indices to refresh automatically and
  // the documents become available in API/integration tests.

  await delay(5000);
}