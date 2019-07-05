import Server from '../src/infrastructure/server';
import Application from '../src/infrastructure/app'; 
import http from 'http';
import websocket from 'ws';
import WebServer from '../src/infrastructure/server';

describe('Server', function() {
  let server: Server;
  let app: Application;
  let webHost: string;
  let webPort: string;
  let websocketServer: websocket.Server;

  beforeAll(function() {
    app = new Application();
    server = new Server(app);
    webPort = app.webApp.get('port');
    webHost = app.webApp.get('host');
    const websocketServerOpts = {server: server.httpClient};
    websocketServer = new websocket.Server(websocketServerOpts);
  });


  it('requires an application when being instantiated', () => {
    expect(app).toBeInstanceOf(Application);
    expect(server).toBeDefined();
  });


  it('receives host name from application', function() {
    expect(server.getHost()).toEqual(webHost);
  });


  it('receives port number from application', function() {
    expect(server.getPort()).toEqual(webPort);
  });


  it('creates an instance of http.Server', function() {
    expect(server.httpClient instanceof http.Server).toBeTruthy();
  });


  it('set the listening status of a websocket', function() {
    server.isSocketListening = true;
    expect(server.isSocketListening).toBeTruthy();
  })


  describe('when being turned on', function() {
    beforeEach(function() {
      server.turnOn();
    });

    afterEach(function(done) {
      server.httpClient.close(done);
    });


    it('starts listening for connections', function(done) {
      expect(server.httpClient.listening).toBeTruthy();
      done();
    });


    it('receives a successful connection', function(done) {
      const rootUrl: string = `${ webHost }:${ webPort }`;
      http.get(rootUrl, function(res) {
        expect(res.statusCode).toBe(200);
        done();
      });
    });


    it('has one connection', function() {
      getServerConnections(server)
        .then(function(count) {
          expect(count).toBeGreaterThanOrEqual(1);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  })

  describe('when being shutdown', function() {
    beforeEach(function() {
      server.turnOn();
    });


    it('no longer listens for connections', function(done) {
      server.shutdown();
      expect(server.httpClient.listening).toBeFalsy();
      done();
    });


    it('has no connections', function(done) {
      // test there is one connection
      getServerConnections(server)
        .then(function(count) {
          expect(count).toBeGreaterThanOrEqual(1);
        })
        .catch(function(err) {
          console.log(err);
        });

      // then call shutdown()
      server.shutdown();

      // finally test there are no connections
      getServerConnections(server)
        .then(function(count) {
          expect(count).toBe(0);
          done();
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });

  describe('when binding a websocket server', function() {
    describe('and application has websocket connections enabled', function() {
      beforeEach(function() {
        app.config.websocketEnabled = true;
        server.bindWebsocketServer(websocketServer);
      });

      afterEach(function(done) {
        server.websocketClient.close(done);
      });

      it('listens for a connection', function() {
        isSocketListening(server.websocketClient)
          .then(function(status) {
            expect(status).toBeTruthy();
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    });

    describe('and application has websocket connections disabled', () => {
      beforeEach(function() {
        app.config.websocketEnabled = false;
      });

      it('receives a binding error', function() {
        expect(function() {
          server.bindWebsocketServer(websocketServer)
        }).toThrow('Unable to bind websocket to existing server');
      });
    })
  });
});

// Returns number of connections on the server
function getServerConnections(server: WebServer) : Promise<any> {
  return new Promise(function(resolve, reject) {
    server.httpClient.getConnections(function(err, count) {
      if(err) {
        reject(err);
        return;
      }

      resolve(count);
    });
  });
};

// returns connections status of a websocket server
function isSocketListening(websocket: websocket.Server) : Promise<any> {
  return new Promise(function(resolve, reject) {
    websocket.on('connection', function() {
      resolve(true)
    });
    websocket.on('error', function(error) {
      reject(error);
    })
  })
};