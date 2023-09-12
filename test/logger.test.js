/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Logger } from '../main';

/**
 * Unit test the `Logger` class,, using the default console as output.
 *
 * @author Haixing Hu
 */
describe('logger: Use console', () => {
  const logger = new Logger();
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

class CustomizedAppender {
  constructor() {
    this.logs = [];
  }
  trace(...args) {
    this.logs.push({ type: 'TRACE', args });
    console.trace(...args);
  }
  debug(...args) {
    this.logs.push({ type: 'DEBUG', args });
    console.debug(...args);
  }
  info(...args) {
    this.logs.push({ type: 'INFO', args });
    console.info(...args);
  }
  warn(...args) {
    this.logs.push({ type: 'WARN', args });
    console.warn(...args);
  }
  error(...args) {
    this.logs.push({ type: 'ERROR', args });
    console.error(...args);
  }
}

/**
 * Unit test the `Logger` class, using custom `Appender` as output.
 *
 * @author Haixing Hu
 */
describe('logger: Use customized appender', () => {
  const appender = new CustomizedAppender();
  const logger = new Logger('MyLogger', appender, 'TRACE');
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
  test('correct logging level in constructor', () => {
    const appender = new CustomizedAppender();
    const logger = new Logger('MyLogger1', appender, 'ERROR');
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
  test('wrong logging level in constructor', () => {
    expect(() => {
      new Logger('MyLogger2', console, 'XXX');
    }).toThrowWithMessage(
        RangeError,
        'Unknown logging level "XXX". '
        + 'Possible values are：["TRACE","DEBUG","INFO","WARN","ERROR","NONE"].',
    );
  });
  test('correct logging level in setLevel()', () => {
    const appender = new CustomizedAppender();
    const logger = new Logger('MyLogger3', appender, 'DEBUG');
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
    const logger = new Logger();
    expect(() => {
      logger.setLevel('YYYY');
    }).toThrowWithMessage(
        RangeError,
        'Unknown logging level "YYYY". '
        + 'Possible values are：["TRACE","DEBUG","INFO","WARN","ERROR","NONE"].',
    );
  });
});
