////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { mount } from '@vue/test-utils';
import { Logger, Log } from '../src';
import CustomizedAppender from './helper/customized-appender';
import Foo from './helper/foo';
import Hello from './helper/hello-vue';
import MyClass from './helper/my-class';

/**
 * Unit test `@Log` decorator.
 *
 * @author Haixing Hu
 */
describe('Test @Log decorator', () => {
  test('Ordinary class method, no parameter', () => {
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('Foo');
    logger.setAppender(appender);
    const foo = new Foo();
    foo.test();
    expect(appender.logs.length).toBe(1);
    expect(appender.logs[0]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] Foo - %s',
        '%s.%s.',
        'Foo',
        'test',
      ],
    });
  });

  test('Ordinary class method, single parameter', () => {
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('Foo');
    logger.setAppender(appender);
    const foo = new Foo();
    foo.say('Hello');
    expect(appender.logs.length).toBe(1);
    expect(appender.logs[0]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] Foo - %s',
        '%s.%s:',
        'Foo',
        'say',
        'Hello',
      ],
    });
  });
  test('Ordinary class method, multiple parameters', () => {
    const appender = new CustomizedAppender();
    const logger = Logger.getLogger('Foo');
    logger.setAppender(appender);
    const foo = new Foo();
    foo.add(1, 2);
    expect(appender.logs.length).toBe(2);
    expect(appender.logs[0]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] Foo - %s',
        '%s.%s:',
        'Foo',
        'add',
        1,
        2,
      ],
    });
    expect(appender.logs[1]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] Foo - %s',
        '%s.%s:',
        'Foo',
        'say',
        'Foo.add: 1, 2',
      ],
    });
  });

  test('@Log decorator for Vue class component methods', async () => {
    const appender = new CustomizedAppender();
    Logger.setDefaultAppender(appender);
    const hello = mount(Hello);
    await hello.vm.$nextTick();
    // Check rendering results
    const p = hello.findComponent('p');
    expect(p.text()).toBe('Hello World!');
    // Check the log of `Hello.created()`
    expect(appender.logs.length).toBe(1);
    expect(appender.logs[0]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] Hello - %s',
        '%s.%s.',
        'Hello',
        'created',
      ],
    });
    // Check the log of `Hello.foo()`
    hello.vm.foo(1, 2);
    expect(appender.logs.length).toBe(2);
    expect(appender.logs[1]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] Hello - %s',
        '%s.%s:',
        'Hello',
        'foo',
        1,
        2,
      ],
    });
    // Check the result of `Hello.add(1, 2)`
    const result = hello.vm.add(1, 2);
    expect(result).toBe(3);
    expect(appender.logs.length).toBe(3);
    expect(appender.logs[2]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG] Hello - %s',
        '%s.%s:',
        'Hello',
        'add',
        1,
        2,
      ],
    });
  });

  test('Log(null, context)', () => {
    expect(() => Log(null, {}))
      .toThrowWithMessage(TypeError, 'The `@Log` can only decorate a class method.');
  });

  test('Log(MyClass.prototype.foo, { kind: "method" })', () => {
    expect(() => Log(MyClass.prototype.foo, { kind: 'class' }))
      .toThrowWithMessage(TypeError, 'The `@Log` can only decorate a class method.');
  });

  test('Log(MyClass.prototype.foo, null)', () => {
    expect(() => Log(MyClass.prototype.foo, null))
      .toThrowWithMessage(TypeError, 'The context must be an object.');
  });

  test('Log(MyClass, "hello")', () => {
    expect(() => Log(MyClass, 'hello'))
      .toThrowWithMessage(TypeError, 'The context must be an object.');
  });
});
