"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const playwright_start_1 = require("./playwright_start");

async function runE2ETests({
  readConfigFile
}) {
  const kibanaConfig = await readConfigFile(require.resolve('./config.ts'));
  return { ...kibanaConfig.getAll(),
    testRunner: playwright_start_1.playwrightRunTests()
  };
} // eslint-disable-next-line import/no-default-export


exports.default = runE2ETests;
module.exports = exports.default;