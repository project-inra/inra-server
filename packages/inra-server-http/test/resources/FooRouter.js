import {get, put, del, post, head, patch, options} from "../../dest";

export default class FooRouter {
  @get("/foo")
  getRequest(ctx, next) {
    ctx.body = { verb: "GET" };
  }

  @put("/foo")
  putRequest(ctx, next) {
    ctx.body = { verb: "PUT" };
  }

  @del("/foo")
  delRequest(ctx, next) {
    ctx.body = { verb: "DELETE" };
  }

  @post("/foo")
  postRequest(ctx, next) {
    ctx.body = { verb: "POST" };
  }

  @head("/foo")
  headRequest(ctx, next) {
    // HEAD responses doesn't have body
  }

  @patch("/foo")
  patchRequest(ctx, next) {
    ctx.body = { verb: "PATCH" };
  }

  @options("/foo")
  optionsRequest(ctx, next) {
    ctx.body = { verb: "OPTIONS" };
  }
}
