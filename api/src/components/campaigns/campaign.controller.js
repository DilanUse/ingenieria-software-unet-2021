const smsCampaignService = require('./sms-campaign/sms-campaign.service');

class CampaignController {
  // eslint-disable-next-line class-methods-use-this
  async getTotalCampaignsOrganization(req) {
    const { tenantIdPayloadToken: tenantId } = req.params;

    const queryFind = {
      status: 'completed',
      tenant: tenantId,
    };

    const countSmsCampaigns = await smsCampaignService.getCount(queryFind);

    return (countSmsCampaigns);
  }
}

const singletonInstance = new CampaignController();

module.exports = singletonInstance;
