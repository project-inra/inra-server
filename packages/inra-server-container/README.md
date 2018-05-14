# inra-server-container

[![npm](https://img.shields.io/npm/v/inra-server-container.svg?maxAge=2592000)](https://www.npmjs.com/package/inra-server-container)
[![Dependency Status](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-container)](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-container)

The container is a component that implements Service Location of services and it's itself a container for them. Since the server is highly decoupled, it is essential to integrate different components. The developer can also use this component to inject dependencies and manage global instances of the different classes used in the application.

Basically, this component implements the ["Inversion of Control"](https://en.wikipedia.org/wiki/Inversion_of_control) pattern: the objects do not receive their dependencies using setters or constructors, but requesting something similar to "service dependency injector". This reduces the overall complexity since there is only one way to get the required dependencies within a component. Additionally, this pattern increases testability in the code, thus making it less prone to errors.

>**Note**: full documentation with more examples is published on our [Wiki](https://github.com/project-inra/inra-server/wiki). Please, refer to our [Wiki](https://github.com/project-inra/inra-server/wiki) for installation details and API references.

- [Installation](#installation)
- [API reference](#api)
- [Contributing](#contributing)
  - [Bug reporting](#bug-reporting)
  - [Development](#development)

## Installation

```bash
$ npm install --save inra-server-container
```

## API

```
const container = new Container();
```

<br>

####  `.set(key, value)`

Adds or updates an element with a specified `key` and `value` to a Container instance. Returns the Container itself.

>**Note:** Any value (both objects and primitive values) may be used as either a key or a value in the default Container. This is not necessarly the case for other containers that implement `ContainerInterface`.

**Example:**

```javascript
container.set("foo", …);
container.set("bar", …);
```

<br>

#### `.get(key [, defaultValue])`

Returns the value associated to specified `key`, or `defaultValue` if there is none.

**Example:**

```javascript
container.get("foo");    //> …
container.get("zoo", 1); //> 1
```

<br>

#### `.has(key)`

Returns a boolean asserting whether an element with the specified `key` exists in a Container instance or not.

**Example:**

```javascript
container.has("foo"); //> true
container.has("zoo"); //> false
```

<br>

#### `.delete(key)`

Removes the value associated to specified key and returns `true` if it was deleted successfully, or `false` otherwise.

**Example:**

```javascript
container.delete("foo"); //> true
container.delete("zoo"); //> false
```

<br>

#### `.clear()`

Removes all key/value pairs from a Container instance.

**Example:**

```javascript
container.clear();
```

<br>

#### `.size`

Returns the number of key/value pairs in a Container instance.

**Example:**

```javascript
container.set("foo", …);
container.set("bar", …);
container.set("zoo", …);

container.size; //> 3
```

<br>

## Contributing

### Bug reporting

[![Github Open Issues](https://img.shields.io/github/issues-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues)
[![Github Closed Issues](https://img.shields.io/github/issues-closed-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues?q=is%3Aissue+is%3Aclosed)
[![Github Pull Requests](https://img.shields.io/github/issues-pr-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/pulls)

**We want contributing to Inra Server to be fun, enjoyable, and educational for anyone, and everyone.** Changes and improvements are more than welcome! Feel free to fork and open a pull request. If you have found any issues, please [report them here](https://github.com/project-inra/inra-server/issues/new) - they are being tracked on [GitHub Issues](https://github.com/project-inra/inra-server/issues).

### Development

We have prepared multiple commands to help you develop `inra-server-container` on your own. Don't forget to install all `Node.js` dependencies from [npm](https://www.npmjs.com/). You will need a local copy of [Node.js](https://nodejs.org/en/) installed on your machine.

```bash
$ npm install
```

#### Usage

```bash
$ npm run <command>
```

#### List of commands

| Command | Description                                  |
| ------- | -------------------------------------------- |
| `build` | Builds `inra-server-container`               |
| `watch` | Re-builds `inra-server-container` on changes |
| `clean` | Deletes builds ands cache                    |
| `lint`  | Fixes Lint errors                            |
| `flow`  | Checks Flow errors                           |
| `test`  | Checks Flow errors and runs tests            |
