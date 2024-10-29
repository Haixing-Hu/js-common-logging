////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import LOGGING_LEVELS from './logging-levels';

/**
 * Checks the validity of a logging level.
 *
 * @param {String} level
 *     The logging level to be checked. If it is invalid, an `Error` will be
 *     thrown.
 * @private
 */
function checkLoggingLevel(level) {
  if (typeof level !== 'string') {
    throw new TypeError('The logging level must be a string.');
  }
  if (LOGGING_LEVELS[level] === undefined) {
    throw new RangeError(`Unknown logging level "${level}". `
      + `Possible values are：${JSON.stringify(Object.keys(LOGGING_LEVELS))}.`);
  }
}

export default checkLoggingLevel;
