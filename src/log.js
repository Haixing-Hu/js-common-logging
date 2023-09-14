/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import Vue from 'vue';
import Logger from './logger';

/**
 * Names of hook functions in the lifecycle of Vue.
 *
 * @author Haixing Hu
 * @private
 */
const VUE_LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
  'beforeUnmount',
  'unmounted',
  'errorCaptured',  // 2.5
  'renderTracked',
  'renderTriggered',
  'serverPrefetch', // 2.6
  'beforeDestroy',
  'destroyed',
];

/**
 * Print tracing logs for class methods.
 *
 * @param {String} className
 *     The name of a class.
 * @param {String} methodName
 *     The name of a method of the class.
 * @param {Array} args
 *     The calling arguments of the method.
 * @author Haixing Hu
 * @private
 */
function printMethodLog(className, methodName, args) {
  const logger = Logger.getLogger(className);
  if (args.length === 0) {
    logger.debug('%s.%s.', className, methodName);
  } else {
    logger.debug('%s.%s:', className, methodName, ...args);
  }
}

/**
 * A decorator function that meets the requirements of the `createDecorator()`
 * function of `vue-class-component`.
 *
 * @param {Object} options
 *     Options object used to create Vue components.
 * @param {String} key
 *     The name of the property or method to which this decorator applies.
 * @author Haixing Hu
 * @private
 */
function vueLogDecorator(options, key) {
  // If the method decorated by the decorator is a Vue's life cycle hook function,
  // Then `col` is `options`; otherwise `col` is `options.methods`
  const col = (VUE_LIFECYCLE_HOOKS.includes(key) ? options : options.methods);
  const originalMethod = col[key];
  col[key] = function logWrapperMethod(...args) {
    printMethodLog(options.name, key, args);
    return originalMethod.apply(this, args);
  };
}

/**
 * Defines a class method decorator that modifies the target method and prints
 * its calling signature in the log, including class name, method name and
 * parameters.
 *
 * Note that only non-constructor class method can be decorated by this decorator.
 * The global function and class constructor CANNOT be decorated by this decorator.
 *
 * Usage example:
 * ```js
 * class Person {
 *   &#064;Log
 *   eat(meal) {
 *     ...
 *   }
 * }
 *
 * const person = new Person();
 * const meal = new Meal();
 * person.eat(meal);   // 日志中将会打印此方法调用的签名
 * ```
 *
 * @param {Function} target
 *     The prototype of the class to which the target object belongs.
 * @param {String} name
 *     The name of the target object.
 * @param {Object} descriptor
 *     The original property descriptor of the target object.
 * @returns
 *     The modified attribute descriptor of the target object.
 * @author Haixing Hu
 */
export function Log(target, name, descriptor) {
  const Class = target.constructor;
  if (target instanceof Vue) {
    // Derived classes of Vue must be treated specially.
    // Refer to the implementation of the `createDecorator()` method of
    // `vue-class-component`
    if (!Class.__decorators__) {
      Object.defineProperty(Class, '__decorators__', {
        configurable: true,
        enumerable: false,
        value: [],
      });
    }
    Class.__decorators__.push((options) => vueLogDecorator(options, name));
  } else {
    // For global functions, handle it normally
    const originalMethod = descriptor.value;
    descriptor.value = function wrapperMethod(...args) {
      printMethodLog(Class.name, name, args);
      return originalMethod.call(this, ...args);
    };
  }
  return descriptor;
}

export default Log;
