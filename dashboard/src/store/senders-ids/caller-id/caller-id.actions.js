import callerIdService from '@/api/modules/senders-ids/caller-id.service';

export default {
  async fetchAllCallerIds({ commit }, params) {
    const resp = await callerIdService.getAll(params);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchCallerId({ getters }, callerId) {
    const resp = await callerIdService.getOne({ id: callerId });
    return resp.data;
  },

  async addCallerId({ commit }, caller) {
    const resp = await callerIdService.create(caller);
    commit('SET_CALLER_ID_LAST_CREATED', resp.data);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async exportFile({ commit }, exportInfo) {
    const resp = await callerIdService.exportFile(exportInfo);
    return resp.data;
  },


  // eslint-disable-next-line no-unused-vars
  async editCallerId({ commit }, { id, ...caller }) {
    const resp = await callerIdService.edit({
      id,
      payload: caller,
    });
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async removeCallerId({ commit }, callerId) {
    const resp = await callerIdService.delete(callerId);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async removeCallerIds({ commit }, { data = null, filters = {} }) {
    const resp = await callerIdService.deleteMany({
      data: data ? data.map((t) => t.id) : null,
      filters,
    });

    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async initVerifyPhone({ commit }, { callerId }) {
    return callerIdService.initVerifyPhone({ callerId });
  },

  // eslint-disable-next-line no-unused-vars
  async checkVerifyPhoneCode({ commit }, { callerId, code }) {
    return callerIdService.checkVerifyPhone({
      callerId,
      code,
    });
  },
};
