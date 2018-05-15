"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.route = route;
exports.default = controller;

var _ = require("../");

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Prefix used to create new methods to prevent overrides:
const prefix = "__route_";

const verbs = Object.freeze({
  all: Symbol("all"),
  get: Symbol("get"),
  put: Symbol("put"),
  del: Symbol("del"),
  post: Symbol("post"),
  head: Symbol("head"),
  patch: Symbol("patch"),
  delete: Symbol("delete"),
  options: Symbol("options")
});

/**
 * Route decorator.
 *
 * @param   {RouterVerb}  verb
 * @param   {RouterPath}  path
 * @param   {?Function}   middleware
 * @return  {Function}
 * @access  public
 */
function route(verb, path, middleware) {
  return function (target, name) {
    target[`${prefix}${name}`] = { verb, path, middleware };
  };
}

// Create prebuilt decorators for standard verbs:
// @[verb](path, ...middleware)
Object.keys(verbs).forEach(verb => {
  exports[verb] = route.bind(null, verb);
});

/**
 * Controller decorator.
 *
 * @return  {Function}
 * @access  public
 */
function controller(base = "/") {
  return Route => server => {
    const router = new Route(server);

    Object.getOwnPropertyNames(Route.prototype).filter(prop => prop.indexOf(prefix) === 0).map(prop => {
      const { verb, path, middleware } = Route.prototype[prop];
      const methodName = prop.substring(prefix.length);
      const methodFunc = router[methodName].bind(router);
      const fullPath = joinPaths(base, path);

      // @example router.get("/"[, middleware], callback);
      // @example router.post("/"[, middleware], callback);
      if (typeof middleware === "function") {
        const composer = middleware.bind(server.middlewares);

        // $FlowFixMe
        server.router[verb](fullPath, composer(server), methodFunc);
      } else {
        // $FlowFixMe
        server.router[verb](fullPath, methodFunc);
      }
    });
  };
}

/**
 * Removes trailing spaces and slashes from a path.
 *
 * @param   {RouterPath}  path
 * @return  {RouterPath}
 */
function normalizePath(path) {
  let normalized = path.trim();

  if (normalized[0] === "/") {
    normalized = normalized.slice(1, normalized.length);
  }

  if (normalized[normalized.length - 1] === "/") {
    normalized = normalized.slice(0, normalized.length - 1);
  }

  return normalized;
}

/**
 * Joins paths together and adds necessary slashes.
 *
 * @param   {Array<RouterPath>} paths
 * @return  {RouterPath}
 */
function joinPaths(...paths) {
  const fullPath = paths.map(path => normalizePath(path)).filter(path => path).join("/");

  return `/${fullPath}`;
}