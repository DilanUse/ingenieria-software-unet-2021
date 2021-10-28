const express = require('express');
const passport = require('passport');
const joi = require('@hapi/joi');
const boom = require('@hapi/boom');
const response = require('../../../http/response');
const controller = require('./contact.controller');
const {
  idMongoSchema,
} = require('../../../http/schemas/base.schema');

const {
  queryParamsMiddlewareValidation,
  queryParamsPopulateMiddlewareValidation,
} = require('../../shared.middleware');

const { COMMON_HTTP_SUCCESS_MSG, COMMON_HTTP_ERROR_MSG, MODULES_SCOPES } = require('../../shared.constant');

const { AUTH_STRATEGIES } = require('../../../http/constants');

const validationHandler = require('../../../http/middlewares/validation-handler.middleware');
// JWT strategy
require('../../../http/auth/jwt');

const router = express.Router();

router.get('/analytics-pie',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.getAnalyticsPieHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, 'Information analytics return successfully');
      }).catch((err) => {
        next(boom.internal('Error in the information analytics return', err));
      });
  });

/**
 * @swagger
 * /contacts:
 *  get:
 *    tags:
 *      - contacts
 *    description: Used for get all contacts by id audience
 *    parameters:
 *      - in: path
 *        name: idAudience
 *        description: Id Of Audience owner of the contacts
 *    responses:
 *      '200':
 *        description: contacts get successfully
 */
router.get('/',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  queryParamsMiddlewareValidation(),
  queryParamsPopulateMiddlewareValidation(),
  (req, res, next) => {
    controller.getAllHandler({ req, trash: false })
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.GET_ALL);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.GET_ALL, err));
      });
  });

/**
 * @swagger
 * /contacts/trash:
 *  get:
 *    tags:
 *      - contacts
 *    description: Used for get all contacts in the trash for the user token
 *    responses:
 *      '200':
 *        description: Contacts trash get successfully
 */
router.get('/trash',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  queryParamsMiddlewareValidation(),
  queryParamsPopulateMiddlewareValidation(),
  (req, res, next) => {
    controller.getAllHandler({ req, trash: true })
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.GET_ALL);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.GET_ALL, err));
      });
  });

router.get('/count',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.getCountHandler({
      req,
      params: { unregistered: false },
    }).then((data) => {
      response.success(req, res, data, 200, 'Return total contacts organization successfully');
    }).catch((err) => {
      next(boom.internal('Error in the return of the contacts organization', err));
    });
  });

/**
 * @swagger
 * /contacts/:idContact:
 *  get:
 *    tags:
 *      - contacts
 *    description: Used for get a contact
 *    parameters:
 *      - in: path
 *        name: idContact
 *        description: id of contact for get
 *    responses:
 *      '200':
 *        description: contact get successfully
 */
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

router.get('/opt-out-info/:id/:optOutToken',
  validationHandler(joi.object({ id: idMongoSchema, optOutToken: joi.string(), serviceName: joi.string() }), 'params'),
  (req, res, next) => {
    controller.optOutInfoHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, 'Company name return successfully');
      }).catch((err) => {
        if (err === 'different') next(boom.badRequest('The optOut does not correspond to contact'));
        else next(boom.badRequest('The contact doesn\'t exist'));
      });
  });

/**
 * @swagger
 * /contacts/import-csv:
 *  post:
 *    tags:
 *      - contacts
 *    description: Used to create many contacts by an excel file
 *    responses:
 *      '201':
 *        description: x contacts has been CREATED successfully
 */
router.post('/import-from-file',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.importFromFileHandler(req)
      .then((data) => {
        response.success(req, res, data, 201, COMMON_HTTP_SUCCESS_MSG.IMPORTED_FILE);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.IMPORTED_FILE, err));
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

/**
 * @swagger
 * /contacts/get-cost:
 *  post:
 *    tags:
 *      - contacts
 *    description: Used to get the cost total of the contacts
 *    responses:
 *      '200':
 *        description: Total Cost return successfully
 */
router.post('/dnc-cost',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.checkContactsInDNCCostHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, 'Total Cost return successfully');
      })
      .catch((err) => {
        next(boom.internal('Error in the return of cost', err));
      });
  });

/**
 * @swagger
 * /contacts/dnc-api:
 *  post:
 *    tags:
 *      - contacts
 *    description: Used to validate the dnc of contacts
 *    responses:
 *      '200':
 *        description: Contacts validates correctly
 */
router.post('/dnc-api',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.checkContactsInDNCHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, 'Contacts validates correctly');
      })
      .catch((err) => {
        next(boom.internal('An error has ocurred', err));
      });
  });

/**
   * @swagger
   * /contacts/:audienceId:
   *  post:
   *    tags:
   *      - contacts
   *    description: Used to create a new contact
   *    parameters:
   *      - in: path
   *        name: audienceId
   *        description: ID of audience where is contact
   *    responses:
   *      '200':
   *        description: contact CREATED successfully
   */
router.post('/',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.createOneHandler(req)
      .then((contact) => {
        response.success(req, res, contact, 201, COMMON_HTTP_SUCCESS_MSG.CREATED);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_SUCCESS_MSG.CREATED, err));
      });
  });

/**
 * @swagger
 * /contacts/:idContact:
 *  put:
 *    tags:
 *      - contacts
 *    description: Used to edit a contact
 *    parameters:
 *      - in: path
 *        name: idContact
 *        description: id of contact for edit
 *    responses:
 *      '201':
 *        description: contact edited successfully
 */

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

/**
 * @swagger
 * /contacts/setOptOut/:idContact/:optToken:
 *  put:
 *    tags:
 *      - contacts
 *    description: Used to optOut a contact
 *    parameters:
 *      - in: path
 *        name: idContact
 *        description: id of contact for edit
 *      - in: path
 *        name: optToken
 *        description: Token of contact for security
 *    responses:
 *      '200':
 *        description: contact opt Out successfully
 */
router.put('/opt-out/:id/:optToken/:nameService',
  (req, res, next) => {
    controller.setOptOutHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, 'contact opt Out Sucessfully');
      }).catch((err) => {
        if (err !== 'different') next(boom.internal('Error in the update the opt out of the user', err));
        else next(boom.badRequest('The optOut does not correspond to contact'));
      });
  });

/**
 * @swagger
 * /contacts/restore-contact/:idContact:
 *  put:
 *    tags:
 *      - contacts
 *    description: Used to restore a contact of the trash
 *    responses:
 *      '200':
 *        description: Contact Restored successfully
 */
router.put('/restore/:id',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.restoreOneHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.RESTORED);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.RESTORED, err));
      });
  });

/**
 * @swagger
 * /contacts/:idContact:
 *  delete:
 *    tags:
 *      - contacts
 *    description: Used to delete a contact
 *    parameters:
 *      - in: path
 *        name: idContact
 *        description: id of contact for delete
 *    responses:
 *      '200':
 *        description: contact DELETED successfully
 */
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

/**
 * @swagger
 * /contacts/:
 *  patch:
 *    tags:
 *      - contacts
 *    description: Used for delete many contacts
 *    responses:
 *      '200':
 *        description: contacts DELETED successfully
 */
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

/**
 * @swagger
 * /contacts/restore-trash:
 *  patch:
 *    tags:
 *      - contacts
 *    description: Used for restore many contacts
 *    responses:
 *      '200':
 *        description: contacts RESTORED successfully
 */
router.patch('/restore',
  passport.authenticate(AUTH_STRATEGIES.JWT, { session: false }),
  (req, res, next) => {
    controller.restoreManyHandler(req)
      .then((data) => {
        response.success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.RESTORED);
      }).catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.RESTORED, err));
      });
  });

module.exports = router;
