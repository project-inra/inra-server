# inra-server-error

[![npm](https://img.shields.io/npm/v/inra-server-error.svg?maxAge=2592000)](https://www.npmjs.com/package/inra-server-error)
[![Dependency Status](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-error)](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-error)

A simple, yet powerful error handler shipped as a middleware for [Koa](https://koajs.com/).
`inra-server-error` provides a set of utilities for defining and returning HTTP errors. Each utility returns an error response object which includes the following properties:

```json
{
  "success": "…",
  "errorCode": "…",
  "userMessage": "…",
  "developerMessage": "…"
}
```

>**Note**: full documentation with more examples is published on our [Wiki](https://github.com/project-inra/inra-server/wiki). Please, refer to our [Wiki](https://github.com/project-inra/inra-server/wiki) for installation details and API references.

- [Installation](#installation)
- [API reference](#api)
- [Contributing](#contributing)
  - [Bug reporting](#bug-reporting)
  - [Development](#development)

## Installation

```bash
$ npm install --save inra-server-error
```

## API

```javascript
import error, {defineError} from "inra-server-error";
```

<br>

#### `error(options)`

Koa errors middleware which catches exceptions thrown inside other middlewares or routes and generates a graceful response.

**Example:**

```javascript
app.use(error({
  errorCode: "Default error code"
  httpStatus: "Default HTTP status",
  userMessage: "Default user message",

  callback(error) {
    // Will be executed on each exception
  }
}));
```

<br>

#### `defineError(definition)`

Defines an error handler for a specified exception type.

>**Note:** to make our middleware handle custom errors, you must define an error with exception's instance. Other fields are optional.

**Example:**

```javascript
defineError({
  instance: AuthWrongUsernameError,
  errorCode: "Optional error code"
  httpStatus: "Optional HTTP status",
  userMessage: "Optional user message",

  callback(error) {
    // …
  }
});
```

```javascript
class CustomError extends Error {
  errorCode = 103;
  httpStatus = 401;
  userMessage = "Something went wrong";
};

defineError({
  instance: CustomError
});
```

<br>

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
