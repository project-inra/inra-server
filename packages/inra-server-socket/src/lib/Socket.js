import io                       from "socket.io";
import SocketNamespace          from "./SocketNamespace";
import SocketConnection         from "./SocketConnection";
import { EmittableInterface }   from "./interfaces/EmittableInterface";

class Socket implements EmittableInterface {
    /**
     * `socket.io` instance.
     *
     * @type    {Object}
     */
    +io: Object = io();

    /**
     * Socket server configuration.
     *
     * @type    {Object}
     */
    config: Object = {};

    /**
     * Registered callbacks.
     *
     * @type    {Object}
     */
    callbacks: Object = {};

    /**
     * Registered connections.
     *
     * @type    {Object}
     */
    connections: Object = {};

    /**
     * Creates a new socket server with custom configuration.
     *
     * @param   {Object}    config
     * @param   {number}    config.port
     * @param   {string}    config.host
     */
    constructor( config: Object = {} ) {
        this.config = config;

        // Listen:
        this.io.listen( this.port );
    }

    /**
     * Emits an `event` with `data` for a specific connection.
     *
     * @param   {string}    event
     * @param   {Object}    data
     * @return  {void}
     */
    send( id: string, event: string, data: Object = {} ): void {
        if ( id in this.connections ) {
            this.connections[ id ].emit( event, data );
        }
    }

    /**
     * Emits an `event` with `data` for every connection in every namespace
     * registered.
     *
     * @param   {string}    event
     * @param   {Object}    data
     * @return  {void}
     */
    emit( event: string, data: Object = {} ): void {
        this.io.emit( event, data );
    }

    /**
     * Emits an `event` with `data` for every connection in every namespace
     * registered.
     *
     * @param   {string}    event
     * @param   {Object}    data
     * @return  {void}
     */
    broadcast( event: string, data: Object = {} ): void {
        this.io.emit( event, data );
    }

    /**
     * Registers a `callback` for a specific `event` coming from all the
     * registered namespaces.
     *
     * @param   {string}    event
     * @param   {Function}  callback
     * @return  {void}
     */
    on( event: string, callback: Function ): void {
        if ( !( event in this.callbacks ) ) {
            this.callbacks[ event ] = [];
        }

        this.callbacks[ event ].push( callback );
    }

    /**
     * Creates a new room with id `room`. Automically resolves new connections
     * and events. Returns the created room.
     *
     * @param   {string}    room
     * @return  {Object}
     */
    create( room: string ): Object {
        const namespace: SocketNamespace = new SocketNamespace( room, this );

        namespace.on( "connect", ( socket: Object ) => {
            this.addConnection( socket, namespace );
        } );

        namespace.on( "disconnect", ( socket: Object ) => {
            this.removeConnection( socket );
        } );

        namespace.on( "event", ( event: string, data: Object, socket: Object,
            namespace: Object ) => {
            this.trigger( event, data, socket, namespace );
        } );

        return namespace;
    }

    /**
     * Triggers a specific `event` with `data`, `connection` and `namespace`.
     *
     * @param   {string}    event
     * @param   {Object}    data
     * @param   {Object}    connection
     * @param   {Object}    namespace
     * @return  {void}
     */
    trigger( event: string, data: Object, connection: Object, namespace: Object ): void {
        if ( event in this.callbacks ) {
            for ( const callback of this.callbacks[ event ] ) {
                callback( data, connection, namespace );
            }
        }
    }

    /**
     * Registers a connection and returns it.
     *
     * @param   {Object}    socket
     * @param   {Object}    namespace
     * @param   {Object}    socket
     */
    addConnection( socket: Object, namespace: Object ): Object {
        const connection = new SocketConnection( socket, namespace, this );

        this.connections[ socket.id ] = connection;

        return connection;
    }

    /**
     * Removes the connection corresponding to `socket`.
     *
     * @param   {Object}
     * @return  {void}
     */
    removeConnection( socket: Object ): void {
        delete this.connections[ socket.id ];
    }

    get port(): number {
        return this.config.port || 8082;
    }

    get hostname(): string {
        return this.config.host || "localhost";
    }

    get host(): string {
        return `ws://${ this.hostname }:${ this.port }`;
    }
}

export default Socket;
