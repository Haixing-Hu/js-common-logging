/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { mount } from '@vue/test-utils';
import { Logger } from '../main';
import CustomizedAppender from './helper/customized-appender';
import MyClass from './helper/my-class';
import HelloWithLogger from './helper/hello-with-logger-vue';
import HelloWithLoggerWrongOrder from './helper/hello-with-logger-wrong-order-vue';

/**
 * Unit test `@HasLogger` decorator.
 *
 * @author Haixing Hu
 */
describe('Test @HasLogger decorator for normal class.', () => {
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
});

/**
 * Unit test of the `@HasLogger` decorator.
 *
 * @author Haiixng Hu
 */
describe('Test @HasLogger decorator for Vue class component.', () => {
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
    expect(hello.vm.logger).toBe(logger);
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
});

/**
 * Unit test of the `@HasLogger` decorator.
 *
 * @author Haiixng Hu
 */
describe('Test @HasLogger decorator for Vue class component, with wrong order of decorators.', () => {
  test('Vue class component', async () => {
    expect(() => {
      mount(HelloWithLoggerWrongOrder);
    }).toThrow(TypeError);
  });
});
