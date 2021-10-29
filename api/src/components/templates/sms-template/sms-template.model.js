const mongoose = require('mongoose');
const { smsTemplateMongoSchema } = require('./sms-template.schema');

const SMSTemplateModel = mongoose.model('smsTemplate', smsTemplateMongoSchema);

module.exports = SMSTemplateModel;
