import Application from './infrastructure/app';
import WebServer from './infrastructure/server';

const app = new Application();
app.config.websocketEnabled = true;

const server = new WebServer(app);
server.turnOn();

// const socket = new websocket.Server({server: server.httpClient});
// server.bindWebsocketServer(socket);

export default server;
