const user = require('../components/user/user.route');
const auth = require('../components/auth/auth.route');
const smsTemplate = require('../components/templates/sms-template/sms-template.route');
const contact = require('../components/contacts/contact/contact.route');
const historyContacts = require('../components/contacts/history-contacts/history-contacts.route');
const callerId = require('../components/senders-ids/caller-id/caller-id.route');
const tenant = require('../components/tenant/tenant.route');
const campaign = require('../components/campaigns/campaign.route');
const smsCampaign = require('../components/campaigns/sms-campaign/sms-campaign.route');

const routes = (server) => {
  server.use('/users', user);
  server.use('/auth', auth);
  server.use('/sms-templates', smsTemplate);
  server.use('/contacts', contact);
  server.use('/history-contacts', historyContacts);
  server.use('/caller-ids', callerId);
  server.use('/tenants', tenant);
  server.use('/campaigns', campaign);
  server.use('/sms-campaigns', smsCampaign);
};

module.exports = routes;
