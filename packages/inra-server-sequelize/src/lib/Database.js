// @flow
import Container from "inra-server-container";
import Sequelize, {Model} from "sequelize";
import type {SyncOptions} from "sequelize";
import Case from "case";

export interface DatabaseConfig {
  database: string;
  username: string;
  password: string;
  dialect: string;
  charset?: string;
  collate?: string;
  host: any;
  port: number;
  logging?: Function;
}

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
export default class Database {
  /**
   * Database configuration.
   *
   * @type    {DatabaseConfig}
   * @access  private
   */
  config: DatabaseConfig;

  /**
   * Active Sequelize connection.
   *
   * @type    {Sequelize}
   * @access  public
   */
  sequelize: Sequelize;

  /**
   * Imported models. Model keys are PascalCased and should be imported with the
   * internal `.import()` method, not the one provided by Sequelize.
   *
   * @type   {Object}
   * @readonly
   */
  +models: {[string]: Class<Model<any>>} = {};

  /**
   * Container used as a linked list for storing custom application data such as
   * models, configurations etc.
   *
   * @type   {Container}
   * @readonly
   */
  +di: Container = new Container();

  /**
   * Returns a Proxy which defines magic global setters for a Database instance.
   * It allows us to reflect models and connection internals while keeping those
   * object safe and immutable. Gives another layer of abstraction for data.
   *
   * @param   {DatabaseConfig}  config
   * @param   {bool}            connect Defaults to true
   * @return  {Proxy<Database>}
   */
  constructor(config: DatabaseConfig, connect: boolean = true): Database {
    this.config = config;

    if (connect) {
      this.connect();
    }

    return new Proxy(this, {
      // Each property in Database internals is immutable for safety
      set(target, key, value) {
        target.di[key] = value;

        return true;
      },

      // XXX: target is actually a Database instance, but there's an error with
      //      "missing indexer property" (Flow v.0.72)
      get(target: Object, key) {
        return (
          target[key] ||
          target.di[key] ||
          target.models[key] ||
          target.sequelize[key]
        );
      },
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
  connect(): * {
    const {
      database,
      username,
      password,
      dialect,
      host,
      port,
      charset,
      collate,
      logging,
    } = this.config;

    this.sequelize = new Sequelize(database, username, password, {
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
          collate: collate || "utf8_general_ci",
        },
      },
    });

    return this.sequelize.authenticate().then(() => this.associate());
  }

  /**
   * Creates relations between each model.
   *
   * @return  {void}
   * @access  public
   */
  associate(): void {
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
  sync(options?: SyncOptions): * {
    return this.sequelize.sync(options);
  }

  /**
   * Loads a model and saves it for further usage.
   *
   * @param   {string}        src
   * @return  {void}
   * @access  public
   */
  import(src: string): void {
    const model: Class<Model<any>> = this.sequelize.import(src);
    const name: string = Case.pascal(model.name);

    this.models[name] = model;
  }
}
