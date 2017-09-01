# inra-server-container

The container is a component that implements Service Location of services and it's itself a container for them. Since the server is highly decoupled, it is essential to integrate different components. The developer can also use this component to inject dependencies and manage global instances of the different classes used in the application.

Basically, this component implements the ["Inversion of Control"](https://en.wikipedia.org/wiki/Inversion_of_control) pattern: the objects do not receive their dependencies using setters or constructors, but requesting something similar to "service dependency injector". This reduces the overall complexity since there is only one way to get the required dependencies within a component. Additionally, this pattern increases testability in the code, thus making it less prone to errors.

## Installation

Using [npm](https://www.npmjs.com/):

```bash
$ npm install --save inra-server-container
```

**Note:** This package provides the core routing functionality for Inra Server, but you might not want to install it directly. If you are writing an application that will run on Inra Server, you should instead install `inra-server`. It will install `inra-server-container` as a dependency.

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
import Container from "inra-server-container";
```

## API

`new Container()`

#### `.set( key, value )`

Sets the value for the key in the Container object. Returns the Map object.

#### `.get( key [, defaultValue] )`

Returns the value associated to the key, or `defaultValue` if there is none.

#### `.has( key )`

Returns a boolean asserting whether a value has been associated to the key in the Container object or not.

#### `.delete( key )`

Removes any value associated to the key and returns `true` if it was deleted successfully, or `false` otherwise.

#### `.clear()`

Removes all key/value pairs from the Map object.

#### `.size`

Returns the number of key/value pairs in the Map object.

## Contributing

### Bug reporting

[![Github Open Issues](https://img.shields.io/github/issues-raw/ProjectInra/inra-server.svg)](https://github.com/ProjectInra/inra-server/issues)
[![Github Closed Issues](https://img.shields.io/github/issues-closed-raw/ProjectInra/inra-server.svg)](https://github.com/ProjectInra/inra-server/issues?q=is%3Aissue+is%3Aclosed)
[![Github Pull Requests](https://img.shields.io/github/issues-pr-raw/ProjectInra/inra-server.svg)](https://github.com/ProjectInra/inra-server/pulls)

**We want contributing to Inra Server to be fun, enjoyable, and educational for anyone, and everyone.** Changes and improvements are more than welcome! Feel free to fork and open a pull request. If you have found any issues, please [report them here](https://github.com/ProjectInra/inra-server/issues/new) - they are being tracked on [GitHub Issues](https://github.com/ProjectInra/inra-server/issues).

### License

Inra Server is built and maintained by [Bartosz Łaniewski](https://github.com/Bartozzz). The full list of contributors can be found [here](https://github.com/ProjectInra/inra-server/graphs/contributors). Inra's code is [MIT licensed](https://github.com/ProjectInra/inra-server/blob/master/LICENSE).

### Development

We have prepared multiple commands to help you develop `inra-server-container` on your own. Don't forget to install all `Node.js` dependencies from [npm](https://www.npmjs.com/). You will need a local copy of [Node.js](https://nodejs.org/en/) installed on your machine.

```bash
$ sudo npm install
```

#### Usage

```bash
$ sudo npm run <command>
```

#### List of commands

| Command       | Description                                       |
|---------------|---------------------------------------------------|
| `build`       | Builds `inra-server-container`                    |
| `watch`       | Re-builds `inra-server-container` on changes      |
| `clean`       | Deletes builds ands cache                         |
| `lint`        | Fixes Lint errors                                 |
| `flow`        | Checks Flow errors                                |
| `test`        | Checks Flow errors and runs tests                 |
