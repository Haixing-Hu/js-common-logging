/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

function Log(target, context) {
  return function (...args) {
    const prototype = Object.getPrototypeOf(this);
    const Class = prototype.constructor;
    const className = Class.name;
    console.debug(`${className}.${context.name}:`, ...args);
    return target.apply(this, args);
  }
}

class Test {
  @Log
  add(x, y) {
    return x + y;
  }
}

describe('Test @Log decorator for class methods', () => {
  test('should work', () => {
    const t = new Test();
    t.add(1, 2);
  });
});
