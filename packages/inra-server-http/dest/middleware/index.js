"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

var _ = require("../");

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Remove "Middleware" from class name.
 *
 * @param   {string}    name
 * @return  {string}
 */
function normalizeName(name) {
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

function createCallback(instance) {
  return (...params) => async (a, b) => {
    // @note in Koa     : a = ctx, b = next
    // @note in Express : a = req, b = res

    if (instance.before) await instance.before(a, b, ...params);
    if (instance.handle) await instance.handle(a, b, ...params);
    if (instance.after) await instance.after(a, b, ...params);
  };
}

function middleware() {
  return Middleware => server => {
    const instance = new Middleware(server);

    const name = normalizeName(Middleware.name);
    const func = createCallback(instance);

    // Save middleware callback for further usage:
    server.middlewares[name] = func;

    return func;
  };
}