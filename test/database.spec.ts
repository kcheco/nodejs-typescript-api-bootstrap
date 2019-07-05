import Database, { IDatabaseArgument } from '../src/infrastructure/database';
import { PROCESS_EXIT_STUB } from './__mocks__';
import logger from '../src/utilities/logger';
import { Mongoose } from 'mongoose';

describe('Database', function() {
  let databaseInstance: Database;
  let databaseArgs: IDatabaseArgument;

  describe('when being instantiated', function() {
    it('create an instance', function() {
      databaseInstance = new Database();

      expect(databaseInstance).toBeTruthy();
    });


    it('can receive a logger', function() {
      databaseArgs = Object.assign({
        logger: logger
      }, databaseArgs);
      databaseInstance = new Database(databaseArgs);

      expect(databaseInstance.arguments.logger).toBeDefined();
    });


    it('can receive a configuration object', function() {
      databaseArgs = Object.assign({
        dbConfig: {
          poolSize: '5',
          useNewUrlParser: true,
          retryWrites: true,
          dbName: 'todo_api_testing',
        }
      }, databaseArgs);
      databaseInstance = new Database(databaseArgs);

      expect(databaseInstance.arguments.dbConfig).toBeDefined();
    });


    it('can receive database client', function() {
      databaseArgs = Object.assign({
        mongoose: new Mongoose(),
      }, databaseArgs);
      databaseInstance = new Database(databaseArgs);

      expect(databaseInstance.arguments.mongoose).toBeDefined();
    });


    it('does not have an active connection', function() {
      databaseInstance = new Database();
      
      expect(databaseInstance.isConnected()).toBeFalsy();
    })
  });
  

  describe('establishing a connection with it\'s client', function() {
    beforeAll(function() {
      databaseInstance = new Database();
      databaseInstance.establishConnection();
    });

    afterAll(function(done) {
      databaseInstance.connection.close();
      done();
    });


    it('successfully connects', function() {
      databaseInstance.connection.on('connected', function() {
        expect(databaseInstance.isConnected()).toBeTruthy();
      });
    });


    it('returns its connection status', function() {
      expect(databaseInstance.isConnected()).toBeTruthy();
    });
  });

  describe('when service is interrupted', function() {
    let dbMockInstance: jest.Mocked<Database>;
    
    beforeAll(function() {
      dbMockInstance = new Database() as any;
      dbMockInstance.establishConnection();
    });

    afterAll(function() {
      jest.restoreAllMocks();
    });

    it('connection is closed', function(done) {
      const dbCloseStub = jest.fn();
      const processExitStub = PROCESS_EXIT_STUB;

      dbMockInstance.connection.close = dbCloseStub;
      process.exit = processExitStub;
      
      process.once('SIGTERM', function() {
        expect(dbCloseStub).toHaveBeenCalled();
        expect(processExitStub).toHaveBeenCalled();
      });

      process.emit('SIGTERM', 'SIGTERM');
      
      done();
    });
  });
});