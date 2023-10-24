////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Logger from './logger';
import { VUE3_CLASS_COMPONENT_DECORATORS_KEY } from './metadata-keys';

/**
 * The names of special functions of Vue components.
 *
 * @type {string[]}
 * @private
 * @author Haixing Hu
 */
const VUE_FUNCTIONS = [
  // The names of lifecycle hooks of Vue components.
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeUnmount',
  'unmounted',
  'errorCaptured',
  'renderTracked',    // Dev only
  'renderTriggered',  // Dev only
  'activated',
  'deactivated',
  'serverPrefetch',   // SSR only
  // The names of special functions in the options API Vue components.
  'render',
];

/**
 * Print tracing logs for class methods.
 *
 * @param {string} className
 *     The name of the class the decorated method belongs to.
 * @param {string} methodName
 *     The name of the decorated method..
 * @param {array} args
 *     The calling arguments of the decorated method.
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
  const col = (VUE_FUNCTIONS.includes(key) ? options : options.methods);
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
 * @param {function} target
 *     The method being decorated.
 * @param {object} context
 *     the context object containing information about the method to be decorated.
 * @return {function}
 *     The decorated method.
 * @author Haixing Hu
 */
export function Log(target, context) {
  if (context === null || typeof context !== 'object') {
    throw new TypeError('The context must be an object.');
  }
  if (typeof target !== 'function' || context.kind !== 'method') {
    throw new TypeError('The `@Log` can only decorate a class method.');
  }
  // decorate the class-style Vue component
  // see the `createDecorator()` function in `@haixing_hu/vue3-class-component`
  const metadata = context.metadata;
  metadata[VUE3_CLASS_COMPONENT_DECORATORS_KEY] ??= [];
  metadata[VUE3_CLASS_COMPONENT_DECORATORS_KEY].push(
    (Class, instance, options) => vueLogDecorator(options, context.name),
  );
  // decorate the original method
  function decoratedMethod(...args) {
    const prototype = Object.getPrototypeOf(this);
    const Class = prototype.constructor;
    const className = Class.name;
    printMethodLog(className, context.name, args);
    return target.apply(this, args);
  }
  return decoratedMethod;
}

export default Log;
