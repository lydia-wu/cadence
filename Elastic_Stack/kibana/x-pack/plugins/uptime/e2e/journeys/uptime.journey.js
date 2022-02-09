"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.byTestId = void 0;

var _synthetics = require("@elastic/synthetics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const byTestId = testId => {
  return `[data-test-subj=${testId}]`;
};

exports.byTestId = byTestId;
(0, _synthetics.journey)('uptime', ({
  page,
  params
}) => {
  async function waitForLoadingToFinish() {
    let isLoadingVisible = true;

    while (isLoadingVisible) {
      const loading = await page.$(byTestId('kbnLoadingMessage'));
      isLoadingVisible = loading !== null;
      await page.waitForTimeout(5 * 1000);
    }
  }

  (0, _synthetics.step)('Go to Kibana', async () => {
    await page.goto(`${params.kibanaUrl}/app/uptime?dateRangeStart=now-5y&dateRangeEnd=now`, {
      waitUntil: 'networkidle'
    });
  });
  (0, _synthetics.step)('Login into kibana', async () => {
    await page.fill('[data-test-subj=loginUsername]', 'elastic', {
      timeout: 60 * 1000
    });
    await page.fill('[data-test-subj=loginPassword]', 'changeme');
    await page.click('[data-test-subj=loginSubmit]');
  });
  (0, _synthetics.step)('dismiss synthetics notice', async () => {
    await waitForLoadingToFinish();
    await page.click('[data-test-subj=uptimeDismissSyntheticsCallout]', {
      timeout: 60 * 1000
    });
  });
  (0, _synthetics.step)('change uptime index pattern', async () => {
    if (await page.$(byTestId('toastCloseButton'))) {
      await page.click(byTestId('toastCloseButton'));
    }

    await page.click(byTestId('settings-page-link'));
    await page.waitForTimeout(5 * 1000);
    const currentIndex = await page.inputValue(byTestId('heartbeat-indices-input-loaded'));

    if (currentIndex !== 'heartbeat-*') {
      await page.fill(byTestId('heartbeat-indices-input-loaded'), 'heartbeat-*');
      await page.click(byTestId('apply-settings-button'));
    }

    await page.goBack();
  });
  (0, _synthetics.step)('Check if there is table data', async () => {
    await page.click('[data-test-subj=uptimeOverviewPage]');
    await page.click('div.euiBasicTable', {
      timeout: 60 * 1000
    });
  });
  (0, _synthetics.step)('Click on my monitor', async () => {
    await page.click('[data-test-subj=monitor-page-link-0001-up]');
  });
});