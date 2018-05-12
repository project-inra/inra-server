// @flow

import {EmittableInterface} from "./interfaces/EmittableInterface";

class SocketConnection implements EmittableInterface {
  /**
   * Unique id for actual connection.
   *
   * @type    {string}
   */
  id: string;

  /**
   * Instance from the initial socket from `socket.io`.
   *
   * @type    {Object}
   */
  instance: Object;

  /**
   * Reference to the namespace the actual socket comes from.
   *
   * @type    {Object}
   */
  namespace: Object;

  /**
   * Reference to the server the actual socket comes from.
   *
   * @type    {Object}
   */
  server: Object;

  /**
   * Creates a new socket connection.
   *
   * @param   {Object}    socket
   * @param   {Object}    namespace
   * @param   {Object}    server
   */
  constructor(socket: Object, namespace: Object, server: Object) {
    this.namespace = namespace;
    this.instance = socket;
    this.server = server;

    // Grab id from the original socket:
    this.id = socket.id;
  }

  /**
   * Executes `callback` on `event` from the actual socket.
   *
   * @param   {string}    event
   * @param   {Function}  callback
   * @return  {void}
   */
  on(event: string, callback: Function): void {
    this.instance.on(event, callback);
  }

  /**
   * Emits an `event` with `data` from the actual socket.
   *
   * @param   {string}    event
   * @param   {object}    data
   * @return  {void}
   */
  emit(event: string, data: Object = {}): void {
    this.instance.emit(event, data);
  }

  /**
   * Emits an `event` with `data` to everyone else in the namespace except for
   * the actual socket.
   *
   * @param   {string}    event
   * @param   {object}    data
   * @return  {void}
   */
  broadcast(event: string, data: Object = {}): void {
    this.instance.broadcast.emit(event, data);
  }

  disconnect() {
    this.instance.disconnect(true);
    // this.instance.destroy();
  }
}

export default SocketConnection;
