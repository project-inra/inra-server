// @flow

import EventEmitter from "events";
import {EmittableInterface} from "./interfaces/EmittableInterface";

class SocketNamespace extends EventEmitter implements EmittableInterface {
  /**
   * Unique id for the actual namespace.
   *
   * @type    {string}
   */
  id: string;

  /**
   * Instance of the initial room from `socket.io`.
   *
   * @type    {Object}
   */
  instance: Object;

  /**
   * Reference to the server the actual namespace comes from.
   *
   * @type    {Object}
   */
  server: Object;

  /**
   * Creates a new namespace.
   *
   * @param   {string}    id
   * @param   {Object}    server
   */
  constructor(id: string, server: Object) {
    super();

    this.id = id;
    this.server = server;
    this.instance = server.io.of(id);
  }

  /**
   * Emits an `event` with `data` to everyone in the actual namespace.
   *
   * @param   {string}    event
   * @param   {object}    data
   * @return  {void}
   */
  broadcast(event: string, data: Object = {}): void {
    this.instance.broadcast.emit(event, data);
  }

  /**
   * Adds a custom middleware to the actual namespace.
   *
   * @param   {Function}  middleware
   * @return  {this}
   */
  use(middleware: Function): this {
    this.instance.use(middleware);

    return this;
  }

  /**
   * Registers customs event listeners for the actual namespace.
   *
   * @return  {this}
   */
  listen(): this {
    this.instance.on("connection", (socket: Object) => {
      this.emit("connect", socket);

      socket.on("event", (data: Object) => {
        this.emit("event", data.action, data, socket, this);
      });

      socket.on("disconnect", () => {
        this.emit("disconnect", socket);
      });

      // Register namespace-specific events:
      this.eventNames().forEach((event: string) => {
        socket.on(event, (data) => {
          this.emit(event, data);
        });
      });
    });

    return this;
  }
}

export default SocketNamespace;
