export interface ContainerInterface {
  /**
   * Return the number of key/value pairs in the Map object.
   *
   * @type    {number}
   * @readonly
   */
  +size: number;

  /**
   * Set value for a given `key` in the Container object.
   *
   * @param   {string}    key
   * @param   {any}       value
   * @return  {Map<string, any>}
   */
  set(key: string, value: any): Map<string, any>;

  /**
   * Return value associated to the given `key`, or `defaultValue` if there is
   * none.
   *
   * @param   {string}    key
   * @param   {any}       defaultValue
   * @return  {any}
   */
  get(key: string, defaultValue: any): any;

  /**
   * Return a boolean asserting whether a value has been associated to the given
   * `key` in the Container object or not.
   *
   * @param   {string}    key
   * @return  {bool}
   */
  has(key: string): boolean;

  /**
   * Remove any value associated to the given `key` and return `true` if it was
   * deleted successfully, or `false` otherwise.
   *
   * @param   {string}    key
   * @return  {bool}
   */
  delete(key: string): boolean;

  /**
   * Remove all key/value pairs from the Map object.
   *
   * @return {void}
   */
  clear(): void;
}
