"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateArtifactsToFleet = void 0;

var _zlib = require("zlib");

var _util = require("util");

var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ArtifactMigrationError extends Error {
  constructor(message, meta) {
    super(message);
    this.meta = meta;
  }

}

const inflateAsync = (0, _util.promisify)(_zlib.inflate);

function isCompressed(artifact) {
  return artifact.compressionAlgorithm === 'zlib';
}
/**
 * With v7.13, artifact storage was moved from a security_solution saved object to a fleet index
 * in order to support Fleet Server.
 */


const migrateArtifactsToFleet = async (soClient, endpointArtifactClient, logger) => {
  let totalArtifactsMigrated = -1;
  let hasMore = true;

  try {
    while (hasMore) {
      // Retrieve list of artifact records
      const {
        saved_objects: artifactList,
        total
      } = await soClient.find({
        type: _common.ArtifactConstants.SAVED_OBJECT_TYPE,
        page: 1,
        perPage: 10
      });

      if (totalArtifactsMigrated === -1) {
        totalArtifactsMigrated = total;

        if (total > 0) {
          logger.info(`Migrating artifacts from SavedObject`);
        }
      } // If nothing else to process, then exit out


      if (total === 0) {
        hasMore = false;

        if (totalArtifactsMigrated > 0) {
          logger.info(`Total Artifacts migrated: ${totalArtifactsMigrated}`);
        }

        return;
      }

      for (const artifact of artifactList) {
        if (isCompressed(artifact.attributes)) {
          artifact.attributes = { ...artifact.attributes,
            body: (await inflateAsync(Buffer.from(artifact.attributes.body, 'base64'))).toString('base64')
          };
        } // Create new artifact in fleet index


        await endpointArtifactClient.createArtifact(artifact.attributes); // Delete old artifact from SO and if there are errors here, then ignore 404's
        // since multiple kibana instances could be going at this

        try {
          await soClient.delete(_common.ArtifactConstants.SAVED_OBJECT_TYPE, artifact.id);
        } catch (e) {
          var _e$output;

          if ((e === null || e === void 0 ? void 0 : (_e$output = e.output) === null || _e$output === void 0 ? void 0 : _e$output.statusCode) !== 404) {
            throw e;
          }

          logger.debug(`Artifact Migration: Attempt to delete Artifact SO [${artifact.id}] returned 404`);
        }
      }
    }
  } catch (e) {
    const error = new ArtifactMigrationError('Artifact SO migration failed', e);
    logger.error(error);
    throw error;
  }
};

exports.migrateArtifactsToFleet = migrateArtifactsToFleet;