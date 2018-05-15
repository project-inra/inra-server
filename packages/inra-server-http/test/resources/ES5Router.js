import controller, {get} from "../../dest/router";

@controller()
class BarRouter {
  @get("/bar")
  read(ctx, next) {
    ctx.body = {
      success: true
    };
  }
}

module.exports = BarRouter;
