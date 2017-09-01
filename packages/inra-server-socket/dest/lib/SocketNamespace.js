"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _EmittableInterface = require("./interfaces/EmittableInterface");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SocketNamespace = function (_EventEmitter) {
    _inherits(SocketNamespace, _EventEmitter);

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
    function SocketNamespace(id, server) {
        _classCallCheck(this, SocketNamespace);

        var _this = _possibleConstructorReturn(this, (SocketNamespace.__proto__ || Object.getPrototypeOf(SocketNamespace)).call(this));

        _this.id = id;
        _this.server = server;
        _this.instance = server.io.of(id);
        return _this;
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


    _createClass(SocketNamespace, [{
        key: "broadcast",
        value: function broadcast(event) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this.instance.broadcast.emit(event, data);
        }

        /**
         * Adds a custom middleware to the actual namespace.
         *
         * @param   {Function}  middleware
         * @return  {this}
         */

    }, {
        key: "use",
        value: function use(middleware) {
            this.instance.use(middleware);

            return this;
        }

        /**
         * Registers customs event listeners for the actual namespace.
         *
         * @return  {this}
         */

    }, {
        key: "listen",
        value: function listen() {
            var _this2 = this;

            this.instance.on("connection", function (socket) {
                _this2.emit("connect", socket);

                socket.on("event", function (data) {
                    _this2.emit("event", data.action, data, socket, _this2);
                });

                socket.on("disconnect", function () {
                    _this2.emit("disconnect", socket);
                });

                // Register namespace-specific events:
                _this2.eventNames().forEach(function (event) {
                    socket.on(event, function (data) {
                        _this2.emit(event, data);
                    });
                });
            });

            return this;
        }
    }]);

    return SocketNamespace;
}(_events2.default);

exports.default = SocketNamespace;
module.exports = exports["default"];