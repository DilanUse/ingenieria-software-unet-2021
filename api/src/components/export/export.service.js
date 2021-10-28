const BaseService = require('../../http/services/base.service');
const repository = require('./export.repository');
const Constructor = require('./export.constructor');
const { getQueryFindBeforePastDate } = require('../shared.functions');

class ExportService extends BaseService {
  constructor() {
    super({ repository, Constructor });
    this.repository = repository;
    this.Constructor = Constructor;
    this.DAYS_TO_DELETE_EXPORTS = 30;
  }

  async deleteExportsTimeOut() {
    const queryFind = getQueryFindBeforePastDate({
      field: 'createdAt',
      daysOffset: this.DAYS_TO_DELETE_EXPORTS,
    });

    return this.repository.deleteMany(queryFind);
  }
}

const singletonInstance = new ExportService();

module.exports = singletonInstance;
