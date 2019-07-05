import { applicationConfig } from '../src/config/app';
import Application, { IApplicationArgument } from '../src/infrastructure/app';
import Router from '../src/infrastructure/router';
import Database from '../src/infrastructure/database';
import {
  ROUTER_INIT_STUB,
  DB_CONNECT_STUB
} from './__mocks__';
import request from 'supertest';
import path from 'path';

const CORS_REGEX = new RegExp(/access-control-allow-origin/, 'i');

describe('Application', function() {
  let application: Application;
  let applicationArgs: IApplicationArgument;
  let mockRouterInstance: jest.Mocked<Router>;
  let mockDBInstance: jest.Mocked<Database>;

  beforeEach(function() {
    applicationConfig.databaseEnabled = false;
    applicationArgs = {
      appConfig: applicationConfig
    };
    jest.clearAllMocks();
  });

  describe('when initialized', function() {
    it('creates an instance without arguments passed', function() {
      application = new Application();

      expect(application).toBeInstanceOf(Application);
    });


    it('creates an instance with arguments passed', function() {
      application = new Application(applicationArgs);

      expect(application).toBeInstanceOf(Application);
    });


    it('receives express function', function() {
      application = new Application();

      expect(typeof application.webApp).toBe('function');
    });


    it('sets the port the application will use', function() {
      const port = 8080;
      application = new Application(applicationArgs);
      application.webApp.set('port', port);

      expect(application.webApp.get('port')).toBe(port);
    });


    it('sets the host the application will use', function() {
      const host = 'http://127.0.0.1';
      application = new Application(applicationArgs);
      application.webApp.set('host', host);

      expect(application.webApp.get('host')).toBe(host);
    });


    it('can receive a configuration object', function() {
      application = new Application(applicationArgs);
      expect(application.arguments.appConfig).toBe(applicationArgs.appConfig);
    });


    it('can receive a database object', function() {
      mockDBInstance = new Database() as any;

      applicationArgs = Object.assign({
        appConfig: applicationConfig,
        database: mockDBInstance,
      }, applicationArgs);
      application = new Application(applicationArgs);

      expect(application.arguments.database).toBeDefined();
    });


    it('can receive a router object', function() {
      mockRouterInstance = new Router() as any;

      applicationArgs = Object.assign({
        router: mockRouterInstance
      }, applicationArgs);
      application = new Application(applicationArgs);

      expect(application.arguments.router).toBeDefined();
    });
  });


  it('is able to return the current environment', function() {
    application = new Application(applicationArgs);
    const currentEnv = application.environment;

    expect(currentEnv).toBe('test');
  });


  it('is able to set the environment', function() {
    application = new Application();
    application.environment = 'development';

    expect(application.environment).toBe('development');
    application.environment = 'test';
  });


  it('is able tor return the root path', function() {
    application = new Application();
    const rootPath = path.join(__dirname, '../');

    expect(application.rootPath()).toEqual(rootPath);
  });


  describe('when configured to use a database', function() {
    it('informs Database to establish connection', function() {
      applicationConfig.databaseEnabled = true;
      mockDBInstance = new Database() as any;
      mockDBInstance.establishConnection = DB_CONNECT_STUB;

      applicationArgs = Object.assign({
        appConfig: applicationConfig,
        database: mockDBInstance,
      }, applicationArgs);
      application = new Application(applicationArgs);

      expect(mockDBInstance.establishConnection).toHaveBeenCalled();
    });
  });


  describe('when configured to not use a database', function() {
    it('receives a error', function() {
      mockDBInstance = new Database() as any;
      mockDBInstance.establishConnection = DB_CONNECT_STUB;

      applicationArgs = Object.assign({
        appConfig: applicationConfig,
        database: mockDBInstance,
      }, applicationArgs);
      application = new Application(applicationArgs);

      expect(mockDBInstance.establishConnection).not.toHaveBeenCalled();
    });
  });


  it('informs the router object to initialize itself', function() {
    mockRouterInstance = new Router() as any;
    mockRouterInstance.init = ROUTER_INIT_STUB;

    applicationArgs = Object.assign({
      router: mockRouterInstance
    }, applicationArgs);
    application = new Application(applicationArgs);

    expect(mockRouterInstance.init).toHaveBeenCalled();
  });


  describe('when configured to use CORS', function() {
    it('sets requests headers', async function() {
      applicationConfig.corsEnabled = true;

      applicationArgs = Object.assign({
        appConfig: applicationConfig,
      }, applicationArgs);
      application = new Application();

      const webApp = application.webApp;

      await request(webApp).get('/')
        .then(function(response) {
          const corsHeaderDetectedResult = isCorsHeaderDetected(response);
          
          expect(corsHeaderDetectedResult).toBeTruthy();
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });

  describe('when configured to not use CORS', function() {
    it('does not contain CORS headers', async function() {
      applicationConfig.corsEnabled = false;
      
      applicationArgs = Object.assign({
        appConfig: applicationConfig,
      }, applicationArgs);
      application = new Application(applicationArgs);

      const webApp = application.webApp;

      await request(webApp).get('/')
        .then(function(response) {
          const corsHeaderDetectedResult = isCorsHeaderDetected(response);
          
          expect(corsHeaderDetectedResult).toBeFalsy();
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });
});

// helper for checking if cors is included in response object
function isCorsHeaderDetected(response: request.Response): boolean {
  const headerArray = Object.keys(response.header);
  const corsHeaderSearchCount = headerArray.filter((key) => {
    return CORS_REGEX.test(key);
  });

  return corsHeaderSearchCount.length > 0 ? true : false;
};