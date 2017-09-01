# inra-server-socket

The purpose of this component is to intercept the manipulation of most of the socket work by creating special wrappers. These wrappers allow the developer to integrate his client with `inra-server` rapidly, manipulate data, connections and/or namespaces.

## Installation

Using [npm](https://www.npmjs.com/):

```bash
$ npm install --save inra-server-socket
```

**Note:** This package provides the core routing functionality for Inra Server, but you might not want to install it directly. If you are writing an application that will run on Inra Server, you should instead install `inra-server`. It will install `inra-server-socket` as a dependency.

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
import Socket from "inra-server-socket";
```

## API

### class `Socket` implementing `EmmitableInterface`

```javascript
new Socket( {
    host : "localhost",
    port : 8082
} );
```

#### `.send( id, event [, data = {}] )`

Emits an `event` with `data` for a specific connection. This is usefull in event listeners on server-side, when you intercept specific events and want to send back a response for the given source.

**Example:**

```javascript
var socket = new Socket();

socket.on( "eventA", ( data, connection, namespace ) => {
    socket.send( connection.id, "eventB", ...data );
} );
```

#### public `.emit( event [, data = {}] )`

Emits an `event` with `data` for every connection in every namespace registered.

**Example:**

```javascript
socket.emit( "event", ...data );
```

#### public `.broadcast( event [, data = {}] )`

Emits an `event` with `data` for every connection in every namespace registered. Broadcast behaviour is the same as for `.emit` (in `Socket` only - it changes for `SocketNamespace` and `SocketConnection`).

**Example:**

```javascript
socket.broadcast( "event", ...data );
```

#### public `.on( event, callback )`

Registers a `callback` for a specific `event` coming from all the registered namespaces. This means that `event` will be intercepted even if it was registered only for a specific `SocketNamespace`.

**Note:** You can still register events which will be intercepted only by specified namespaces.

```javascript
socket.on( "event", ( data, connection, namespace ) => {
    // …
} );
```

#### public `.create( id )`

Creates a new room with id `room`. Automically resolves new connections and events. Returns the created room instance (`SocketNamespace`).

```javascript
const indexNamespace = socket.create( "/" ).listen();
const adminNamespace = socket.create( "/admin" ).use( authMiddleware ).listen();
```

#### public `.trigger( event, data, connection, namespace )`

Triggers a specific `event` with `data`, `connection` and `namespace`.

```javascript
socket.on( "event", ( data, connection, namespace ) => {
    if ( /* … */ ) {
        socket.trigger( "another_event", data, connection, namespace );
    }
} );
```

#### private `.addConnection( socket, namespace )`

Registers a connection and returns it.

#### private `.removeConnection( socket )`

Removes the connection corresponding to `socket`.

#### public `.io`

`socket.io` instance.

#### public `.host`
#### public `.port`
#### public `.hostname`
#### private `.config`
#### private `.callbacks`
#### private `.connections`

---

### class `SocketConnection` implementing `EmmitableInterface`

#### public `.on( event, callback )`

Executes `callback` on `event` from the actual socket.

#### public `.emit( event [, data = {} ] )`

Emits an `event` with `data` from the actual socket.

#### public `.broadcast( event [, data = {} ] )`

Emits an `event` with `data` to everyone else in the namespace except for the actual socket.

#### public `.id`

Unique id for actual connection. Same as in `Socket.connections<id>`. Can be used for `Socket.send( id, event, data )`.

#### public `.instance`

Instance from the initial socket from `socket.io`.

#### public `.namespace`

Reference to the namespace the actual socket comes from.

#### public `.server`

Reference to the server the actual socket comes from.


---

### class `SocketNamespace` implementing `EmmitableInterface`

Returned by `Socket.create`.

```javascript
const indexNamespace = socket.create( "/" ).listen();
const adminNamespace = socket.create( "/admin" ).use( authMiddleware ).listen();

indexNamespace.on( "event", ( data, socket ) => {
    // accessible for all users
} );

adminNamespace.on( "event", ( data, socket ) => {
    // accessible for authenticated users
} );
```

#### public `.on( event, callback )`

Registers a `callback` for `event` for the actual namespace. Events registered with this method are local. This means that those events will not be intercepted by `Socket.on`.

#### private `.emit( event [, data = {} ] )`

Used for internal usage. You should use `.broadcast` instead.

#### public `.broadcast( event [, data = {} ] )`

Emits an `event` with `data` to everyone in the actual namespace.

#### public `.use( middleware )`

Adds a custom middleware to the actual namespace.

#### public `.listen()`

Registers customs event listeners for the actual namespace. Integrates the actual namespace with socket server. You probably want to always call this method once you've configured your namespace.

#### public `.id`

Unique id (name) for the actual namespace.

#### public `.instance`

Instance of the initial room from `socket.io`.

#### public `.server`

Reference to the server the actual namespace comes from.

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
