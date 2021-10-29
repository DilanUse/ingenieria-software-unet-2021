const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { createServer } = require('http');
const ngrok = require('ngrok');
const router = require('../http/routes');
const { config } = require('../config');
const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('../http/middlewares/error-handler.middleware.js');
const notFoundHandler = require('../http/middlewares/not-found-handler.middleware');
const { ngrokUrl } = require('../utils/common/common');

const app = express();
const http = createServer(app);

function setAppMiddlewares() {
  app.use(session({
    name: 'session',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: config.refreshTokenExpiresInSeconds,
      httpOnly: true,
      // sameSite: 'lax',
      // domain: 'localhost',
    },
  }));

  // body parser
  app.use(express.json({
    limit: '200mb',
    verify(req, res, buf, encoding) {
      req.rawBody = buf;
    },
  }));

  app.use(express.urlencoded({ extended: true }));

  app.use(cors({
    origin: config.cors,
    credentials: true,
  }));

  app.use(express.static('public'));
}

function registerRoutes() {
// routes
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.get('/json', (req, res) => {
    res.json({ hello: 'World!' });
  });

  router(app);
}

function setErrorMiddlewares() {
  // Catch 404
  app.use(notFoundHandler);

  // Errors middleware
  app.use(logErrors);
  app.use(wrapErrors);
  app.use(errorHandler);
}

function listen() {
  http.setTimeout(1200000);

  http.listen(config.port, () => {
    console.log(`Listening http://localhost:${config.port}`);
    if (config.dev) {
      (async function connectNgrok() {
        const url = await ngrok.connect(config.port);

        ngrokUrl.push(url);
        console.log(`Api local server is publicly-accessible at ${url}`);
      }());
    }
  });
}

module.exports = {
  app,
  http,
  setAppMiddlewares,
  setErrorMiddlewares,
  registerRoutes,
  listen,
};
