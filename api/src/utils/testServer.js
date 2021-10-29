const express = require('express');
const supertest = require('supertest');
const cors = require('cors');
const { config } = require('../config');

function testServer(route, pathModule) {
  const app = express();
  // route(app);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({
    origin: config.cors,
  }));
  app.use(pathModule, route);
  return supertest(app);
}

module.exports = testServer;
