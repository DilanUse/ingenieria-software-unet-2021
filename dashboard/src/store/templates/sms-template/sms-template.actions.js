import smsTemplateService from '@/api/modules/templates/sms-template.service';

export default {

  // eslint-disable-next-line no-unused-vars
  async fetchAllSMSTemplates({ commit }, params = {}) {
    const resp = await smsTemplateService.getAll(params);
    return resp.data;
  },


  // eslint-disable-next-line no-unused-vars
  async fetchAllSMSTemplatesFromTrash({ commit }, params) {
    const resp = await smsTemplateService.getAllFromTrash(params);
    return resp.data;
  },


  // eslint-disable-next-line no-unused-vars
  async fetchSMSTemplate({ getters }, smsTemplateId) {
    const resp = await smsTemplateService.getOne({ id: smsTemplateId });
    return resp.data;
  },


  async addSMSTemplate({ commit }, smsTemplate) {
    const resp = await smsTemplateService.create(smsTemplate);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async importFromFile({ commit }, smsTemplates) {
    const resp = await smsTemplateService.importFromFile(smsTemplates);
    return resp.data;
  },


  // eslint-disable-next-line no-unused-vars
  async exportFile({ commit }, exportInfo) {
    const resp = await smsTemplateService.exportFile(exportInfo);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async editSMSTemplate({ commit }, { id, ...smsTemplate }) {
    await smsTemplateService.edit({
      id,
      payload: smsTemplate,
    });
  },


  // eslint-disable-next-line no-unused-vars
  async restoreSMSTemplate({ commit }, smsTemplateId) {
    const resp = await smsTemplateService.restore(smsTemplateId);
    return resp.data;
  },


  // eslint-disable-next-line no-unused-vars
  async removeSMSTemplate({ commit }, smsTemplateId) {
    const resp = await smsTemplateService.delete(smsTemplateId);
    return resp.data;
  },


  // eslint-disable-next-line no-unused-vars
  async removeSMSTemplates({ commit }, { data = null, filters = {} }) {
    const resp = await smsTemplateService.deleteMany({
      data: data ? data.map((t) => t.id) : null,
      filters,
    });

    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async restoreSMSTemplates({ commit }, { data = null, filters = {} }) {
    const resp = await smsTemplateService.restoreMany({
      data: data ? data.map((t) => t.id) : null,
      filters,
    });

    return resp.data;
  },
};
