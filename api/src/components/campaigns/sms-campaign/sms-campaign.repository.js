const CommonCampaignRepository = require('../../../http/repositories/common-campaign.repository');
const model = require('./sms-campaign.model');

class SmsCampaignRepository extends CommonCampaignRepository {
  constructor() {
    super({ model });
    this.model = model;
  }
}

const singletonInstance = new SmsCampaignRepository();

module.exports = singletonInstance;
