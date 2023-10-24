////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Component, toVue } from '@haixing_hu/vue3-class-component';
import { HasLogger, Log } from '../../src';

// Encapsulate the Vue component to be tested
@HasLogger    // Note the order of the decorators is INCORRECT
@Component({
  template: '<p>{{ message }}</p>',
})
class HelloWithLoggerWrongOrder {
  message = 'Hello World!';

  @Log
  created() {
    this.logger.info('In Function: Hello.created.');
  }

  @Log
  foo(x, y) {
    this.logger.info('In Function: Hello.foo:', x, y);
    this.sayHello(x, y);   // call with this
  }

  sayHello(x, y) {
    this.logger.info('In Function: sayHello', this.message, ' x = ', x, ' y = ', y);
  }

  @Log
  add(x, y) {
    this.logger.info('In Function: Hello.add(%d, %d)', x, y);
    return (x + y);
  }
}
export default toVue(HelloWithLoggerWrongOrder);
