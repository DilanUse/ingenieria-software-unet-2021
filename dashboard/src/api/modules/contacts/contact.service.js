import grapePerksAppService from '@/api';
import configApi from '@/api/config';
import BaseService from '@/api/base.service';

class ContactService extends BaseService {
  constructor() {
    super({ baseUrl: configApi.baseRoutesUrls.contacts });
  }

  optOutInfo = ({ contactId, optOutToken }) => grapePerksAppService.get(
    `${this.baseUrl}/opt-out-info/${contactId}/${optOutToken}`,
  ).then((resp) => resp.data);

  getAnalyticsLines = (params) => grapePerksAppService.get(
    '/history-contacts/analytics-lines', { params },
  ).then((resp) => resp.data);

  getAnalyticsPie = () => grapePerksAppService.get(
    `${this.baseUrl}/analytics-pie/`,
  ).then((resp) => resp.data);


  getAllFromTrash = (params) => grapePerksAppService.get(
    `${this.baseUrl}/trash/`, { params },
  ).then((resp) => resp.data);


  checkDncCost = (dataRequest) => grapePerksAppService.post(
    `${this.baseUrl}/dnc-cost`, dataRequest,
  ).then((resp) => resp.data);


  checkDnc = (dataRequest) => grapePerksAppService.post(
    `${this.baseUrl}/dnc-api`, dataRequest,
  ).then((resp) => resp.data);


  restore = (contactId) => grapePerksAppService.put(
    `${this.baseUrl}/restore/${contactId}`, {},
  ).then((resp) => resp.data);


  optOut = ({ contactId, optOutToken, service }) => grapePerksAppService.put(
    `${this.baseUrl}/opt-out/${contactId}/${optOutToken}/${service}`, {},
  ).then((resp) => resp.data);


  restoreMany = (dataRequest) => grapePerksAppService.patch(
    `${this.baseUrl}/restore`, dataRequest,
  ).then((resp) => resp.data);
}

const singletonInstance = new ContactService();

export default singletonInstance;
