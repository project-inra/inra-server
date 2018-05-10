import Koa from "koa";
import chai from "chai";
import http from "chai-http";
import errors, {handlers, defineError} from "../dest";

chai.use(http);

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
const request = chai.request;

describe("inra-server-container", function() {
  class ValidationError extends Error {
    errorCode = 1234;
    httpStatus = 500;
    userMessage = "Message for users";
  }

  class AuthError extends Error {
    errorCode = 4567;
    httpStatus = 400;
    userMessage = "Message for users";
  }

  class CustomError extends Error {
    errorCode = 7890;
    httpStatus = 404;
    userMessage = "Message for users";
  }

  class CallbackError extends Error {
    errorCode = 7891;
    httpStatus = 405;
    userMessage = "Message for users";
  }

  describe("#defineError(data)", function() {
    it("should define new error", function() {
      defineError({
        instance: ValidationError,
        errorCode: 1234,
        httpStatus: 400,
        userMessage: "An error occured 1"
      });

      defineError({
        instance: AuthError,
        errorCode: 5678,
        httpStatus: 505,
        userMessage: "An error occured 2"
      });

      defineError({
        instance: CustomError
      });

      assert.equal(handlers.size, 3);
    });
  });

  describe("#errors(ctx, next)", function() {
    it("should handle ValidationError", function(done) {
      const app = new Koa();
      const server = app.listen(3000);

      app.use(errors());
      app.use(ctx => { throw new ValidationError("Developer message"); });

      request(server).get("/").end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.errorCode).to.be.equal(1234);
        expect(res.body.userMessage).to.be.equal("An error occured 1");
        expect(res.body.developerMessage).to.be.equal("Developer message");

        server.close();
        done();
      });
    });

    it("should handle AuthError", function(done) {
      const app = new Koa();
      const server = app.listen(3000);

      app.use(errors());
      app.use(ctx => { throw new AuthError("Developer message"); });

      request(server).get("/").end((err, res) => {
        expect(res).to.have.status(505);
        expect(res.body.status).to.be.equal(505);
        expect(res.body.errorCode).to.be.equal(5678);
        expect(res.body.userMessage).to.be.equal("An error occured 2");
        expect(res.body.developerMessage).to.be.equal("Developer message");

        server.close();
        done();
      });
    });

    it("should handle CustomError", function(done) {
      const app = new Koa();
      const server = app.listen(3000);

      app.use(errors());
      app.use(async ctx => {
        await service();
      });

      function service() {
        throw new CustomError("Some custom message")
      }

      request(server).get("/").end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.be.equal(404);
        expect(res.body.errorCode).to.be.equal(7890);
        expect(res.body.userMessage).to.be.equal("Message for users");
        expect(res.body.developerMessage).to.be.equal("Some custom message");

        server.close();
        done();
      });
    });

    it("should execute callback on error", function(done) {
      const app = new Koa();
      const server = app.listen(3000);

      defineError({
        instance: CallbackError,
        callback(error) {
          expect(error.status).to.be.equal(405);
          expect(error.errorCode).to.be.equal(7891);
          expect(error.userMessage).to.be.equal("Message for users");
          expect(error.developerMessage).to.be.equal("Some custom message");

          server.close();
          done();
        }
      });

      app.use(errors());
      app.use(async ctx => {
        await service();
      });

      function service() {
        throw new CallbackError("Some custom message")
      }

      request(server).get("/").end();
    });
  });
});
