// Lance le serveur de développement webpack (react-scripts) en tâche de fond.
process.on('uncaughtException', e => console.error('UNCAUGHT:', e));
process.on('unhandledRejection', e => console.error('UNHANDLED:', e));
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.BABEL_ENV = process.env.BABEL_ENV || 'development';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const configFactory = require('react-scripts/config/webpack.config.js');
const createDevServerConfig = require('react-scripts/config/webpackDevServer.config.js');

const config = configFactory('development');
const compiler = webpack(config);
const serverConfig = createDevServerConfig({}, 'localhost');
serverConfig.host = '127.0.0.1';
serverConfig.port = 3000;
const devServer = new WebpackDevServer(serverConfig, compiler);
devServer.startCallback(() => {
  console.log('DEV SERVER LANCE sur http://localhost:3000');
});

// Empêche le processus de se terminer : le handle du serveur semble se perdre
// quand stdout est un pipe (processus lancé sans TTY) sous Windows.
setInterval(() => {}, 1 << 30);
// Journal de vie
const fslog = require('fs');
const logp = __dirname + '/dev-server.log';
process.on('exit', c => fslog.appendFileSync(logp, 'EXIT ' + c + ' ' + new Date().toISOString() + '\n'));
process.on('SIGINT', () => { fslog.appendFileSync(logp, 'SIGINT\n'); process.exit(0); });
process.on('SIGTERM', () => { fslog.appendFileSync(logp, 'SIGTERM\n'); process.exit(0); });
process.on('SIGHUP', () => { fslog.appendFileSync(logp, 'SIGHUP\n'); process.exit(0); });
fslog.appendFileSync(logp, 'START ' + new Date().toISOString() + '\n');
