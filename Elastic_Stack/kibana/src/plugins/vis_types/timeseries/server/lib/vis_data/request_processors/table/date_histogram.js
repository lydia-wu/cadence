"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateHistogram = void 0;

var _helpers = require("../../helpers");

var _calculate_agg_root = require("./calculate_agg_root");

var _server = require("../../../../../../../../plugins/data/server");

var _agg_utils = require("../../../../../common/agg_utils");

var _enums = require("../../../../../common/enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const {
  dateHistogramInterval
} = _server.search.aggs;

const dateHistogram = ({
  req,
  panel,
  seriesIndex,
  capabilities,
  uiSettings,
  buildSeriesMetaParams
}) => next => async doc => {
  var _seriesIndex$indexPat;

  const barTargetUiSettings = await uiSettings.get(_server.UI_SETTINGS.HISTOGRAM_BAR_TARGET);
  const {
    timeField,
    interval
  } = await buildSeriesMetaParams();
  const {
    from,
    to
  } = (0, _helpers.getTimerange)(req);
  const meta = {
    timeField,
    index: panel.use_kibana_indexes ? (_seriesIndex$indexPat = seriesIndex.indexPattern) === null || _seriesIndex$indexPat === void 0 ? void 0 : _seriesIndex$indexPat.id : undefined,
    panelId: panel.id
  };
  const {
    intervalString
  } = (0, _helpers.getBucketSize)(req, interval, capabilities, barTargetUiSettings);
  const {
    timezone
  } = capabilities;

  const overwriteDateHistogramForLastBucketMode = () => {
    panel.series.forEach(column => {
      const aggRoot = (0, _calculate_agg_root.calculateAggRoot)(doc, column);
      (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.date_histogram`, {
        field: timeField,
        min_doc_count: 0,
        time_zone: timezone,
        extended_bounds: {
          min: from.valueOf(),
          max: to.valueOf()
        },
        ...dateHistogramInterval(intervalString)
      });
      (0, _helpers.overwrite)(doc, aggRoot.replace(/\.aggs$/, '.meta'), { ...meta,
        intervalString
      });
    });
  };

  const overwriteDateHistogramForEntireTimerangeMode = () => {
    const metricAggs = (0, _agg_utils.getAggsByType)(agg => agg.id)[_agg_utils.AGG_TYPE.METRIC];

    let bucketInterval;
    panel.series.forEach(column => {
      const aggRoot = (0, _calculate_agg_root.calculateAggRoot)(doc, column); // we should use auto_date_histogram only for metric aggregations and math

      if (column.metrics.every(metric => metricAggs.includes(metric.type) || metric.type === _enums.TSVB_METRIC_TYPES.MATH)) {
        (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.auto_date_histogram`, {
          field: timeField,
          buckets: 1
        });
        bucketInterval = `${to.valueOf() - from.valueOf()}ms`;
      } else {
        (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.date_histogram`, {
          field: timeField,
          min_doc_count: 0,
          time_zone: timezone,
          extended_bounds: {
            min: from.valueOf(),
            max: to.valueOf()
          },
          ...dateHistogramInterval(intervalString)
        });
        bucketInterval = intervalString;
      }

      (0, _helpers.overwrite)(doc, aggRoot.replace(/\.aggs$/, '.meta'), { ...meta,
        intervalString: bucketInterval
      });
    });
  };

  if ((0, _helpers.isLastValueTimerangeMode)(panel)) {
    overwriteDateHistogramForLastBucketMode();
  } else {
    overwriteDateHistogramForEntireTimerangeMode();
  }

  return next(doc);
};

exports.dateHistogram = dateHistogram;