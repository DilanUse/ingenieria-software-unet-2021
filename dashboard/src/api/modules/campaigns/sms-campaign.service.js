import configApi from '@/api/config';
import BaseCampaignService from '@/api/modules/campaigns/base-campaign.service';

class SmsCampaignService extends BaseCampaignService {
  constructor() {
    super({ baseUrl: configApi.baseRoutesUrls.smsCampaigns });
  }
}

const singletonInstance = new SmsCampaignService();

export default singletonInstance;
