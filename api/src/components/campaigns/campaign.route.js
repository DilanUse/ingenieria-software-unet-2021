const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');

const response = require('../../http/response');

const controller = require('./campaign.controller');

const { AUTH_STRATEGIES } = require('../../http/constants');

const router = express.Router();

router.get('/count',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.getTotalCampaignsOrganization(req).then((data) => {
      response.success(req, res, data, 200, 'Return total campaigns organization successfully');
    }).catch((err) => {
      next(boom.internal('Error in the return of the campaigns organization', err));
    });
  });

module.exports = router;
