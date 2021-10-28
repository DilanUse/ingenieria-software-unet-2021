const express = require('./express');
const connectDb = require('./db');
const seeders = require('../http/seeders');

function bootstrap() {
  connectDb().then(() => {
    seeders.run();
  }); // connect to db

  express.setAppMiddlewares();
  express.registerRoutes();
  express.setErrorMiddlewares();
  express.listen();
}

module.exports = bootstrap;
