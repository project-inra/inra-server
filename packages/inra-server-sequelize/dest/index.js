"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inraServerContainer = require("inra-server-container");

var _inraServerContainer2 = _interopRequireDefault(_inraServerContainer);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _case = require("case");

var _case2 = _interopRequireDefault(_case);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Database and it's related classes provide a simple SQL database interface for
 * the server. The Database is the basic class you use to connect your Node.js
 * application to an RDBMS. There is a different adapter class for each brand of
 * RDBMS.
 *
 * This component is intended mainly for connection and models initialisation.
 * It can lower level database operations but you should interact with databases
 * using initialised Models.
 *
 * @example Connecting
 * const database = new Database({
 *   host: process.env.DB_HOST,
 *   port: Number(process.env.DB_PORT),
 *   dialect: String(process.env.DB_DIALECT),
 *   database: String(process.env.DB_DATABASE),
 *   username: String(process.env.POSTGRES_USER),
 *   password: String(process.env.POSTGRES_PASSWORD),
 *   logging: console.log
 * });
 *
 * database.sync({ … })
 *   .then(…)
 *   .catch(…);
 *
 * @example Using models
 * const {User} = database.models;
 *
 * User.create({ … })
 *  .then(user => console.log("Created", user));
 *  .catch(err => console.log("Error", err));
 *
 *
 * @example Using raw queries
 * database.sequelize.query(…)
 *  .then(data => console.log("Executed", data));
 *  .catch(err => console.log("Error", err));
 */
class Database {

  /**
   * Returns a Proxy which defines magic global setters for a Database instance.
   * It allows us to reflect models and connection internals while keeping those
   * object safe and immutable. Gives another layer of abstraction for data.
   *
   * @param   {DatabaseConfig}  config
   * @param   {bool}            connect Defaults to true
   * @return  {Proxy<Database>}
   */


  /**
   * Imported models. Model keys are PascalCased and should be imported with the
   * internal `.import()` method, not the one provided by Sequelize.
   *
   * @type   {Models}
   * @readonly
   */

  /**
   * Database configuration.
   *
   * @type    {DatabaseConfig}
   * @access  private
   */
  constructor(config, connect = true) {
    this.models = {};
    this.di = new _inraServerContainer2.default();

    this.config = config;

    if (connect) {
      this.connect();
    }

    return new Proxy(this, {
      // Each property in Database internals is immutable for safety
      set(target, key, value) {
        target.di.set(key, value);

        return true;
      },

      // XXX: target is actually a Database instance, but there's an error with
      //      "missing indexer property" (Flow v.0.72)
      get(target, key) {
        return target[key] || target.di.get(key) || target.models[key] || target.sequelize[key];
      }
    });
  }

  /**
   * Tries to establish a connection with the given database's configuration.
   * Disables `operatorsAliases` for security purposes.
   *
   * @see http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html
   * @see http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-security
   *
   * @return  {Promise<void>}
   */


  /**
   * Container used as a linked list for storing custom application data such as
   * models, configurations etc.
   *
   * @type   {Container}
   * @readonly
   */


  /**
   * Active Sequelize connection.
   *
   * @type    {Sequelize}
   * @access  public
   */
  connect() {
    const {
      database,
      username,
      password,
      dialect,
      host,
      port,
      charset,
      collate,
      logging
    } = this.config;

    this.sequelize = new _sequelize2.default(database, username, password, {
      host: host,
      port: port,
      dialect: dialect,
      logging: logging,
      benchmark: true,
      operatorsAliases: false,

      define: {
        timestamps: true,
        underscored: false,
        freezeTableName: false,

        charset: charset || "utf8",
        collate: collate || "utf8_general_ci",

        dialectOptions: {
          collate: collate || "utf8_general_ci"
        }
      }
    });

    return this.sequelize.authenticate().then(() => this.associate());
  }

  /**
   * Creates relations between each model.
   *
   * @return  {void}
   * @access  public
   */
  associate() {
    for (const model in this.models) {
      if ("associate" in this.models[model]) {
        // $FlowFixMe associate is used to generate associations between models:
        this.models[model].associate(this.models);
      }
    }
  }

  /**
   * Creates relations between each model and synchronises the database with
   * provided models.
   *
   * @see    http://docs.sequelizejs.com/manual/tutorial/models-definition.html
   * @see    http://docs.sequelizejs.com/manual/tutorial/associations.html
   *
   * @param   {SyncOptions?}  options
   * @return  {Promise<any>}
   * @access  public
   */
  sync(options) {
    return this.sequelize.sync(options);
  }

  /**
   * Loads a model and saves it for further usage.
   *
   * @param   {string}        src
   * @return  {void}
   * @access  public
   */
  import(src) {
    const model = this.sequelize.import(src);
    const name = _case2.default.pascal(model.name);

    this.models[name] = model;
  }
}
exports.default = Database;
module.exports = exports["default"];