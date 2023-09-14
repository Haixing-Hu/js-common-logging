/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { HasLogger, Log } from '../../main';

@HasLogger
class MyClass {
  foo() {
    this.logger.debug('This is MyClass.foo()');
  }

  @Log
  add(x, y) {
    this.logger.info('Add %d and %d', x, y);
  }
}

export default MyClass;
