const BaseRepository = require('../../../http/repositories/base.repository');
const model = require('./caller-id.model');

class CallerIdRepository extends BaseRepository {
  constructor() {
    super({ model });
    this.model = model;
  }
}

const singletonInstance = new CallerIdRepository();

module.exports = singletonInstance;
