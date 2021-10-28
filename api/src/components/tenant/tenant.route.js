const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const response = require('../../http/response');

const controller = require('./tenant.controller');

const { AUTH_STRATEGIES } = require('../../http/constants');

// JWT strategy
require('../../http/auth/jwt');

const router = express.Router();

router.get('/flags',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.getFlagsInformationHandler(req).then((data) => {
      response.success(req, res, data, 200, 'Flags information get successfully');
    })
      .catch((err) => {
        next(boom.internal('Something is wrong', err));
      });
  });

router.get('/tenant-from-user',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.getTenantOrganization(req).then((data) => {
      response.success(req, res, data, 200, 'Tenant organization get successfully');
    })
      .catch((err) => {
        next(boom.internal('Something is wrong', err));
      });
  });

module.exports = router;
