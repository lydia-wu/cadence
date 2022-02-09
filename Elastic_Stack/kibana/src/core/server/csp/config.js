"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getDirectiveValidator = options => {
  const validateValue = getDirectiveValueValidator(options);
  return values => {
    for (const value of values) {
      const error = validateValue(value);

      if (error) {
        return error;
      }
    }
  };
};

const getDirectiveValueValidator = ({
  allowNone,
  allowNonce
}) => {
  return value => {
    if (!allowNonce && value.startsWith('nonce-')) {
      return `using "nonce-*" is considered insecure and is not allowed`;
    }

    if (!allowNone && (value === `none` || value === `'none'`)) {
      return `using "none" would conflict with Kibana's default csp configuration and is not allowed`;
    }
  };
};

const configSchema = _configSchema.schema.object({
  rules: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  script_src: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: [],
    validate: getDirectiveValidator({
      allowNone: false,
      allowNonce: false
    })
  }),
  worker_src: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: [],
    validate: getDirectiveValidator({
      allowNone: false,
      allowNonce: false
    })
  }),
  style_src: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: [],
    validate: getDirectiveValidator({
      allowNone: false,
      allowNonce: false
    })
  }),
  connect_src: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: [],
    validate: getDirectiveValidator({
      allowNone: false,
      allowNonce: false
    })
  }),
  default_src: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: [],
    validate: getDirectiveValidator({
      allowNone: false,
      allowNonce: false
    })
  }),
  font_src: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: [],
    validate: getDirectiveValidator({
      allowNone: false,
      allowNonce: false
    })
  }),
  frame_src: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: [],
    validate: getDirectiveValidator({
      allowNone: false,
      allowNonce: false
    })
  }),
  img_src: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: [],
    validate: getDirectiveValidator({
      allowNone: false,
      allowNonce: false
    })
  }),
  frame_ancestors: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: [],
    validate: getDirectiveValidator({
      allowNone: false,
      allowNonce: false
    })
  }),
  report_uri: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: [],
    validate: getDirectiveValidator({
      allowNone: true,
      allowNonce: false
    })
  }),
  report_to: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  strict: _configSchema.schema.boolean({
    defaultValue: false
  }),
  warnLegacyBrowsers: _configSchema.schema.boolean({
    defaultValue: true
  }),
  disableEmbedding: _configSchema.schema.oneOf([_configSchema.schema.literal(false)], {
    defaultValue: false
  })
}, {
  validate: cspConfig => {
    if (cspConfig.rules && hasDirectiveSpecified(cspConfig)) {
      return `"csp.rules" cannot be used when specifying per-directive additions such as "script_src", "worker_src" or "style_src"`;
    }

    const hasUnsafeInlineScriptSrc = cspConfig.script_src.includes(`unsafe-inline`) || cspConfig.script_src.includes(`'unsafe-inline'`);

    if (cspConfig.strict && hasUnsafeInlineScriptSrc) {
      return 'cannot use `unsafe-inline` for `script_src` when `csp.strict` is true';
    }

    if (cspConfig.warnLegacyBrowsers && hasUnsafeInlineScriptSrc) {
      return 'cannot use `unsafe-inline` for `script_src` when `csp.warnLegacyBrowsers` is true';
    }
  }
});

const hasDirectiveSpecified = rawConfig => {
  return Boolean(rawConfig.script_src.length || rawConfig.worker_src.length || rawConfig.style_src.length || rawConfig.connect_src.length || rawConfig.default_src.length || rawConfig.font_src.length || rawConfig.frame_src.length || rawConfig.img_src.length || rawConfig.frame_ancestors.length || rawConfig.report_uri.length || rawConfig.report_to.length);
};
/**
 * @internal
 */


const config = {
  // TODO: Move this to server.csp using config deprecations
  // ? https://github.com/elastic/kibana/pull/52251
  path: 'csp',
  schema: configSchema,
  deprecations: () => [(rawConfig, fromPath, addDeprecation) => {
    const cspConfig = rawConfig[fromPath];

    if (cspConfig !== null && cspConfig !== void 0 && cspConfig.rules) {
      addDeprecation({
        configPath: 'csp.rules',
        message: '`csp.rules` is deprecated in favor of directive specific configuration. Please use `csp.connect_src`, ' + '`csp.default_src`, `csp.font_src`, `csp.frame_ancestors`, `csp.frame_src`, `csp.img_src`, ' + '`csp.report_uri`, `csp.report_to`, `csp.script_src`, `csp.style_src`, and `csp.worker_src` instead.',
        correctiveActions: {
          manualSteps: [`Remove "csp.rules" from the Kibana config file."`, `Add directive specific configurations to the config file using "csp.connect_src", "csp.default_src", "csp.font_src", ` + `"csp.frame_ancestors", "csp.frame_src", "csp.img_src", "csp.report_uri", "csp.report_to", "csp.script_src", ` + `"csp.style_src", and "csp.worker_src".`]
        }
      });
    }
  }]
};
exports.config = config;