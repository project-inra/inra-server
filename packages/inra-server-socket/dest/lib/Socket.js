"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require("socket.io");

var _socket2 = _interopRequireDefault(_socket);

var _SocketNamespace = require("./SocketNamespace");

var _SocketNamespace2 = _interopRequireDefault(_SocketNamespace);

var _SocketConnection = require("./SocketConnection");

var _SocketConnection2 = _interopRequireDefault(_SocketConnection);

var _EmittableInterface = require("./interfaces/EmittableInterface");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Socket {

  /**
   * Creates a new socket server with custom configuration.
   *
   * @param   {Object}    config
   * @param   {number}    config.port
   * @param   {string}    config.host
   */


  /**
   * Registered callbacks.
   *
   * @type    {Object}
   */

  /**
   * `socket.io` instance.
   *
   * @type    {Object}
   */
  constructor(config = {}) {
    this.io = (0, _socket2.default)();
    this.config = {};
    this.callbacks = {};
    this.connections = {};

    this.config = config;

    // Listen:
    this.io.listen(this.port);
  }

  /**
   * Emits an `event` with `data` for a specific connection.
   *
   * @param   {string}    id
   * @param   {string}    event
   * @param   {Object}    data
   * @return  {void}
   */


  /**
   * Registered connections.
   *
   * @type    {Object}
   */


  /**
   * Socket server configuration.
   *
   * @type    {Object}
   */
  send(id, event, data = {}) {
    if (id in this.connections) {
      this.connections[id].emit(event, data);
    }
  }

  /**
   * Emits an `event` with `data` for every connection in every namespace
   * registered.
   *
   * @param   {string}    event
   * @param   {Object}    data
   * @return  {void}
   */
  emit(event, data = {}) {
    this.io.emit(event, data);
  }

  /**
   * Emits an `event` with `data` for every connection in every namespace
   * registered.
   *
   * @param   {string}    event
   * @param   {Object}    data
   * @return  {void}
   */
  broadcast(event, data = {}) {
    this.io.emit(event, data);
  }

  /**
   * Registers a `callback` for a specific `event` coming from all the
   * registered namespaces.
   *
   * @param   {string}    event
   * @param   {Function}  callback
   * @return  {void}
   */
  on(event, callback) {
    if (!(event in this.callbacks)) {
      this.callbacks[event] = [];
    }

    this.callbacks[event].push(callback);
  }

  /**
   * Creates a new room with id `room`. Automically resolves new connections
   * and events. Returns the created room.
   *
   * @param   {string}    room
   * @return  {Object}
   */
  create(room) {
    const namespace = new _SocketNamespace2.default(room, this);

    namespace.on("connect", socket => {
      this.addConnection(socket, namespace);
    });

    namespace.on("disconnect", socket => {
      this.removeConnection(socket);
    });

    namespace.on("event", (event, data, socket, namespace) => {
      this.trigger(event, data, socket, namespace);
    });

    return namespace;
  }

  /**
   * Triggers a specific `event` with `data`, `connection` and `namespace`.
   *
   * @param   {string}    event
   * @param   {Object}    data
   * @param   {Object}    connection
   * @param   {Object}    namespace
   * @return  {void}
   */
  trigger(event, data, connection, namespace) {
    if (event in this.callbacks) {
      for (const callback of this.callbacks[event]) {
        callback(data, connection, namespace);
      }
    }
  }

  /**
   * Registers a connection and returns it.
   *
   * @param   {Object}    socket
   * @param   {Object}    namespace
   * @return  {SocketConnection}
   */
  addConnection(socket, namespace) {
    const connection = new _SocketConnection2.default(socket, namespace, this);

    this.connections[socket.id] = connection;

    return connection;
  }

  /**
   * Removes the connection corresponding to `socket`.
   *
   * @param   {Object}  socket
   * @return  {void}
   */
  removeConnection(socket) {
    delete this.connections[socket.id];
  }

  get port() {
    return this.config.port || 8082;
  }

  get hostname() {
    return this.config.host || "localhost";
  }

  get host() {
    return `ws://${this.hostname}:${this.port}`;
  }
}

exports.default = Socket;
module.exports = exports["default"];