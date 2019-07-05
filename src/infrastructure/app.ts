import path from 'path';
import express from 'express';
import { Logger } from 'winston';
import logger from '../utilities/logger';
import { IApplicationConfig, applicationConfig as defaultConfig } from '../config/app';
import Database from './database';
import dotenv from 'dotenv';
import Router from './router';

dotenv.config({path: '.env'});

const host = process.env.HOST || 'http://localhost';
const port = process.env.PORT || 3000;

export interface IApplicationArgument {
  appConfig?: object,
  database?: Database,
  router?: Router,
};

class Application {
  /**
   * The database instance used by the application
   * 
   * @property
   * @private
   */
  private _database: Database;

  /**
   * The current environment the application is running
   * 
   * @property
   * @private
   */
  private _environment: string;

  /**
   * The router instance used by the application
   * 
   * @property
   * @private
   */
  private _router: Router;

  /**
   * The application's web framework
   * 
   * @property
   * @public
   */
  public webApp: express.Express ;

  /**
   * The logger instance used by the application
   * 
   * @property
   * @public
   */
  public logger: Logger;

  /**
   * The application's configuration settings
   * 
   * @property
   * @public
   */
  public config: IApplicationConfig;

  /**
   * The arguments passed to the constructor when
   * application is being instantiated
   * 
   * @property
   * @public
   */
  public arguments: IApplicationArgument;

  /**
   * Used to create an instance of Application
   * 
   * @constructor
   */
  constructor(args?: IApplicationArgument) {
    this.arguments = args || {};
    this.webApp = express();
    this.logger = logger;
    this.config = this.arguments.appConfig || defaultConfig;
    this._database = this.arguments.database || new Database();
    this._router = this.arguments.router || new Router();

    this.loadSettings();
    this.loadDatabase();
    this.initMiddleware();
  }

  /**
   * A getter for returning the current environment
   * 
   * @property
   * @public
   */
  get environment(): string {
    return this._environment || process.env.NODE_ENV || 'development';
  }

  /**
   * A setter for specifying the current environment
   * 
   * @property
   * @public
   */
  set environment(value: string) {
    this._environment = value;
  }

  /**
   * Returns the root path of the application
   * 
   * @public
   * 
   * @returns string
   */
  public rootPath(): string {
    return path.join(__dirname, '../../');
  }

  /**
   * Calls on the database instance to establish connection or
   * logs error when application is not configured to use a
   * database
   * 
   * @private
   * 
   * @returns void
   */
  private loadDatabase(): void {
    if (!this.config.databaseEnabled) {
      const errorMessage = `Application has database connections turned off. Update
                          the configuration of the application, if you would like
                          to use a database\n`;
      this.logger.error(errorMessage);
      return;
    }

    this._database.establishConnection();
  }

  /**
   * Calls on the router instance to initialize and 
   * incorporate into web framework
   * 
   * @private
   * 
   * @returns void
   */
  private initMiddleware(): void {
    const initRouter = this._router.init();
    this.webApp.use(initRouter);
  }

  /**
   * Loads additional web framework settings
   * 
   * @private
   * 
   * @returns void
   */
  private loadSettings(): void {
    this.webApp.set('port', port);
    this.webApp.set('host', host);

    if (this.config.corsEnabled) {
      this.applyCORSHeaders();
    }
  }

  /**
   * Incorporates CORS into all web requests
   * Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
   * 
   * @private
   * 
   * @returns void
   */
  private applyCORSHeaders(): void {
    this.webApp.all('*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers',
                 'Content-Type, Content-Length, Accept, Authorization, X-Requested-With');
      res.header('Access-Control-Allow-Methods',
                 'DELETE, GET, POST, PUT, OPTIONS');
      res.header('Access-Control-Allow-Credentials', 'true');
      req.method === 'OPTIONS' ? res.sendStatus(200) : next();
    });
  }
}

export default Application;
