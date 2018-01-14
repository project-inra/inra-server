// @flow
import Container from "inra-server-container";
import {handleMiddleware, MiddlewareInterface} from "./Middleware";
import {handleRouter, RouterInterface} from "./Router";

export interface ConfigInterface {
  port: number;
}

export interface EngineInterface {
  listen: (port: number, callback?: Function) => any;
}

/**
 * Wrapper for common Node.js frameworks. Creates micro applications which are
 * suitable for small applications that will have very low overhead. Such apps
 * are for instance websites, documentations, APIs, prototypes etc.
 *
 * It creates a HTTP(S) server on a given port, populates it with specified
 * resources (routes, middlewares, …). This class aims to be a better, more
 * expressive, and more robust foundation for web applications and APIs.
 */

export default class App {
  config: ConfigInterface;

  engine: EngineInterface;

  router: RouterInterface;

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
  +middlewares: {[string]: MiddlewareInterface};

  /**
   * Container used as a linked list for storing custom application data such as
   * models, configurations etc.
   *
   * @type    {Container}
   * @access  public
   * @readonly
   */
  +di: Container = new Container();

  /**
   * Return Proxy which defines custom global getters and setters for App class.
   * It allows us to reflect all custom properties to dependency injector which
   * keeps fundamental object safe and immutable. Gives another layer of
   * abstraction for data.
   *
   * @param   {ConfigInterface}   config
   * @return  {Proxy<App>}
   */
  constructor(config: ConfigInterface): any {
    this.config = config;

    return new Proxy(this, {
      set(target: Object, prop: string, value: any): boolean {
        target.di[prop] = value;
        return true;
      },

      get(target: Object, prop: string): any {
        return target[prop] || target.di[prop];
      },
    });
  }

  setEngine(engine: EngineInterface): void {
    this.engine = engine;
  }

  setRouter(router: RouterInterface): void {
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
  import(path: string): any {
    const object: Object = require(path);

    if (object.name.includes("Middleware")) {
      return this._handleMiddleware(object);
    }

    if (object.name.includes("Router")) {
      return this._handleRouter(object);
    }

    throw new Error(`No handler defined for ${object.name}`);
  }

  _handleMiddleware(object: Class<MiddlewareInterface>): Object {
    const resource: Object = handleMiddleware(object, this);

    // Save middleware callback for further usage:
    this.middlewares[resource.name] = resource.func;

    return resource;
  }

  _handleRouter(object: Class<RouterInterface>): void {
    if (!this.router) {
      throw new Error("Router engine not specified");
    }

    handleRouter(object, this);
  }

  /**
   * Listens on a given port.
   *
   * @param   {number}    port
   * @param   {Function}  callback
   * @return  {void}
   */
  run(port: number = this.config.port, callback: Function): void {
    if (!this.engine) {
      throw new Error("Server engine not specified");
    }

    this.engine.listen(port, callback);
  }
}
