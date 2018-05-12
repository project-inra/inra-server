let assert = require("assert");
let SocketClient = require("socket.io-client");
let SocketServer = require("../dest");
let SocketNamespace = require("../dest/lib/SocketNamespace");

// Server config:
let host = "localhost";
let port = 8085;

// Sockets used for testing:
let socket = new SocketServer({host, port});

describe("inra-server-socket", function() {
  let host, port, socket, client, client2, indexNamespace, adminNamespace;

  before(function(done) {
    // Server config:
    host = "localhost";
    port = 8080;

    // Sockets used for testing:
    socket = new SocketServer({host, port});
    indexNamespace = socket.create("/").listen();
    adminNamespace = socket.create("/admin").listen();

    // Client:
    client = SocketClient("http://localhost:8080/");
    client2 = SocketClient("http://localhost:8080/");

    client.on("connect", () => {
      done();
    });
  });

  after(function() {
    socket.close();
  });

  describe("SocketServer", function() {
    describe("#create( id )", function() {
      it("should create a room", function() {
        assert.equal(indexNamespace instanceof SocketNamespace, true);
        assert.equal(adminNamespace instanceof SocketNamespace, true);
      });
    });

    describe("#on( event, callback )", function() {
      it("should register a listener", function() {
        socket.on("eventA", (data) => {});
        socket.on("eventB", (data) => {});

        assert.equal("eventA" in socket.callbacks, true);
        assert.equal("eventB" in socket.callbacks, true);
      });

      it("should register multiple listeners for the same event", function() {
        socket.on("eventC", (data) => {});
        socket.on("eventC", (data) => {});

        assert.equal("eventC" in socket.callbacks, true);
        assert.equal(Array.isArray(socket.callbacks["eventC"]), true);
        assert.equal(socket.callbacks["eventC"].length === 2, true);
      });
    });

    describe("#trigger( event, data )", function() {
      it("should trigger a listener", function(done) {
        socket.on("eventD", (data) => done());
        socket.trigger("eventD");
      });

      it("should trigger multiple listeners for the same event", function(done) {
        let eventE1 = false;
        let eventE2 = false;

        function isDone() {
          if (eventE1 && eventE2) {
            done();
          }
        }

        socket.on("eventE", (data) => {
          eventE1 = true;
          isDone();
        });

        socket.on("eventE", (data) => {
          eventE2 = true;
          isDone();
        });

        socket.trigger("eventE");
      });
    });

    describe("#addConnection( socket, namespace )", function() {
      it("should add client", function() {
        socket.addConnection(client, indexNamespace);
        socket.addConnection(client2, indexNamespace);

        assert.equal(socket.connections.has(client.id), true);
        assert.equal(socket.connections.has(client2.id), true);
        assert.equal(typeof socket.connections.get(client.id) === "object", true);
        assert.equal(typeof socket.connections.get(client2.id) === "object", true);
      });
    });

    describe("#removeConnection( socket )", function() {
      it("should remove client", function() {
        socket.removeConnection(client);

        assert.equal(socket.connections.has(client.id), false);
      });
    });

    describe("#emit( event, callback )", function() {
      it("should send an event for connected clients", function(done) {
        client2.on("emitEvent", () => {
          done();
        });

        socket.emit("emitEvent");
      });
    });

    describe("#broadcast( event, callback )", function() {
      it("should send an event for connected clients", function(done) {
        client2.on("broadcastEvent", () => {
          done();
        });

        socket.broadcast("broadcastEvent");
      });
    });

    describe("#port", function() {
      it("should return valid port", function() {
        assert.equal(socket.port, port);
      });
    });

    describe("#hostname", function() {
      it("should return valid hostname", function() {
        assert.equal(socket.hostname, host);
      });
    });

    describe("#host", function() {
      it("should return valid host", function() {
        assert.equal(socket.host, "ws://" + host + ":" + port);
      });
    });
  });
});
