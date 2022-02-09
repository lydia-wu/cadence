"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceInstaller = void 0;

var _lodash = require("lodash");

var _assets = require("../../common/assets");

var _technical_component_template = require("../../common/assets/component_templates/technical_component_template");

var _ecs_component_template = require("../../common/assets/component_templates/ecs_component_template");

var _default_lifecycle_policy = require("../../common/assets/lifecycle_policies/default_lifecycle_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const INSTALLATION_TIMEOUT = 20 * 60 * 1000; // 20 minutes

class ResourceInstaller {
  constructor(options) {
    this.options = options;
  }

  async installWithTimeout(resources, installer) {
    try {
      const installResources = async () => {
        const {
          logger,
          isWriteEnabled
        } = this.options;

        if (!isWriteEnabled) {
          logger.info(`Write is disabled; not installing ${resources}`);
          return;
        }

        logger.info(`Installing ${resources}`);
        await installer();
        logger.info(`Installed ${resources}`);
      };

      const throwTimeoutException = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const msg = `Timeout: it took more than ${INSTALLATION_TIMEOUT}ms`;
            reject(new Error(msg));
          }, INSTALLATION_TIMEOUT);
        });
      };

      await Promise.race([installResources(), throwTimeoutException()]);
    } catch (e) {
      this.options.logger.error(e);
      const reason = (e === null || e === void 0 ? void 0 : e.message) || 'Unknown reason';
      throw new Error(`Failure installing ${resources}. ${reason}`);
    }
  } // -----------------------------------------------------------------------------------------------
  // Common resources

  /**
   * Installs common, library-level resources shared between all indices:
   *   - default ILM policy
   *   - component template containing technical fields
   *   - component template containing all standard ECS fields
   */


  async installCommonResources() {
    await this.installWithTimeout('common resources shared between all indices', async () => {
      const {
        getResourceName
      } = this.options; // We can install them in parallel

      await Promise.all([this.createOrUpdateLifecyclePolicy({
        policy: getResourceName(_assets.DEFAULT_ILM_POLICY_ID),
        body: _default_lifecycle_policy.defaultLifecyclePolicy
      }), this.createOrUpdateComponentTemplate({
        name: getResourceName(_assets.TECHNICAL_COMPONENT_TEMPLATE_NAME),
        body: _technical_component_template.technicalComponentTemplate
      }), this.createOrUpdateComponentTemplate({
        name: getResourceName(_assets.ECS_COMPONENT_TEMPLATE_NAME),
        body: _ecs_component_template.ecsComponentTemplate
      })]);
    });
  } // -----------------------------------------------------------------------------------------------
  // Index-level resources

  /**
   * Installs index-level resources shared between all namespaces of this index:
   *   - custom ILM policy if it was provided
   *   - component templates
   */


  async installIndexLevelResources(indexInfo) {
    await this.installWithTimeout(`resources for index ${indexInfo.baseName}`, async () => {
      const {
        componentTemplates,
        ilmPolicy
      } = indexInfo.indexOptions;

      if (ilmPolicy != null) {
        await this.createOrUpdateLifecyclePolicy({
          policy: indexInfo.getIlmPolicyName(),
          body: {
            policy: ilmPolicy
          }
        });
      }

      await Promise.all(componentTemplates.map(async ct => {
        var _ct$settings;

        await this.createOrUpdateComponentTemplate({
          name: indexInfo.getComponentTemplateName(ct.name),
          body: {
            template: {
              settings: (_ct$settings = ct.settings) !== null && _ct$settings !== void 0 ? _ct$settings : {},
              mappings: ct.mappings
            },
            _meta: ct._meta
          }
        });
      }));
    });
  }

  async updateIndexMappings(indexInfo, namespace) {
    const {
      logger
    } = this.options;
    const aliases = indexInfo.basePattern;
    const backingIndices = indexInfo.getPatternForBackingIndices(namespace);
    logger.debug(`Updating mappings of existing concrete indices for ${indexInfo.baseName}`); // Find all concrete indices for all namespaces of the index.

    const concreteIndices = await this.fetchConcreteIndices(aliases, backingIndices); // Update mappings of the found indices.

    await Promise.all(concreteIndices.map(item => this.updateAliasWriteIndexMapping(item)));
  } // NOTE / IMPORTANT: Please note this will update the mappings of backing indices but
  // *not* the settings. This is due to the fact settings can be classed as dynamic and static,
  // and static updates will fail on an index that isn't closed. New settings *will* be applied as part
  // of the ILM policy rollovers. More info: https://github.com/elastic/kibana/pull/113389#issuecomment-940152654


  async updateAliasWriteIndexMapping({
    index,
    alias
  }) {
    const {
      logger,
      getClusterClient
    } = this.options;
    const clusterClient = await getClusterClient();
    const simulatedIndexMapping = await clusterClient.indices.simulateIndexTemplate({
      name: index
    });
    const simulatedMapping = (0, _lodash.get)(simulatedIndexMapping, ['body', 'template', 'mappings']);

    try {
      await clusterClient.indices.putMapping({
        index,
        body: simulatedMapping
      });
      return;
    } catch (err) {
      logger.error(`Failed to PUT mapping for alias ${alias}: ${err.message}`);
      throw err;
    }
  } // -----------------------------------------------------------------------------------------------
  // Namespace-level resources

  /**
   * Installs and updates resources tied to concrete namespace of an index:
   *   - namespaced index template
   *   - Index mappings for existing concrete indices
   *   - concrete index (write target) if it doesn't exist
   */


  async installAndUpdateNamespaceLevelResources(indexInfo, namespace) {
    const {
      logger
    } = this.options;
    const alias = indexInfo.getPrimaryAlias(namespace);
    logger.info(`Installing namespace-level resources and creating concrete index for ${alias}`); // Install / update the index template

    await this.installNamespacedIndexTemplate(indexInfo, namespace); // Update index mappings for indices matching this namespace.

    await this.updateIndexMappings(indexInfo, namespace); // If we find a concrete backing index which is the write index for the alias here, we shouldn't
    // be making a new concrete index. We return early because we don't need a new write target.

    const indexExists = await this.checkIfConcreteWriteIndexExists(indexInfo, namespace);

    if (indexExists) {
      return;
    } else {
      await this.createConcreteWriteIndex(indexInfo, namespace);
    }
  }

  async checkIfConcreteWriteIndexExists(indexInfo, namespace) {
    const {
      logger
    } = this.options;
    const primaryNamespacedAlias = indexInfo.getPrimaryAlias(namespace);
    const indexPatternForBackingIndices = indexInfo.getPatternForBackingIndices(namespace);
    logger.debug(`Checking if concrete write index exists for ${primaryNamespacedAlias}`);
    const concreteIndices = await this.fetchConcreteIndices(primaryNamespacedAlias, indexPatternForBackingIndices);
    const concreteIndicesExist = concreteIndices.some(item => item.alias === primaryNamespacedAlias);
    const concreteWriteIndicesExist = concreteIndices.some(item => item.alias === primaryNamespacedAlias && item.isWriteIndex); // If we find backing indices for the alias here, we shouldn't be making a new concrete index -
    // either one of the indices is the write index so we return early because we don't need a new write target,
    // or none of them are the write index so we'll throw an error because one of the existing indices should have
    // been the write target
    // If there are some concrete indices but none of them are the write index, we'll throw an error
    // because one of the existing indices should have been the write target.

    if (concreteIndicesExist && !concreteWriteIndicesExist) {
      throw new Error(`Indices matching pattern ${indexPatternForBackingIndices} exist but none are set as the write index for alias ${primaryNamespacedAlias}`);
    }

    return concreteWriteIndicesExist;
  }

  async installNamespacedIndexTemplate(indexInfo, namespace) {
    var _indexTemplate$_meta;

    const {
      logger,
      getResourceName
    } = this.options;
    const {
      componentTemplateRefs,
      componentTemplates,
      indexTemplate = {},
      ilmPolicy
    } = indexInfo.indexOptions;
    const primaryNamespacedAlias = indexInfo.getPrimaryAlias(namespace);
    const secondaryNamespacedAlias = indexInfo.getSecondaryAlias(namespace);
    const indexPatternForBackingIndices = indexInfo.getPatternForBackingIndices(namespace);
    logger.debug(`Installing index template for ${primaryNamespacedAlias}`);
    const technicalComponentNames = [getResourceName(_assets.TECHNICAL_COMPONENT_TEMPLATE_NAME)];
    const referencedComponentNames = componentTemplateRefs.map(ref => getResourceName(ref));
    const ownComponentNames = componentTemplates.map(template => indexInfo.getComponentTemplateName(template.name));
    const ilmPolicyName = ilmPolicy ? indexInfo.getIlmPolicyName() : getResourceName(_assets.DEFAULT_ILM_POLICY_ID);
    const indexMetadata = { ...indexTemplate._meta,
      kibana: { ...((_indexTemplate$_meta = indexTemplate._meta) === null || _indexTemplate$_meta === void 0 ? void 0 : _indexTemplate$_meta.kibana),
        version: indexInfo.kibanaVersion
      },
      namespace
    }; // TODO: need a way to update this template if/when we decide to make changes to the
    // built in index template. Probably do it as part of updateIndexMappingsForAsset?
    // (Before upgrading any indices, find and upgrade all namespaced index templates - component templates
    // will already have been upgraded by solutions or rule registry, in the case of technical/ECS templates)
    // With the current structure, it's tricky because the index template creation
    // depends on both the namespace and secondary alias, both of which are not currently available
    // to updateIndexMappingsForAsset. We can make the secondary alias available since
    // it's known at plugin startup time, but
    // the namespace values can really only come from the existing templates that we're trying to update
    // - maybe we want to store the namespace as a _meta field on the index template for easy retrieval

    await this.createOrUpdateIndexTemplate({
      name: indexInfo.getIndexTemplateName(namespace),
      body: {
        index_patterns: [indexPatternForBackingIndices],
        // Order matters:
        // - first go external component templates referenced by this index (e.g. the common full ECS template)
        // - then we include own component templates registered with this index
        // - finally, we include technical component templates to make sure the index gets all the
        //   mappings and settings required by all Kibana plugins using rule registry to work properly
        composed_of: [...referencedComponentNames, ...ownComponentNames, ...technicalComponentNames],
        template: {
          settings: {
            hidden: true,
            'index.lifecycle': {
              name: ilmPolicyName,
              rollover_alias: primaryNamespacedAlias
            }
          },
          mappings: {
            dynamic: false,
            _meta: indexMetadata
          },
          aliases: secondaryNamespacedAlias != null ? {
            [secondaryNamespacedAlias]: {
              is_write_index: false
            }
          } : undefined
        },
        _meta: indexMetadata,
        // By setting the priority to namespace.length, we ensure that if one namespace is a prefix of another namespace
        // then newly created indices will use the matching template with the *longest* namespace
        priority: namespace.length
      }
    });
  }

  async createConcreteWriteIndex(indexInfo, namespace) {
    const {
      logger,
      getClusterClient
    } = this.options;
    const clusterClient = await getClusterClient();
    const primaryNamespacedAlias = indexInfo.getPrimaryAlias(namespace);
    const initialIndexName = indexInfo.getConcreteIndexInitialName(namespace);
    logger.debug(`Creating concrete write index for ${primaryNamespacedAlias}`);

    try {
      await clusterClient.indices.create({
        index: initialIndexName,
        body: {
          aliases: {
            [primaryNamespacedAlias]: {
              is_write_index: true
            }
          }
        }
      });
    } catch (err) {
      var _err$meta, _err$meta$body, _err$meta$body$error; // If the index already exists and it's the write index for the alias,
      // something else created it so suppress the error. If it's not the write
      // index, that's bad, throw an error.


      if ((err === null || err === void 0 ? void 0 : (_err$meta = err.meta) === null || _err$meta === void 0 ? void 0 : (_err$meta$body = _err$meta.body) === null || _err$meta$body === void 0 ? void 0 : (_err$meta$body$error = _err$meta$body.error) === null || _err$meta$body$error === void 0 ? void 0 : _err$meta$body$error.type) === 'resource_already_exists_exception') {
        var _existingIndices$init, _existingIndices$init2, _existingIndices$init3;

        const {
          body: existingIndices
        } = await clusterClient.indices.get({
          index: initialIndexName
        });

        if (!((_existingIndices$init = existingIndices[initialIndexName]) !== null && _existingIndices$init !== void 0 && (_existingIndices$init2 = _existingIndices$init.aliases) !== null && _existingIndices$init2 !== void 0 && (_existingIndices$init3 = _existingIndices$init2[primaryNamespacedAlias]) !== null && _existingIndices$init3 !== void 0 && _existingIndices$init3.is_write_index)) {
          throw Error(`Attempted to create index: ${initialIndexName} as the write index for alias: ${primaryNamespacedAlias}, but the index already exists and is not the write index for the alias`);
        }
      } else {
        throw err;
      }
    }
  } // -----------------------------------------------------------------------------------------------
  // Helpers


  async createOrUpdateLifecyclePolicy(policy) {
    const {
      logger,
      getClusterClient
    } = this.options;
    const clusterClient = await getClusterClient();
    logger.debug(`Installing lifecycle policy ${policy.policy}`);
    return clusterClient.ilm.putLifecycle(policy);
  }

  async createOrUpdateComponentTemplate(template) {
    const {
      logger,
      getClusterClient
    } = this.options;
    const clusterClient = await getClusterClient();
    logger.debug(`Installing component template ${template.name}`);
    return clusterClient.cluster.putComponentTemplate(template);
  }

  async createOrUpdateIndexTemplate(template) {
    const {
      logger,
      getClusterClient
    } = this.options;
    const clusterClient = await getClusterClient();
    logger.debug(`Installing index template ${template.name}`);
    const {
      body: simulateResponse
    } = await clusterClient.indices.simulateTemplate(template);
    const mappings = simulateResponse.template.mappings;

    if ((0, _lodash.isEmpty)(mappings)) {
      throw new Error('No mappings would be generated for this index, possibly due to failed/misconfigured bootstrapping');
    } // @ts-expect-error estypes.IndicesSimulateTemplateRequest.name is option but requied in estypes.IndicesPutIndexTemplateRequest


    return clusterClient.indices.putIndexTemplate(template);
  }

  async fetchConcreteIndices(aliasOrPatternForAliases, indexPatternForBackingIndices) {
    const {
      logger,
      getClusterClient
    } = this.options;
    const clusterClient = await getClusterClient();
    logger.debug(`Fetching concrete indices for ${indexPatternForBackingIndices}`);

    try {
      // It's critical that we specify *both* the index pattern for backing indices and their alias(es) in this request.
      // The alias prevents the request from finding other namespaces that could match the -* part of the index pattern
      // (see https://github.com/elastic/kibana/issues/107704). The backing index pattern prevents the request from
      // finding legacy .siem-signals indices that we add the alias to for backwards compatibility reasons. Together,
      // the index pattern and alias should ensure that we retrieve only the "new" backing indices for this
      // particular alias.
      const {
        body: response
      } = await clusterClient.indices.getAlias({
        index: indexPatternForBackingIndices,
        name: aliasOrPatternForAliases
      });
      return createConcreteIndexInfo(response);
    } catch (err) {
      // 404 is expected if the alerts-as-data indices haven't been created yet
      if (err.statusCode === 404) {
        return createConcreteIndexInfo({});
      } // A non-404 error is a real problem so we re-throw.


      throw err;
    }
  }

}

exports.ResourceInstaller = ResourceInstaller;

const createConcreteIndexInfo = response => {
  return Object.entries(response).flatMap(([index, {
    aliases
  }]) => Object.entries(aliases).map(([aliasName, aliasProperties]) => {
    var _aliasProperties$is_w;

    return {
      index,
      alias: aliasName,
      isWriteIndex: (_aliasProperties$is_w = aliasProperties.is_write_index) !== null && _aliasProperties$is_w !== void 0 ? _aliasProperties$is_w : false
    };
  }));
};