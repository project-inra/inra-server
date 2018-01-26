"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _EmittableInterface = require("./interfaces/EmittableInterface");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SocketNamespace extends _events2.default {

  /**
   * Creates a new namespace.
   *
   * @param   {string}    id
   * @param   {Object}    server
   */


  /**
   * Instance of the initial room from `socket.io`.
   *
   * @type    {Object}
   */
  constructor(id, server) {
    super();

    this.id = id;
    this.server = server;
    this.instance = server.io.of(id);
  }

  /**
   * Emits an `event` with `data` to everyone in the actual namespace.
   *
   * @param   {string}    event
   * @param   {object}    data
   * @return  {void}
   */


  /**
   * Reference to the server the actual namespace comes from.
   *
   * @type    {Object}
   */

  /**
   * Unique id for the actual namespace.
   *
   * @type    {string}
   */
  broadcast(event, data = {}) {
    this.instance.broadcast.emit(event, data);
  }

  /**
   * Adds a custom middleware to the actual namespace.
   *
   * @param   {Function}  middleware
   * @return  {this}
   */
  use(middleware) {
    this.instance.use(middleware);

    return this;
  }

  /**
   * Registers customs event listeners for the actual namespace.
   *
   * @return  {this}
   */
  listen() {
    this.instance.on("connection", socket => {
      this.emit("connect", socket);

      socket.on("event", data => {
        this.emit("event", data.action, data, socket, this);
      });

      socket.on("disconnect", () => {
        this.emit("disconnect", socket);
      });

      // Register namespace-specific events:
      this.eventNames().forEach(event => {
        socket.on(event, data => {
          this.emit(event, data);
        });
      });
    });

    return this;
  }
}

exports.default = SocketNamespace;
module.exports = exports["default"];