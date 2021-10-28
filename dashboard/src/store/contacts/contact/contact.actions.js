import contactService from '@/api/modules/contacts/contact.service';


export default {

  // eslint-disable-next-line no-unused-vars
  async fetchAnalyticsLines({ rootState }, params) {
    const resp = await contactService.getAnalyticsLines(params);
    return resp.data;
  },


  // eslint-disable-next-line no-unused-vars
  async fetchAnalyticsPie({ rootState }) {
    const resp = await contactService.getAnalyticsPie();
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchCountContacts({ commit }, params) {
    const resp = await contactService.getCount(params);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async fetchAllContacts({ commit }, params) {
    const resp = await contactService.getAll(params);
    return resp.data;
  },


  // eslint-disable-next-line no-unused-vars
  async fetchAllContactsFromTrash({ commit }, params) {
    const resp = await contactService.getAllFromTrash(params);
    return resp.data;
  },


  // eslint-disable-next-line no-unused-vars
  async fetchContact({ getters }, contactId) {
    const resp = await contactService.getOne({ id: contactId });
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async addContact({ commit }, contact) {
    const resp = await contactService.create(contact);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async checkDncCost({ rootState }, { data = null, filters = {} }) {
    const resp = await contactService.checkDncCost({
      data: data ? data.map((t) => t.id) : null,
      filters,
    });
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async checkDncContacts({ rootState }, { data = null, filters = {} }) {
    const resp = await contactService.checkDnc({
      data: data ? data.map((t) => t.id) : null,
      filters,
    });
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async importFromFile({ commit, rootState }, payloads) {
    const resp = await contactService.importFromFile(payloads);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async exportFile({ commit }, exportInfo) {
    const resp = await contactService.exportFile(exportInfo);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async editContact({ commit }, { id, ...contact }) {
    const resp = await contactService.edit({
      id,
      payload: contact,
    });
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async restoreContact({ commit }, contactId) {
    const resp = await contactService.restore(contactId);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async removeContact({ commit }, contactId) {
    const resp = await contactService.delete(contactId);
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async removeContacts({ rootState }, { data = null, filters = {} }) {
    const resp = await contactService.deleteMany({
      data: data ? data.map((t) => t.id) : null,
      filters,
    });
    return resp.data;
  },

  // eslint-disable-next-line no-unused-vars
  async restoreContacts({ rootState }, { data = null, filters = {} }) {
    const resp = await contactService.restoreMany({
      data: data ? data.map((t) => t.id) : null,
      filters,
    });
    return resp.data;
  },
};
