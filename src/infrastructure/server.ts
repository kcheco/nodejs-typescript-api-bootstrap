import Application from './app';
import * as http from 'http';
import webSocket from 'ws';

class WebServer {
  /**
   * the application the server will run on
   * 
   * @private
   * @property
   */
  private app: Application;

  /**
   * the host the application needs to run
   * 
   * @private
   * @property
   */
  private host: string;

  /**
   * the port the application will use
   * 
   * @private
   * @property
   */
  private port: string;

  /**
   * the http server connection
   * 
   * @private
   * @property
   */
  private _httpClient?: http.Server;

  /**
   * the websocket connection
   * 
   * @private
   * @property
   */
  private _websocket?: webSocket.Server;

  /**
   * Checks is the websocket is listening
   * 
   * @private
   * @property
   */
  private _isSocketListening: boolean;

  /**
   * Getter for accessing servers client
   * 
   * @public
   * @property
   * 
   * @returns http.Server
   */
  public get httpClient() : http.Server {
    return this._httpClient;
  }

  /**
   * Getter for accessing websocket client
   * 
   * @public
   * @property
   * 
   * @returns websocket.Server
   */
  public get websocketClient() : webSocket.Server {
    return this._websocket;
  }

  /**
   * Getter for accessing websocket listening status
   * 
   * @public
   * @property
   * 
   * @returns boolean
   */
  public get isSocketListening() : boolean {
    return this._isSocketListening;
  }

  /**
   * Setter for the websocket listening status
   * 
   * @public
   * @property
   * 
   * @returns websocket.Server
   */
  public set isSocketListening(value: boolean) {
    this._isSocketListening = value;
  }

  constructor(app: Application) {
    this.app = app;
    this.host = app.webApp.get('host');
    this.port = app.webApp.get('port');
    this._httpClient = http.createServer(this.app.webApp);
    this.isSocketListening = false;
  }

  /**
   * Like a push of a button, this turns on the Webserver
   * 
   * @returns void
   */
  public turnOn() : void {
    this.httpClient.listen(this.port, () => {
      // log successful connection
      this.app.logger.info('Application is running on %s:%s in %s mode ...',
        this.host,
        this.port,
        this.app.environment,
      );
      this.app.logger.info('To shutdown press CTRL+C\n');
    });
    this.httpClient.on('error', (err) => {
      // log errors while connecting
      this.app.logger.error(`Error occurred while turning on server ${ err }`);
    });
  }

  /**
   * Also, like a push of a button or a command, this turns off the Webserver
   * 
   * @returns void
   */
  public shutdown() : void {
    if (this.httpClient) {
      this.httpClient.close();
      this.httpClient.on('close', () => {
        // log shutdown
        this.app.logger.info('Application is closing ..');
      });
    }
  }

  /**
   * Connects a websocket server on existing met server connection
   * 
   * @param socket 
   * 
   * @returns void
   */
  public bindWebsocketServer(socket: webSocket.Server) {
    if (!this.app.config.websocketEnabled) {
      this.isSocketListening = false;
      throw new Error('Unable to bind websocket to existing server');
    }

    this._websocket = socket;
  }

  /**
   * Returns the host
   * 
   * @returns string
   */
  public getHost() {
    return this.host;
  }

  /**
   * Returns the port
   * 
   * @returns number | string
   */
  public getPort() {
    return this.port;
  }
}

export default WebServer;
