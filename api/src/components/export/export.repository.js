const BaseRepository = require('../../http/repositories/base.repository');
const model = require('./export.model');

class ExportRepository extends BaseRepository {
  constructor() {
    super({ model });
    this.model = model;
  }
}

const singletonInstance = new ExportRepository();

module.exports = singletonInstance;
