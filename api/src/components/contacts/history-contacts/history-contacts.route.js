const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const response = require('../../../http/response');

const controller = require('./history-contacts.controller');

const { AUTH_STRATEGIES } = require('../../../http/constants');
// JWT strategy
require('../../../http/auth/jwt');

const router = express.Router();

router.get('/analytics-lines',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.getAnalyticsLinesHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, 'Information analytics return successfully');
      }).catch((err) => {
        next(boom.internal('Error in the information analytics return', err));
      });
  });

module.exports = router;
