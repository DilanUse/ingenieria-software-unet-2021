import userService from '../../api/modules/user.service';

export default {
  // eslint-disable-next-line no-unused-vars
  async fetchAllUsers({ commit }, params = {}) {
    const resp = await userService.getAll(params);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchAllMerchants({ commit }, params) {
    const resp = await userService.getAllMerchants(params);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchUser({ getters }, userId) {
    const resp = await userService.getOne({ id: userId });
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async inviteUser({ commit }, invitation) {
    const resp = await userService.invite({
      users: invitation,
      params: {},
    });

    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async exportFile({ commit }, exportInfo) {
    const resp = await userService.exportFile(exportInfo);
    return resp.data;
  },

  async saveDraftCampaign({ commit }, {
    campaignDraft,
    campaignType,
    hardDraft = false,
  }) {
    const { id, ...payload } = campaignDraft;
    const resp = await userService.saveDraftCampaign({
      payload,
      campaignType,
      campaignId: id || null,
      hardDraft,
    });

    commit('auth/UPDATE_CAMPAIGN_DRAFT_AUTH_USER', {
      campaignType,
      payload: resp.data,
    }, { root: true });

    return resp.data;
  },

  async discardDraftCampaign({ commit }, {
    campaignId = null,
    campaignType,
  }) {
    const resp = await userService.discardDraftCampaign({
      campaignType,
      campaignId: campaignId || null,
    });

    commit('auth/UPDATE_CAMPAIGN_DRAFT_AUTH_USER', {
      campaignType,
      payload: resp.data,
    }, { root: true });

    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async editUser({ commit }, { id, ...user }) {
    const resp = await userService.edit({
      id,
      payload: user,
    });

    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async removeUser({ commit }, userId) {
    const resp = await userService.delete(userId);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async removeUsers({ commit }, { data, filters = {} }) {
    const resp = await userService.deleteMany({
      data: data.map((user) => user.id),
      filters,
    });

    return resp.data;
  },
};
