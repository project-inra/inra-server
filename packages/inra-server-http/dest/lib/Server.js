"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inraServerContainer = require("inra-server-container");

var _inraServerContainer2 = _interopRequireDefault(_inraServerContainer);

var _Middleware = require("./Middleware");

var _Router = require("./Router");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wrapper for common Node.js frameworks. Creates micro applications which are
 * suitable for small applications that will have very low overhead. Such apps
 * are for instance websites, documentations, APIs, prototypes etc.
 *
 * It creates a HTTP(S) server on a given port, populates it with specified
 * resources (routes, middlewares, …). This class aims to be a better, more
 * expressive, and more robust foundation for web applications and APIs.
 */

class App {

  /**
   * Return Proxy which defines custom global getters and setters for App class.
   * It allows us to reflect all custom properties to dependency injector which
   * keeps fundamental object safe and immutable. Gives another layer of
   * abstraction for data.
   *
   * @param   {ConfigInterface}   config
   * @return  {Proxy<App>}
   */


  /**
   * Object containing all registered and already initialised middlewares. Each
   * middleware should be a class. Methods are executed in the order below:
   * 1. `async create(application);`
   * 2. `async before(ctx, next, ...rest);`
   * 3. `async handle(ctx, next, ...rest);`
   * 4. `async after(ctx, next, ...rest);`
   *
   * @type    {Object}
   * @access  public
   * @readonly
   */
  constructor(config) {
    this.di = new _inraServerContainer2.default();

    this.config = config;

    return new Proxy(this, {
      set(target, prop, value) {
        target.di[prop] = value;
        return true;
      },

      get(target, prop) {
        return target[prop] || target.di[prop];
      }
    });
  }

  /**
   * Container used as a linked list for storing custom application data such as
   * models, configurations etc.
   *
   * @type    {Container}
   * @access  public
   * @readonly
   */


  setEngine(engine) {
    this.engine = engine;
  }

  setRouter(router) {
    this.router = router;
  }

  /**
   * Imports, initialises and saves a given resource. Each resource is handled
   * by it individual handler. Resources are recognized based on their name, so
   * a `*Middleware` will be interpreted as a middleware and a `*Router` will be
   * interpreted as a router.
   *
   * @param   {string}    path  Path to the resource
   * @return  {Function}        Initialised resource
   * @return  {any}
   */
  import(path) {
    const object = require(path);

    if (object.name.includes("Middleware")) {
      return this._handleMiddleware(object);
    }

    if (object.name.includes("Router")) {
      return this._handleRouter(object);
    }

    throw new Error(`No handler defined for ${object.name}`);
  }

  _handleMiddleware(object) {
    const resource = (0, _Middleware.handleMiddleware)(object, this);

    // Save middleware callback for further usage:
    this.middlewares[resource.name] = resource.func;

    return resource;
  }

  _handleRouter(object) {
    if (!this.router) {
      throw new Error("Router engine not specified");
    }

    (0, _Router.handleRouter)(object, this);
  }

  /**
   * Listens on a given port.
   *
   * @param   {number}    port
   * @param   {Function}  callback
   * @return  {void}
   */
  run(port = this.config.port, callback) {
    if (!this.engine) {
      throw new Error("Server engine not specified");
    }

    this.engine.listen(port, callback);
  }
}
exports.default = App;
module.exports = exports["default"];