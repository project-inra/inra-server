import {get} from "../../dest";

module.exports = class BarRouter {
  @get("/bar")
  read(ctx, next) {
    ctx.body = {
      success: true
    };
  }
}
