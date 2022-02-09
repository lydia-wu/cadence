"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointArtifactClient = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Endpoint specific artifact management client which uses FleetArtifactsClient to persist artifacts
 * to the Fleet artifacts index (then used by Fleet Server)
 */

class EndpointArtifactClient {
  constructor(fleetArtifacts) {
    this.fleetArtifacts = fleetArtifacts;
  }

  parseArtifactId(id) {
    const idPieces = id.split('-');
    return {
      type: idPieces[1],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      decodedSha256: idPieces.pop(),
      identifier: idPieces.join('-')
    };
  }

  async getArtifact(id) {
    const {
      decodedSha256,
      identifier
    } = this.parseArtifactId(id);
    const artifacts = await this.fleetArtifacts.listArtifacts({
      kuery: `decoded_sha256: "${decodedSha256}" AND identifier: "${identifier}"`,
      perPage: 1
    });

    if (artifacts.items.length === 0) {
      return;
    }

    return artifacts.items[0];
  }

  async listArtifacts(options) {
    return this.fleetArtifacts.listArtifacts(options);
  }

  async createArtifact(artifact) {
    const createdArtifact = await this.fleetArtifacts.createArtifact({
      content: Buffer.from(artifact.body, 'base64').toString(),
      identifier: artifact.identifier,
      type: this.parseArtifactId(artifact.identifier).type
    });
    return createdArtifact;
  }

  async deleteArtifact(id) {
    var _await$this$getArtifa; // Ignoring the `id` not being in the type until we can refactor the types in endpoint.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion


    const artifactId = (_await$this$getArtifa = await this.getArtifact(id)) === null || _await$this$getArtifa === void 0 ? void 0 : _await$this$getArtifa.id;
    return this.fleetArtifacts.deleteArtifact(artifactId);
  }

}

exports.EndpointArtifactClient = EndpointArtifactClient;