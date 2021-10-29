import ResourceService from '@/api/resource.service';
import configApi from '@/api/config';


class SmsTemplateService extends ResourceService {
  constructor() {
    super({ baseUrl: configApi.baseRoutesUrls.smsTemplates });
  }
}

const singletonInstance = new SmsTemplateService();


export default singletonInstance;
