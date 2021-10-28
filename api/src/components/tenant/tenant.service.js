const BaseService = require('../../http/services/base.service');
const repository = require('./tenant.repository');
const Constructor = require('./tenant.constructor');

class TenantService extends BaseService {
  constructor() {
    super({ repository, Constructor });
    this.repository = repository;
    this.Constructor = Constructor;
  }

  async createOne({ payload }) {
    const newTenant = new this.Constructor({
      ...payload,
    });

    return this.repository.createOne(newTenant);
  }
}

const singletonInstance = new TenantService();

module.exports = singletonInstance;
