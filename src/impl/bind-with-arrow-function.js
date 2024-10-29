////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getLoggingPrefix from './get-logging-prefix';
import fixFirstArgument from './fix-first-argument';

/**
 * Binds a logging method of a logger with an array function.
 *
 * We use the simple arrow function to preserve the actual source code location
 * where the logging method is called.
 *
 * This works for the Safari browser.
 *
 * @param {Logger} logger
 *     The logger object whose method to be bound.
 * @param {string} method
 *     The name of the logging method to be bound.
 * @param {string} level
 *     The logging level of the method.
 * @param {object} appender
 *     The appender object which provides underlying logging operation.
 * @author Haixing Hu
 * @private
 */
function bindWithArrowFunction(logger, method, level, appender) {
  // Add a prefix to the message, which contains the logging level
  // and the name of the logger. Since the prefix use the recursive
  // string substitution pattern '%s', only some browsers support it.
  const prefix = getLoggingPrefix(logger, level);
  // For Safari, the recursive string substitution pattern '%s' is not
  // supported. So we add the prefix to the first argument of the message
  // manually. We use the arrow function to preserve the actual source
  // code location where the logging method is called.
  logger[method] = (...args) => appender[method](...fixFirstArgument(prefix, args));
}

export default bindWithArrowFunction;
