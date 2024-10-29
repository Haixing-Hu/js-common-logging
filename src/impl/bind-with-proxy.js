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
 * Binds a logging method of a logger with a function bind.
 *
 * A way to preserve the correct source code location of calling Logger's logging
 * methods is to use the stack trace of the `Error` object. But it's too heavy
 * and significantly affects the performance.
 *
 * See:
 *
 * - https://stackoverflow.com/questions/57436034/wrap-consol-log-with-bind-to-keep-caller-context
 * - https://github.com/MrToph/stacklogger/
 * - https://github.com/baryon/tracer
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
function bindWithProxy(logger, method, level, appender) {
  const prefix = getLoggingPrefix(logger, level);
  logger[method] = new Proxy(appender[method], {
    apply: (target, thisArg, args) => target.apply(thisArg, fixFirstArgument(prefix, args)),
  });
}

export default bindWithProxy;
