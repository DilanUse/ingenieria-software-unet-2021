const ResourceController = require('../../../http/controllers/resource.controller');
const service = require('./sms-template.service');

class SmsTemplateController extends ResourceController {
  constructor() {
    super({ service });
    this.service = service;
  }
}

const singletonInstance = new SmsTemplateController();

module.exports = singletonInstance;
