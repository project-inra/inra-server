// @flow
import App from "../";

export type MiddlewareCallback = (
  ...params: Array<any>
) => (Function) => Promise<void> | void;

export type Middlewares = {[string]: MiddlewareCallback};

export interface MiddlewareInterface {
  constructor(app: App<*>): void;
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
function normalizeName(name: string): string {
  return name.replace("Middleware", "");
}

/**
 * Creates a universal middleware which adapts to all popular Node.js frameworks
 * such as Koa.js/Express.js. Middleware methods are executed asynchronously in
 * order below:
 *
 * • For Koa:
 *    1. `async before(ctx, next, ...rest);`
 *    2. `async handle(ctx, next, ...rest);`
 *    3. `async after(ctx, next, ...rest);`
 *
 * • For Express:
 *    1. `async before(req, res, ...rest);`
 *    2. `async handle(req, res, ...rest);`
 *    3. `async after(req, res, ...rest);`
 *
 * @param   {Object}    instance    Middleware instance
 * @return  {Function}
 */
function createCallback(instance: MiddlewareInterface): * {
  return (...params: Array<any>) => async (a: any, b: any) => {
    // @note in Koa     : a = ctx, b = next
    // @note in Express : a = req, b = res

    if (instance.before) await instance.before(a, b, ...params);
    if (instance.handle) await instance.handle(a, b, ...params);
    if (instance.after) await instance.after(a, b, ...params);
  };
}

export default function middleware() {
  return (Middleware: Class<MiddlewareInterface>) => (server: App<*>) => {
    const instance: MiddlewareInterface = new Middleware(server);

    const name = normalizeName(Middleware.name);
    const func = createCallback(instance);

    // Save middleware callback for further usage:
    server.middlewares[name] = func;

    return func;
  };
}
