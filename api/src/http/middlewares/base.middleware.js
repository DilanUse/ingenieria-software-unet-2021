const boom = require('@hapi/boom');
const { HTTP_OPERATIONS } = require('../constants');

const baseMiddlewareObject = {};

baseMiddlewareObject.validateResourceManyOperation = async ({
  service, userId, userRole, tenantId, payloadIds, next,
}) => {
  console.log('Llego validateResourceManyOperation');
  try {
    const resource = await service.getResourcesForDelete({
      userId,
      userRole,
      tenantId,
    });

    let countCoincidence = 0;

    payloadIds.forEach((id) => {
      // eslint-disable-next-line no-underscore-dangle
      const result = resource.findIndex((r) => (r._id).toString() === id);

      // eslint-disable-next-line no-plusplus
      if (result !== -1) countCoincidence++;
    });

    if (payloadIds.length !== countCoincidence) {
      next(boom.unauthorized('You can\'t delete any of the resources'));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

baseMiddlewareObject.validateResourceOneOperation = async ({
  service, userId, userRole, tenantId, resourceId, next, operation,
}) => {
  try {
    const resource = await service.getResourceWithPermissions({
      userId,
      userRole,
      tenantId,
      id: resourceId,
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
      default:
        next();
    }

    if (!resource) {
      next(boom.unauthorized(`Do you not permission for ${errorMsg} this resource`));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

baseMiddlewareObject.mainMiddlewareFunction = async (req, res, next, service, operation = '') => {
  const {
    tenantIdPayloadToken: tenantId,
    userIdPayloadToken: userId,
    userRolePayloadToken: userRole,
  } = req.params;

  switch (operation) {
    case HTTP_OPERATIONS.GET_ONE:
    case HTTP_OPERATIONS.UPDATE_ONE:
    case HTTP_OPERATIONS.DELETE_ONE:
      await baseMiddlewareObject.validateResourceOneOperation({
        service,
        userId,
        userRole,
        tenantId,
        resourceId: req.params.id,
        next,
        operation,
      });
      break;
    case HTTP_OPERATIONS.DELETE_MANY:
      if (req.body.data !== null) { // todo: review this for filters
        await baseMiddlewareObject.validateResourceManyOperation({
          service,
          userId,
          userRole,
          tenantId,
          payloadIds: req.body.data,
          next,
        });
      }
      break;
    default:
      next();
  }
};

baseMiddlewareObject.baseMiddleware = ({ service, operation = '' }) => async (req, res, next) => {
  await baseMiddlewareObject.mainMiddlewareFunction(req, res, next, service, operation);
};

module.exports = baseMiddlewareObject;
