////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import LOGGING_LEVELS from './logging-levels';
import getBrowserEngine from './get-browser-engine';
import bindWithArrowFunction from './bind-with-arrow-function';
import bindWithoutPrefix from './bind-without-prefix';
import bindWithFunctionBind from './bind-with-function-bind';

/**
 * A no-operation function.
 *
 * @author Haixing Hu
 * @private
 */
const NOOP = () => {};

/**
 * Rebinds all logging implementation methods to the corresponding logging
 * methods of the appender.
 *
 * @param {Logger} logger
 *     The logger whose logging methods will be rebind to the corresponding
 *     logging methods of the appender.
 * @param {string} level
 *     The target logging level. All logging methods belows this target logging
 *     level will be bind to a no-op function, while all logging methods above
 *     or equal to this target logging level will be bind to the corresponding
 *     logging methods of the appender. This argument should be a valid
 *     logging level. The function do not check the validity of this argument.
 * @param {object} appender
 *     The appender whose logging methods will be bound to the corresponding
 *     logging methods of this logger. This argument should be a valid appender.
 *     The function do not check the validity of this argument.
 * @author Haixing Hu
 * @private
 */
function bindLoggingMethods(logger, level, appender) {
  const target = LOGGING_LEVELS[level];
  for (const level in LOGGING_LEVELS) {
    // NOTE: do NOT use Object.hasOwn() because it has a lot of compatibility problems
    if (Object.prototype.hasOwnProperty.call(LOGGING_LEVELS, level) && (level !== 'NONE')) {
      const m = level.toLowerCase();
      if (LOGGING_LEVELS[level] < target) {
        // binds the private logging method of this object to no-op
        logger[m] = NOOP;
      } else {
        // binds the private logging method of this object to the
        // corresponding logging method of this.appender.
        const engine = getBrowserEngine();
        switch (engine) {
          case 'Blink': // Chrome, Edge and other Blink-based browsers
            bindWithFunctionBind(logger, m, level, appender);
            break;
          case 'WebKit':   // Safari and other WebKit-based browsers
            bindWithArrowFunction(logger, m, level, appender);
            break;
          case 'Gecko':   // Firefox and other Gecko-based browsers
          case 'Trident': // Internet Explorer and other Trident-based browsers
          case 'Presto':  // Opera and other Presto-based browsers
          default:
            bindWithoutPrefix(logger, m, level, appender);
            // bindWithErrorStack(logger, m, level, appender);
            // bindWithProxy(logger, m, level, appender);
            break;
        }
      }
    }
  }
}

export default bindLoggingMethods;
