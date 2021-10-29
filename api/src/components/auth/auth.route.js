const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const response = require('../../http/response');
const controller = require('./auth.controller');
const { AUTH_STRATEGIES } = require('../../http/constants');
const { config } = require('../../config');
const { USER_STATUS } = require('../user/user.constants');

const {
  AUTH_HTTP_ERRORS_MSG,
  AUTH_HTTP_SUCCESS_MSG,
} = require('./auth.constant');

const { MESSAGE_ERROR_GENERAL } = require('../shared.constant');

require('../../http/auth/basic');

require('../../http/auth/jwtRefresh');

const router = express.Router();

router.get('/verify-token',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.verifyTokenHandler(req).then((data) => {
      response.success(req, res, data, 200, 'User verified');
    }).catch((err) => {
      next(boom.internal('Error in the verification user', err));
    });
  });

router.get('/validate-email-account/link/:email/:securityToken',
  (req, res, next) => {
    controller.validateEmailAccountBySecurityTokenHandler(req).then((success) => {
      if (success) {
        res.redirect(`${config.baseUrlDashboard}/log-in?authEmailVerificationSuccess=true`);
      } else {
        res.redirect(`${config.baseUrlDashboard}/log-in?authEmailVerificationError=true&email=${req.params.email}`);
      }
    }).catch((err) => {
      res.redirect(`${config.baseUrlDashboard}/log-in?authEmailVerificationError=true`);
    });
  });

router.get('/validate-email-account/code/:email/:securityCode',
  (req, res, next) => {
    controller.validateEmailAccountBySecurityCodeHandler(req).then((data) => {
      response.success(req, res, data, 200, 'User verified');
    }).catch((err) => {
      next(boom.internal(err.message, err));
    });
  });

router.get('/resend-email-validate-account/:email',
  (req, res, next) => {
    controller.resendEmailValidateAccount(req).then((data) => {
      response.success(req, res, data, 200, 'Email resend successfully');
    }).catch((err) => {
      next(boom.internal(MESSAGE_ERROR_GENERAL, err));
    });
  });

router.post('/sign-in',
  passport.authenticate(AUTH_STRATEGIES.BASIC, { session: false }), (req, res, next) => {
    controller.signInHandler(req)
      .then((data) => {
        if (!data.twoFactorAuthenticationActivate) {
          req.session.refreshToken = data.refreshToken;
          response.success(req, res, data, 200, AUTH_HTTP_SUCCESS_MSG.login);
        }
        else {
          console.log(`Data ${JSON.stringify(data)}`);
          response.success(req, res, data, 200, 'First step passed');
        }
      }).catch((err) => {
        switch (err.message) {
          case AUTH_HTTP_ERRORS_MSG.EMAIL_ACCOUNT_NOT_VERIFIED:
            next(boom.unauthorized(err.message, 'User no active', { status: USER_STATUS.EMAIL_NOT_VERIFIED }));
            break;
          case AUTH_HTTP_ERRORS_MSG.USER_INACTIVE:
            next(boom.unauthorized(err.message, 'User no active', { status: USER_STATUS.INACTIVE }));
            break;
          case AUTH_HTTP_ERRORS_MSG.USER_INVITED:
            next(boom.unauthorized(err.message, 'User no active', { status: USER_STATUS.INVITED }));
            break;

          default:
            next(boom.internal(err.message, err));
        }
      });
  });

router.post('/sign-up',
  async (req, res, next) => {
    controller.signUpHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, AUTH_HTTP_SUCCESS_MSG.register);
      }).catch((err) => {
        if (err.message === 'email already exist') next(boom.badRequest('The email already exist'));
        else next(boom.internal(err.message, err));
      });
  });

router.post('/invited-sign-up/:email/:securityToken',
  async (req, res, next) => {
    controller.invitedSignUpHandler(req)
      .then((data) => {
        req.session.refreshToken = data.refreshToken;
        response.success(req, res, data, 200, AUTH_HTTP_SUCCESS_MSG.register);
      }).catch((err) => {
        next(boom.internal(AUTH_HTTP_ERRORS_MSG.savingUser, err));
      });
  });

router.post('/recover-password/:emailUser',
  async (req, res, next) => {
    controller.sendRecoveryPasswordEmailHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, AUTH_HTTP_SUCCESS_MSG.recoveryEmailSend);
      }).catch((err) => {
        next(boom.internal(MESSAGE_ERROR_GENERAL, err));
      });
  });

router.post('/refresh-tokens',
  passport.authenticate(AUTH_STRATEGIES.REFRESH_TOKEN, { session: false }), (req, res, next) => {
    controller.refreshTokenHandler(req)
      .then((data) => {
        req.session.refreshToken = data.refreshToken;
        response.success(req, res, data, 200, AUTH_HTTP_SUCCESS_MSG.extendedSession);
      }).catch((err) => {
        next(boom.internal(MESSAGE_ERROR_GENERAL, err));
      });
  });

router.post('/change-password/:securityToken',
  (req, res, next) => {
    controller.changePasswordHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, AUTH_HTTP_SUCCESS_MSG.passwordChanged);
      }).catch((err) => {
        next(boom.internal(MESSAGE_ERROR_GENERAL, err));
      });
  });

router.post('/log-out',
  (req, res, next) => {
    req.session.refreshToken = '';
    response.success(req, res, '', 200, AUTH_HTTP_SUCCESS_MSG.logout);
  });

module.exports = router;
