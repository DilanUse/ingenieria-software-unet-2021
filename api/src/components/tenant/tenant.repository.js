const BaseRepository = require('../../http/repositories/base.repository');
const model = require('./tenant.model');

class TenantRepository extends BaseRepository {
  constructor() {
    super({
      model,
    });
    this.model = model;
  }
}

const singletonInstance = new TenantRepository();
module.exports = singletonInstance;
