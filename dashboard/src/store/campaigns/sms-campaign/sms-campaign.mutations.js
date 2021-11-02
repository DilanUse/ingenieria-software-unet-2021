
export default {

  SET_FROM_SMS_TEMPLATE(state, smsTemplate) {
    state.fromSMSTemplate = smsTemplate;
  },


  SET_SMS_CAMPAIGN_PAYLOAD(state, campaignPayload) {
    state.payload = campaignPayload;
  },
};
