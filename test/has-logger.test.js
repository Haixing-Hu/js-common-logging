////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { mount } from '@vue/test-utils';
import { Logger, HasLogger } from '../src';
import CustomizedAppender from './helper/customized-appender';
import MyClass from './helper/my-class';
import HelloWithLogger from './helper/hello-with-logger-vue';
import HelloWithLoggerWrongOrder from './helper/hello-with-logger-wrong-order-vue';
import { beforeEachHook, afterEachHook } from './helper/jest-hooks';

/**
 * Unit test `@HasLogger` decorator.
 *
 * @author Haixing Hu
 */
describe('Test @HasLogger decorator for normal class.', () => {
  beforeEach(() => {
    beforeEachHook();
  });

  afterEach(() => {
    afterEachHook();
  });

  test('Normal class', () => {
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('MyClass');
    logger.setAppender(appender);
    const obj = new MyClass();
    expect(obj.logger).toBe(logger);
    obj.foo();
    expect(appender.logs.length).toBe(1);
    expect(appender.logs[0]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] MyClass - %s',
        'This is MyClass.foo()',
      ],
    });
    obj.add(1, 2);
    expect(appender.logs.length).toBe(3);
    expect(appender.logs[1]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] MyClass - %s',
        '%s.%s:',
        'MyClass',
        'add',
        1,
        2,
      ],
    });
    expect(appender.logs[2]).toEqual({
      type: 'INFO',
      args: [
        '[INFO] MyClass - %s',
        'Add %d and %d',
        1,
        2,
      ],
    });
  });

  test('Vue class component', async () => {
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('HelloWithLogger');
    logger.setAppender(appender);
    const hello = mount(HelloWithLogger);
    await hello.vm.$nextTick();
    // Check rendering results
    const p = hello.findComponent('p');
    expect(p.text()).toBe('Hello World!');
    // Check the logger of `HelloWithLogger` instance
    // expect(hello.vm.logger).toBe(logger);
    // Check the log of `Hello.created()`
    expect(appender.logs.length).toBe(2);
    expect(appender.logs[0]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] HelloWithLogger - %s',
        '%s.%s.',
        'HelloWithLogger',
        'created',
      ],
    });
    expect(appender.logs[1]).toEqual({
      type: 'INFO',
      args: [
        '[INFO] HelloWithLogger - %s',
        'In Function: Hello.created.',
      ],
    });
    // Check the log of `Hello.foo()`
    hello.vm.foo(1, 2);
    expect(appender.logs.length).toBe(5);
    expect(appender.logs[2]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] HelloWithLogger - %s',
        '%s.%s:',
        'HelloWithLogger',
        'foo',
        1,
        2,
      ],
    });
    expect(appender.logs[3]).toEqual({
      type: 'INFO',
      args: [
        '[INFO] HelloWithLogger - %s',
        'In Function: Hello.foo:',
        1,
        2,
      ],
    });
    expect(appender.logs[4]).toEqual({
      type: 'INFO',
      args: [
        '[INFO] HelloWithLogger - %s',
        'In Function: sayHello',
        'Hello World!',
        ' x = ',
        1,
        ' y = ',
        2,
      ],
    });
    // Check the result of `Hello.add(3, 2)`
    const result = hello.vm.add(3, 2);
    expect(result).toBe(5);
    expect(appender.logs.length).toBe(7);
    expect(appender.logs[5]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] HelloWithLogger - %s',
        '%s.%s:',
        'HelloWithLogger',
        'add',
        3,
        2,
      ],
    });
    expect(appender.logs[6]).toEqual({
      type: 'INFO',
      args: [
        '[INFO] HelloWithLogger - %s',
        'In Function: Hello.add(%d, %d)',
        3,
        2,
      ],
    });
  });

  test('Vue class component with wrong order of decorators', async () => {
    expect(() => {
      mount(HelloWithLoggerWrongOrder);
    }).toThrow(TypeError);
  });

  test('HasLogger(null, context)', () => {
    expect(() => HasLogger(null, {}))
      .toThrowWithMessage(TypeError, 'The `@HasLogger` can only decorate a class.');
  });

  test('HasLogger(MyClass, { kind: "method" })', () => {
    expect(() => HasLogger(MyClass, { kind: 'method' }))
      .toThrowWithMessage(TypeError, 'The `@HasLogger` can only decorate a class.');
  });

  test('HasLogger(MyClass, null)', () => {
    expect(() => HasLogger(MyClass, null))
      .toThrowWithMessage(TypeError, 'The context must be an object.');
  });

  test('HasLogger(MyClass, "hello")', () => {
    expect(() => HasLogger(MyClass, 'hello'))
      .toThrowWithMessage(TypeError, 'The context must be an object.');
  });

  test('@HasLogger decorate a class twice', () => {
    expect(() => {
      @HasLogger
      @HasLogger
      class Test {}
      new Test();
    }).toThrowWithMessage(
      Error,
      'The @HasLogger decorator can only be used once on a class.',
    );
  });

  test('@HasLogger decorated on class with `logger` field', () => {
    expect(() => {
      @HasLogger
      class Test {
        logger = 'logger';
      }
      new Test();
    }).toThrowWithMessage(
      Error,
      'The @HasLogger cannot be decorated on the class with a `logger` field.',
    );
  });
});
