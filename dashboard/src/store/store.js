import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import getters from './getters';
import { mutations } from './mutations';
import actions from './actions';
import plugins from './plugins';

import auth from './auth/auth.module';
import user from './user/user.module';
import contact from './contacts/contact/contact.module';
import smsTemplate from './templates/sms-template/sms-template.module';
import callerId from './senders-ids/caller-id/caller-id.module';
import smsCampaign from './campaigns/sms-campaign/sms-campaign.module';

Vue.use(Vuex);

export default new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  plugins,
  modules: {
    auth,
    user,
    contact,
    smsTemplate,
    callerId,
    smsCampaign,
  },
  strict: process.env.NODE_ENV !== 'production',
});
