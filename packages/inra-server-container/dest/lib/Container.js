"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ContainerInterface = require("./ContainerInterface");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
    function ExtendableBuiltin() {
        var instance = Reflect.construct(cls, Array.from(arguments));
        Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
        return instance;
    }

    ExtendableBuiltin.prototype = Object.create(cls.prototype, {
        constructor: {
            value: cls,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(ExtendableBuiltin, cls);
    } else {
        ExtendableBuiltin.__proto__ = cls;
    }

    return ExtendableBuiltin;
}

/**
 * The container is a component that implements Service Location of services and
 * it's itself a container for them. Since the server is highly decoupled, it is
 * essential to integrate different components. The developer can also use this
 * component to inject dependencies and manage global instances of the different
 * classes used in the application.
 *
 * Basically, this component implements the "Inversion of Control" pattern: the
 * objects do not receive their dependencies using setters or constructors, but
 * requesting a service dependency injector. This reduces the overall complexity
 * since there is only one way to get the required dependencies within a
 * component. Additionally, this pattern increases testability in the code, thus
 * making it less prone to errors.
 *
 * @todo We should make it more like a dependency-inector, pheraps with
 *       dependency resolving etc.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 * @see https://docs.microsoft.com/en-us/scripting/javascript/reference/map-object-javascript
 * @see https://en.wikipedia.org/wiki/Inversion_of_control
 */

var Container = function (_extendableBuiltin2) {
    _inherits(Container, _extendableBuiltin2);

    function Container() {
        _classCallCheck(this, Container);

        return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).apply(this, arguments));
    }

    _createClass(Container, [{
        key: "get",
        value: function get(key, defaultValue) {
            return _get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), "get", this).call(this, key) || defaultValue;
        }
    }]);

    return Container;
}(_extendableBuiltin(Map));

exports.default = Container;
module.exports = exports["default"];