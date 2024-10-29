////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Gets the logging prefix for a logger.
 *
 * @param {Logger} logger
 *     The logger object.
 * @param {string} level
 *     The logging level.
 * @return {string}
 *     The logging prefix.
 * @author Haixing Hu
 * @private
 */
function getLoggingPrefix(logger, level) {
  let prefix = `[${level}] `;
  if (logger._name) {
    prefix += `${logger._name} - `;
  }
  return prefix;
}

export default getLoggingPrefix;
