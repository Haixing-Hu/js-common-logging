# js-logging

[![npm package](https://img.shields.io/npm/v/@haixing_hu/logging.svg)](https://npmjs.com/package/@haixing_hu/logging)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![English Document](https://img.shields.io/badge/Document-English-blue.svg)](README.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/js-logging/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/js-logging/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/js-logging/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/js-logging?branch=master)

[@haixing_hu/logging] 是一个 JavaScript 库，通过装饰器为类方法和属性提供强大的日志记录功能。
该库旨在与[Vue.js 类组件]无缝集成，为处理 JavaScript 项目中的日志记录提供了优雅的解决方案。

## 安装

使用 npm 或 yarn 安装该库：
```sh
npm install @haixing_hu/logging
```
或
```sh
yarn add @haixing_hu/logging
```

## `Logger` 类

`Logger` 类提供了一个简单而灵活的日志记录接口。

### 获取或创建 Logger

你可以通过调用静态方法 `Logger.getLogger(name, options)` 获取一个 `Logger` 实例，其中：
- `name` 是 logger 的标识符。如果已经存在具有相同名称的 logger，则返回该实例；否则将创建一个新的 logger。
- `options`（可选）是一个对象，可能包括：
    - `appender: object`：指定日志消息的输出目的地。此对象必须实现 `trace`、`debug`、`info`、`warn` 和 `error` 方法。
      如果省略，将使用 logger 的现有 appender，或者为新创建的 logger 分配默认 appender。
    - `level: string`：定义日志记录级别（`TRACE`、`DEBUG`、`INFO`、`WARN`、`ERROR`、`NONE`）。不区分大小写。
      如果省略，将使用 logger 的现有日志级别，或者为新创建的 logger 分配默认日志级别。

### 记录日志消息

- `logger.trace(message, ...args)`：记录一个 trace 级别的消息。
- `logger.debug(message, ...args)`：记录一个 debug 级别的消息。
- `logger.info(message, ...args)`：记录一个 info 级别的消息。
- `logger.warn(message, ...args)`：记录一个警告级别的消息。
- `logger.error(message, ...args)`：记录一个错误级别的消息。
- `logger.log(level, message, ...args)`：以指定的日志级别记录消息。

你可以在日志消息中使用占位符动态插入变量：

- `%o` 或 `%O`：JavaScript 对象输出。点击对象名称可以在检查器中查看更多信息。
- `%d` 或 `%i`：整数输出（支持格式化）。例如，`logger.info('Foo %.2d', 1.1)` 将数字输出为两位有效数字并带有前导0：
  `Foo 01`。
- `%s`：字符串输出。
- `%f`：浮点数输出（支持格式化）。例如，`logger.debug("Foo %.2f", 1.1)` 将数字输出为两位小数：`Foo 1.10`。

示例：

```javascript
import Logger from '@haixing_hu/logging';

const logger = Logger.getLogger('MyClass');
logger.trace('This is a trace message with argument %s and argument %o', 'foo', { bar: 'baz' });
logger.debug('This is a debug message with argument %s and argument %o', 'foo', { bar: 'baz' });
logger.info('This is an info message with argument %s and argument %o', 'foo', { bar: 'baz' });
logger.warn('This is a warning message with argument %s and argument %o', 'foo', { bar: 'baz' });
logger.error('This is an error message with argument %s and argument %o', 'foo', { bar: 'baz' });
const level = 'info';
logger.log(level, 'This is an %s message with argument %s and argument %o', level, 'foo', { bar: 'baz' });
```

### 设置日志级别

使用 `logger.setLevel(level)` 调整 logger 的日志级别。

可用的日志级别有：`TRACE`、`DEBUG`、`INFO`、`WARN`、`ERROR`、`NONE`（不区分大小写）。

### 设置日志 Appender

使用 `logger.setAppender(appender)` 为 logger 分配一个自定义的 appender 对象，该对象定义了以下方法：
- `trace(message, ...args)`
- `debug(message, ...args)`
- `info(message ...args)`
- `warn(message, ...args)`
- `error(message, ...args)`

示例：

```javascript
const logger = Logger.getLogger('MyClass');
logger.setAppender(console);    // Outputs log messages to the console.
```

### 启用或禁用日志记录

- `logger.enable()`：启用日志记录。
- `logger.disable()`：禁用日志记录。
- `logger.setEnabled(enabled)`：动态控制日志记录的启用与禁用。

### 管理日志记录器

- `Logger.clearAllLoggers()`：清除所有已注册的日志记录器。
- `Logger.getLevel(name)`：获取特定日志记录器的日志级别。
- `Logger.setLevel(name, level)`：设置特定日志记录器的日志级别。

### 默认级别和 Appender

当创建一个新日志记录器时，如果没有指定级别或 appender，将使用默认的日志级别和 appender。

- `Logger.getDefaultLevel()`：获取默认日志级别。
- `Logger.setDefaultLevel(level)`：设置默认日志级别。
- `Logger.resetDefaultLevel()`：将默认日志级别重置为出厂值。
- `Logger.getDefaultAppender()`：获取默认日志 appender。
- `Logger.setDefaultAppender(appender)`：设置默认日志 appender。
- `Logger.resetDefaultAppender()`：将默认日志 appender 重置为出厂值。

### 全局日志管理

- `Logger.setAllLevels(level)`：将指定日志级别应用于所有现有日志记录器。
- `Logger.resetAllLevels()`：将所有现有日志记录器的日志级别重置为默认日志级别。
- `Logger.setAllAppenders(appender)`：将指定日志 appender 应用于所有现有日志记录器。
- `Logger.resetAllAppenders()`：将所有现有日志记录器的日志 appender 重置为默认 appender。

## `@Log` 装饰器

`@Log` 装饰器会自动记录方法签名，包括类名、方法名和参数。

示例：

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

## `@HasLogger` 装饰器

`@HasLogger` 装饰器会为类添加一个命名的日志记录器，可以通过 `logger` 属性访问。

示例：

```javascript
import { HasLogger } from '@haixing_hu/logging';

@HasLogger
class MyClass {
  foo() {
    this.logger.debug('This is MyClass.foo()');
  }
}
```

## 与 Vue.js 类组件一起使用

你可以在[Vue.js 类组件]中使用 `@Log` 和 `@HasLogger` 装饰器：

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

**注意**：`@HasLogger` 装饰器必须放在 `@Component` 装饰器的**后面**。

## <span id="contributing">贡献</span>

如果您发现任何问题或有改进建议，请随时在 [GitHub 仓库] 上提交 issue 或 pull request。

## <span id="license">许可证</span>

[@haixing_hu/logging] 根据 Apache 2.0 许可证分发。详情请参阅 [LICENSE](LICENSE) 文件。

[@haixing_hu/logging]: https://npmjs.com/package/@haixing_hu/logging
[Vue.js 类组件]: https://github.com/Haixing-Hu/vue3-class-component/
[GitHub repository]: https://github.com/Haixing-Hu/js-logging
