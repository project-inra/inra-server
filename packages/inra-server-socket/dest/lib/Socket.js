"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _socket = require("socket.io");

var _socket2 = _interopRequireDefault(_socket);

var _SocketNamespace = require("./SocketNamespace");

var _SocketNamespace2 = _interopRequireDefault(_SocketNamespace);

var _SocketConnection = require("./SocketConnection");

var _SocketConnection2 = _interopRequireDefault(_SocketConnection);

var _EmittableInterface = require("./interfaces/EmittableInterface");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Socket = function () {

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
  function Socket() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Socket);

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


  _createClass(Socket, [{
    key: "send",
    value: function send(id, event) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

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

  }, {
    key: "emit",
    value: function emit(event) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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

  }, {
    key: "broadcast",
    value: function broadcast(event) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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

  }, {
    key: "on",
    value: function on(event, callback) {
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

  }, {
    key: "create",
    value: function create(room) {
      var _this = this;

      var namespace = new _SocketNamespace2.default(room, this);

      namespace.on("connect", function (socket) {
        _this.addConnection(socket, namespace);
      });

      namespace.on("disconnect", function (socket) {
        _this.removeConnection(socket);
      });

      namespace.on("event", function (event, data, socket, namespace) {
        _this.trigger(event, data, socket, namespace);
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

  }, {
    key: "trigger",
    value: function trigger(event, data, connection, namespace) {
      if (event in this.callbacks) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.callbacks[event][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var callback = _step.value;

            callback(data, connection, namespace);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
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

  }, {
    key: "addConnection",
    value: function addConnection(socket, namespace) {
      var connection = new _SocketConnection2.default(socket, namespace, this);

      this.connections[socket.id] = connection;

      return connection;
    }

    /**
     * Removes the connection corresponding to `socket`.
     *
     * @param   {Object}  socket
     * @return  {void}
     */

  }, {
    key: "removeConnection",
    value: function removeConnection(socket) {
      delete this.connections[socket.id];
    }
  }, {
    key: "port",
    get: function get() {
      return this.config.port || 8082;
    }
  }, {
    key: "hostname",
    get: function get() {
      return this.config.host || "localhost";
    }
  }, {
    key: "host",
    get: function get() {
      return "ws://" + this.hostname + ":" + this.port;
    }
  }]);

  return Socket;
}();

exports.default = Socket;
module.exports = exports["default"];