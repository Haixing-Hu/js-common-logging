/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Logger } from '../src';
import CustomizedAppender from './helper/customized-appender';

afterEach(() => Logger.clearAllLoggers());

/**
 * Unit test the `Logger` class, calling the default constructor will cause
 * error.
 *
 * @author Haixing Hu
 */
describe('Logger: constructor', () => {
  test('Cannot call the constructor directly', () => {
    expect(() => {
      new Logger('', console, 'ERROR');
    }).toThrowWithMessage(
      Error,
      'The `Logger` instance can only be constructed by the '
        + 'static method `Logger.getLogger()`.',
    );
  });
});

/**
 * Unit test the `Logger` class, `Logger.getLogger()` will returns the same
 * instance for the same name.
 *
 * @author Haixing Hu
 */
describe('Logger: getLogger() should work', () => {
  test('`Logger.getLogger() with the empty string as logger name', () => {
    const logger = Logger.getLogger('');
    expect(logger.getName()).toBe('');
  });
  test('`Logger.getLogger() with provided name', () => {
    const logger = Logger.getLogger('MyLogger');
    expect(logger.getName()).toBe('MyLogger');
  });
  test('`Logger.getLogger()` returns the same instance for the same name', () => {
    const logger1 = Logger.getLogger('MyLogger');
    const logger2 = Logger.getLogger('MyLogger');
    expect(logger1).toBe(logger2);
    const logger3 = Logger.getLogger();
    const logger4 = Logger.getLogger();
    expect(logger3).toBe(logger4);
  });
  test('`Logger.getLogger()` with default appender', () => {
    const logger1 = Logger.getLogger('MyLogger1');
    expect(logger1.getAppender()).toBe(Logger.getDefaultAppender());
    const appender = {
      trace: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };
    Logger.setDefaultAppender(appender);
    const logger2 = Logger.getLogger('MyLogger2');
    expect(logger2.getAppender()).toBe(appender);
  });
  test('`Logger.getLogger()` with provided appender for new logger', () => {
    const appender = {
      trace: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };
    const logger = Logger.getLogger('MyLogger', { appender });
    expect(logger.getAppender()).toBe(appender);
  });
  test('`Logger.getLogger()` with provided appender for existing logger', () => {
    const logger1 = Logger.getLogger('MyLogger');
    const appender = {
      trace: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };
    const logger2 = Logger.getLogger('MyLogger', { appender });
    expect(logger1.getAppender()).toBe(appender);
    expect(logger2.getAppender()).toBe(appender);
  });
  test('`Logger.getLogger()` with default logging level', () => {
    const logger1 = Logger.getLogger('MyLogger1');
    expect(logger1.getLevel()).toBe(Logger.getDefaultLevel());
    Logger.setDefaultLevel('ERROR');
    const logger2 = Logger.getLogger('MyLogger2');
    expect(logger2.getLevel()).toBe('ERROR');
  });
  test('`Logger.getLogger()` with provided logging level for new logger', () => {
    Logger.setDefaultLevel('DEBUG');
    const logger1 = Logger.getLogger('MyLogger1');
    expect(logger1.getLevel()).toBe('DEBUG');
    const logger2 = Logger.getLogger('MyLogger2', { level: 'ERROR' });
    expect(logger2.getLevel()).toBe('ERROR');
  });
  test('`Logger.getLogger()` with provided logging level for existing logger', () => {
    Logger.setDefaultLevel('DEBUG');
    const logger1 = Logger.getLogger('MyLogger');
    expect(logger1.getLevel()).toBe('DEBUG');
    const logger2 = Logger.getLogger('MyLogger', { level: 'ERROR' });
    expect(logger1.getLevel()).toBe('ERROR');
    expect(logger2.getLevel()).toBe('ERROR');
  });
});

/**
 * Unit test the `Logger` class.
 *
 * Test the `Logger.getLogger()` with invalid logger name.
 *
 * @author Haixing Hu
 */
describe('Logger: `getLogger()` with invalid logger name', () => {
  test('`Logger.getLogger()` must provide string as name', () => {
    expect(() => {
      Logger.getLogger(0);
    }).toThrowWithMessage(
        TypeError,
        'The name of a logger must be a string, and empty string is allowed.',
    );
  });
});

/**
 * Unit test the `Logger` class.
 *
 * Test the `Logger.getLogger()` with invalid appender.
 *
 * @author Haixing Hu
 */
describe('Logger: `getLogger()` with invalid appender', () => {
  const NOOP = () => {};
  test('Appender is null', () => {
    expect(() => Logger.getLogger('test', { appender: null }))
    .toThrowWithMessage(
        TypeError,
        'The appender for a logger must be a non-null object.',
    );
  });
  test('Appender is a string', () => {
    expect(() => Logger.getLogger('test', { appender: 'hello' }))
    .toThrowWithMessage(
        TypeError,
        'The appender for a logger must be a non-null object.',
    );
  });
  test('Appender has no trace() function', () => {
    expect(() => Logger.getLogger('test', {
      appender: {
        debug: NOOP,
        info: NOOP,
        warn: NOOP,
        error: NOOP,
      },
    })).toThrowWithMessage(
        Error,
        'The appender of this logger has no trace() method.',
    );
  });
  test('Appender has no debug() function', () => {
    expect(() => Logger.getLogger('test', {
      appender: {
        trace: NOOP,
        info: NOOP,
        warn: NOOP,
        error: NOOP,
      },
    })).toThrowWithMessage(
        Error,
        'The appender of this logger has no debug() method.',
    );
  });
  test('Appender has no info() function', () => {
    expect(() => Logger.getLogger('test', {
      appender: {
        trace: NOOP,
        debug: NOOP,
        warn: NOOP,
        error: NOOP,
      },
    })).toThrowWithMessage(
        Error,
        'The appender of this logger has no info() method.',
    );
  });
  test('Appender has no warn() function', () => {
    expect(() => Logger.getLogger('test', {
      appender: {
        trace: NOOP,
        debug: NOOP,
        info: NOOP,
        error: NOOP,
      },
    }))
    .toThrowWithMessage(
        Error,
        'The appender of this logger has no warn() method.',
    );
  });
  test('Appender has no error() function', () => {
    expect(() => Logger.getLogger('test', {
      appender: {
        trace: NOOP,
        debug: NOOP,
        info: NOOP,
        warn: NOOP,
      },
    }))
    .toThrowWithMessage(
        Error,
        'The appender of this logger has no error() method.',
    );
  });
});

/**
 * Unit test the `Logger` class.
 *
 * Test the `Logger.getLogger()` with invalid logging level.
 *
 * @author Haixing Hu
 */
describe('Logger: `getLogger()` with invalid logging level', () => {
  test('logging level is not string', () => {
    expect(() => Logger.getLogger('test', { level: 0 }))
    .toThrowWithMessage(TypeError, 'The logging level must be a string.');
  });
  test('logging level is not predefined', () => {
    expect(() => Logger.getLogger('test', { level: 'xxx' }))
    .toThrowWithMessage(
        RangeError,
        'Unknown logging level "xxx". '
        + 'Possible values are：["TRACE","DEBUG","INFO","WARN","ERROR","NONE"].',
    );
  });
});

/**
 * Unit test the `Logger` class, using the default console as output.
 *
 * @author Haixing Hu
 */
describe('Logger: Use console appender', () => {
  const logger = Logger.getLogger();
  test('logger.trace', () => {
    const arg1 = 'hello';
    const arg2 = {
      name: 'world',
      value: { id: 123, data: 'abc' },
    };
    logger.trace('This is a TRACE message: %s, '
        + 'and another is %o, that is all.', arg1, arg2);
  });
  test('logger.debug', () => {
    const arg1 = 'hello';
    const arg2 = {
      name: 'world',
      value: { id: 123, data: 'abc' },
    };
    logger.debug('This is a DEBUG message: %s, '
        + 'and another is %o, that is all.', arg1, arg2);
  });
  test('logger.info', () => {
    const arg1 = 'hello';
    const arg2 = {
      name: 'world',
      value: { id: 123, data: 'abc' },
    };
    logger.info('This is a INFO message: %s, '
        + 'and another is %o, that is all.', arg1, arg2);
  });
  test('logger.warn', () => {
    const arg1 = 'hello';
    const arg2 = {
      name: 'world',
      value: { id: 123, data: 'abc' },
    };
    logger.warn('This is a WARN message: %s, '
        + 'and another is %o, that is all.', arg1, arg2);
  });
  test('logger.error', () => {
    const arg1 = 'hello';
    const arg2 = {
      name: 'world',
      value: { id: 123, data: 'abc' },
    };
    logger.error('This is a ERROR message: %s, '
        + 'and another is %o, that is all.', arg1, arg2);
  });
});

/**
 * Unit test the `Logger` class, using custom `Appender` as output.
 *
 * @author Haixing Hu
 */
describe('Logger: Use customized appender', () => {
  const appender = new CustomizedAppender();
  const logger = Logger.getLogger('MyLogger', { appender, level: 'TRACE' });
  test('logger.trace', () => {
    const arg1 = 'hello';
    const arg2 = {
      name: 'world',
      value: 123,
    };
    logger.trace('This is a TRACE message: %s, '
        + 'and another is %d, that is all.', arg1, arg2);
    expect(appender.logs.length).toBe(1);
    expect(appender.logs[0].type).toBe('TRACE');
    expect(appender.logs[0].args).toEqual([
      '[TRACE] MyLogger - %s',
      'This is a TRACE message: %s, and another is %d, that is all.',
      arg1,
      arg2,
    ]);
  });
  test('logger.debug', () => {
    const arg1 = 'hello';
    const arg2 = {
      name: 'world',
      value: 123,
    };
    logger.debug('This is a DEBUG message: %s, '
        + 'and another is %d, that is all.', arg1, arg2);
    expect(appender.logs.length).toBe(2);
    expect(appender.logs[1].type).toBe('DEBUG');
    expect(appender.logs[1].args).toEqual([
      '[DEBUG] MyLogger - %s',
      'This is a DEBUG message: %s, and another is %d, that is all.',
      arg1,
      arg2,
    ]);
  });
  test('logger.info', () => {
    const arg1 = 'hello';
    const arg2 = {
      name: 'world',
      value: 123,
    };
    logger.info('This is a INFO message: %s, '
        + 'and another is %d, that is all.', arg1, arg2);
    expect(appender.logs.length).toBe(3);
    expect(appender.logs[2].type).toBe('INFO');
    expect(appender.logs[2].args).toEqual([
      '[INFO] MyLogger - %s',
      'This is a INFO message: %s, and another is %d, that is all.',
      arg1,
      arg2,
    ]);
  });
  test('logger.warn', () => {
    const arg1 = 'hello';
    const arg2 = {
      name: 'world',
      value: 123,
    };
    logger.warn('This is a WARN message: %s, '
        + 'and another is %d, that is all.', arg1, arg2);
    expect(appender.logs.length).toBe(4);
    expect(appender.logs[3].type).toBe('WARN');
    expect(appender.logs[3].args).toEqual([
      '[WARN] MyLogger - %s',
      'This is a WARN message: %s, and another is %d, that is all.',
      arg1,
      arg2,
    ]);
  });
  test('logger.error', () => {
    const arg1 = 'hello';
    const arg2 = {
      name: 'world',
      value: 123,
    };
    logger.error('This is a ERROR message: %s, '
        + 'and another is %d, that is all.', arg1, arg2);
    expect(appender.logs.length).toBe(5);
    expect(appender.logs[4].type).toBe('ERROR');
    expect(appender.logs[4].args).toEqual([
      '[ERROR] MyLogger - %s',
      'This is a ERROR message: %s, and another is %d, that is all.',
      arg1,
      arg2,
    ]);
  });
});

/**
 * Unit test the `Logger` class, set logging level.
 *
 * @author Haixing Hu
 */
describe('Logger: set logging level', () => {
  test('correct logging level in getLogger', () => {
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('MyLogger1', { appender, level: 'ERROR' });
    logger.trace('TRACE level should not be logged');
    logger.debug('DEBUG level should not be logged');
    logger.info('INFO level should not be logged');
    logger.warn('WARN level should not be logged');
    logger.error('ERROR level should be logged');
    expect(appender.logs.length).toBe(1);
    expect(appender.logs[0].type).toBe('ERROR');
    expect(appender.logs[0].args).toEqual([
      '[ERROR] MyLogger1 - %s',
      'ERROR level should be logged',
    ]);
  });
  test('wrong logging level in getLogger', () => {
    expect(() => {
      Logger.getLogger('MyLogger2', { appender: console, level: 'XXX' });
    }).toThrowWithMessage(
      RangeError,
      'Unknown logging level "XXX". '
        + 'Possible values are：["TRACE","DEBUG","INFO","WARN","ERROR","NONE"].',
    );
  });
  test('correct logging level in setLevel()', () => {
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('MyLogger3', { appender, level: 'DEBUG' });
    logger.debug('DEBUG level should be logged');
    expect(appender.logs.length).toBe(1);
    expect(appender.logs[0]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] MyLogger3 - %s',
        'DEBUG level should be logged',
      ],
    });
    logger.setLevel('ERROR');
    logger.info('INFO level should not be logged');
    logger.warn('WARN level should not be logged');
    logger.error('ERROR level should be logged');
    expect(appender.logs.length).toBe(2);
    expect(appender.logs[1]).toEqual({
      type: 'ERROR',
      args: [
        '[ERROR] MyLogger3 - %s',
        'ERROR level should be logged',
      ],
    });
  });
  test('wrong logging level in setLevel()', () => {
    const logger = Logger.getLogger();
    expect(() => {
      logger.setLevel('YYYY');
    }).toThrowWithMessage(
      RangeError,
      'Unknown logging level "YYYY". '
        + 'Possible values are：["TRACE","DEBUG","INFO","WARN","ERROR","NONE"].',
    );
  });
});

/**
 * Unit test the `Logger` class, set/get default logging level.
 *
 * @author Haixing Hu
 */
describe('Logger: set/get default logging level', () => {
  test('set correct default logging level', () => {
    Logger.setDefaultLevel('ERROR');
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('MyLogger4', { appender });
    logger.trace('TRACE level should not be logged');
    logger.debug('DEBUG level should not be logged');
    logger.info('INFO level should not be logged');
    logger.warn('WARN level should not be logged');
    logger.error('ERROR level should be logged');
    expect(appender.logs.length).toBe(1);
    expect(appender.logs[0].type).toBe('ERROR');
    expect(appender.logs[0].args).toEqual([
      '[ERROR] MyLogger4 - %s',
      'ERROR level should be logged',
    ]);
  });
  test('get default logging level', () => {
    const level = Logger.getDefaultLevel();
    expect(level).toBe('ERROR');
  });
  test('wrong logging level in Logger.setDefaultLevel()', () => {
    expect(() => {
      Logger.setDefaultLevel('YYYY');
    }).toThrowWithMessage(
      RangeError,
      'Unknown logging level "YYYY". '
        + 'Possible values are：["TRACE","DEBUG","INFO","WARN","ERROR","NONE"].',
    );
  });
});

/**
 * Unit test the `Logger` class, set/reset all logging levels.
 *
 * @author Haixing Hu
 */
describe('Logger: set/reset all logging level', () => {
  test('correct logging level in Logger.setAllLevels()', () => {
    const l1 = Logger.getLogger('l1');
    const l2 = Logger.getLogger('l2');
    const l3 = Logger.getLogger('l3');
    const logger = Logger.getLogger();
    Logger.setAllLevels('ERROR');
    expect(l1.getLevel()).toBe('ERROR');
    expect(l2.getLevel()).toBe('ERROR');
    expect(l3.getLevel()).toBe('ERROR');
    expect(logger.getLevel()).toBe('ERROR');
  });
  test('wrong logging level in Logger.setAllLevels()', () => {
    expect(() => {
      Logger.setDefaultLevel('YYYY');
    }).toThrowWithMessage(
      RangeError,
      'Unknown logging level "YYYY". '
        + 'Possible values are：["TRACE","DEBUG","INFO","WARN","ERROR","NONE"].',
    );
  });
  test('reset all logging levels', () => {
    const l1 = Logger.getLogger('l1');
    const l2 = Logger.getLogger('l2');
    const l3 = Logger.getLogger('l3');
    const logger = Logger.getLogger();
    const defaultLevel = Logger.getDefaultLevel();
    Logger.resetAllLevels();
    expect(l1.getLevel()).toBe(defaultLevel);
    expect(l2.getLevel()).toBe(defaultLevel);
    expect(l3.getLevel()).toBe(defaultLevel);
    expect(logger.getLevel()).toBe(defaultLevel);
  });
});

/**
 * Unit test the `Logger` class, set/reset all appenders.
 *
 * @author Haixing Hu
 */
describe('Logger: set/reset all appenders', () => {
  test('Logger.setAllAppenders() and Logger.resetAllAppenders() should work', () => {
    const logger1 = Logger.getLogger('l1');
    const logger2 = Logger.getLogger('l2');
    const logger3 = Logger.getLogger('l3');
    const defaultAppender = Logger.getDefaultAppender();
    expect(logger1.getAppender()).toBe(defaultAppender);
    expect(logger2.getAppender()).toBe(defaultAppender);
    expect(logger3.getAppender()).toBe(defaultAppender);
    const appender = new CustomizedAppender();
    Logger.setAllAppenders(appender);
    expect(logger1.getAppender()).toBe(appender);
    expect(logger2.getAppender()).toBe(appender);
    expect(logger3.getAppender()).toBe(appender);
    expect(Logger.getDefaultAppender()).toBe(defaultAppender);
    const logger4 = Logger.getLogger('l4');
    expect(logger4.getAppender()).toBe(defaultAppender);
    Logger.resetAllAppenders();
    expect(logger1.getAppender()).toBe(defaultAppender);
    expect(logger2.getAppender()).toBe(defaultAppender);
    expect(logger3.getAppender()).toBe(defaultAppender);
    expect(logger4.getAppender()).toBe(defaultAppender);
  });
  test('Logger.setAllAppenders() with invalid appender', () => {
    const NOOP = () => {};
    expect(() => Logger.setAllAppenders(null))
      .toThrowWithMessage(
        TypeError,
        'The appender for a logger must be a non-null object.',
      );
    expect(() => Logger.setAllAppenders('hello'))
      .toThrowWithMessage(
        TypeError,
        'The appender for a logger must be a non-null object.',
      );
    expect(() => Logger.setAllAppenders({
      debug: NOOP,
      info: NOOP,
      warn: NOOP,
      error: NOOP,
    })).toThrowWithMessage(
      Error,
      'The appender of this logger has no trace() method.',
    );
    expect(() => Logger.setAllAppenders({
      trace: NOOP,
      info: NOOP,
      warn: NOOP,
      error: NOOP,
    })).toThrowWithMessage(
      Error,
      'The appender of this logger has no debug() method.',
    );
    expect(() => Logger.setAllAppenders({
      trace: NOOP,
      debug: NOOP,
      warn: NOOP,
      error: NOOP,
    })).toThrowWithMessage(
      Error,
      'The appender of this logger has no info() method.',
    );
    expect(() => Logger.setAllAppenders({
      trace: NOOP,
      debug: NOOP,
      info: NOOP,
      error: NOOP,
    })).toThrowWithMessage(
      Error,
      'The appender of this logger has no warn() method.',
    );
    expect(() => Logger.setAllAppenders({
      trace: NOOP,
      debug: NOOP,
      info: NOOP,
      warn: NOOP,
    })).toThrowWithMessage(
      Error,
      'The appender of this logger has no error() method.',
    );
  });
});

/**
 * Unit test the `Logger` class, enable/disable.
 *
 * @author Haixing Hu
 */
describe('Logger: enable/disable', () => {
  test('logger.enable(), logger.disable() should work', () => {
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('MyLogger', { appender, level: 'INFO' });
    logger.trace('TRACE level should not be logged');
    logger.debug('DEBUG level should not be logged');
    logger.info('INFO level should not be logged');
    logger.warn('WARN level should not be logged');
    logger.error('ERROR level should be logged');
    expect(appender.logs.length).toBe(3);
    expect(appender.logs[0].type).toBe('INFO');
    expect(appender.logs[1].type).toBe('WARN');
    expect(appender.logs[2].type).toBe('ERROR');
    logger.disable();
    logger.trace('TRACE level should not be logged');
    logger.debug('DEBUG level should not be logged');
    logger.info('INFO level should not be logged');
    logger.warn('WARN level should not be logged');
    logger.error('ERROR level should be logged');
    expect(appender.logs.length).toBe(3);
    logger.enable();
    logger.trace('TRACE level should not be logged');
    logger.debug('DEBUG level should not be logged');
    logger.info('INFO level should not be logged');
    logger.warn('WARN level should not be logged');
    logger.error('ERROR level should be logged');
    expect(appender.logs.length).toBe(6);
    expect(appender.logs[0].type).toBe('INFO');
    expect(appender.logs[1].type).toBe('WARN');
    expect(appender.logs[2].type).toBe('ERROR');
    expect(appender.logs[3].type).toBe('INFO');
    expect(appender.logs[4].type).toBe('WARN');
    expect(appender.logs[5].type).toBe('ERROR');
  });
  test('logger.setEnabled() should work', () => {
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('MyLogger', { appender, level: 'INFO' });
    logger.trace('TRACE level should not be logged');
    logger.debug('DEBUG level should not be logged');
    logger.info('INFO level should not be logged');
    logger.warn('WARN level should not be logged');
    logger.error('ERROR level should be logged');
    expect(appender.logs.length).toBe(3);
    expect(appender.logs[0].type).toBe('INFO');
    expect(appender.logs[1].type).toBe('WARN');
    expect(appender.logs[2].type).toBe('ERROR');
    logger.setEnabled(false);
    logger.trace('TRACE level should not be logged');
    logger.debug('DEBUG level should not be logged');
    logger.info('INFO level should not be logged');
    logger.warn('WARN level should not be logged');
    logger.error('ERROR level should be logged');
    expect(appender.logs.length).toBe(3);
    logger.setEnabled(true);
    logger.trace('TRACE level should not be logged');
    logger.debug('DEBUG level should not be logged');
    logger.info('INFO level should not be logged');
    logger.warn('WARN level should not be logged');
    logger.error('ERROR level should be logged');
    expect(appender.logs.length).toBe(6);
    expect(appender.logs[0].type).toBe('INFO');
    expect(appender.logs[1].type).toBe('WARN');
    expect(appender.logs[2].type).toBe('ERROR');
    expect(appender.logs[3].type).toBe('INFO');
    expect(appender.logs[4].type).toBe('WARN');
    expect(appender.logs[5].type).toBe('ERROR');
  });
});
