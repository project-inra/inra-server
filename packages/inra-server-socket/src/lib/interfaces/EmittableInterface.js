export interface EmittableInterface {
    /**
     * Executes `callback` on `event` from the actual socket.
     *
     * @param   {string}    event
     * @param   {Function}  callback
     * @return  {any}
     */
    on( event: string, callback: Function ): any;

    /**
     * Emits an `event` with `data` from the actual socket.
     *
     * @param   {string}    event
     * @param   {object}    data
     * @return  {any}
     */
    emit( event: string, data: Object ): any;

    /**
     * Emits an `event` with `data` to everyone else except for the actual
     * socket.
     *
     * @param   {string}    event
     * @param   {object}    data
     * @return  {any}
     */
    broadcast( event: string, data: Object ): any;
}
