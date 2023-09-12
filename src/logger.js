/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import {
  NOOP,
  LOGGING_LEVELS,
  checkAppend,
  checkLoggingLevel,
} from './utils';

/**
 * A simple logging class.
 *
 * A `Logger` object provides the following logging methods:
 *
 * - `Logger.trace(message, arg1, arg2, ...)`: Outputs a log message with the `TRACE` level.
 * - `Logger.debug(message, arg1, arg2, ...)`: Outputs a log message with the `DEBUG` level.
 * - `Logger.info(message, arg1, arg2, ...)`: Outputs a log message with the `INFO` level.
 * - `Logger.warn(message, arg1, arg2, ...)`: Outputs a log message with the `WARN` level.
 * - `Logger.error(message, arg1, arg2, ...)`: Outputs a log message with the `ERROR` level.
 *
 * The message argument of those logging methods supports the following
 * substitution patterns:
 *
 * - `%o` or `%O`: Outputs a JavaScript object. Clicking the object name opens
 *    more information about it in the inspector.
 * - `%d` or `%i`: Outputs an integer. Number formatting is supported, for
 *   example `logger.info('Foo %.2d', 1.1)` will output the number as two
 *   significant figures with a leading 0: `Foo 01`.
 * - `%s`: Outputs a string.
 * - `%f`: Outputs a floating-point value. Formatting is supported, for example
 *   `logger.debug("Foo %.2f", 1.1)` will output the number to 2 decimal
 *   places: `Foo 1.10`.
 *
 * @author Haixing Hu
 */
class Logger {
  /**
   * The default logging level, which is `DEBUG`.
   *
   * @private
   */
  static _defaultLevel = 'DEBUG';

  /**
   * Construct a log object.
   *
   * @param {String} name
   *     The optional name of this logger. The default value of this argument
   *     is an empty string.
   * @param {String} level
   *     Optional, indicating the log level of this object. The default value
   *     of this argument is the default logging level of all `Logger` instants.
   * @param {Object} appender
   *     Optional, indicating the content output pipe of the log. This object
   *     must provide `trace`, `debug`, `info`, `warn` and `error` methods.
   *     The default value of this argument is `console`.
   */
  constructor(name = '', appender = console, level = Logger._defaultLevel) {
    if (typeof name !== 'string') {
      throw new TypeError('The name of a logger must be a string, and empty string is allowed.');
    }
    checkAppend(appender);
    checkLoggingLevel(level);
    this._name = name;
    this._level = level;
    this._appender = appender;
    this._bindLoggingMethods(level, appender);
  }

  /**
   * Get the name of this logger.
   *
   * @returns {String}
   *     The name of this logger.
   */
  getName() {
    return this._name;
  }

  /**
   * Get the appender of this logger.
   *
   * @return {Object}
   *     The appender of this logger.
   */
  getAppender() {
    return this._appender;
  }

  /**
   * Set up a new Appender.
   *
   * @param {Object} appender
   *     The new Appender serves as the content output pipeline of the log.
   *     This object must provide `trace`, `debug`, `info`, `warn` and `error`
   *     methods.
   */
  setAppender(appender) {
    checkAppend(appender);
    this._bindLoggingMethods(this._level, appender);
    this._appender = appender;
  }

  /**
   * Get the logging level of this logger.
   *
   * @return {String}
   *     The logging level of this logger. Possible return values are `TRACE`,
   *     `DEBUG`, `INFO`, `WARN`, `ERROR`, and `NONE`.
   */
  getLevel() {
    return this._level;
  }

  /**
   * Set the logging level of this logger.
   *
   * @param {String} level
   *     The new logging level. The optional levels are `TRACE`, `DEBUG`, `INFO`,
   *     `WARN`, `ERROR`, and `NONE`.
   */
  setLevel(level) {
    level = level.toUpperCase();
    checkLoggingLevel(level);
    this._bindLoggingMethods(level, this._appender);
    this._level = level;
  }

  /**
   * Disable this logging object.
   */
  disable() {
    this._bindLoggingMethods('NONE', this._appender);
  }

  /**
   * Enable this logging object.
   */
  enable() {
    this._bindLoggingMethods(this._level, this._appender);
  }

  /**
   * Enable or disable this log object.
   *
   * @param {Boolean} enabled
   *    Whether to enable this log object.
   */
  setEnabled(enabled) {
    if (enabled) {
      this.enable();
    } else {
      this.disable();
    }
  }

  /**
   * Rebinds all logging implementation methods to the corresponding logging
   * methods of the appender.
   *
   * @param {String} level
   *     The target logging level. All logging methods belows this target logging
   *     level will be bind to a no-op function, while all logging methods above
   *     or equal to this target logging level will be bind to the corresponding
   *     logging methods of the appender. This argument should be a valid
   *     logging level. The function do not check the validity of this argument.
   * @param {Object} appender
   *     The appender whose logging methods will be bound to the corresponding
   *     logging methods of this logger. This argument should be a valid appender.
   *     The function do not check the validity of this argument.
   * @private
   */
  _bindLoggingMethods(level, appender) {
    const target = LOGGING_LEVELS[level];
    for (const level in LOGGING_LEVELS) {
      if (Object.hasOwn(LOGGING_LEVELS, level) && (level !== 'NONE')) {
        const m = level.toLowerCase();
        if (LOGGING_LEVELS[level] < target) {
          // binds the private logging method of this object to no-op
          this[m] = NOOP;
        } else {
          // binds the private logging method of this object to the
          // corresponding logging method of this.appender.
          // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
          let prefix = `[${level}] `;
          if (this._name) {
            prefix += `${this._name} - `;
          }
          prefix += '%s';
          this[m] = Function.prototype.bind.call(appender[m], appender, prefix);
        }
      }
    }
  }

  /**
   * Logs a message in the `TRACE` level.
   *
   * @param {String} message
   *     the message or message template, which may contain zero or more
   *     substitution patterns, e.g., '%o', '%s', '%d', '%f', ..., etc.
   * @param {Array} args
   *     the array of arguments used to format the message.
   * @private
   */
  trace(message, ...args) {}

  /**
   * Logs a message in the `DEBUG` level.
   *
   * @param {String} message
   *     the message or message template, which may contain zero or more
   *     substitution patterns, e.g., '%o', '%s', '%d', '%f', ..., etc.
   * @param {Array} args
   *     the array of arguments used to format the message.
   * @private
   */
  debug(message, ...args) {}

  /**
   * Logs a message in the `INFO` level.
   *
   * @param {String} message
   *     the message or message template, which may contain zero or more
   *     substitution patterns, e.g., '%o', '%s', '%d', '%f', ..., etc.
   * @param {Array} args
   *     the array of arguments used to format the message.
   * @private
   */
  info(message, ...args) {}

  /**
   * Logs a message in the `WARN` level.
   *
   * @param {String} message
   *     the message or message template, which may contain zero or more
   *     substitution patterns, e.g., '%o', '%s', '%d', '%f', ..., etc.
   * @param {Array} args
   *     the array of arguments used to format the message.
   * @private
   */
  warn(message, ...args) {}

  /**
   * Logs a message in the `ERROR` level.
   *
   * @param {String} message
   *     the message or message template, which may contain zero or more
   *     substitution patterns, e.g., '%o', '%s', '%d', '%f', ..., etc.
   * @param {Array} args
   *     the array of arguments used to format the message.
   * @private
   */
  error(message, ...args) {}

  /**
   * Gets the default logging level of all `Logger` instants.
   *
   * @return {String}
   *     The default logging level of all `Logger` instants.
   */
  static getDefaultLevel() {
    return Logger._defaultLevel;
  }

  /**
   * Sets the default logging level of all `Logger` instants.
   *
   * @param {String} level
   *     The new default logging level of all `Logger` instants.
   */
  static setDefaultLevel(level) {
    checkLoggingLevel(level);
    Logger._defaultLevel = level;
  }
}

/**
 * A predefined default constructed logger object.
 *
 * @author Haixing Hu
 */
const logger = new Logger();

export {
  Logger,
  logger,
};

export default logger;
