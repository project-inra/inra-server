export interface ContainerInterface {
  /**
   * Returns the number of key/value pairs in the Map object.
   *
   * @type    {number}
   * @readonly
   */
  +size: number;

  /**
   * Sets the value for the key in the Container object. Returns the Map
   * object.
   *
   * @param   {string}    key
   * @param   {any}       value
   * @return  {Map<string, any>}
   */
  set(key: string, value: any): Map<string, any>;

  /**
   * Returns the value associated to the key, or `defaultValue` if there is
   * none.
   *
   * @param   {string}    key
   * @param   {any}       defaultValue
   * @return  {any}
   */
  get(key: string, defaultValue: any): any;

  /**
   * Returns a boolean asserting whether a value has been associated to the
   * key in the Container object or not.
   *
   * @param   {string}    key
   * @return  {bool}
   */
  has(key: string): boolean;

  /**
   * Removes any value associated to the key and returns `true` if it was
   * deleted successfully, or `false` otherwise.
   *
   * @param   {string}    key
   * @return  {bool}
   */
  delete(key: string): boolean;

  /**
   * Removes all key/value pairs from the Map object.
   *
   * @return {void}
   */
  clear(): void;
}
