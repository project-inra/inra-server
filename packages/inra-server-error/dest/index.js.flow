// @flow
import type {Context} from "koa";

// JSON format:
export type Response = {
  status: number;
  errorCode: number;
  userMessage: string;
  developerMessage: string|null;
}

// Exception class definition:
export interface Exception {
  message?: string;
  errorCode?: string | number;
  httpStatus?: number;
  userMessage?: string;
  callback?: (Response) => any;
};

export type ErrorHandler = {
  instance: Exception;
  errorCode?: string | number;
  httpStatus?: number;
  userMessage?: string;
  callback?: (Response) => any;
};

export const handlers: Map<Exception, ErrorHandler> = new Map();

/**
 * Errors middleware which catches exceptions thrown inside other middlewares or
 * routes and generates a graceful response.
 *
 * @param   {Object}    options
 * @return  {Function}
 */
export default function errors(options?: Object): Function {
  // Default options:
  const opts = {
    httpStatus: 500,
    userMessage: "Internal error",
    ...options,
  };

  return async function middleware(
    ctx: Context,
    next: () => Promise<void>
  ): Promise<void> {
    try {
      await next();
    } catch (err) {
      handlers.forEach((def, instance) => {
        if (err instanceof instance) {
          const defaults = {...opts, ...err, ...def};
          const response: Response = {
            status: defaults.httpStatus,
            errorCode: defaults.errorCode,
            userMessage: defaults.userMessage,
            developerMessage: err.message,
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
export function defineError(data: ErrorHandler): void {
  if (!data.instance) {
    throw new Error("Error instance must extend Error class");
  }

  handlers.set(data.instance, data);
}
