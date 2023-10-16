/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import Logger from './logger';

/**
 * A decorator to add a named logger to a class.
 *
 * This decorator will add a named logger to the class, which can be accessed
 * via the `logger` property of the class.
 *
 * Example usage:
 * ```js
 * import HasLogger from '@haixing_hu/js-common-logging/src/has-logger';
 *
 * &#064;HasLogger
 * class MyClass {
 *    foo() {
 *      this.logger.debug('This is MyClass.foo()');
 *    }
 * }
 * ```
 *
 * The following is another example usage with the class component of Vue.js:
 * ```js
 * import Vue from 'vue';
 * import Component from 'vue-class-component';
 * import HasLogger from '@haixing_hu/js-common-logging/src/has-logger';
 * import Log from '@haixing_hu/js-common-logging/src/log';
 *
 * &#064;Component({
 *   template: '<p>{{ message }}</p>',
 * })
 * &#064;HasLogger
 * class MyComponent extends Vue {
 *    &#064;Log
 *    foo() {
 *      this.logger.debug('This is MyComponent.foo()');
 *    }
 * }
 * ```
 *
 * **NOTE**: the order of the decorators is IMPORTANT. The `@HasLogger` decorator
 * must be placed **AFTER** the `@Component` decorator.
 *
 * @param {function} Class
 *     the target class to be decorated.
 * @param {object} context
 *     the context object containing information about the class to be decorated.
 * @return {function}
 *     the new constructor of the decorated class.
 * @author Haixing Hu
 */
function HasLogger(Class, context) {
  if (context === null || typeof context !== 'object') {
    throw new TypeError('The context must be an object.');
  }
  if (typeof Class !== 'function' || context.kind !== 'class') {
    throw new TypeError('The `@HasLogger` can only decorate a class.');
  }
  if (Class.prototype.logger) {
    throw new Error('The @HasLogger decorator can only be used once on a class.');
  }
  const instance = new Class();
  if (instance.logger !== undefined) {
    throw new Error('The @HasLogger cannot be decorated on the class with a `logger` field.');
  }
  // add the logger to the class prototype
  Class.prototype.logger = Logger.getLogger(context.name);
  return Class;
}

export default HasLogger;
