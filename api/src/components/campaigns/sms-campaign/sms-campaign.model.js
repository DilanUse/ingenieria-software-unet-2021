const mongoose = require('mongoose');
const { smsCampaignSchemaMongo } = require('./schemas/sms-campaign.mongo-schemas');

const ModelSmsCampaign = mongoose.model('smsCampaign', smsCampaignSchemaMongo);

module.exports = ModelSmsCampaign;
