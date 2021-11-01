import configApi from '@/api/config';
import BaseService from '@/api/base.service';

class CampaignService extends BaseService {
  constructor() {
    super({ baseUrl: configApi.baseRoutesUrls.campaigns });
  }
}

const singletonInstance = new CampaignService();

export default singletonInstance;
