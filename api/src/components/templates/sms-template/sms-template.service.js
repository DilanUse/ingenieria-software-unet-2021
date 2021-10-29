const ResourceService = require('../../../http/services/resource.service');
const repository = require('./sms-template.repository');
const Constructor = require('./sms-template.constructor');

class SmsTemplateService extends ResourceService {
  constructor() {
    super({ repository, Constructor });
    this.repository = repository;
    this.Constructor = Constructor;
  }
}

const singletonInstance = new SmsTemplateService();

module.exports = singletonInstance;
