"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGridTile = getGridTile;
exports.getTile = getTile;

var _geojsonVt = _interopRequireDefault(require("geojson-vt"));

var _vtPbf = _interopRequireDefault(require("vt-pbf"));

var _get_geometry_counts = require("../../common/get_geometry_counts");

var _constants = require("../../common/constants");

var _elasticsearch_util = require("../../common/elasticsearch_util");

var _util = require("./util");

var _geo_tile_utils = require("../../common/geo_tile_utils");

var _get_centroid_features = require("../../common/get_centroid_features");

var _pluck_range_field_meta = require("../../common/pluck_range_field_meta");

var _pluck_category_field_meta = require("../../common/pluck_category_field_meta");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error
// @ts-expect-error
// heuristic. largest color-palette has 30 colors. 1 color is used for 'other'.


const TERM_COUNT = 30 - 1;

function isAbortError(error) {
  return error.message === 'Request aborted' || error.message === 'Aborted';
}

async function getGridTile({
  logger,
  context,
  index,
  geometryFieldName,
  x,
  y,
  z,
  requestBody = {},
  requestType = _constants.RENDER_AS.POINT,
  searchSessionId,
  abortSignal
}) {
  try {
    const tileBounds = (0, _geo_tile_utils.tileToESBbox)(x, y, z);
    requestBody.query.bool.filter.push(getTileSpatialFilter(geometryFieldName, tileBounds));
    requestBody.aggs[_constants.GEOTILE_GRID_AGG_NAME].geotile_grid.precision = Math.min(z + _constants.SUPER_FINE_ZOOM_DELTA, _constants.MAX_ZOOM);
    requestBody.aggs[_constants.GEOTILE_GRID_AGG_NAME].geotile_grid.bounds = tileBounds;
    requestBody.track_total_hits = false;
    const response = await context.search.search({
      params: {
        index,
        body: requestBody
      }
    }, {
      sessionId: searchSessionId,
      legacyHitsTotal: false,
      abortSignal
    }).toPromise();
    const features = (0, _elasticsearch_util.convertRegularRespToGeoJson)(response.rawResponse, requestType);

    if (features.length) {
      const bounds = (0, _elasticsearch_util.formatEnvelopeAsPolygon)({
        maxLat: tileBounds.top_left.lat,
        minLat: tileBounds.bottom_right.lat,
        maxLon: tileBounds.bottom_right.lon,
        minLon: tileBounds.top_left.lon
      });
      const fieldNames = new Set();
      features.forEach(feature => {
        for (const key in feature.properties) {
          if (feature.properties.hasOwnProperty(key) && key !== 'key' && key !== 'gridCentroid') {
            fieldNames.add(key);
          }
        }
      });
      const fieldMeta = {};
      fieldNames.forEach(fieldName => {
        const rangeMeta = (0, _pluck_range_field_meta.pluckRangeFieldMeta)(features, fieldName, rawValue => {
          if (fieldName === _constants.COUNT_PROP_NAME) {
            return parseFloat(rawValue);
          } else if (typeof rawValue === 'number') {
            return rawValue;
          } else if (rawValue) {
            return parseFloat(rawValue.value);
          } else {
            return NaN;
          }
        });
        const categoryMeta = (0, _pluck_category_field_meta.pluckCategoryFieldMeta)(features, fieldName, TERM_COUNT);

        if (!fieldMeta[fieldName]) {
          fieldMeta[fieldName] = {};
        }

        if (rangeMeta) {
          fieldMeta[fieldName].range = rangeMeta;
        }

        if (categoryMeta) {
          fieldMeta[fieldName].categories = categoryMeta;
        }
      });
      const metaDataFeature = {
        type: 'Feature',
        properties: {
          [_constants.KBN_METADATA_FEATURE]: true,
          [_constants.KBN_FEATURE_COUNT]: features.length,
          [_constants.KBN_IS_TILE_COMPLETE]: true,
          [_constants.KBN_VECTOR_SHAPE_TYPE_COUNTS]: requestType === _constants.RENDER_AS.GRID ? {
            [_constants.VECTOR_SHAPE_TYPE.POINT]: 0,
            [_constants.VECTOR_SHAPE_TYPE.LINE]: 0,
            [_constants.VECTOR_SHAPE_TYPE.POLYGON]: features.length
          } : {
            [_constants.VECTOR_SHAPE_TYPE.POINT]: features.length,
            [_constants.VECTOR_SHAPE_TYPE.LINE]: 0,
            [_constants.VECTOR_SHAPE_TYPE.POLYGON]: 0
          },
          fieldMeta
        },
        geometry: bounds
      };
      features.push(metaDataFeature);
    }

    const featureCollection = {
      features,
      type: 'FeatureCollection'
    };
    return createMvtTile(featureCollection, z, x, y);
  } catch (e) {
    if (!isAbortError(e)) {
      // These are often circuit breaking exceptions
      // Should return a tile with some error message
      logger.warn(`Cannot generate grid-tile for ${z}/${x}/${y}: ${e.message}`);
    }

    return null;
  }
}

async function getTile({
  logger,
  context,
  index,
  geometryFieldName,
  x,
  y,
  z,
  requestBody = {},
  geoFieldType,
  searchSessionId,
  abortSignal
}) {
  let features;

  try {
    requestBody.query.bool.filter.push(getTileSpatialFilter(geometryFieldName, (0, _geo_tile_utils.tileToESBbox)(x, y, z)));
    const searchOptions = {
      sessionId: searchSessionId,
      legacyHitsTotal: false,
      abortSignal
    };
    const countResponse = await context.search.search({
      params: {
        index,
        body: {
          size: 0,
          query: requestBody.query,
          track_total_hits: requestBody.size + 1
        }
      }
    }, searchOptions).toPromise();

    if ((0, _elasticsearch_util.isTotalHitsGreaterThan)(countResponse.rawResponse.hits.total, requestBody.size)) {
      // Generate "too many features"-bounds
      const bboxResponse = await context.search.search({
        params: {
          index,
          body: {
            size: 0,
            query: requestBody.query,
            aggs: {
              data_bounds: {
                geo_bounds: {
                  field: geometryFieldName
                }
              }
            },
            track_total_hits: false
          }
        }
      }, searchOptions).toPromise();
      const metaDataFeature = {
        type: 'Feature',
        properties: {
          [_constants.KBN_METADATA_FEATURE]: true,
          [_constants.KBN_IS_TILE_COMPLETE]: false,
          [_constants.KBN_FEATURE_COUNT]: 0,
          [_constants.KBN_VECTOR_SHAPE_TYPE_COUNTS]: {
            [_constants.VECTOR_SHAPE_TYPE.POINT]: 0,
            [_constants.VECTOR_SHAPE_TYPE.LINE]: 0,
            [_constants.VECTOR_SHAPE_TYPE.POLYGON]: 0
          }
        },
        geometry: esBboxToGeoJsonPolygon( // @ts-expect-error @elastic/elasticsearch no way to declare aggregations for search response
        bboxResponse.rawResponse.aggregations.data_bounds.bounds, (0, _geo_tile_utils.tileToESBbox)(x, y, z))
      };
      features = [metaDataFeature];
    } else {
      const documentsResponse = await context.search.search({
        params: {
          index,
          body: { ...requestBody,
            track_total_hits: false
          }
        }
      }, searchOptions).toPromise();
      const featureCollection = (0, _elasticsearch_util.hitsToGeoJson)( // @ts-expect-error hitsToGeoJson should be refactored to accept estypes.SearchHit
      documentsResponse.rawResponse.hits.hits, hit => {
        return (0, _util.flattenHit)(geometryFieldName, hit);
      }, geometryFieldName, geoFieldType, []);
      features = featureCollection.features; // Correct system-fields.

      for (let i = 0; i < features.length; i++) {
        const props = features[i].properties;

        if (props !== null) {
          props[_constants.FEATURE_ID_PROPERTY_NAME] = features[i].id;
        }
      }

      const counts = (0, _get_geometry_counts.countVectorShapeTypes)(features);
      const fieldNames = new Set();
      features.forEach(feature => {
        for (const key in feature.properties) {
          if (feature.properties.hasOwnProperty(key) && key !== '_index' && key !== '_id' && key !== _constants.FEATURE_ID_PROPERTY_NAME) {
            fieldNames.add(key);
          }
        }
      });
      const fieldMeta = {};
      fieldNames.forEach(fieldName => {
        const rangeMeta = (0, _pluck_range_field_meta.pluckRangeFieldMeta)(features, fieldName, rawValue => {
          return typeof rawValue === 'number' ? rawValue : NaN;
        });
        const categoryMeta = (0, _pluck_category_field_meta.pluckCategoryFieldMeta)(features, fieldName, TERM_COUNT);

        if (!fieldMeta[fieldName]) {
          fieldMeta[fieldName] = {};
        }

        if (rangeMeta) {
          fieldMeta[fieldName].range = rangeMeta;
        }

        if (categoryMeta) {
          fieldMeta[fieldName].categories = categoryMeta;
        }
      });
      const metadataFeature = {
        type: 'Feature',
        properties: {
          [_constants.KBN_METADATA_FEATURE]: true,
          [_constants.KBN_IS_TILE_COMPLETE]: true,
          [_constants.KBN_VECTOR_SHAPE_TYPE_COUNTS]: counts,
          [_constants.KBN_FEATURE_COUNT]: features.length,
          fieldMeta
        },
        geometry: esBboxToGeoJsonPolygon((0, _geo_tile_utils.tileToESBbox)(x, y, z), (0, _geo_tile_utils.tileToESBbox)(x, y, z))
      };
      features.push(metadataFeature);
    }

    const featureCollection = {
      features,
      type: 'FeatureCollection'
    };
    return createMvtTile(featureCollection, z, x, y);
  } catch (e) {
    if (!isAbortError(e)) {
      logger.warn(`Cannot generate tile for ${z}/${x}/${y}: ${e.message}`);
    }

    return null;
  }
}

function getTileSpatialFilter(geometryFieldName, tileBounds) {
  const tileExtent = {
    minLon: tileBounds.top_left.lon,
    minLat: tileBounds.bottom_right.lat,
    maxLon: tileBounds.bottom_right.lon,
    maxLat: tileBounds.top_left.lat
  };
  const tileExtentFilter = (0, _elasticsearch_util.createExtentFilter)(tileExtent, [geometryFieldName]);
  return tileExtentFilter.query;
}

function esBboxToGeoJsonPolygon(esBounds, tileBounds) {
  // Intersecting geo_shapes may push bounding box outside of tile so need to clamp to tile bounds.
  let minLon = Math.max(esBounds.top_left.lon, tileBounds.top_left.lon);
  const maxLon = Math.min(esBounds.bottom_right.lon, tileBounds.bottom_right.lon);
  minLon = minLon > maxLon ? minLon - 360 : minLon; // fixes an ES bbox to straddle dateline

  const minLat = Math.max(esBounds.bottom_right.lat, tileBounds.bottom_right.lat);
  const maxLat = Math.min(esBounds.top_left.lat, tileBounds.top_left.lat);
  return {
    type: 'Polygon',
    coordinates: [[[minLon, minLat], [minLon, maxLat], [maxLon, maxLat], [maxLon, minLat], [minLon, minLat]]]
  };
}

function createMvtTile(featureCollection, z, x, y) {
  featureCollection.features.push(...(0, _get_centroid_features.getCentroidFeatures)(featureCollection));
  const tileIndex = (0, _geojsonVt.default)(featureCollection, {
    maxZoom: 24,
    // max zoom to preserve detail on; can't be higher than 24
    tolerance: 3,
    // simplification tolerance (higher means simpler)
    extent: 4096,
    // tile extent (both width and height)
    buffer: 64,
    // tile buffer on each side
    debug: 0,
    // logging level (0 to disable, 1 or 2)
    lineMetrics: false,
    // whether to enable line metrics tracking for LineString/MultiLineString features
    promoteId: null,
    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
    generateId: false,
    // whether to generate feature ids. Cannot be used with `promoteId`
    indexMaxZoom: 5,
    // max zoom in the initial tile index
    indexMaxPoints: 100000 // max number of points per tile in the index

  });
  const tile = tileIndex.getTile(z, x, y);

  if (tile) {
    const pbf = _vtPbf.default.fromGeojsonVt({
      [_constants.MVT_SOURCE_LAYER_NAME]: tile
    }, {
      version: 2
    });

    return Buffer.from(pbf);
  } else {
    return null;
  }
}