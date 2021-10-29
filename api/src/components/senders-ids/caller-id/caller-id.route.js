const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const response = require('../../../http/response');

const controller = require('./caller-id.controller');

const {
  queryParamsMiddlewareValidation, queryParamsPopulateMiddlewareValidation,
} = require('../../shared.middleware');

const { COMMON_HTTP_SUCCESS_MSG, COMMON_HTTP_ERROR_MSG } = require('../../shared.constant');
const { AUTH_STRATEGIES } = require('../../../http/constants');

// JWT strategy
require('../../../http/auth/jwt');

const router = express.Router();

router.get('/',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  queryParamsMiddlewareValidation(),
  queryParamsPopulateMiddlewareValidation(),
  (req, res, next) => {
    controller.getAllHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.GET_ALL);
      })
      .catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.GET_ALL, err));
      });
  });

router.get('/:id',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  queryParamsPopulateMiddlewareValidation(),
  (req, res, next) => {
    controller.getOneHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.GET_ONE);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.GET_ONE, err));
      });
  });

router.get('/verify-phone/:id',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.generateCodeForVerificationHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, 'Code Send Successfully');
      }).catch((err) => {
        next(boom.internal('Code not send', err));
      });
  });

router.get('/check-verify-phone/:id/:codeVerification',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.checkCodeVerificationHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, 'Code Verified');
      }).catch((err) => {
        if (err.message === 'Error code verified') {
          next(boom.badRequest('Code Verification is not valid'));
        }

        next(boom.internal('Error code verified', err));
      });
  });

router.post('/',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.createOneHandler(req)
      .then((data) => {
        response.success(req, res, data, 201, COMMON_HTTP_SUCCESS_MSG.CREATED);
      })
      .catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.CREATED, err));
      });
  });

router.post('/export-file',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.exportIntoFileHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.EXPORTED_FILE);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.EXPORTED_FILE, err));
      });
  });

router.put('/:id',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.updateOneHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.UPDATED);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.UPDATED, err));
      });
  });

router.delete('/:id',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.deleteOneHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.DELETED);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.DELETED, err));
      });
  });

router.patch('/',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.deleteManyHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.DELETED);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.DELETED, err));
      });
  });

module.exports = router;
