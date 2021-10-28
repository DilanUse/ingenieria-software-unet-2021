const campaignConstants = require('../../constants/common-campaign.constants');

const campaignsValidations = {
  name: {
    max: 100,
  },
  step: {
    min: 0,
  },
  deliveryType: {
    arrayEnum: Object.values(campaignConstants.DELIVERY_TYPE),
  },
  status: {
    arrayEnum: Object.values(campaignConstants.STATUS),
  },
  outbound: {
    min: 0,
  },
  bounced: {
    min: 0,
  },
  delivered: {
    min: 0,
  },
  contactsNumber: {
    min: 0,
  },
  details: {
    status: {
      arrayEnum: Object.values(campaignConstants.CONTACTS_DETAILS.STATUS),
    },
  },
};

module.exports = {
  campaignsValidations,
};
