const moment = require('moment');
const axios = require('axios');
const { config } = require('../../../config');
const { ROLES_SYSTEM } = require('../../shared.constant');
const { getFiltersForQueryFind } = require('../../shared.functions');
const { shortUrl } = require('../../../http/services/url-short.service');

async function getOptOutUrl({ contactId, optOutToken, nameService }) {
  const urlConvert = `${config.baseUrlDashboard}/contacts/opt-out/${contactId}/${optOutToken}/${nameService}`;
  return shortUrl(urlConvert);
}

function getQueryFindForModifyContacts({
  tenantId, userRole, userId, idResource = '', filters = {}, filtersMatch = 'all',
}) {
  const conditionalsOr = [{
    creator: userId,
  }];

  let queryFind;
  const objectCondition = {
    tenant: tenantId,
  };

  conditionalsOr.push(objectCondition);

  queryFind = {
    $or: conditionalsOr,
  };

  if (idResource !== '') {
    // eslint-disable-next-line no-underscore-dangle
    queryFind._id = idResource;
  }

  if (filters !== '') {
    const objectFiltersField = getFiltersForQueryFind({
      filters,
      filtersMatch,
    });

    queryFind = {
      ...queryFind,
      ...objectFiltersField,
    };
  }

  return queryFind;
}

function getMappedPayloadToSave(payload) {
  const mappedPayload = payload;

  if (typeof payload === 'object' && payload !== null) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(payload)) {
      // eslint-disable-next-line no-restricted-globals
      if (/^[0-9a-fA-F]{24}$/.test(key) && value && typeof value === 'string' && Number.isNaN(Number(value))) {
        const date = new Date(value);
        const momentDate = moment(date);
        if (momentDate.isValid()) {
          mappedPayload[key] = moment.utc(momentDate).toDate();
        }
      }
    }
  }

  return mappedPayload;
}

module.exports = {
  getOptOutUrl,
  getQueryFindForModifyContacts,
  getMappedPayloadToSave,
};
