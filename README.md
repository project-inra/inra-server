# Project Inra

[![Greenkeeper badge](https://badges.greenkeeper.io/project-inra/inra-server.svg)](https://greenkeeper.io/)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

**Inra Server** is a set of JavaScript libraries for creating back-end solutions on a higher level of abstraction. This project is very experimental, as it brings to life patterns very rarely seen in Node.js such as _inversion of control_, _dependency injectors_, _autoloaders_.

>**Note:** documentation and examples for each package are published on our [Wiki](https://github.com/project-inra/inra-server/wiki). Please, refer to our [Wiki](https://github.com/project-inra/inra-server/wiki) for installation details and API references.

## Installation

**Inra Server** is written using _ES2015 modules_. Create a custom bundle using your preferred bundler. To import Inra into your application, just import Inra modules that you need:

```javascript
import Server from "inra-server-http";
import Database from "inra-server-sequelize";
```

### List of packages

- [`inra-server-container`](https://github.com/project-inra/inra-server/tree/master/packages/inra-server-container)
- [`inra-server-http`](https://github.com/project-inra/inra-server/tree/master/packages/inra-server-error)
- [`inra-server-error`](https://github.com/project-inra/inra-server/tree/master/packages/inra-server-http)
- [`inra-server-sequelize`](https://github.com/project-inra/inra-server/tree/master/packages/inra-server-sequelize)
- [`inra-server-socket`](https://github.com/project-inra/inra-server/tree/master/packages/inra-server-socket)

## Contributing

### Bug reporting

[![Github Open Issues](https://img.shields.io/github/issues-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues)
[![Github Closed Issues](https://img.shields.io/github/issues-closed-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues?q=is%3Aissue+is%3Aclosed)
[![Github Pull Requests](https://img.shields.io/github/issues-pr-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/pulls)

**We want contributing to Inra Server to be fun, enjoyable, and educational for anyone, and everyone.** Changes and improvements are more than welcome! Feel free to fork and open a pull request. If you have found any issues, please [report them here](https://github.com/project-inra/inra-server/issues/new) - they are being tracked on [GitHub Issues](https://github.com/project-inra/inra-server/issues).
