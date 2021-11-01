import grapePerksAppService from '@/api';
import BaseService from '@/api/base.service';

export default class BaseCampaignService extends BaseService {
  constructor({ baseUrl }) {
    super({ baseUrl });
  }

  getAnalytics = (params) => grapePerksAppService.get(
    `${this.baseUrl}/analytics`, { params },
  ).then((resp) => resp.data);

  getCountByStatus = () => grapePerksAppService.get(
    `${this.baseUrl}/count-by-status`,
  ).then((resp) => resp.data);

  getCost = (campaignInfo) => grapePerksAppService.post(
    `${this.baseUrl}/get-cost`, campaignInfo,
  ).then((resp) => resp.data);

  getQuickCost = (campaignInfo) => grapePerksAppService.post(
    `${this.baseUrl}/get-cost/quick`, campaignInfo,
  ).then((resp) => resp.data);

  getDetails = ({ id, params = {} }) => grapePerksAppService.get(
    `${this.baseUrl}/details/${id}`, { params },
  ).then((resp) => resp.data);

  createQuick = (payload) => grapePerksAppService.post(
    `${this.baseUrl}/quick`, payload,
  ).then((resp) => resp.data);

  getTestCost = (payload) => grapePerksAppService.post(
    `${this.baseUrl}/get-cost/test`, payload,
  ).then((resp) => resp.data);

  test = (payload) => grapePerksAppService.post(
    `${this.baseUrl}/test`, payload,
  ).then((resp) => resp.data);
}
