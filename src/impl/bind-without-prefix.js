////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Binds a logging method of a logger with the stack of an `Error` object
 * with logging prefix.
 *
 * We use the `Function.prototype.bind` to preserve the actual source code
 * location where the logging method is called.
 *
 * See: https://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number
 *
 * Some browsers do not support the recursive string substitution pattern '%s'
 * in the `console` object. For those browsers, we have no way to add a prefix
 * to the logging message.
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
function bindWithoutPrefix(logger, method, level, appender) {
  logger[method] = Function.prototype.bind.call(appender[method], appender);
}

export default bindWithoutPrefix;
