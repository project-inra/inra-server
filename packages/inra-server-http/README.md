# inra-server-http

[![npm](https://img.shields.io/npm/v/inra-server-http.svg?maxAge=2592000)](https://www.npmjs.com/package/inra-server-http)
[![Dependency Status](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-http)](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-http)

A wrapper for common Node.js frameworks. Creates a micro application suitable for small applications with low overhead such as RESTful APIS. This class aims to be a _better_, _more expressive_, and _more robust_ foundation for web applications and APIs.

>**Note**: full documentation with more examples is published on our [Wiki](https://github.com/project-inra/inra-server/wiki). Please, refer to our [Wiki](https://github.com/project-inra/inra-server/wiki) for installation details and API references.

- [Installation](#installation)
- [API reference](#api)
- [Contributing](#contributing)
  - [Bug reporting](#bug-reporting)
  - [Development](#development)

## Installation

```bash
$ npm install --save inra-server-http
```

## API

```javascript
const server = new Server({
  port: Number(process.env.PORT)
});
```

Each `Server` instance is a [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) which defines custom behaviors for fundamental operations such as "magic" setters and getters. It allows us to reflect all custom properties to a dependency injector which keeps fundamental object safe and immutable. Gives another layer of abstraction for data.

- Setters are used to prevent developers from overriding server internals. Additionally, custom-defined properties will be added to an internal Map object which serves as Service Location of services and it's itself a container for them.

- Getters retrieve those properties from the Map object by key, if such key doesn't exist in server internals. You should avoid to access server internals manually, unless you know what are you doing.

### Server

<br>

#### `.setEngine(framework)`

Sets a engine for server. Each engine must implement methods described in `EngineInterface`.

**Example:** using [Koa.js](https://koajs.com/)

```javascript
server.setEngine(new Koa());
```

<br>

#### `.setRouter(framework)`

Sets a router for server. Each router must implement methods described in `RouterInterface`.

**Example:** using [`koa-router`](https://github.com/alexmingoia/koa-router)

```javascript
server.setRouter(new Router());
```

<br>

#### `.import(path)`

Imports, initialises and handles a given resource. Resources are recognized based on their name.

**Example:**

```javascript
app.import("./path/to/something.js");
```

```javascript
// ./path/to/something.js
export default function(app) {
  // …
}
```

<br>

#### `.run(port, callback)`

Listens on a given port.

<br>

#### `.use(middleware)`

Mounts the specified middleware function or functions.

<br>

### Middlewares

Assuming we are using [Koa.js](https://koajs.com/):

```javascript
import middleware from "inra-server-http/middleware";

@middleware()
export default class SomeMiddleware {
  constructor(app) {
    // …
  }

  async before(ctx, next, ...rest) {
    // …
  }

  async handle(ctx, next, ...rest) {
    // …
  }

  async after(ctx, next, ...rest) {
    // …
  }
}
```

<br>

### Controllers

Assuming we are using [Koa.js](https://koajs.com/):

```javascript
import controller, {get, post, patch, del} from "inra-server-http/router";

@controller("/namespace")
export default class SomeController {
  constructor(app) {
    // …
  }

  @post("/resource", function (app) {
    return compose([
      this.isAuthorized(),
      this.hasPermission(["create", …])
    ])
  })
  async create(ctx, next) {
    // …
  }

  @get("/resource/:id")
  async read(ctx, next) {
    // …
  }

  @get("/resource")
  async readAll(ctx, next) {
    // …
  }

  @patch("/resource")
  async update(ctx, next) {
    // …
  }

  @del("/resource")
  async delete(ctx, next) {
    // …
  }
}
```

## Contributing

### Bug reporting

[![Github Open Issues](https://img.shields.io/github/issues-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues)
[![Github Closed Issues](https://img.shields.io/github/issues-closed-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues?q=is%3Aissue+is%3Aclosed)
[![Github Pull Requests](https://img.shields.io/github/issues-pr-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/pulls)

**We want contributing to Inra Server to be fun, enjoyable, and educational for anyone, and everyone.** Changes and improvements are more than welcome! Feel free to fork and open a pull request. If you have found any issues, please [report them here](https://github.com/project-inra/inra-server/issues/new) - they are being tracked on [GitHub Issues](https://github.com/project-inra/inra-server/issues).

### Development

We have prepared multiple commands to help you develop `inra-server-http` on your own. Don't forget to install all `Node.js` dependencies from [npm](https://www.npmjs.com/). You will need a local copy of [Node.js](https://nodejs.org/en/) installed on your machine.

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
| `build` | Builds `inra-server-http`                    |
| `watch` | Re-builds `inra-server-http` on changes      |
| `clean` | Deletes builds and cache                     |
| `lint`  | Fixes Lint errors                            |
| `flow`  | Checks Flow errors                           |
| `test`  | Checks for style guide errors and runs tests |
