const boom = require('@hapi/boom');
const { HTTP_OPERATIONS } = require('../constants');

const resourceMiddlewareObject = {};

resourceMiddlewareObject.validateResourceManyOperation = async ({
  service, tenantId, payloadIds, next, operation,
}) => {
  try {
    const resource = await service.getResourcesForDeleteOrRestore({
      tenantId,
    });
    let countCoincidence = 0;
    let messageError = '';

    if (operation === HTTP_OPERATIONS.DELETE_MANY) messageError = 'delete';
    else if (operation === HTTP_OPERATIONS.RESTORE_MANY) messageError = 'restore';

    payloadIds.forEach((id) => {
      // eslint-disable-next-line no-underscore-dangle
      const result = resource.findIndex((r) => (r._id).toString() === id);

      // eslint-disable-next-line no-plusplus
      if (result !== -1) countCoincidence++;
    });

    if (payloadIds.length !== countCoincidence) {
      next(boom.unauthorized(`You can't ${messageError} any of the resources`));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

resourceMiddlewareObject.validateResourceOneOperation = async ({
  service, tenantId, resourceId, next, operation,
}) => {
  try {
    const resource = await service.getResourceWithPermissions({
      tenantId,
      resourceId,
    });

    let errorMsg;

    switch (operation) {
      case HTTP_OPERATIONS.GET_ONE:
        errorMsg = 'see';
        break;
      case HTTP_OPERATIONS.UPDATE_ONE:
        errorMsg = 'update';
        break;
      case HTTP_OPERATIONS.DELETE_ONE:
        errorMsg = 'delete';
        break;
      case HTTP_OPERATIONS.RESTORE_ONE:
        errorMsg = 'restore';
        break;
      case HTTP_OPERATIONS.CONFIG_PRIVACY:
        errorMsg = 'shared';
        break;

      default:
        errorMsg = '';
    }

    if (!resource) {
      next(boom.unauthorized(`Do you haven't permission for ${errorMsg} this template`));
    } else if (resource.deleted === true
      && (operation === HTTP_OPERATIONS.UPDATE_ONE
        || operation === HTTP_OPERATIONS.CONFIG_PRIVACY)) {
      next(boom.unauthorized(`You can't ${errorMsg} this template because is in trash`));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

resourceMiddlewareObject.mainMiddlewareFunction = async (req, res, next, service, operation = '') => {
  const {
    tenantIdPayloadToken: tenantId,
  } = req.params;

  switch (operation) {
    case HTTP_OPERATIONS.GET_ONE:
    case HTTP_OPERATIONS.UPDATE_ONE:
    case HTTP_OPERATIONS.DELETE_ONE:
    case HTTP_OPERATIONS.CONFIG_PRIVACY:
    case HTTP_OPERATIONS.RESTORE_ONE:
      await resourceMiddlewareObject.validateResourceOneOperation({
        service,
        tenantId,
        resourceId: req.params.id,
        next,
        operation,
      });
      break;

    case HTTP_OPERATIONS.DELETE_MANY:
    case HTTP_OPERATIONS.RESTORE_MANY:
      if (req.body.data !== null) {
        await resourceMiddlewareObject.validateResourceManyOperation({
          service,
          tenantId,
          payloadIds: req.body.data,
          next,
          operation,
        });
      }
      break;

    default:
      next();
  }
};

resourceMiddlewareObject.resourceMiddleware = ({ service, operation = '' }) => async (req, res, next) => {
  await resourceMiddlewareObject.mainMiddlewareFunction(req, res, next, service, operation);
};

module.exports = resourceMiddlewareObject;
