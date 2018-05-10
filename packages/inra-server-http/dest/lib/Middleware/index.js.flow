// @flow

export interface MiddlewareInterface {
  constructor(app: Object): void;
  create(app: Object): any;
  before(...params: Array<any>): any;
  handle(...params: Array<any>): any;
  after(...params: Array<any>): any;
}

/**
 * Remove "Middleware" from class name.
 *
 * @param   {string}    name
 * @return  {string}
 */
export function handleName(name: string): string {
  return name.replace("Middleware", "");
}

/**
 * Creates a universal middleware which adapts to all popular Node.js frameworks
 * such as Koa.js/Express.js. Middleware methods are executed asynchronously in
 * order below:
 *
 * • For Koa:
 *    1. `async create(application);`
 *    2. `async before(ctx, next, ...rest);`
 *    3. `async handle(ctx, next, ...rest);`
 *    4. `async after(ctx, next, ...rest);`
 *
 * • For Express:
 *    1. `async create(application);`
 *    2. `async before(req, res, ...rest);`
 *    3. `async handle(req, res, ...rest);`
 *    4. `async after(req, res, ...rest);`
 *
 * @param  {Object}   instance    Middleware instance
 * @param  {Object}   server      Server instance
 * @return {Function}
 */
export function handleCallback(
  instance: MiddlewareInterface,
  server: Object
): Function {
  return (...params) => async (a, b) => {
    // @note in Koa     : a = ctx, b = next
    // @note in Express : a = req, b = res

    if (instance.create) await instance.create(server);
    if (instance.before) await instance.before(a, b, ...params);
    if (instance.handle) await instance.handle(a, b, ...params);
    if (instance.after) await instance.after(a, b, ...params);
  };
}

/**
 * Normalize Middleware name and create a valid callback.
 *
 * @param   {MiddlewareInterface}   Middleware    Middleware class
 * @param   {Object}                server        Server instance
 * @return  {{name: string, func: Function}}
 */
export function handleMiddleware(
  Middleware: Class<MiddlewareInterface>,
  server: Object
): Object {
  const instance: MiddlewareInterface = new Middleware(server);

  return {
    name: handleName(Middleware.name),
    func: handleCallback(instance, server),
  };
}
