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
import { Log } from '../../main';

// Encapsulate the Vue component to be tested
@Component({
  template: '<p>{{ message }}</p>',
})
export default class Hello extends Vue {
  message = 'Hello World!';

  @Log
  created() {
    console.log('CONSOLE - In Function: Hello.created.');
  }

  @Log
  foo(x, y) {
    console.log(`CONSOLE - In Function: Hello.Foo: ${x}, ${y}`);
    this.sayHello(x, y);   // call with this
  }

  sayHello(x, y) {
    console.log('CONSOLE - In Function: ', this.message, ' x = ', x, ' y = ', y);
  }

  @Log
  add(x, y) {
    console.log(`CONSOLE - In Function: Hello.add: ${x}, ${y}`);
    return (x + y);
  }
}
