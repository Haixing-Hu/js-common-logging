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
 * Checks the validity of an appender.
 *
 * @param {Object} appender
 *     The appender to be checked. If it is invalid, an `Error` will be thrown.
 * @author Haixing Hu
 * @private
 */
function checkAppender(appender) {
  if (appender === null || typeof appender !== 'object') {
    throw new TypeError('The appender for a logger must be a non-null object.');
  }
  for (const level in LOGGING_LEVELS) {
    // NOTE: do NOT use Object.hasOwn() because it has a lot of compatibility problems
    if (Object.prototype.hasOwnProperty.call(LOGGING_LEVELS, level) && (level !== 'NONE')) {
      const methodName = level.toLowerCase();
      const method = appender[methodName];
      if (typeof method !== 'function') {
        throw new Error(`The appender of this logger has no ${methodName}() method.`);
      }
    }
  }
}

export default checkAppender;
