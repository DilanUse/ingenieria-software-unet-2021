import enums from '@/enums';
import smsCampaignService from '@/api/modules/campaigns/sms-campaign.service';

export default {
  // eslint-disable-next-line no-unused-vars
  async fetchAnalytics({ rootState }, params) {
    const resp = await smsCampaignService.getAnalytics(params);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchCountSMSCampaigns({ commit }, params) {
    const resp = await smsCampaignService.getCount(params);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchAllSMSCampaigns({ commit }, params) {
    const resp = await smsCampaignService.getAll(params);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchSMSCampaign({ getters }, smsCampaignId) {
    const resp = await smsCampaignService.getOne({ id: smsCampaignId });
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchSMSCampaignDetails({ getters }, { id, params }) {
    const resp = await smsCampaignService.getDetails({
      id,
      params,
    });
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchTestCostSMSCampaign({ rootState }, payload) {
    const resp = await smsCampaignService.getTestCost(payload);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchCostSMSCampaign({ rootState }, campaignInfo) {
    const resp = await smsCampaignService.getCost(campaignInfo);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchCostSMSQuickCampaign({ rootState }, campaignInfo) {
    const resp = await smsCampaignService.getQuickCost(campaignInfo);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async addSMSCampaign({ commit, rootState }, smsCampaign) {
    const resp = await smsCampaignService.create(smsCampaign);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async addSMSQuickCampaign({ commit }, smsCampaign) {
    const resp = await smsCampaignService.createQuick(smsCampaign);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async exportFile({ commit }, exportInfo) {
    const resp = await smsCampaignService.exportFile(exportInfo);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async editSMSCampaign({ commit, rootState }, { id, ...smsCampaign }) {
    const resp = await smsCampaignService.edit({
      id,
      payload: smsCampaign,
    });

    return resp.data;
  },

  // eslint-disable-next-line no-empty-pattern
  async removeSMSCampaign({}, smsCampaignId) {
    const resp = await smsCampaignService.delete(smsCampaignId);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async removeSMSCampaigns({ commit }, { data = null, filters = {} }) {
    const resp = await smsCampaignService.deleteMany({
      data: data ? data.map((t) => t.id) : null,
      filters,
    });
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async testSMSCampaign({ rootState }, payload) {
    const resp = await smsCampaignService.test(payload);
    return resp.data;
  },
};
