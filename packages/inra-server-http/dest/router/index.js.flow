// @flow
import App from "../";

export type RouterPath = string;
export type RouterVerb = $Keys<typeof verbs>;
type RouterTemp = {verb: RouterVerb, path: RouterPath, middleware: ?Function};

export interface RouterInterface {
  constructor(app: App<*>): void;
  all: (path: RouterPath, callback: Function) => any;
  get: (path: RouterPath, callback: Function) => any;
  put: (path: RouterPath, callback: Function) => any;
  del: (path: RouterPath, callback: Function) => any;
  post: (path: RouterPath, callback: Function) => any;
  head: (path: RouterPath, callback: Function) => any;
  patch: (path: RouterPath, callback: Function) => any;
  delete: (path: RouterPath, callback: Function) => any;
  options: (path: RouterPath, callback: Function) => any;
}

// Prefix used to create new methods to prevent overrides:
const prefix: string = "__route_";
const verbs = Object.freeze({
  all: Symbol("all"),
  get: Symbol("get"),
  put: Symbol("put"),
  del: Symbol("del"),
  post: Symbol("post"),
  head: Symbol("head"),
  patch: Symbol("patch"),
  delete: Symbol("delete"),
  options: Symbol("options"),
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
export function route(
  verb: RouterVerb,
  path: RouterPath,
  middleware: ?Function
): * {
  return function(target: Object, name: string) {
    target[`${prefix}${name}`] = {verb, path, middleware};
  };
}

// Create prebuilt decorators for standard verbs:
// @[verb](path, ...middleware)
Object.keys(verbs).forEach((verb) => {
  exports[verb] = route.bind(null, verb);
});

/**
 * Controller decorator.
 *
 * @return  {Function}
 * @access  public
 */
export default function controller(base: RouterPath = "/"): * {
  return (Route: Class<any>) => (server: App<*>) => {
    const router: Object = new Route(server);

    Object.getOwnPropertyNames(Route.prototype)
      .filter((prop) => prop.indexOf(prefix) === 0)
      .map((prop) => {
        const {verb, path, middleware}: RouterTemp = Route.prototype[prop];
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
function normalizePath(path: RouterPath): RouterPath {
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
function joinPaths(...paths: Array<RouterPath>): RouterPath {
  const fullPath = paths
    .map((path) => normalizePath(path))
    .filter((path) => path)
    .join("/");

  return `/${fullPath}`;
}
