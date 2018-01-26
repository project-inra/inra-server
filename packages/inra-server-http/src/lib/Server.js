// @flow
import Container from "inra-server-container";
import {handleRouter, RouterInterface} from "./Router";
import {handleMiddleware, MiddlewareInterface} from "./Middleware";

export interface ConfigInterface {
  port: number;
}

export interface EngineInterface {
  use: (middleware: Function) => void;
  listen: (port: number, callback?: Function) => void;
}

/**
 * Wrapper for common Node.js frameworks. Creates micro applications which are
 * suitable for small applications that will have very low overhead. Such apps
 * are for instance websites, documentations, APIs, prototypes etc. It creates
 * a HTTP(S) server on a given port, populates it with specified resources.
 *
 * This class aims to be a better, more expressive, and more robust foundation
 * for web applications and APIs.
 *
 * Each App instance is a Proxy which defines custom behaviors for fundamental
 * operations such as "magic" setters and getters:
 *  • Setters are used to prevent developers from overriding server internals.
 *    Additionally, custom-defined properties will be added to an internal Map
 *    object which serves as Service Location of services and it's itself a
 *    container for them.
 *  • Getters retrieve those properties from the Map by key, if such key doesn't
 *    exist in server instance.
 */

export default class App {
  engine: EngineInterface;
  router: RouterInterface;
  config: ConfigInterface = {
    port: 8000,
  };

  /**
   * Object containing all registered and already initialised middlewares. Each
   * middleware should be a class. Methods are executed in the order below:
   * 1. `async create(application);`
   * 2. `async before(ctx, next, ...rest);`
   * 3. `async handle(ctx, next, ...rest);`
   * 4. `async after(ctx, next, ...rest);`
   *
   * @type   {Object}
   * @access public
   * @readonly
   */
  +middlewares: { [string]: MiddlewareInterface } = {};

  /**
   * User-defined handlers for resources imported by `.import`. Object keys must
   * match resource name (ex. `Resource` will match `UserDefinedResource`). Once
   * matched, the resource is handled by corresponding handler.
   *
   * @type   {Object}
   * @access private
   * @readonly
   */
  +handlers: { [string]: Function } = {};

  /**
   * Container used as a linked list for storing custom application data such as
   * models, configurations etc.
   *
   * @type   {Container}
   * @access public
   * @readonly
   */
  +di: Container = new Container();

  /**
   * Returns a Proxy instance which defines magic global getters and setters for
   * Server class. It allows us to reflect all custom properties to a dependency
   * injector which keeps fundamental object safe and immutable. Gives another
   * layer of abstraction for data.
   *
   * @param  {ConfigInterface}   config
   * @return {Proxy<App>}
   */
  constructor(config: ConfigInterface): any {
    this.config = config;

    return new Proxy(this, {
      set(target: Object, key: string, value: any): boolean {
        target.di[key] = value;

        // Indicate success:
        return true;
      },

      get(target: Object, key: string): any {
        return target[key] || target.di[key];
      },
    });
  }

  /**
   * Sets engine for our server. Each engine must implement methods described in
   * `EngineInterface`.
   *
   * @param  {EngineInterface}   engine
   * @return {this}
   * @access public
   */
  setEngine(engine: EngineInterface): this {
    if (this.engine) {
      throw new Error("Cannot override engine");
    }

    this.engine = engine;

    return this;
  }

  /**
   * Sets router for our server. Each router must implement methods described in
   * RouterInterface.
   *
   * @param  {RouterInterface}   router
   * @return {this}
   * @access public
   */
  setRouter(router: RouterInterface): this {
    if (this.router) {
      throw new Error("Cannot override router");
    }

    this.router = router;

    return this;
  }

  /**
   * Adds a handler for our server. A handler is describes by its name which is
   * used to identify specific kind of files and a callback which handles those
   * files.
   *
   * @param  {string}     name
   * @param  {Function}   handler
   * @return {void}
   * @access public
   */
  addHandler(name: string, handler: Function): any {
    this.handlers[name] = handler;
  }

  /**
   * Imports, initialises and saves a given resource. Each resource is handled
   * by it individual handler. Resources are recognized based on their name, so
   * a `*Middleware` will be interpreted as a middleware and a `*Router` will be
   * interpreted as a router.
   *
   * @param  {string}    path  Path to the resource
   * @return {any}
   */
  import(path: string): any {
    try {
      const object: {
        name: string,
      } = require(path);

      for (const name in this.handlers) {
        if (object.name.includes(name)) {
          return this.handlers[name](object, this);
        }
      }

      if (this.handlers.default) {
        return this.handlers.default(object, this);
      }

      throw new Error(`No handler defined for "${object.name}"`);
    } catch (error) {
      throw new Error(`Could not load file "${path}"`);
    }
  }

  /**
   * Mounts the specified middleware function or functions.
   *
   * @param  {Function}  middleware
   * @return {this}
   * @access public
   */
  use(middleware: Function): this {
    if (!this.engine) {
      throw new Error("Server engine not specified");
    }

    this.engine.use(middleware);

    return this;
  }

  /**
   * Listens on a given port.
   *
   * @param  {number}    port
   * @param  {Function}  callback
   * @return {this}
   * @access public
   */
  run(port: number = this.config.port, callback: Function): this {
    if (!this.engine) {
      throw new Error("Server engine not specified");
    }

    this.engine.listen(port, callback);

    return this;
  }

  /**
   * Basic handler for middlewares.
   *
   * @param  {Class<MiddlewareInterface>}   Item      Middleware class
   * @param  {App}                          server    Server instance
   * @return {Object}
   * @access public
   * @static
   */
  static middlewareHandler(
    Item: Class<MiddlewareInterface>,
    server: App
  ): Function {
    const resource: Object = handleMiddleware(Item, server);

    // Save middleware callback for further usage:
    server.middlewares[resource.name] = resource.func;

    return resource.func;
  }

  /**
   * Basic handler for routes.
   *
   * @param  {Class<RouterInterface>}   Item      Router class
   * @param  {App}                      server    Server instance
   * @return {void}
   * @access public
   * @static
   */
  static routerHandler(Item: Class<RouterInterface>, server: App): void {
    if (!server.router) {
      throw new Error("Router engine not specified");
    }

    handleRouter(Item, server);
  }

  /**
   * Basic handler for other files.
   *
   * @param  {Class<*>}   Item      Class to handle
   * @param  {App}        server    Server instance
   * @return {any}
   * @access public
   * @static
   */
  static defaultHandler(Item: Class<*>, server: App): boolean {
    return new Item(server);
  }
}
