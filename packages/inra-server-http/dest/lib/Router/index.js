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
  const [path, middlewares] = prepareArguments(args);

  return function (target, name) {
    target[`${prefix}${name}`] = { verb, path, middlewares };
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
    const { verb, path, middlewares } = Route.prototype[prop];
    const methodName = prop.substring(prefix.length);
    const methodFunc = Router[methodName].bind(Router);
    const middleware = middlewares.bind(server.middlewares);

    // @example router.get("/", middleware, callback);
    // @example router.post("/", middleware, callback);
    server.router[verb](path, middleware(server), methodFunc);
  });
}