"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EmittableInterface = require("./interfaces/EmittableInterface");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocketConnection = function () {

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
  function SocketConnection(socket, namespace, server) {
    _classCallCheck(this, SocketConnection);

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


  _createClass(SocketConnection, [{
    key: "on",
    value: function on(event, callback) {
      this.instance.on(event, callback);
    }

    /**
     * Emits an `event` with `data` from the actual socket.
     *
     * @param   {string}    event
     * @param   {object}    data
     * @return  {void}
     */

  }, {
    key: "emit",
    value: function emit(event) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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

  }, {
    key: "broadcast",
    value: function broadcast(event) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.instance.broadcast.emit(event, data);
    }
  }]);

  return SocketConnection;
}();

exports.default = SocketConnection;
module.exports = exports["default"];