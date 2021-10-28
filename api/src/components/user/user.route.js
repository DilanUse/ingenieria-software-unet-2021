const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const response = require('../../http/response');

const controller = require('./user.controller');

const {
  queryParamsMiddlewareValidation,
  queryParamsPopulateMiddlewareValidation,
} = require('../shared.middleware');

const {
  COMMON_HTTP_SUCCESS_MSG, COMMON_HTTP_ERROR_MSG,
} = require('../shared.constant');
const { AUTH_STRATEGIES } = require('../../http/constants');

// JWT strategy
require('../../http/auth/jwt');

const router = express.Router();

router.get('/',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  queryParamsMiddlewareValidation(),
  queryParamsPopulateMiddlewareValidation(),
  (req, res, next) => {
    controller.getAllHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.GET_ALL);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.GET_ALL, err));
      });
  });

router.get('/merchants',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  queryParamsMiddlewareValidation(),
  queryParamsPopulateMiddlewareValidation(),
  (req, res, next) => {
    controller.getAllMerchantsHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.GET_ALL);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.GET_ALL, err));
      });
  });

router.get('/to-shared',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  queryParamsMiddlewareValidation(),
  queryParamsPopulateMiddlewareValidation(),
  async (req, res, next) => {
    controller.getAllUsersToShareHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.GET_ALL);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.GET_ALL, err));
      });
  });

router.get('/status-by-email/:email',
  async (req, res, next) => {
    controller.getStatusHandler(req).then((data) => {
      response.success(req, res, data, 200, 'Status information');
    }).catch((err) => {
      next(boom.internal('Something is wrong', err));
    });
  });

router.get('/get-campaign-draft/:nameService',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.getCurrentlyCampaignHandler(req).then((data) => {
      response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.GET_ONE);
    }).catch((err) => {
      next(boom.internal(COMMON_HTTP_ERROR_MSG.GET_ONE, err));
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

router.post('/invite',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  queryParamsPopulateMiddlewareValidation(),
  (req, res, next) => {
    controller.inviteUsersHandler(req)
      .then((data) => {
        response.success(req, res, data, 201, COMMON_HTTP_SUCCESS_MSG.CREATED);
      })
      .catch((err) => {
        if (err === 'Error only owner') next(boom.badRequest('Only an owner can update the role of an user to owner'));
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


router.put('/avatar',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.updateAvatarHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.UPDATED);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.UPDATED, err));
      });
  });

// Update profile data

router.put('/profile',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.updateProfileHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.UPDATED);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.UPDATED, err));
      });
  });

// User Password Change

router.put('/password',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.updatePasswordHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.UPDATED);
      }).catch((err) => {
        if (err.message && err.message === 'BadCurrentPassword') {
          next(boom.badRequest('Current password is wrong', err));
        } else {
          next(boom.internal(COMMON_HTTP_ERROR_MSG.UPDATED, err));
        }
      });
  });

router.put('/flags',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.changeValueFlagsHandler(req).then((data) => {
      response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.UPDATED);
    }).catch((err) => {
      next(boom.internal(COMMON_HTTP_ERROR_MSG.UPDATED, err));
    });
  });

router.put('/markers',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.updateMarkersHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.UPDATED);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.UPDATED, err));
      });
  });

router.put('/save-draft-campaign/:campaignType/:id?',
  (req, res, next) => {
    controller.saveDraftCampaignHandler(req).then((data) => {
      response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.UPDATED);
    }).catch((err) => {
      next(boom.internal(COMMON_HTTP_ERROR_MSG.UPDATED, err));
    });
  });

router.put('/discard-draft-campaign/:campaignType/:id?',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.discardDraftCampaignHandler(req).then((data) => {
      response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.UPDATED);
    }).catch((err) => {
      next(boom.internal(COMMON_HTTP_ERROR_MSG.UPDATED, err));
    });
  });

router.put('/:id',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.updateOneHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.UPDATED);
      }).catch((err) => {
        if (err === 'Error only owner') {
          next(boom.badRequest('Only an owner can update the role of an user to owner'));
        }
        next(boom.internal(COMMON_HTTP_ERROR_MSG.UPDATED, err));
      });
  });

router.delete('/avatar',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.deleteAvatarHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.DELETED);
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

// Upgrade data profile

module.exports = router;
