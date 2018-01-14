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
 * Create a universal middleware which adapts to all major Node.js frameworks
 * such as Koa/Express. Middleware methods are executed asynchronously in order:
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
 * @example Defining a middleware
 *  class AclMiddleware {
 *    constructor(app) {
 *      this.models = app.models;
 *    }
 *
 *    async before(ctx) {
 *      if (!ctx.state.user) {
 *        ctx.throw(401, "Not allowed");
 *      }
 *    }
 *
 *    async handle(ctx, next, permissions) {
 *      if (ctx.state.user.hasPermissions(permissions) {
 *        return next();
 *      }
 *    }
 *  }
 *
 * @example Importing a middleware
 *  const hasPermission = app.import("./AclMiddleware");
 *  const {Acl} = app.middlewares;
 *  // hasPermission === AclMiddleware
 *
 *  router.delete("/user", hasPermission(["isAdmin"]), …);
 *  router.delete("/post", hasPermission(["isModerator"]), …);
 *
 * @param   {Object}    instance    Middleware instance
 * @param   {Object}    server      Server instance
 * @return  {Function}
 */


function handleCallback(instance, server) {
  return (...params) => async (a, b) => {
    // @note in Koa     : a = ctx, b = next
    // @note in Express : a = req, b = res
    params.unshift(a, b);

    if (instance.create) await instance.create(server);
    if (instance.before) await instance.before(...params);
    if (instance.handle) await instance.handle(...params);
    if (instance.after) await instance.after(...params);
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