////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Log } from '../../src';

export default class Foo {
  constructor() {
    console.log('CONSOLE - Foo.constructor');
  }

  @Log
  test() {
    console.log('CONSOLE - Foo.foo');
  }

  @Log
  say(message) {
    console.log(`CONSOLE - Foo.say: ${message}`);
  }

  @Log
  add(x, y) {
    this.say(`Foo.add: ${x}, ${y}`);    // call with this
    return x + y;
  }
}
