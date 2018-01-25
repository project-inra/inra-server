"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.route = route;
exports.prepareArguments = prepareArguments;
exports.handleRouter = handleRouter;


// Prefix used to create new methods to prevent overrides:
const prefix = "__route_";

// List of allowed HTTP verbs:


const verbs = ["all", "get", "put", "del", "post", "head", "patch", "delete", "options"];

/**
 * Route decorators:
 *
 * @example
 *    @route(method, path, app => compose(...middlewares))
 *    @all(path, app => compose(...middlewares))
 *    @get(path, app => compose(...middlewares))
 *    @put(path, app => compose(...middlewares))
 *    @del(path, app => compose(...middlewares))
 *    @post(path, app => compose(...middlewares))
 *    @head(path, app => compose(...middlewares))
 *    @patch(path, app => compose(...middlewares))
 *    @delete(path, app => compose(...middlewares))
 *    @options(path, app => compose(...middlewares))
 *
 * @param   {string}      verb
 * @param   {Array<any>}  args
 * @return  {Function}
 */
function route(verb, ...args) {
  const [path, middleware] = prepareArguments(args);

  return function (target, name) {
    target[`${prefix}${name}`] = { verb, path, middleware };
  };
}

// Create prebuilt decorators for standard verbs:
// @[verb](path, ...middleware)
verbs.forEach(verb => {
  exports[verb] = route.bind(null, verb);
});

/**
 * Parse arguments and return path and middlewares.
 *
 * @param   {Array<any>}  args
 * @return  {Array<any>}
 */
function prepareArguments(args) {
  const path = typeof args[0] === "string" ? args[0] : "";
  const midd = typeof args[1] === "function" ? args[1] : null;

  return [path, midd];
}

/**
 * Populate server router with additional routes from `Route`.
 *
 * @param   {Class<RouterInterface>}  Route     Routes class
 * @param   {Object}                  server    Server instance
 * @return  {void}
 */
function handleRouter(Route, server) {
  const Router = new Route(server);

  Object.getOwnPropertyNames(Route.prototype).filter(prop => prop.indexOf(prefix) === 0).map(prop => {
    const { verb, path, middleware } = Route.prototype[prop];
    const methodName = prop.substring(prefix.length);
    const methodFunc = Router[methodName].bind(Router);

    // @example router.get("/"[, middleware], callback);
    // @example router.post("/"[, middleware], callback);
    if (middleware) {
      const composer = middleware.bind(server.middlewares);
      server.router[verb](path, composer(server), methodFunc);
    } else {
      server.router[verb](path, methodFunc);
    }
  });
}