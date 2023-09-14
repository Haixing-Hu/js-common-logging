/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import Vue from 'vue';
import Component from 'vue-class-component';
import { HasLogger, Log } from '../../main';

// Encapsulate the Vue component to be tested
@HasLogger    // Note the order of the decorators is INCORRECT
@Component({
  template: '<p>{{ message }}</p>',
})
export default class HelloWithLoggerWrongOrder extends Vue {
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
