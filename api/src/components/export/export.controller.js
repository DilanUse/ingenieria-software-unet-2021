const BaseController = require('../../http/controllers/base.controller');
const service = require('./export.service');

class ExportController extends BaseController {
  constructor() {
    super({ service });
    this.service = service;
  }
}

const singletonInstance = new ExportController();

module.exports = singletonInstance;
