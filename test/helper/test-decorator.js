/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

function Model(Class) {
  console.log('Model: Class = ', Class);
}

function Func(target, name, descriptor) {
  console.log('Func: target = ',
    target,
    ' target.constructor = ',
    target.constructor,
    ' name = ',
    name,
    ' descriptor = ',
    descriptor);
}

@Model
class Test {
  @Func
  hello() {
    console.log('hello');
  }
}


/**
 * Unit test `@Log` decorator.
 *
 * @author Haixing Hu
 */
describe('Test decorator', () => {
  test('test', () => {
    const test = new Test();
    test.hello();
  });
});
