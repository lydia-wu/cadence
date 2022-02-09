"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAllRuleSavedObjects = exports.validateAllPrepackagedRules = exports.getPrepackagedRules = exports.getLatestPrepackagedRules = exports.getFleetInstalledRules = void 0;

var _Either = require("fp-ts/lib/Either");

var _pipeable = require("fp-ts/lib/pipeable");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _add_prepackaged_rules_schema = require("../../../../common/detection_engine/schemas/request/add_prepackaged_rules_schema");

var _prepackaged_rules = require("./prepackaged_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: convert rules files to TS and add explicit type definitions

/**
 * Validate the rules from the file system and throw any errors indicating to the developer
 * that they are adding incorrect schema rules. Also this will auto-flush in all the default
 * aspects such as default interval of 5 minutes, default arrays, etc...
 */


const validateAllPrepackagedRules = rules => {
  return rules.map(rule => {
    const decoded = _add_prepackaged_rules_schema.addPrepackagedRulesSchema.decode(rule);

    const checked = (0, _securitysolutionIoTsUtils.exactCheck)(rule, decoded);

    const onLeft = errors => {
      const ruleName = rule.name ? rule.name : '(rule name unknown)';
      const ruleId = rule.rule_id ? rule.rule_id : '(rule rule_id unknown)';
      throw new _securitysolutionEsUtils.BadRequestError(`name: "${ruleName}", rule_id: "${ruleId}" within the folder rules/prepackaged_rules ` + `is not a valid detection engine rule. Expect the system ` + `to not work with pre-packaged rules until this rule is fixed ` + `or the file is removed. Error is: ${(0, _securitysolutionIoTsUtils.formatErrors)(errors).join()}, Full rule contents are:\n${JSON.stringify(rule, null, 2)}`);
    };

    const onRight = schema => {
      return schema;
    };

    return (0, _pipeable.pipe)(checked, (0, _Either.fold)(onLeft, onRight));
  });
};
/**
 * Validate the rules from Saved Objects created by Fleet.
 */


exports.validateAllPrepackagedRules = validateAllPrepackagedRules;

const validateAllRuleSavedObjects = rules => {
  return rules.map(rule => {
    const decoded = _add_prepackaged_rules_schema.addPrepackagedRulesSchema.decode(rule);

    const checked = (0, _securitysolutionIoTsUtils.exactCheck)(rule, decoded);

    const onLeft = errors => {
      const ruleName = rule.name ? rule.name : '(rule name unknown)';
      const ruleId = rule.rule_id ? rule.rule_id : '(rule rule_id unknown)';
      throw new _securitysolutionEsUtils.BadRequestError(`name: "${ruleName}", rule_id: "${ruleId}" within the security-rule saved object ` + `is not a valid detection engine rule. Expect the system ` + `to not work with pre-packaged rules until this rule is fixed ` + `or the file is removed. Error is: ${(0, _securitysolutionIoTsUtils.formatErrors)(errors).join()}, Full rule contents are:\n${JSON.stringify(rule, null, 2)}`);
    };

    const onRight = schema => {
      return schema;
    };

    return (0, _pipeable.pipe)(checked, (0, _Either.fold)(onLeft, onRight));
  });
};
/**
 * Retrieve and validate rules that were installed from Fleet as saved objects.
 */


exports.validateAllRuleSavedObjects = validateAllRuleSavedObjects;

const getFleetInstalledRules = async client => {
  const fleetResponse = await client.all();
  const fleetRules = fleetResponse.map(so => so.attributes);
  return validateAllRuleSavedObjects(fleetRules);
};

exports.getFleetInstalledRules = getFleetInstalledRules;

const getPrepackagedRules = ( // @ts-expect-error mock data is too loosely typed
rules = _prepackaged_rules.rawRules) => {
  return validateAllPrepackagedRules(rules);
};

exports.getPrepackagedRules = getPrepackagedRules;

const getLatestPrepackagedRules = async (client, prebuiltRulesFromFileSystem, prebuiltRulesFromSavedObjects) => {
  // build a map of the most recent version of each rule
  const prepackaged = prebuiltRulesFromFileSystem ? getPrepackagedRules() : [];
  const ruleMap = new Map(prepackaged.map(r => [r.rule_id, r])); // check the rules installed via fleet and create/update if the version is newer

  if (prebuiltRulesFromSavedObjects) {
    const fleetRules = await getFleetInstalledRules(client);
    const fleetUpdates = fleetRules.filter(r => {
      const rule = ruleMap.get(r.rule_id);
      return rule == null || rule.version < r.version;
    }); // add the new or updated rules to the map

    fleetUpdates.forEach(r => ruleMap.set(r.rule_id, r));
  }

  return Array.from(ruleMap.values());
};

exports.getLatestPrepackagedRules = getLatestPrepackagedRules;