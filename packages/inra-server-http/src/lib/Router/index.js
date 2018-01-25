// @flow

export interface RouterInterface {
  constructor(app: Object): void;
  all: (path: string, callback: Function) => any;
  get: (path: string, callback: Function) => any;
  put: (path: string, callback: Function) => any;
  del: (path: string, callback: Function) => any;
  post: (path: string, callback: Function) => any;
  head: (path: string, callback: Function) => any;
  patch: (path: string, callback: Function) => any;
  delete: (path: string, callback: Function) => any;
  options: (path: string, callback: Function) => any;
}

// Prefix used to create new methods to prevent overrides:
const prefix: string = "__route_";

// List of allowed HTTP verbs:
const verbs: Array<string> = [
  "all",
  "get",
  "put",
  "del",
  "post",
  "head",
  "patch",
  "delete",
  "options",
];

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
export function route(verb: string, ...args: Array<any>): Function {
  const [path, middlewares] = prepareArguments(args);

  return function(target: Object, name: string) {
    target[`${prefix}${name}`] = {verb, path, middlewares};
  };
}

// Create prebuilt decorators for standard verbs:
// @[verb](path, ...middleware)
verbs.forEach((verb) => {
  exports[verb] = route.bind(null, verb);
});

/**
 * Parse arguments and return path and middlewares.
 *
 * @param   {Array<any>}  args
 * @return  {Array<any>}
 */
export function prepareArguments(args: Array<any>): Array<any> {
  const hasPath = typeof args[0] === "string";
  const path = hasPath ? args[0] : "";
  const mids = hasPath ? args.slice(1) : args;

  if (mids.some((middleware) => typeof middleware !== "function")) {
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
export function handleRouter(Route: Class<any>, server: Object): void {
  const Router: Object = new Route(server);

  Object.getOwnPropertyNames(Route.prototype)
    .filter((prop) => prop.indexOf(prefix) === 0)
    .map((prop) => {
      const {verb, path, middlewares} = Route.prototype[prop];
      const methodName = prop.substring(prefix.length);
      const methodFunc = Router[methodName].bind(Router);
      const middleware = middlewares.bind(server.middlewares);

      // @example router.get("/", middleware, callback);
      // @example router.post("/", middleware, callback);
      server.router[verb](path, middleware(server), methodFunc);
    });
}
