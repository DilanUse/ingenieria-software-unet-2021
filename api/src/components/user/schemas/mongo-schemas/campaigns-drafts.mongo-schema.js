const mongoose = require('mongoose');

const { Schema } = mongoose;

const { smsCampaignSchemaMongo } = require('../../../campaigns/sms-campaign/schemas/sms-campaign.mongo-schemas');

const { TYPE: CAMPAIGN_TYPE } = require('../../../../http/constants/common-campaign.constants');

module.exports = new Schema({
  [CAMPAIGN_TYPE.SMS]: smsCampaignSchemaMongo,
},
{
  _id: false,
  strict: false,
});
