/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

/**
 * A no-operation function.
 *
 * @author Haixing Hu
 * @private
 */
const NOOP = () => {};

/**
 * Predefined logging levels.
 *
 * @author Haixing Hu
 */
const LOGGING_LEVELS = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  NONE: 5,
};

/**
 * Checks the validity of an appender.
 *
 * @param {Object} appender
 *     The appender to be checked. If it is invalid, an `Error` will be thrown.
 * @private
 */
function checkAppend(appender) {
  if (typeof appender !== 'object') {
    throw new TypeError('The appender for a logger must be an object.');
  }
  for (const level in LOGGING_LEVELS) {
    if (Object.hasOwn(LOGGING_LEVELS, level) && (level !== 'NONE')) {
      const methodName = level.toLowerCase();
      if (!appender[methodName]) {
        throw new Error(`The appender of this logger has no ${methodName}() method.`);
      }
    }
  }
}

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

export {
  NOOP,
  LOGGING_LEVELS,
  checkAppend,
  checkLoggingLevel,
}
