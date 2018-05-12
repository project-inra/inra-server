"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EmittableInterface = require("./interfaces/EmittableInterface");

class SocketConnection {

  /**
   * Creates a new socket connection.
   *
   * @param   {Object}    socket
   * @param   {Object}    namespace
   * @param   {Object}    server
   */


  /**
   * Reference to the namespace the actual socket comes from.
   *
   * @type    {Object}
   */

  /**
   * Unique id for actual connection.
   *
   * @type    {string}
   */
  constructor(socket, namespace, server) {
    this.namespace = namespace;
    this.instance = socket;
    this.server = server;

    // Grab id from the original socket:
    this.id = socket.id;
  }

  /**
   * Executes `callback` on `event` from the actual socket.
   *
   * @param   {string}    event
   * @param   {Function}  callback
   * @return  {void}
   */


  /**
   * Reference to the server the actual socket comes from.
   *
   * @type    {Object}
   */


  /**
   * Instance from the initial socket from `socket.io`.
   *
   * @type    {Object}
   */
  on(event, callback) {
    this.instance.on(event, callback);
  }

  /**
   * Emits an `event` with `data` from the actual socket.
   *
   * @param   {string}    event
   * @param   {object}    data
   * @return  {void}
   */
  emit(event, data = {}) {
    this.instance.emit(event, data);
  }

  /**
   * Emits an `event` with `data` to everyone else in the namespace except for
   * the actual socket.
   *
   * @param   {string}    event
   * @param   {object}    data
   * @return  {void}
   */
  broadcast(event, data = {}) {
    this.instance.broadcast.emit(event, data);
  }

  disconnect() {
    this.instance.disconnect(true);
    // this.instance.destroy();
  }
}

exports.default = SocketConnection;
module.exports = exports["default"];