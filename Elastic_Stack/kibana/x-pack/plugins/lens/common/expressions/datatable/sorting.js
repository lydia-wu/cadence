"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSortingCriteria = getSortingCriteria;

var _ipaddr = _interopRequireDefault(require("ipaddr.js"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isIPv6Address(ip) {
  return ip.kind() === 'ipv6';
}

function getSafeIpAddress(ip, directionFactor) {
  if (!_ipaddr.default.isValid(ip)) {
    // for non valid IPs have the same behaviour as for now (we assume it's only the "Other" string)
    // create a mock object which has all a special value to keep them always at the bottom of the list
    return {
      parts: Array(8).fill(directionFactor * Infinity)
    };
  }

  const parsedIp = _ipaddr.default.parse(ip);

  return isIPv6Address(parsedIp) ? parsedIp : parsedIp.toIPv4MappedAddress();
}

function getIPCriteria(sortBy, directionFactor) {
  // Create a set of 8 function to sort based on the 8 IPv6 slots of an address
  // For IPv4 bring them to the IPv6 "mapped" format and then sort
  return (rowA, rowB) => {
    const ipAString = rowA[sortBy];
    const ipBString = rowB[sortBy];
    const ipA = getSafeIpAddress(ipAString, directionFactor);
    const ipB = getSafeIpAddress(ipBString, directionFactor); // Now compare each part of the IPv6 address and exit when a value != 0 is found

    let i = 0;
    let diff = ipA.parts[i] - ipB.parts[i];

    while (!diff && i < 7) {
      i++;
      diff = ipA.parts[i] - ipB.parts[i];
    } // in case of same address but written in different styles, sort by string length


    if (diff === 0) {
      return directionFactor * (ipAString.length - ipBString.length);
    }

    return directionFactor * diff;
  };
}

function getRangeCriteria(sortBy, directionFactor) {
  // fill missing fields with these open bounds to perform number sorting
  const openRange = {
    gte: -Infinity,
    lt: Infinity
  };
  return (rowA, rowB) => {
    const rangeA = { ...openRange,
      ...rowA[sortBy]
    };
    const rangeB = { ...openRange,
      ...rowB[sortBy]
    };
    const fromComparison = rangeA.gte - rangeB.gte;
    const toComparison = rangeA.lt - rangeB.lt;
    return directionFactor * (fromComparison || toComparison);
  };
}

function getSortingCriteria(type, sortBy, formatter, direction) {
  // handle the direction with a multiply factor.
  const directionFactor = direction === 'asc' ? 1 : -1;
  let criteria;

  if (['number', 'date'].includes(type || '')) {
    criteria = (rowA, rowB) => directionFactor * (rowA[sortBy] - rowB[sortBy]);
  } // this is a custom type, and can safely assume the gte and lt fields are all numbers or undefined
  else if (type === 'range') {
    criteria = getRangeCriteria(sortBy, directionFactor);
  } // IP have a special sorting
  else if (type === 'ip') {
    criteria = getIPCriteria(sortBy, directionFactor);
  } else {
    // use a string sorter for the rest
    criteria = (rowA, rowB) => {
      const aString = formatter.convert(rowA[sortBy]);
      const bString = formatter.convert(rowB[sortBy]);
      return directionFactor * aString.localeCompare(bString);
    };
  }

  return getUndefinedHandler(sortBy, criteria);
}

function getUndefinedHandler(sortBy, sortingCriteria) {
  return (rowA, rowB) => {
    const valueA = rowA[sortBy];
    const valueB = rowB[sortBy];

    if (valueA != null && valueB != null && !Number.isNaN(valueA) && !Number.isNaN(valueB)) {
      return sortingCriteria(rowA, rowB);
    }

    if (valueA == null || Number.isNaN(valueA)) {
      return 1;
    }

    if (valueB == null || Number.isNaN(valueB)) {
      return -1;
    }

    return 0;
  };
}