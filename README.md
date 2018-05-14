# Project Inra

[![Greenkeeper badge](https://badges.greenkeeper.io/project-inra/inra-server.svg)](https://greenkeeper.io/)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

**Inra Server** is a set of JavaScript libraries for creating back-end solutions on a higher level of abstraction. This project is very experimental, as it brings to life patterns very rarely seen in Node.js such as _inversion of control_, _dependency injectors_, _autoloaders_.

>**Note:** documentation and examples for each package are published on our [Wiki](https://github.com/project-inra/inra-server/wiki) and their respectives [READMEs](#list-of-packages). Please, refer to those resources for installation details and API references.

## Installation

**Inra Server** is written using _ES2015 modules_. Create a custom bundle using your preferred bundler. To import Inra into your application, just import Inra modules that you need.

>**Note:** some packages such as [`inra-server-http`](/packages/inra-server-container) are incompatible with [Webpack](https://webpack.js.org/), as Webpack doesn't support dynamic imports.

### List of packages

| Package | Version | Dependencies |
| ------- | ------- | ------------ |
| [`inra-server-container`](/packages/inra-server-container) | [![npm](https://img.shields.io/npm/v/inra-server-container.svg?maxAge=2592000)](https://www.npmjs.com/package/inra-server-container) | [![Dependency Status](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-container)](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-container) |
| [`inra-server-http`](/packages/inra-server-http) | [![npm](https://img.shields.io/npm/v/inra-server-http.svg?maxAge=2592000)](https://www.npmjs.com/package/inra-server-http) | [![Dependency Status](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-http)](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-http) |
| [`inra-server-error`](/packages/inra-server-error) | [![npm](https://img.shields.io/npm/v/inra-server-error.svg?maxAge=2592000)](https://www.npmjs.com/package/inra-server-error) | [![Dependency Status](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-error)](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-error) |
| [`inra-server-sequelize`](/packages/inra-server-sequelize) | [![npm](https://img.shields.io/npm/v/inra-server-sequelize.svg?maxAge=2592000)](https://www.npmjs.com/package/inra-server-sequelize) | [![Dependency Status](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-sequelize)](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-sequelize) |
| [`inra-server-socket`](/packages/inra-server-socket) | [![npm](https://img.shields.io/npm/v/inra-server-socket.svg?maxAge=2592000)](https://www.npmjs.com/package/inra-server-socket) | [![Dependency Status](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-socket)](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-socket) |

## Contributing

### License

**Project Inra** was created and developed by [Bartosz Łaniewski](https://github.com/Bartozzz). The full list of contributors can be found [here](https://github.com/project-inra/inra-server/graphs/contributors). Each package is [MIT licensed](https://github.com/project-inra/inra-server/blob/master/LICENSE), except for packages that provide a different LICENSE file.

### Bug reporting

[![Github Open Issues](https://img.shields.io/github/issues-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues)
[![Github Closed Issues](https://img.shields.io/github/issues-closed-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues?q=is%3Aissue+is%3Aclosed)
[![Github Pull Requests](https://img.shields.io/github/issues-pr-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/pulls)

**We want contributing to Inra Server to be fun, enjoyable, and educational for anyone, and everyone.** Changes and improvements are more than welcome! Feel free to fork and open a pull request. If you have found any issues, please [report them here](https://github.com/project-inra/inra-server/issues/new) - they are being tracked on [GitHub Issues](https://github.com/project-inra/inra-server/issues).
