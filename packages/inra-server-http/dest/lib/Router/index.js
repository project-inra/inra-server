"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.route = route;
exports.parseArguments = parseArguments;
exports.handleRouter = handleRouter;


// Prefix used to create new methods to prevent overrides:
const prefix = "__route_";

// List of allowed HTTP verbs:


const verbs = ["all", "get", "put", "del", "post", "head", "patch", "delete", "options"];

/**
 * Route decorator:
 *
 * @example
 *    @route(method, path, ...middleware)
 *    @all(path, ...middleware)
 *    @get(path, ...middleware)
 *    @put(path, ...middleware)
 *    @del(path, ...middleware)
 *    @post(path, ...middleware)
 *    @head(path, ...middleware)
 *    @patch(path, ...middleware)
 *    @delete(path, ...middleware)
 *    @options(path, ...middleware)
 *
 * @param   {string}      verb
 * @param   {Array<any>}  args
 * @return  {Function}
 */
function route(verb, ...args) {
  const [url, middleware] = parseArguments(args);

  return function (target, name) {
    target[`${prefix}${name}`] = { verb, url, middleware };
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
function parseArguments(args) {
  const hasPath = typeof args[0] === "string";
  const path = hasPath ? args[0] : "";
  const mids = hasPath ? args.slice(1) : args;

  if (mids.some(middleware => typeof middleware !== "function")) {
    throw new Error("Middleware must be function");
  }

  return [path, mids];
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
    const { verb, url, middleware } = Route.prototype[prop];
    const func = prop.substring(prefix.length);

    server.router[verb](url, ...middleware, Router[func].bind(Router));
  });
}