import {resolve} from "path";
import Koa from "koa";
import Router from "koa-router";
import chai from "chai";
import http from "chai-http";
import Server from "../dest";

chai.use(http);

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
const request = chai.request;

describe("inra-server-http", function() {
  let server;
  let conn;

  describe("Server", function() {
    describe("#constructor(config)", function() {
      it("should create a new instance", function() {
        server = new Server({
          port: 8000,
          host: "localhost"
        });

        expect(server).to.be.an.instanceof(Object);
      });
    });

    describe("#setEngine(engine)", function() {
      function setEngine() {
        server.setEngine(new Koa());
      }

      it("should add engine when valid", function() {
        expect(setEngine).to.not.throw(Error);
        expect(server.engine).to.be.an.instanceof(Koa);
      });

      it("should throw when overriting", function() {
        expect(setEngine).to.throw(Error);
        expect(server.engine).to.be.an.instanceof(Koa);
      });
    });

    describe("#setRouter(router)", function() {
      function setRouter() {
        server.setRouter(new Router());
      }

      it("should add engine when valid", function() {
        expect(setRouter).to.not.throw(Error);
        expect(server.engine).to.be.an.instanceof(Object);
      });

      it("should throw when overriting", function() {
        expect(setRouter).to.throw(Error);
        expect(server.engine).to.be.an.instanceof(Object);
      });
    });

    describe("#use(middleware)", function() {
      function addMiddleware(engine) {
        return () => {
          // Koa specific:
          engine.use(engine.router.routes());
          engine.use(engine.router.allowedMethods());
        };
      }

      it("should add middleware if engine set", function() {
        expect(addMiddleware(server)).to.not.throw(Error);
      });

      it("should throw when no engine set", function() {
        const rawServer = new Server({
          port: 8000,
          host: "localhost"
        });

        expect(addMiddleware(rawServer)).to.throw(Error);
      });
    });

    describe("#import(path)", function() {
      function importer(path) {
        return () => server.import(path);
      }

      it("should import specified resource (ES6)", function() {
        const middleware = resolve(__dirname, "./resources/ES6Middleware.js");
        expect(importer(middleware)).to.not.throw(Error);

        const route = resolve(__dirname, "./resources/ES6Router.js");
        expect(importer(route)).to.not.throw(Error);
      });

      it("should import specified resource (pre ES6)", function() {
        const resource = resolve(__dirname, "./resources/ES5Router.js");
        expect(importer(resource)).to.not.throw(Error);
      });
    });

    describe("#run(port, callback)", function() {
      it("should run on specified port", function(done) {
        server.run(8000, function () {
          done();
        });
      });
    });
  });

  describe("Router", function () {
    it("should respond to GET requests", function(done) {
      request("localhost:8000").get("/prefix/foo").then(res => {
        expect(res).to.have.status(200);
        expect(res.body.verb).to.be.equal("GET");

        done();
      }).catch(err => done(err.message));
    });

    it("should respond to PUT requests", function(done) {
      request("localhost:8000").put("/prefix/foo").then(res => {
        expect(res).to.have.status(200);
        expect(res.body.verb).to.be.equal("PUT");

        done();
      }).catch(err => done(err.message));
    });

    it("should respond to DELETE requests", function(done) {
      request("localhost:8000").delete("/prefix/foo").then(res => {
        expect(res).to.have.status(200);
        expect(res.body.verb).to.be.equal("DELETE");

        done();
      }).catch(err => done(err.message));
    });

    it("should respond to POST requests", function(done) {
      request("localhost:8000").post("/prefix/foo").then(res => {
        expect(res).to.have.status(200);
        expect(res.body.verb).to.be.equal("POST");

        done();
      }).catch(err => done(err.message));
    });

    it("should respond to HEAD requests", function(done) {
      request("localhost:8000").head("/prefix/foo").then(res => {
        // HEAD responses doesn't have body
        done();
      }).catch(err => done(err.message));
    });

    it("should respond to PATCH requests", function(done) {
      request("localhost:8000").patch("/prefix/foo").then(res => {
        expect(res).to.have.status(200);
        expect(res.body.verb).to.be.equal("PATCH");

        done();
      }).catch(err => done(err.message));
    });

    it("should respond to OPTIONS requests", function(done) {
      request("localhost:8000").options("/prefix/foo").then(res => {
        expect(res).to.have.status(200);
        expect(res.body.verb).to.be.equal("OPTIONS");

        done();
        server.native.close();
      }).catch(err => done(err.message));
    });

    after(function() {
      // Runs after all tests in this block:
      server.native.close();
    });
  });
});
