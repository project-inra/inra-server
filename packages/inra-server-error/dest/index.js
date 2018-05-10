"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = errors;
exports.defineError = defineError;


// JSON format:
;

// Exception class definition:

const handlers = exports.handlers = new Map();

/**
 * Errors middleware which catches exceptions thrown inside other middlewares or
 * routes and generates a graceful response.
 *
 * @param   {Object}    options
 * @return  {Function}
 */
function errors(options) {
  // Default options:
  const opts = _extends({
    httpStatus: 500,
    userMessage: "Internal error"
  }, options);

  return async function middleware(ctx, next) {
    try {
      await next();
    } catch (err) {
      handlers.forEach((def, instance) => {
        if (err instanceof instance) {
          const defaults = _extends({}, opts, err, def);
          const response = {
            status: defaults.httpStatus,
            errorCode: defaults.errorCode,
            userMessage: defaults.userMessage,
            developerMessage: err.message
          };

          if (typeof defaults.callback === "function") {
            defaults.callback(response);
          }

          if (process.env.NODE_ENV === "production") {
            response.developerMessage = null;
          }

          ctx.response.type = "json";
          ctx.status = response.status;
          ctx.body = response;
        }
      });
    }
  };
}

/**
 * Adds an error handler for a specified exception type.
 *
 * @example
 *  defineError({
 *    instance: ValidationError
 *  });
 *
 * @example
 *  defineError({
 *    instance: EmptyFieldError,
 *
 *    errorCode: Errors.VALIDATION_ERROR,
 *    httpStatus: 400,
 *    userMessage: "Field is required",
 *
 *    callback(error) {}
 *  });
 *
 * @param   {ErrorHandler}  data
 * @return  {void}
 */
function defineError(data) {
  if (!data.instance) {
    throw new Error("Error instance must extend Error class");
  }

  handlers.set(data.instance, data);
}