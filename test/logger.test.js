/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Logger } from '../main';
import CustomizedAppender from "./helper/customized-appender";

/**
 * Unit test the `Logger` class, calling the default constructor will cause
 * error.
 *
 * @author Haixing Hu
 */
describe('logger: constructor', () => {
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
describe('logger: Logger.getLogger()', () => {
  test('`Logger.getLogger()` returns the same instance for the same name', () => {
    const logger1 = Logger.getLogger('MyLogger');
    const logger2 = Logger.getLogger('MyLogger');
    expect(logger1).toBe(logger2);
    const logger3 = Logger.getLogger();
    const logger4 = Logger.getLogger();
    expect(logger3).toBe(logger4);
  });
  test('`Logger.getLogger()` must provide string as name', () => {
    expect(() => {
      Logger.getLogger(123);
    }).toThrowWithMessage(
        TypeError,
        'The name of a logger must be a string, and empty string is allowed.',
    );
  });
  test('`Logger.getLogger()` must provide correct appender', () => {
    const correctAppender = {
      trace: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };
    const wrongAppender = {
      trace: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
    };
    const logger = Logger.getLogger('MyLogger-TestAppender', correctAppender);
    expect(logger.getAppender())
      .toBe(correctAppender);
    expect(() => {
      Logger.getLogger('MyLogger', wrongAppender);
    }).toThrowWithMessage(
        Error,
        'The appender of this logger has no error() method.',
    );
  });
});

/**
 * Unit test the `Logger` class, using the default console as output.
 *
 * @author Haixing Hu
 */
describe('logger: Use console', () => {
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
describe('logger: Use customized appender', () => {
  const appender = new CustomizedAppender();
  const logger = Logger.getLogger('MyLogger', appender, 'TRACE');
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
describe('logger: set logging level', () => {
  test('correct logging level in getLogger', () => {
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('MyLogger1', appender, 'ERROR');
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
      Logger.getLogger('MyLogger2', console, 'XXX');
    }).toThrowWithMessage(
        RangeError,
        'Unknown logging level "XXX". '
        + 'Possible values are：["TRACE","DEBUG","INFO","WARN","ERROR","NONE"].',
    );
  });
  test('correct logging level in setLevel()', () => {
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('MyLogger3', appender, 'DEBUG');
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
describe('logger: set/get default logging level', () => {
  test('set correct default logging level', () => {
    Logger.setDefaultLevel('ERROR');
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('MyLogger4', appender);
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
describe('logger: set/reset all logging level', () => {
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
