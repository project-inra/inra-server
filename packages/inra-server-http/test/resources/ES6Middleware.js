import middleware from '../../dest/middleware';

@middleware()
export default class BasicMiddleware {
  async before(ctx, next) {
    // …
  }

  async handle(ctx, next) {
    next();
  }

  async after(ctx, next) {
    // …
  }
}
