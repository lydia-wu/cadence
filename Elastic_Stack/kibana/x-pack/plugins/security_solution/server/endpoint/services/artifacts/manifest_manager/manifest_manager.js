"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManifestManager = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pMap = _interopRequireDefault(require("p-map"));

var _semver = _interopRequireDefault(require("semver"));

var _lodash = require("lodash");

var _manifest = require("../../../../../common/endpoint/schema/manifest");

var _artifacts = require("../../../lib/artifacts");

var _artifacts2 = require("../../../schemas/artifacts");

var _manifest_client = require("../manifest_client");

var _errors = require("../errors");

var _utils = require("../../../utils");

var _errors2 = require("../../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const iterateArtifactsBuildResult = async (result, callback) => {
  for (const artifact of result.defaultArtifacts) {
    await callback(artifact);
  }

  for (const policyId of Object.keys(result.policySpecificArtifacts)) {
    for (const artifact of result.policySpecificArtifacts[policyId]) {
      await callback(artifact, policyId);
    }
  }
};

const iterateAllListItems = async (pageSupplier, itemCallback) => {
  let paging = true;
  let page = 1;

  while (paging) {
    const {
      items,
      total
    } = await pageSupplier(page);

    for (const item of items) {
      await itemCallback(item);
    }

    paging = (page - 1) * 20 + items.length < total;
    page++;
  }
};

const getArtifactIds = manifest => [...Object.keys(manifest.artifacts)].map(key => `${key}-${manifest.artifacts[key].decoded_sha256}`);

const manifestsEqual = (manifest1, manifest2) => (0, _lodash.isEqual)(new Set(getArtifactIds(manifest1)), new Set(getArtifactIds(manifest2)));

class ManifestManager {
  constructor(context) {
    (0, _defineProperty2.default)(this, "artifactClient", void 0);
    (0, _defineProperty2.default)(this, "exceptionListClient", void 0);
    (0, _defineProperty2.default)(this, "packagePolicyService", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "cache", void 0);
    (0, _defineProperty2.default)(this, "schemaVersion", void 0);
    (0, _defineProperty2.default)(this, "experimentalFeatures", void 0);
    this.artifactClient = context.artifactClient;
    this.exceptionListClient = context.exceptionListClient;
    this.packagePolicyService = context.packagePolicyService;
    this.savedObjectsClient = context.savedObjectsClient;
    this.logger = context.logger;
    this.cache = context.cache;
    this.schemaVersion = 'v1';
    this.experimentalFeatures = context.experimentalFeatures;
  }
  /**
   * Gets a ManifestClient for this manager's schemaVersion.
   *
   * @returns {ManifestClient} A ManifestClient scoped to the appropriate schemaVersion.
   */


  getManifestClient() {
    return new _manifest_client.ManifestClient(this.savedObjectsClient, this.schemaVersion);
  }
  /**
   * Builds an artifact (one per supported OS) based on the current
   * state of exception-list-agnostic SOs.
   */


  async buildExceptionListArtifact(os) {
    return (0, _artifacts.buildArtifact)(await (0, _artifacts.getEndpointExceptionList)(this.exceptionListClient, this.schemaVersion, os), this.schemaVersion, os, _artifacts.ArtifactConstants.GLOBAL_ALLOWLIST_NAME);
  }
  /**
   * Builds an array of artifacts (one per supported OS) based on the current
   * state of exception-list-agnostic SOs.
   *
   * @returns {Promise<InternalArtifactCompleteSchema[]>} An array of uncompressed artifacts built from exception-list-agnostic SOs.
   * @throws Throws/rejects if there are errors building the list.
   */


  async buildExceptionListArtifacts() {
    const defaultArtifacts = [];
    const policySpecificArtifacts = {};

    for (const os of _artifacts.ArtifactConstants.SUPPORTED_OPERATING_SYSTEMS) {
      defaultArtifacts.push(await this.buildExceptionListArtifact(os));
    }

    await iterateAllListItems(page => this.listEndpointPolicyIds(page), async policyId => {
      policySpecificArtifacts[policyId] = defaultArtifacts;
    });
    return {
      defaultArtifacts,
      policySpecificArtifacts
    };
  }
  /**
   * Builds an artifact (one per supported OS) based on the current state of the
   * Trusted Apps list (which uses the `exception-list-agnostic` SO type)
   */


  async buildTrustedAppsArtifact(os, policyId) {
    return (0, _artifacts.buildArtifact)(await (0, _artifacts.getEndpointTrustedAppsList)(this.exceptionListClient, this.schemaVersion, os, policyId), this.schemaVersion, os, _artifacts.ArtifactConstants.GLOBAL_TRUSTED_APPS_NAME);
  }
  /**
   * Builds an array of artifacts (one per supported OS) based on the current state of the
   * Trusted Apps list (which uses the `exception-list-agnostic` SO type)
   */


  async buildTrustedAppsArtifacts() {
    const defaultArtifacts = [];
    const policySpecificArtifacts = {};

    for (const os of _artifacts.ArtifactConstants.SUPPORTED_TRUSTED_APPS_OPERATING_SYSTEMS) {
      defaultArtifacts.push(await this.buildTrustedAppsArtifact(os));
    }

    await iterateAllListItems(page => this.listEndpointPolicyIds(page), async policyId => {
      for (const os of _artifacts.ArtifactConstants.SUPPORTED_TRUSTED_APPS_OPERATING_SYSTEMS) {
        policySpecificArtifacts[policyId] = policySpecificArtifacts[policyId] || [];
        policySpecificArtifacts[policyId].push(await this.buildTrustedAppsArtifact(os, policyId));
      }
    });
    return {
      defaultArtifacts,
      policySpecificArtifacts
    };
  }
  /**
   * Builds an array of endpoint event filters (one per supported OS) based on the current state of the
   * Event Filters list
   * @protected
   */


  async buildEventFiltersArtifacts() {
    const defaultArtifacts = [];
    const policySpecificArtifacts = {};

    for (const os of _artifacts.ArtifactConstants.SUPPORTED_EVENT_FILTERS_OPERATING_SYSTEMS) {
      defaultArtifacts.push(await this.buildEventFiltersForOs(os));
    }

    await iterateAllListItems(page => this.listEndpointPolicyIds(page), async policyId => {
      for (const os of _artifacts.ArtifactConstants.SUPPORTED_EVENT_FILTERS_OPERATING_SYSTEMS) {
        policySpecificArtifacts[policyId] = policySpecificArtifacts[policyId] || [];
        policySpecificArtifacts[policyId].push(await this.buildEventFiltersForOs(os, policyId));
      }
    });
    return {
      defaultArtifacts,
      policySpecificArtifacts
    };
  }

  async buildEventFiltersForOs(os, policyId) {
    return (0, _artifacts.buildArtifact)(await (0, _artifacts.getEndpointEventFiltersList)(this.exceptionListClient, this.schemaVersion, os, policyId), this.schemaVersion, os, _artifacts.ArtifactConstants.GLOBAL_EVENT_FILTERS_NAME);
  }

  async buildHostIsolationExceptionsArtifacts() {
    const defaultArtifacts = [];
    const policySpecificArtifacts = {};

    for (const os of _artifacts.ArtifactConstants.SUPPORTED_HOST_ISOLATION_EXCEPTIONS_OPERATING_SYSTEMS) {
      defaultArtifacts.push(await this.buildHostIsolationExceptionForOs(os));
    }

    await iterateAllListItems(page => this.listEndpointPolicyIds(page), async policyId => {
      for (const os of _artifacts.ArtifactConstants.SUPPORTED_HOST_ISOLATION_EXCEPTIONS_OPERATING_SYSTEMS) {
        policySpecificArtifacts[policyId] = policySpecificArtifacts[policyId] || [];
        policySpecificArtifacts[policyId].push(await this.buildHostIsolationExceptionForOs(os, policyId));
      }
    });
    return {
      defaultArtifacts,
      policySpecificArtifacts
    };
  }

  async buildHostIsolationExceptionForOs(os, policyId) {
    return (0, _artifacts.buildArtifact)(await (0, _artifacts.getHostIsolationExceptionsList)(this.exceptionListClient, this.schemaVersion, os, policyId), this.schemaVersion, os, _artifacts.ArtifactConstants.GLOBAL_HOST_ISOLATION_EXCEPTIONS_NAME);
  }
  /**
   * Writes new artifact SO.
   *
   * @param artifact An InternalArtifactCompleteSchema representing the artifact.
   * @returns {Promise<[Error | null, InternalArtifactCompleteSchema | undefined]>} An array with the error if encountered or null and the generated artifact or null.
   */


  async pushArtifact(artifact) {
    const artifactId = (0, _artifacts.getArtifactId)(artifact);
    let fleetArtifact;

    try {
      // Write the artifact SO
      fleetArtifact = await this.artifactClient.createArtifact(artifact); // Cache the compressed body of the artifact

      this.cache.set(artifactId, Buffer.from(artifact.body, 'base64'));
    } catch (err) {
      if (this.savedObjectsClient.errors.isConflictError(err)) {
        this.logger.debug(`Tried to create artifact ${artifactId}, but it already exists.`);
      } else {
        return [err, undefined];
      }
    }

    return [null, fleetArtifact];
  }
  /**
   * Writes new artifact SOs.
   *
   * @param artifacts An InternalArtifactCompleteSchema array representing the artifacts.
   * @param newManifest A Manifest representing the new manifest
   * @returns {Promise<Error[]>} Any errors encountered.
   */


  async pushArtifacts(artifacts, newManifest) {
    const errors = [];

    for (const artifact of artifacts) {
      if (_artifacts2.internalArtifactCompleteSchema.is(artifact)) {
        const [err, fleetArtifact] = await this.pushArtifact(artifact);

        if (err) {
          errors.push(err);
        } else if (fleetArtifact) {
          newManifest.replaceArtifact(fleetArtifact);
        }
      } else {
        errors.push(new _errors2.EndpointError(`Incomplete artifact: ${(0, _artifacts.getArtifactId)(artifact)}`, artifact));
      }
    }

    return errors;
  }
  /**
   * Deletes outdated artifact SOs.
   *
   * The artifact may still remain in the cache.
   *
   * @param artifactIds The IDs of the artifact to delete..
   * @returns {Promise<Error[]>} Any errors encountered.
   */


  async deleteArtifacts(artifactIds) {
    const errors = [];

    for (const artifactId of artifactIds) {
      try {
        await this.artifactClient.deleteArtifact(artifactId);
        this.logger.info(`Cleaned up artifact ${artifactId}`);
      } catch (err) {
        errors.push(err);
      }
    }

    return errors;
  }
  /**
   * Returns the last computed manifest based on the state of the user-artifact-manifest SO. If no
   * artifacts have been created yet (ex. no Endpoint policies are in use), then method return `null`
   *
   * @returns {Promise<Manifest | null>} The last computed manifest, or null if does not exist.
   * @throws Throws/rejects if there is an unexpected error retrieving the manifest.
   */


  async getLastComputedManifest() {
    try {
      const manifestSo = await this.getManifestClient().getManifest();

      if (manifestSo.version === undefined) {
        throw new _errors.InvalidInternalManifestError('Internal Manifest map SavedObject is missing version', manifestSo);
      }

      const manifest = new _artifacts.Manifest({
        schemaVersion: this.schemaVersion,
        semanticVersion: manifestSo.attributes.semanticVersion,
        soVersion: manifestSo.version
      });

      for (const entry of manifestSo.attributes.artifacts) {
        const artifact = await this.artifactClient.getArtifact(entry.artifactId);

        if (!artifact) {
          this.logger.error(new _errors.InvalidInternalManifestError(`artifact id [${entry.artifactId}] not found!`, {
            entry,
            action: 'removed from internal ManifestManger tracking map'
          }));
        } else {
          manifest.addEntry(artifact, entry.policyId);
        }
      }

      return manifest;
    } catch (error) {
      if (!error.output || error.output.statusCode !== 404) {
        throw (0, _utils.wrapErrorIfNeeded)(error);
      }

      return null;
    }
  }
  /**
   * creates a new default Manifest
   */


  static createDefaultManifest(schemaVersion) {
    return _artifacts.Manifest.getDefault(schemaVersion);
  }
  /**
   * Builds a new manifest based on the current user exception list.
   *
   * @param baselineManifest A baseline manifest to use for initializing pre-existing artifacts.
   * @returns {Promise<Manifest>} A new Manifest object reprenting the current exception list.
   */


  async buildNewManifest(baselineManifest = ManifestManager.createDefaultManifest(this.schemaVersion)) {
    const results = await Promise.all([this.buildExceptionListArtifacts(), this.buildTrustedAppsArtifacts(), this.buildEventFiltersArtifacts(), this.buildHostIsolationExceptionsArtifacts()]);
    const manifest = new _artifacts.Manifest({
      schemaVersion: this.schemaVersion,
      semanticVersion: baselineManifest.getSemanticVersion(),
      soVersion: baselineManifest.getSavedObjectVersion()
    });

    for (const result of results) {
      await iterateArtifactsBuildResult(result, async (artifact, policyId) => {
        const artifactToAdd = baselineManifest.getArtifact((0, _artifacts.getArtifactId)(artifact)) || artifact;

        if (!_artifacts2.internalArtifactCompleteSchema.is(artifactToAdd)) {
          throw new _errors2.EndpointError(`Incomplete artifact detected: ${(0, _artifacts.getArtifactId)(artifactToAdd)}`, artifactToAdd);
        }

        manifest.addEntry(artifactToAdd, policyId);
      });
    }

    return manifest;
  }
  /**
   * Dispatches the manifest by writing it to the endpoint package policy, if different
   * from the manifest already in the config.
   *
   * @param manifest The Manifest to dispatch.
   * @returns {Promise<Error[]>} Any errors encountered.
   */


  async tryDispatch(manifest) {
    const errors = [];
    await iterateAllListItems(page => this.listEndpointPolicies(page), async packagePolicy => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const {
        id,
        revision,
        updated_at,
        updated_by,
        ...newPackagePolicy
      } = packagePolicy;

      if (newPackagePolicy.inputs.length > 0 && newPackagePolicy.inputs[0].config !== undefined) {
        var _newPackagePolicy$inp;

        const oldManifest = (_newPackagePolicy$inp = newPackagePolicy.inputs[0].config.artifact_manifest) !== null && _newPackagePolicy$inp !== void 0 ? _newPackagePolicy$inp : {
          value: {}
        };
        const newManifestVersion = manifest.getSemanticVersion();

        if (_semver.default.gt(newManifestVersion, oldManifest.value.manifest_version)) {
          const serializedManifest = manifest.toPackagePolicyManifest(packagePolicy.id);

          if (!_manifest.manifestDispatchSchema.is(serializedManifest)) {
            errors.push(new _errors2.EndpointError(`Invalid manifest for policy ${packagePolicy.id}`, serializedManifest));
          } else if (!manifestsEqual(serializedManifest, oldManifest.value)) {
            newPackagePolicy.inputs[0].config.artifact_manifest = {
              value: serializedManifest
            };

            try {
              await this.packagePolicyService.update(this.savedObjectsClient, // @ts-expect-error TS2345
              undefined, id, newPackagePolicy);
              this.logger.debug(`Updated package policy ${id} with manifest version ${manifest.getSemanticVersion()}`);
            } catch (err) {
              errors.push(err);
            }
          } else {
            this.logger.debug(`No change in manifest content for package policy: ${id}. Staying on old version`);
          }
        } else {
          this.logger.debug(`No change in manifest version for package policy: ${id}`);
        }
      } else {
        errors.push(new _errors2.EndpointError(`Package Policy ${id} has no 'inputs[0].config'`, newPackagePolicy));
      }
    });
    return errors;
  }
  /**
   * Commits a manifest to indicate that a new version has been computed.
   *
   * @param manifest The Manifest to commit.
   * @returns {Promise<Error | null>} An error, if encountered, or null.
   */


  async commit(manifest) {
    const manifestClient = this.getManifestClient(); // Commit the new manifest

    const manifestSo = manifest.toSavedObject();
    const version = manifest.getSavedObjectVersion();

    if (version == null) {
      await manifestClient.createManifest(manifestSo);
    } else {
      await manifestClient.updateManifest(manifestSo, {
        version
      });
    }

    this.logger.info(`Committed manifest ${manifest.getSemanticVersion()}`);
  }

  async listEndpointPolicies(page) {
    return this.packagePolicyService.list(this.savedObjectsClient, {
      page,
      perPage: 20,
      kuery: 'ingest-package-policies.package.name:endpoint'
    });
  }

  async listEndpointPolicyIds(page) {
    return this.packagePolicyService.listIds(this.savedObjectsClient, {
      page,
      perPage: 20,
      kuery: 'ingest-package-policies.package.name:endpoint'
    });
  }

  getArtifactsClient() {
    return this.artifactClient;
  }
  /**
   * Cleanup .fleet-artifacts index if there are some orphan artifacts
   */


  async cleanup(manifest) {
    try {
      const fleetArtifacts = [];
      const perPage = 100;
      let page = 1;
      let fleetArtifactsResponse = await this.artifactClient.listArtifacts({
        perPage,
        page
      });
      fleetArtifacts.push(...fleetArtifactsResponse.items);

      while (fleetArtifactsResponse.total > fleetArtifacts.length && !(0, _lodash.isEmpty)(fleetArtifactsResponse.items)) {
        page += 1;
        fleetArtifactsResponse = await this.artifactClient.listArtifacts({
          perPage,
          page
        });
        fleetArtifacts.push(...fleetArtifactsResponse.items);
      }

      if ((0, _lodash.isEmpty)(fleetArtifacts)) {
        return;
      }

      const badArtifacts = [];
      const manifestArtifactsIds = manifest.getAllArtifacts().map(artifact => (0, _artifacts.getArtifactId)(artifact));

      for (const fleetArtifact of fleetArtifacts) {
        const artifactId = (0, _artifacts.getArtifactId)(fleetArtifact);
        const isArtifactInManifest = manifestArtifactsIds.includes(artifactId);

        if (!isArtifactInManifest) {
          badArtifacts.push(fleetArtifact);
        }
      }

      if ((0, _lodash.isEmpty)(badArtifacts)) {
        return;
      }

      this.logger.error(new _errors2.EndpointError(`Cleaning up ${badArtifacts.length} orphan artifacts`, badArtifacts));
      await (0, _pMap.default)(badArtifacts, async badArtifact => this.artifactClient.deleteArtifact((0, _artifacts.getArtifactId)(badArtifact)), {
        concurrency: 5,

        /** When set to false, instead of stopping when a promise rejects, it will wait for all the promises to
         * settle and then reject with an aggregated error containing all the errors from the rejected promises. */
        stopOnError: false
      });
      this.logger.info(`All orphan artifacts has been removed successfully`);
    } catch (error) {
      this.logger.error(new _errors2.EndpointError('There was an error cleaning orphan artifacts', error));
    }
  }

}

exports.ManifestManager = ManifestManager;