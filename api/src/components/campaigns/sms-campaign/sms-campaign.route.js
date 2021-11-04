const express = require('express');
const passport = require('passport');

const boom = require('@hapi/boom');
const response = require('../../../http/response');
const controller = require('./sms-campaign.controller');

const {
  queryParamsMiddlewareValidation,
  queryParamsPopulateMiddlewareValidation,
} = require('../../shared.middleware');

const { COMMON_HTTP_SUCCESS_MSG, COMMON_HTTP_ERROR_MSG } = require('../../shared.constant');

const { AUTH_STRATEGIES } = require('../../../http/constants');

// JWT strategy
require('../../../http/auth/jwt');

const router = express.Router();

router.get('/analytics',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.getAnalyticsHandler(req).then((data) => {
      response.success(req, res, data, 200, 'Information Chart return successfully');
    })
      .catch((err) => {
        next(boom.internal('Error in the information chart return', err));
      });
  });

router.get('/dlr-callback', (req, res, next) => {
  controller.dlrHandlerCallback(req).then((data) => {
    // response.success(req, res, data, 200, 'dlr-callback');
    res.send(data);
  })
    .catch((err) => {
      next(boom.internal('ERR', err));
      // next(boom.internal(COMMON_HTTP_ERROR_MSG.GET_ALL, err));
    });
});

router.get('/details/:id',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  queryParamsMiddlewareValidation(),
  queryParamsPopulateMiddlewareValidation(),
  (req, res, next) => {
    controller.getAllDetailsHandler(req).then((data) => {
      response.success(req, res, data, 200, 'Get all details campaigns successfully');
    }).catch((err) => {
      next(boom.internal('Error in get details campaigns', err));
    });
  });

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

router.get('/count',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.getCountHandler({ req }).then((data) => {
      response.success(req, res, data, 200, 'Return count of sms campaigns');
    }).catch((err) => {
      next(boom.internal('Error in the return sms campaigns count', err));
    });
  });

router.get('/count-by-status',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.getCountTypesHandler(req).then((data) => {
      response.success(req, res, data, 200, 'Return count of types sms campaigns');
    }).catch((err) => {
      next(boom.internal('Error in the return sms campaigns count of types', err));
    });
  });

router.get('/:id',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  queryParamsPopulateMiddlewareValidation(),
  (req, res, next) => {
    controller.getOneHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.GET_ONE);
      })
      .catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.GET_ONE, err));
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
        if (err === 'Insufficient balance') next(boom.paymentRequired('Payment Required'));
        next(boom.internal(COMMON_HTTP_ERROR_MSG.CREATED, err));
      });
  });

router.post('/get-cost',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.totalCostCampaignHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, 'Total Cost return successfully');
      }).catch((err) => {
        next(boom.internal('Error in the return of cost', err));
      });
  });

router.post('/export-file',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.exportIntoFileHandler(req).then((data) => {
      response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.EXPORTED_FILE);
    }).catch((err) => {
      next(boom.internal(COMMON_HTTP_ERROR_MSG.EXPORTED_FILE, err));
    });
  });

router.put('/:id',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.updateOneHandler(req).then((data) => {
      response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.UPDATED);
    }).catch((err) => {
      next(boom.internal(COMMON_HTTP_ERROR_MSG.UPDATED, err));
    });
  });

router.delete('/:id',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.deleteOneHandler(req).then((data) => {
      response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.DELETED);
    }).catch((err) => {
      next(boom.internal(COMMON_HTTP_ERROR_MSG.DELETED, err));
    });
  });

router.patch('/',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.deleteManyHandler(req).then((data) => {
      response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.DELETED);
    }).catch((err) => {
      next(boom.internal(COMMON_HTTP_ERROR_MSG.DELETED, err));
    });
  });

module.exports = router;
