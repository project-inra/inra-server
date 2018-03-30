# inra-server-error

A simple, yet powerful error handler shipped as a middleware for Koa.

> **Note**: documentation and examples are published on our [Wiki](https://github.com/project-inra/inra-server/wiki).

## Installation

```bash
$ npm install --save inra-server-error
```

## API

#### `error(options)`

Koa errors middleware which catches exceptions thrown inside other middlewares or routes and generates a graceful response.

#### `defineError(definition)`

Defines an error handler for a specified exception type.

#### `handlers`

Returns defined error handlers (as a `Map`).

## Contributing

### Bug reporting

[![Github Open Issues](https://img.shields.io/github/issues-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues)
[![Github Closed Issues](https://img.shields.io/github/issues-closed-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues?q=is%3Aissue+is%3Aclosed)
[![Github Pull Requests](https://img.shields.io/github/issues-pr-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/pulls)

**We want contributing to Inra Server to be fun, enjoyable, and educational for anyone, and everyone.** Changes and improvements are more than welcome! Feel free to fork and open a pull request. If you have found any issues, please [report them here](https://github.com/project-inra/inra-server/issues/new) - they are being tracked on [GitHub Issues](https://github.com/project-inra/inra-server/issues).

### Development

We have prepared multiple commands to help you develop `inra-server-error` on your own. Don't forget to install all `Node.js` dependencies from [npm](https://www.npmjs.com/). You will need a local copy of [Node.js](https://nodejs.org/en/) installed on your machine.

```bash
$ npm install
```

#### Usage

```bash
$ npm run <command>
```

#### List of commands

| Command | Description                              |
| ------- | ---------------------------------------- |
| `build` | Builds `inra-server-error`               |
| `watch` | Re-builds `inra-server-error` on changes |
| `clean` | Deletes builds ands cache                |
| `lint`  | Fixes Lint errors                        |
| `flow`  | Checks Flow errors                       |
| `test`  | Checks Flow errors and runs tests        |
