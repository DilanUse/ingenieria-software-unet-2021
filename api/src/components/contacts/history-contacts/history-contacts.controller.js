const BaseController = require('../../../http/controllers/base.controller');
const service = require('./history-contacts.service');

class HistoryContactsController extends BaseController {
  constructor() {
    super({ service });
    this.service = service;
  }

  async getAnalyticsLinesHandler(req) {
    const { dateStart, dateEnd } = req.query;
    const { tenantIdPayloadToken: tenantId } = req.params;

    return this.service.getAnalyticsLines({
      dateStart,
      dateEnd,
      tenantId,
    });
  }
}

const singletonInstance = new HistoryContactsController();

module.exports = singletonInstance;
