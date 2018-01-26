"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleName = handleName;
exports.handleCallback = handleCallback;
exports.handleMiddleware = handleMiddleware;


/**
 * Remove "Middleware" from class name.
 *
 * @param   {string}    name
 * @return  {string}
 */
function handleName(name) {
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


function handleCallback(instance, server) {
  return (...params) => async (a, b) => {
    // @note in Koa     : a = ctx, b = next
    // @note in Express : a = req, b = res

    if (instance.create) await instance.create(server);
    if (instance.before) await instance.before(...params, a, b);
    if (instance.handle) await instance.handle(...params, a, b);
    if (instance.after) await instance.after(...params, a, b);
  };
}

/**
 * Normalize Middleware name and create a valid callback.
 *
 * @param   {MiddlewareInterface}   Middleware    Middleware class
 * @param   {Object}                server        Server instance
 * @return  {{name: string, func: Function}}
 */
function handleMiddleware(Middleware, server) {
  const instance = new Middleware(server);

  return {
    name: handleName(Middleware.name),
    func: handleCallback(instance, server)
  };
}