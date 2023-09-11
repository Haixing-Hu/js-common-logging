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
 * The default logging level, which is `DEBUG`.
 *
 * @author Haixing Hu
 * @private
 */
const DEFAULT_LOGGING_LEVEL = 'DEBUG';

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
   * Construct a log object.
   *
   * @param {String} level
   *     Optional, indicating the log level of this object. The default value
   *     of this argument is `DEFAULT_LOGGING_LEVEL`.
   * @param {Object} appender
   *     Optional, indicating the content output pipe of the log. This object
   *     must provide `trace`, `debug`, `info`, `warn` and `error` methods.
   *     The default value of this argument is `console`.
   */
  constructor(level = DEFAULT_LOGGING_LEVEL, appender = console) {
    this._checkLoggingLevel(level);
    this._checkAppend(appender);
    this.appender = appender;
    this.level = level;
    this._bindLoggingMethods(level, appender);
  }

  /**
   * Disable this logging object.
   */
  disable() {
    this._bindLoggingMethods('NONE', this.appender);
  }

  /**
   * Enable this logging object.
   */
  enable() {
    this._bindLoggingMethods(this.level, this.appender);
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
   * Get the appender of this logger.
   *
   * @return {Object}
   *     The appender of this logger.
   */
  getAppender() {
    return this.appender;
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
    this._checkAppend(appender);
    this._bindLoggingMethods(this.level, appender);
    this.appender = appender;
  }

  /**
   * Get the logging level of this logger.
   *
   * @return {String}
   *     The logging level of this logger. Possible return values are `TRACE`,
   *     `DEBUG`, `INFO`, `WARN`, `ERROR`, and `NONE`.
   */
  getLevel() {
    return this.level;
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
    this._checkLoggingLevel(level);
    this._bindLoggingMethods(level, this.appender);
    this.level = level;
  }

  /**
   * Checks the validity of an appender.
   *
   * @param {Object} appender
   *     The appender to be checked. If it is invalid, an `Error` will be thrown.
   * @private
   */
  _checkAppend(appender) {
    if (!appender) {
      throw new Error('The appender for a logger cannot be `null` nor `undefined`.');
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
  _checkLoggingLevel(level) {
    if (LOGGING_LEVELS[level] === undefined) {
      throw new RangeError(`Unknown logging level "${level}". `
          + 'Possible values are："TRACE", "DEBUG", "INFO", "WARN", "ERROR", "NONE"。');
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
    for (const l in LOGGING_LEVELS) {
      if (Object.hasOwn(LOGGING_LEVELS, l) && (l !== 'NONE')) {
        const m = l.toLowerCase();
        if (LOGGING_LEVELS[l] < target) {
          // binds the private logging method of this object to no-op
          this[m] = NOOP;
        } else {
          // binds the private logging method of this object to the
          // corresponding logging method of this.appender.
          // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
          this[m] = Function.prototype.bind.call(appender[m], appender, `[${l}]`);
        }
      }
    }
  }
}

/**
 * A predefined default constructed logger object.
 *
 * @author Haixing Hu
 */
const logger = new Logger();

export {
  LOGGING_LEVELS,
  DEFAULT_LOGGING_LEVEL,
  Logger,
  logger,
};

export default logger;
