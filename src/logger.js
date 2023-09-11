/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

/**
 * Predefined logging levels.
 *
 * @author Haixing Hu
 * @private
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
 * When passing a string to one of the `Logger` object's logging methods that
 * accepts a string (such as `info()`, `debug()`), you may use these
 * substitution strings:
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
    this.setLevel(level);
    this.setAppender(appender);
    this.log = this._log;
    this.trace = this._trace;
    this.debug = this._debug;
    this.info = this._info;
    this.warn = this._warn;
    this.error = this._error;
    this.lastTimestamp = '';    // remember the timestamp of the last log output
  }

  /**
   * Disable this logging object.
   */
  disable() {
    this.log = () => {};
    this.debug = () => {};
    this.info = () => {};
    this.warn = () => {};
    this.error = () => {};
  }

  /**
   * Enable this logging object.
   */
  enable() {
    this.log = this._log;
    this.debug = this._debug;
    this.info = this._info;
    this.warn = this._warn;
    this.error = this._error;
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
   * Set up a new Appender.
   *
   * @param {Object} appender
   *     The new Appender serves as the content output pipeline of the log.
   *     This object must provide `trace`, `debug`, `info`, `warn` and `error`
   *     methods.
   */
  setAppender(appender) {
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
    if (LOGGING_LEVELS[level] === undefined) {
      throw new RangeError(
          `Unknown logging level "${level}". `
        + 'Possible values are："TRACE", "DEBUG", "INFO", "WARN", "ERROR", "NONE"。'
      );
    }
    this.level = level;
  }

  /**
   * Log a message.
   *
   * @param {String} level
   *     The log level for this message.
   * @param {String} message
   *     Template for the specified message. The message can contain substitution
   *     strings in the form of `%s`, `%o`, `%d`, `%f`, etc.
   * @param {Array} args
   *     Parameters used to format the message string.
   * @private
   */
  _log(level, message, args) {
    if (LOGGING_LEVELS[level] < LOGGING_LEVELS[this.level]) {
      return;
    }
    const timestamp = new Date().toISOString();
    const output = this._getOutput(level);
    output(`[${level}]`, timestamp, message, ...args);
    this.lastTimestamp = timestamp;   // 记录日志输出时的时间戳
  }

  /**
   * Get the output function of the appender corresponding to the specified
   * logging level.
   *
   * Note that in order to allow some virtual consoles (such as VConsole, Eruda,
   * etc.) to correctly inject the console, you cannot use map to pre-define
   * the console output functions corresponding to each level, but must obtain
   * the console output functions corresponding to each level in real time
   * during output.
   *
   * @param {String} level
   *     Specified logging level.
   * @return {Function}
   *     According to the specified logging level, return the corresponding
   *     appender object method.
   * @private
   */
  _getOutput(level) {
    switch (level) {
      case 'TRACE':
        return this.appender.trace;
      case 'DEBUG':
        return this.appender.debug;
      case 'INFO':
        return this.appender.info;
      case 'WARN':
        return this.appender.warn;
      case 'ERROR':
        return this.appender.error;
      default:
        return () => {};
    }
  }

  /**
   * Logs a message in the TRACE level.
   *
   * @param {String} message
   *     Template for the specified message. The message can contain substitution
   *     strings in the form of `%s`, `%o`, `%d`, `%f`, etc.
   * @param {Array} args
   *     the array of arguments used to format the message.
   * @private
   */
  _trace(message, ...args) {
    this._log('TRACE', message, args);
  }

  /**
   * Logs a message in the DEBUG level.
   *
   * @param {String} message
   *     Template for the specified message. The message can contain substitution
   *     strings in the form of `%s`, `%o`, `%d`, `%f`, etc.
   * @param {Array} args
   *     the array of arguments used to format the message.
   * @private
   */
  _debug(message, ...args) {
    this._log('DEBUG', message, args);
  }

  /**
   * Logs a message in the INFO level.
   *
   * @param {String} message
   *     Template for the specified message. The message can contain substitution
   *     strings in the form of `%s`, `%o`, `%d`, `%f`, etc.
   * @param {Array} args
   *     the array of arguments used to format the message.
   * @private
   */
  _info(message, ...args) {
    this._log('INFO', message, args);
  }

  /**
   * Logs a message in the WARN level.
   *
   * @param {String} message
   *     Template for the specified message. The message can contain substitution
   *     strings in the form of `%s`, `%o`, `%d`, `%f`, etc.
   * @param {Array} args
   *     the array of arguments used to format the message.
   * @private
   */
  _warn(message, ...args) {
    this._log('WARN', message, args);
  }

  /**
   * Logs a message in the ERROR level.
   *
   * @param {String} message
   *     Template for the specified message. The message can contain substitution
   *     strings in the form of `%s`, `%o`, `%d`, `%f`, etc.
   * @param {Array} args
   *     the array of arguments used to format the message.
   * @private
   */
  _error(message, ...args) {
    this._log('ERROR', message, args);
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
