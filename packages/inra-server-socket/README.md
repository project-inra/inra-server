# inra-server-socket

[![npm](https://img.shields.io/npm/v/inra-server-socket.svg?maxAge=2592000)](https://www.npmjs.com/package/inra-server-socket)
[![Dependency Status](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-socket)](https://david-dm.org/project-inra/inra-server.svg?path=packages/inra-server-socket)

The purpose of this component is to intercept the manipulation of most of the socket work by creating special wrappers. These wrappers allow the developer to integrate his client with `inra-server` rapidly, manipulate data, connections and/or namespaces.

>**Note**: full documentation with more examples is published on our [Wiki](https://github.com/project-inra/inra-server/wiki). Please, refer to our [Wiki](https://github.com/project-inra/inra-server/wiki) for installation details and API references.

- [Installation](#installation)
- [API reference](#api)
- [Contributing](#contributing)
  - [Bug reporting](#bug-reporting)
  - [Development](#development)

## Installation

```bash
$ npm install --save inra-server-socket
```

## API

```javascript
const socket = new Socket(config);
```

### Socket Server

<br>

#### `.send(id, event [, data = {}])`

Emits an `event` with `data` for a specific connection. This is usefll in event listeners on server-side, when you intercept specific events and want to send back a response for the given source.

**Example:**

```javascript
socket.on("eventA", (data, connection, namespace) => {
  socket.send(connection.id, "eventB", ...data);
});
```

<br>

#### `.emit(event [, data = {}])`

Emits an `event` with `data` for every connection in every namespace registered.

**Example:**

```javascript
socket.emit("event", ...data);
```

<br>

#### `.broadcast(event [, data = {}])`

Emits an `event` with `data` for every connection in every namespace registered. Broadcast behaviour is the same as for `.emit` (in `Socket` only - it changes for `SocketNamespace` and `SocketConnection`).

**Example:**

```javascript
socket.broadcast("event", ...data);
```

<br>

#### `.on(event, callback)`

Registers a `callback` for a specific `event` coming from all the registered namespaces. This means that `event` will be intercepted even if it was registered only for a specific `SocketNamespace`.

**Note:** You can still register events which will be intercepted only by specified namespaces.

```javascript
socket.on("event", (data, connection, namespace) => {
  // …
});
```

<br>

#### `.create(id)`

Creates a new room with id `room`. Automically resolves new connections and events. Returns the created room instance (`SocketNamespace`).

```javascript
const indexNamespace = socket.create("/").listen();
const adminNamespace = socket.create("/admin").use(authMiddleware).listen();
```

<br>

#### `.trigger(event, data, connection, namespace)`

Triggers a specific `event` with `data`, `connection` and `namespace`.

```javascript
socket.on("event", (data, connection, namespace) => {
  if (/* … */) {
    socket.trigger("another_event", data, connection, namespace);
  }
});
```

<br>

#### `.io`

`socket.io` instance.

<br>

#### `.host`

<br>

#### `.port`

<br>

#### `.hostname`

<br>

#### `.config`

<br>

#### `.callbacks`

<br>

#### `.connections`

<br>

### Socket Connection

<br>

#### `.on(event, callback)`

Executes `callback` on `event` from the actual socket.

<br>

#### `.emit(event [, data = {}])`

Emits an `event` with `data` from the actual socket.

<br>

#### `.broadcast(event [, data = {}])`

Emits an `event` with `data` to everyone else in the namespace except for the actual socket.

<br>

#### `.id`

Unique id for actual connection. Same as in `Socket.connections<id>`. Can be used for `Socket.send(id, event, data)`.

<br>

#### `.instance`

Instance from the initial socket from `socket.io`.

<br>

#### `.namespace`

Reference to the namespace the actual socket comes from.

<br>

#### `.server`

Reference to the server the actual socket comes from.

<br>

### Socket Namespace

Returned by `Socket.create`.

```javascript
const indexNamespace = socket.create("/").listen();
const adminNamespace = socket.create("/admin").use(authMiddleware).listen();

indexNamespace.on("event", (data, socket) => {
  // accessible for all users
});

adminNamespace.on("event", (data, socket) => {
  // accessible for authenticated users
});
```

<br>

#### `.on(event, callback)`

Registers a `callback` for `event` for the actual namespace. Events registered with this method are local. This means that those events will not be intercepted by `Socket.on`.

<br>

#### `.broadcast(event [, data = {}])`

Emits an `event` with `data` to everyone in the actual namespace.

<br>

#### `.use(middleware)`

Adds a custom middleware to the actual namespace.

<br>

#### `.listen()`

Registers customs event listeners for the actual namespace. Integrates the actual namespace with socket server. You probably want to always call this method once you've configured your namespace.

<br>

#### `.id`

Unique id (name) for the actual namespace.

<br>

#### `.instance`

Instance of the initial room from `socket.io`.

<br>

#### `.server`

Reference to the server the actual namespace comes from.

<br>

## Contributing

### Bug reporting

[![Github Open Issues](https://img.shields.io/github/issues-raw/ProjectInra/inra-server.svg)](https://github.com/ProjectInra/inra-server/issues)
[![Github Closed Issues](https://img.shields.io/github/issues-closed-raw/ProjectInra/inra-server.svg)](https://github.com/ProjectInra/inra-server/issues?q=is%3Aissue+is%3Aclosed)
[![Github Pull Requests](https://img.shields.io/github/issues-pr-raw/ProjectInra/inra-server.svg)](https://github.com/ProjectInra/inra-server/pulls)

**We want contributing to Inra Server to be fun, enjoyable, and educational for anyone, and everyone.** Changes and improvements are more than welcome! Feel free to fork and open a pull request. If you have found any issues, please [report them here](https://github.com/ProjectInra/inra-server/issues/new) - they are being tracked on [GitHub Issues](https://github.com/ProjectInra/inra-server/issues).

### License

Inra Server is built and maintained by [Bartosz Łaniewski](https://github.com/Bartozzz). The full list of contributors can be found [here](https://github.com/ProjectInra/inra-server/graphs/contributors). Inra's code is [MIT licensed](https://github.com/ProjectInra/inra-server/blob/master/LICENSE).

### Development

We have prepared multiple commands to help you develop `inra-server-socket` on your own. Don't forget to install all `Node.js` dependencies from [npm](https://www.npmjs.com/). You will need a local copy of [Node.js](https://nodejs.org/en/) installed on your machine.

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
| `build`       | Builds `inra-server-socket`                       |
| `watch`       | Re-builds `inra-server-socket` on changes         |
| `clean`       | Deletes builds ands cache                         |
| `lint`        | Fixes Lint errors                                 |
| `flow`        | Checks Flow errors                                |
| `test`        | Checks Flow errors and runs tests                 |
