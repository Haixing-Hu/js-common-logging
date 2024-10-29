////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getLoggingPrefix from './get-logging-prefix';

/**
 * Binds a logging method of a logger with the stack of an `Error` object.
 *
 * We use the `Function.prototype.bind` to preserve the actual source code
 * location where the logging method is called.
 *
 * See: https://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number
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
function bindWithFunctionBind(logger, method, level, appender) {
  // Add a prefix to the message, which contains the logging level
  // and the name of the logger. Since the prefix use the recursive
  // string substitution pattern '%s', only some browsers support it.
  const prefix = getLoggingPrefix(logger, level);
  // Note that we add a string substitution pattern '%s' to the end of
  // the prefix, since according to the specification of the `console`,
  // the string substitution is taken on the first argument **recursively**.
  // See: https://stackoverflow.com/questions/75160241/what-order-does-console-log-with-multiple-arguments-and-multiple-s-substitu#answer-75167070
  //      https://console.spec.whatwg.org/#logger
  //      https://console.spec.whatwg.org/#formatter
  //
  // But the `console` object of the Node.js does not support the recursive
  // string substitution.
  // See: https://nodejs.org/api/console.html#console_console_log_data_args
  //  and https://nodejs.org/api/util.html#utilformatformat-args
  logger[method] = Function.prototype.bind.call(appender[method], appender, `${prefix}%s`);
}

export default bindWithFunctionBind;
