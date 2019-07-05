import mongoose, { Connection, Mongoose } from 'mongoose';
import { MongoError } from 'mongodb';
import dotenv from 'dotenv';
import dbOptions, { IDatabaseConfiguration } from '../config/database';
import { Logger } from 'winston';
import logger from '../utilities/logger';

dotenv.config({path: '../../.env'});

export interface IDatabaseArgument {
  logger?: Logger,
  dbConfig?: IDatabaseConfiguration,
  mongoose?: Mongoose,
};

class Database {
  /**
   * the configuration file the database instance uses to
   * connect to third-party client
   * 
   * @property
   * @private
   */
  private _config: IDatabaseConfiguration;

  /**
   * the logger instance
   * 
   * @property
   * @private
   */
  private _logger: Logger;

  /**
   * the mongoose instance used to connect to MongoDB
   * 
   * @property
   * @private
   */
  private _mongoose: Mongoose;

  /**
   * the mongoose connection when established
   * 
   * @property
   * @public
   */
  public connection: Connection;

  /**
   * the arguments passed to the constructor
   * 
   * @property
   * @public
   */
  public arguments: IDatabaseArgument;

  /**
   * Getter for retrieving the database uri
   * 
   * @property
   * @private
   */
  get databaseURI(): string {
    let uri: string;

    switch(process.env.NODE_ENV) {
      case 'test':
        uri = 'mongodb://127.0.0.1:27017';
      default:
        uri = process.env.MONGODB_URL || process.env.MONGODB_ATLAS_URL || 'mongodb://127.0.0.1:27017';
    }
    
    return uri;
  }

  /**
   * Initializes an instance of Database
   * 
   * @params args (optional)
   */
  constructor(args?: IDatabaseArgument) {
    this.arguments = args || {};
    this._logger = this.arguments.logger || logger;
    this._config = this.arguments.dbConfig || this.defaultConfiguration;
    this._mongoose = this.arguments.mongoose || mongoose;
  }

  /**
   * Returns the default configuration an instance of Database can use
   * 
   * @private
   * 
   * @returns object
   */
  private get defaultConfiguration(): object {
    let dbConfig = Object.assign({}, dbOptions.default);
    dbConfig = Object.assign(dbConfig, dbOptions[process.env.NODE_ENV]);

    return dbConfig;
  }

  /**
   * Returns the status of a database connection
   * 
   * @public
   * 
   * @returns boolean
   */
  public isConnected(): boolean {
    if (typeof this.connection === 'undefined') {
      return false;
    }
    
    return (this.connection.readyState === 2) ? true : false;
  }

  /**
   * Connects to mongodb using existing configuration or a new configuration
   * 
   * @params config (optional)
   * @public
   * 
   * @returns void
   */
  public establishConnection(config?: any): void {
    config = (config) ? config : this._config;
    this._mongoose.Promise = global.Promise;
    this._mongoose.connect(this.databaseURI, config);
    this.connection = mongoose.connection;

    this.connection.on('connected', () => {
      this._logger.info(`Connected successfully to MongoDB in ${ process.env.NODE_ENV}`);
    });

    this.connection.on('error', (error: MongoError) => {
      this._logger.error(`Unable to connect to mongodb - %s`, error);
      throw error;
    });

    process.on('SIGTERM', this.handleConnectionInterruption.bind(this));
    process.on('SIGINT', this.handleConnectionInterruption.bind(this));
  }

  private handleConnectionInterruption() {
    this.connection.close();
    this._logger.info('Database Connection closed due to NodeJS process termination');
    process.exit(0);
  }
}

export default Database;
