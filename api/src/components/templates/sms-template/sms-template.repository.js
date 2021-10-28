const ResourceRepository = require('../../../http/repositories/resource.repository');
const model = require('./sms-template.model');

class SmsTemplateRepository extends ResourceRepository {
  constructor() {
    super(model);
    this.model = model;
  }
}

const singletonInstance = new SmsTemplateRepository();

module.exports = singletonInstance;
