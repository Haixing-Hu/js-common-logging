# js-logging

[![npm package](https://img.shields.io/npm/v/@haixing_hu/logging.svg)](https://npmjs.com/package/@haixing_hu/logging)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![中文文档](https://img.shields.io/badge/文档-中文版-blue.svg)](README.zh_CN.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/js-logging/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/js-logging/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/js-logging/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/js-logging?branch=master)

[@haixing_hu/logging] is a JavaScript library that provides powerful 
logging capabilities through decorators for class methods and properties. 
This library is designed to seamlessly integrate with Vue.js class components, 
offering an elegant solution for handling logging in your JavaScript projects.

## Installation

To install the library, use either npm or yarn:
```sh
npm install @haixing_hu/logging
```
or
```sh
yarn add @haixing_hu/logging
```

## The `Logger` Class

The `Logger` class provides a simple yet flexible logging interface.

### Get or create a Logger

You can retrieve a `Logger` instance by calling the static method
`Logger.getLogger(name, options)`, where 
- `name` is the identifier of the logger. If a logger with the same name exists,
  it will be returned; otherwise, a new one will be created.
- `options` (optional) is an object that may include:
  - `appender: object`: specifies the output destination for log messages.
    This object must implement `trace`, `debug`, `info`, `warn` and `error`
    methods. If omitted, the existing appender of the logger will be used, or
    the default appender will be assigned to a new logger.
  - `level: string`: defines the logging level (`TRACE`, `DEBUG`, `INFO`, `WARN`,
    `ERROR`, `NONE`). Case-insensitive. If omitted, the existing logging level
    of the logger will be used, or the default logging level will be assigned to
    a new logger. 

### Logging Messages

- `logger.trace(message, ...args)`: Logs a trace-level message.
- `logger.debug(message, ...args)`: Logs a debug-level message.
- `logger.info(message, ...args)`: Logs an info-level message.
- `logger.warn(message, ...args)`: Logs a warning-level message.
- `logger.error(message, ...args)`: Logs an error-level message.
- `logger.log(level, message, ...args)`: Logs a message in the specified logging level.

You can use placeholders in log messages to dynamically insert variables:

- `%o` or `%O`: JavaScript object output. Clicking the object name opens
  more information about it in the inspector.
- `%d` or` %i`: Integer output (supports formatting). For example, 
  `logger.info('Foo %.2d', 1.1)` will output the number as two significant
  figures with a leading 0: `Foo 01`.
- `%s`: String output.
- `%f`: Floating-point number output (supports formatting). For example,
  `logger.debug("Foo %.2f", 1.1)` will output the number to 2 decimal
  places: `Foo 1.10`.

Example:

```javascript
import { Logger } from '@haixing_hu/logging';

const logger = Logger.getLogger('MyClass');
logger.trace('This is a trace message with argument %s and argument %o', 'foo', { bar: 'baz' });
logger.debug('This is a debug message with argument %s and argument %o', 'foo', { bar: 'baz' });
logger.info('This is an info message with argument %s and argument %o', 'foo', { bar: 'baz' });
logger.warn('This is a warning message with argument %s and argument %o', 'foo', { bar: 'baz' });
logger.error('This is an error message with argument %s and argument %o', 'foo', { bar: 'baz' });
const level = 'info';
logger.log(level, 'This is an %s message with argument %s and argument %o', level, 'foo', { bar: 'baz' });
```

### Set the Logging Level

Adjust the logging level for a logger using `logger.setLevel(level)`.

Available levels: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `NONE` (case-insensitive).

### Set the Logging Appender

Use `logger.setAppender(appender)` to assign a custom appender object that defines:
- `trace(message, ...args)`
- `debug(message, ...args)`
- `info(message ...args)`
- `warn(message, ...args)`
- `error(message, ...args)`

Example:

```javascript
const logger = Logger.getLogger('MyClass');
logger.setAppender(console);    // Outputs log messages to the console.
```

### Enable or Disable Logging

- `logger.enable()`: Enable logging.
- `logger.disable()`: Disable logging.
- `logger.setEnabled(enabled)`: Dynamically control logging.

### Managing Loggers

- `Logger.clearAllLoggers()`: Clears all registered loggers.
- `Logger.getLevel(name)`: Retrieves the logging level for a specific logger.
- `Logger.setLevel(name, level)`: Sets the logging level for a specific logger.

### Default Levels and Appenders

The default logging levels and appenders are used when creating a new logger 
without specifying the level or appender.

- `Logger.getDefaultLevel()`: Gets the default logging level.
- `Logger.setDefaultLevel(level)`: Sets the default logging level.
- `Logger.resetDefaultLevel()`: Resets the default logging level to the 
  factory value.
- `Logger.getDefaultAppender()`: Gets the default logging appender.
- `Logger.setDefaultAppender(appender)`: Sets the default logging appender.
- `Logger.resetDefaultAppender()`:  Resets the default logging appender to the 
  factory value.

### Global Loggers Management

- `Logger.setAllLevels(level)`: Applies a logging level to all existing loggers.
- `Logger.resetAllLevels()`: Resets the logging level of all existing loggers to
  the default logging level.
- `Logger.setAllAppenders(appender)`: Applies a logging appender to all existing
  loggers.
- `Logger.resetAllAppenders()`: Resets the logging appender of all existing loggers
  to the default logging appender.
  
## The `@Log` Decorator

The `@Log` decorator automatically logs the method signature, including the 
class name, method name, and parameters.

Example:

```javascript
import { Log } from '@haixing_hu/logging';

class Person {
  @Log
  eat(meal) {
    // method implementation
  }
}

const person = new Person();
const meal = new Meal();
person.eat(meal); // The log will print the method calling signature
```

## The `@HasLogger` Decorator

The `@HasLogger` decorator adds a named logger to a class, which is accessibl
via the `logger` property.

Example:

```javascript
import { HasLogger } from '@haixing_hu/logging';

@HasLogger
class MyClass {
  foo() {
    this.logger.debug('This is MyClass.foo()');
  }
}
```

## Using with Vue.js Class Components

You can use the `@Log` and `@HasLogger` decorators with Vue.js class components:

```javascript
import { HasLogger, Log } from '@haixing_hu/logging';
import { Component, toVue } from '@haixing_hu/vue3-class-component';

@Component({
  template: '<p @click="foo">{{ message }}</p>',
})
@HasLogger
class MyComponent {
  
  message = 'hello world';
  
  @Log
  foo() {
    this.logger.debug('This is MyComponent.foo()');
  }
}

export default toVue(MyComponent);
```

**Note**: The `@HasLogger` decorator must be placed **after** the `@Component` decorator. 

## <span id="contributing">Contributing</span>

If you find any issues or have suggestions for improvements, please feel free
to open an issue or submit a pull request to the [GitHub repository].

## <span id="license">License</span>

[@haixing_hu/logging] is distributed under the Apache 2.0 license.
See the [LICENSE](LICENSE) file for more details.

[@haixing_hu/logging]: https://npmjs.com/package/@haixing_hu/logging
[GitHub repository]: https://github.com/Haixing-Hu/js-logging
