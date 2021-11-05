const CommonCampaignController = require('../../../http/controllers/common-campaign.controller');
const service = require('./sms-campaign.service');

class SmsCampaignController extends CommonCampaignController {
  constructor() {
    super({ service });
    this.service = service;
  }

  async dlrHandlerCallback(req) {
    const {
      status, mobile, datetime, userId, idCampaign, message_id, idContact,
    } = req.query;

    const informationWebHook = {
      status,
      mobile,
      datetime,
      userId,
      idCampaign,
      message_id,
      idContact,
    };

    return this.service.dlrCallback(informationWebHook);
  }
}

const singletonInstance = new SmsCampaignController();

module.exports = singletonInstance;
