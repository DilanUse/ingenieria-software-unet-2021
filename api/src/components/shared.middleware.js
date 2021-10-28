const boom = require('@hapi/boom');
const { config } = require('../config');

function queryParamsPopulateMiddlewareValidation() {
  return async (req, res, next) => {
    const {
      populate,
    } = req.query;

    try {
      const populateArray = typeof populate === 'string'
        ? JSON.parse(populate)
        : populate || [];

      for (let i = 0; i < populateArray.length; i += 1) {
        populateArray[i] = typeof populateArray[i] === 'string'
          ? JSON.parse(populateArray[i])
          : populateArray[i];
      }

      req.query.populate = populateArray;
    } catch (e) {
      req.query.populate = [];
    }

    next();
  };
}

function queryParamsMiddlewareValidation() {
  return async (req, res, next) => {
    const {
      limit, skip, filters, sortBy, filtersMatch,
    } = req.query;

    req.query.limit = Number(limit) || 0;
    req.query.skip = Number(skip) || 0;

    try {
      req.query.filters = typeof filters === 'string'
        ? JSON.parse(filters)
        : filters || {};
    } catch (e) {
      req.query.filters = {};
    }

    try {
      const sortByArray = typeof sortBy === 'string'
        ? JSON.parse(sortBy)
        : sortBy || [];

      for (let i = 0; i < sortByArray.length; i += 1) {
        sortByArray[i] = typeof sortByArray[i] === 'string'
          ? JSON.parse(sortByArray[i])
          : sortByArray[i];
      }

      req.query.sortBy = sortByArray;

      req.query.filtersMatch = (filtersMatch) || 'all';
      // req.query.filtersMatch = (filtersMatch) || 'any';
    } catch (e) {
      req.query.sortBy = [];
    }

    next();
  };
}

function payloadSizeMiddleware(maxSize = config.requestMaxPayloadSize) {
  return (req, res, next) => {
    const payloadSize = Number(req.get('Content-Length')) || 0;

    if (payloadSize > maxSize) {
      next(boom.entityTooLarge());
    }

    next();
  };
}

function uniqueValueInOrganizationMiddleware({ service, messageError, field }) {
  return async (req, res, next) => {
    const payload = req.body;
    const { tenantIdPayloadToken: tenant, id } = req.params;
    const queryFind = {
      tenant,
      [field]: payload[field],
    };

    if (id) {
      // eslint-disable-next-line no-underscore-dangle
      queryFind._id = { $ne: id };
    }

    const found = await service.getOneByQueryFind(queryFind);

    if (found) {
      next(boom.badRequest(messageError));
    } else {
      next();
    }
  };
}

module.exports = {
  queryParamsMiddlewareValidation,
  queryParamsPopulateMiddlewareValidation,
  payloadSizeMiddleware,
  uniqueValueInOrganizationMiddleware,
};
