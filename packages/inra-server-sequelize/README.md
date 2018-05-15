# inra-server-sequelize

[![npm](https://img.shields.io/npm/v/inra-server-sequelize.svg?maxAge=2592000)](https://www.npmjs.com/package/inra-server-sequelize)
[![Dependency Status](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-sequelize)](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-sequelize)

>**Note**: full documentation with more examples is published on our [Wiki](https://github.com/project-inra/inra-server/wiki). Please, refer to our [Wiki](https://github.com/project-inra/inra-server/wiki) for installation details and API references.

- [Installation](#installation)
- [API reference](#api)
- [Contributing](#contributing)
  - [Bug reporting](#bug-reporting)
  - [Development](#development)

## Installation

```bash
$ npm install --save inra-server-sequelize
```

## API

```javascript
const database = new Database(config, autoconnect);
```

<br>

#### `.connect()`

Tries to establish a connection with the given database's configuration. Disables `operatorsAliases` for security purposes.

**Example:**

```javascript
database.connect()
  .then(…)
  .catch(…);
```

<br>

#### `.associate()`

Creates relations between each model. This is automatically executed on `.connect` but might come handy when implementing migrations and seeders.

**Example:**

```javascript
database.associate();
```

<br>

#### `.sync(options)`

Creates relations between each model and synchronises the database with provided models.

**Example:**

```javascript
database.sync()
  .then(…)
  .catch(…);
```

<br>

#### `.import(path)`

Loads a model and saves it for further usage.

**Example:**

```javascript
database.import(…);
```

<br>

## Contributing

### Bug reporting

[![Github Open Issues](https://img.shields.io/github/issues-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues)
[![Github Closed Issues](https://img.shields.io/github/issues-closed-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues?q=is%3Aissue+is%3Aclosed)
[![Github Pull Requests](https://img.shields.io/github/issues-pr-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/pulls)

**We want contributing to Inra Server to be fun, enjoyable, and educational for anyone, and everyone.** Changes and improvements are more than welcome! Feel free to fork and open a pull request. If you have found any issues, please [report them here](https://github.com/project-inra/inra-server/issues/new) - they are being tracked on [GitHub Issues](https://github.com/project-inra/inra-server/issues).

### Development

We have prepared multiple commands to help you develop `inra-server-sequelize` on your own. Don't forget to install all `Node.js` dependencies from [npm](https://www.npmjs.com/). You will need a local copy of [Node.js](https://nodejs.org/en/) installed on your machine.

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
| `build` | Builds `inra-server-sequelize`               |
| `watch` | Re-builds `inra-server-sequelize` on changes |
| `clean` | Deletes builds and cache                     |
| `lint`  | Fixes Lint errors                            |
| `flow`  | Checks Flow errors                           |
| `test`  | Checks for style guide errors and runs tests |
