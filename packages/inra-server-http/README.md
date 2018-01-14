# inra-server-http

Wrapper for common Node.js frameworks. Creates micro applications which are suitable for small applications that will have very low overhead. Such apps are for instance websites, documentations, APIs, prototypes etc.

It creates a HTTP(S) server on a given port, populates it with specified resources (routes, middlewares, …). This class aims to be a better, more expressive, and more robust foundation for web applications and APIs.

## Installation

Using [npm](https://www.npmjs.com/):

```bash
$ npm install --save inra-server-http
```

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
import App from "inra-server-http";
```

## API

`new Server(config)`

#### `.setEngine(framework)`

Listens on a given port.

#### `.setRouter(framework)`

Listens on a given port.

#### `.run(port, callback)`

Listens on a given port.

#### `.import(path)`

Imports, initialises and saves a given resource. Each resource is handled by it individual handler. Resources are recognized based on their name, so a `*Middleware` will be interpreted as a middleware and a `*Router` will be interpreted as a router.

## Examples

### Middleware

Middlewares are simple classes which defines 4 methods, executes in the same order as follows:

- For Express.js
  1. `create(application);`
  2. `before(req, res, ...rest);`
  3. `handle(req, res, ...rest);`
  4. `after(req, res, ...rest);`

- For Koa.js
  1. `async create(application);`
  2. `async before(ctx, next, ...rest);`
  3. `async handle(ctx, next, ...rest);`
  4. `async after(ctx, next, ...rest);`

Consider the following middleware for Koa.js:

```javascript
export default class AclMiddleware {
  constructor(app) {
    this.models = app.models;
  }
  
  async before(ctx) {
    if (!ctx.state.user) {
      ctx.throw(401, "Not allowed");
    }
  }
  
  async handle(ctx, next, permissions) {
    if (ctx.state.user.hasPermissions(permissions) {
      return next();
    }
  }
}
```

You can import it to your app for further usage using `.import(path)` method. The middleware will be automatically initialised and populated with necessary data.

```javascript
const hasPermission = app.import("./AclMiddleware");
const {Acl} = app.middlewares;

// hasPermission === Acl
// Note that middleware names are based on class name. During the initialisation, "Middleware" suffix is deleted.

router.delete("/user", hasPermission(["isAdmin"]), …);
router.delete("/post", hasPermission(["isModerator"]), …);
```

### Routes

Consider the following middleware for Koa.js:

```javascript
import {head, options, get, post, put, patch, del, all} from "inra-server-http";

export class NamespaceMiddleware {
  constructor(app) {
      // this.models = app.models;
      // this.middlewares = app.middlewares;
  }

  @post("/namespace", middlewareA, middlewareB)
  create(ctx, next) {
      // …
  }

  @get("/namespace/:id", middlewareA, middlewareB)
  read(ctx, next) {
      // …
  }

  @patch("/namespace/:id", middlewareA, middlewareB)
  update(ctx, next) {
      // …
  }

  @del("/namespace/:id", middlewareA, middlewareB)
  delete(ctx, next) {
      // …
  }
}
```

You can import it to your app for further usage using `.import(path)` method. The router will be automatically initialised and added to your application.

```javascript
app.setEngine(new Koa());
app.setRouter(new Router());

app.import("./UserRoutes");
app.import("./BlogRoutes");

app.run();
```

## Contributing

### Bug reporting

[![Github Open Issues](https://img.shields.io/github/issues-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues)
[![Github Closed Issues](https://img.shields.io/github/issues-closed-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/issues?q=is%3Aissue+is%3Aclosed)
[![Github Pull Requests](https://img.shields.io/github/issues-pr-raw/project-inra/inra-server.svg)](https://github.com/project-inra/inra-server/pulls)

**We want contributing to Inra Server to be fun, enjoyable, and educational for anyone, and everyone.** Changes and improvements are more than welcome! Feel free to fork and open a pull request. If you have found any issues, please [report them here](https://github.com/project-inra/inra-server/issues/new) - they are being tracked on [GitHub Issues](https://github.com/project-inra/inra-server/issues).

### License

Inra Server is built and maintained by [Bartosz Łaniewski](https://github.com/Bartozzz). The full list of contributors can be found [here](https://github.com/project-inra/inra-server/graphs/contributors). Inra's code is [MIT licensed](https://github.com/project-inra/inra-server/blob/master/LICENSE).

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
