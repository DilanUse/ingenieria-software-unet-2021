const exportFileService = require('./export-file.service');
const sharedFunctions = require('../../components/shared.functions');
const baseFunctions = require('../functions/base.functions');

class BaseService {
  constructor({ repository, Constructor }) {
    this.repository = repository;
    this.Constructor = Constructor;
  }

  getAll({
    queryFind, skip = 0, limit = 0, fieldSort = '',
  }) {
    return this.repository.get({
      queryFind,
      skip,
      limit,
      fieldSort,
    });
  }

  getCount(queryFind) {
    return this.repository.count(queryFind);
  }

  getOne(id) {
    return this.repository.getOneById(id);
  }

  getOneByQueryFind(queryFind) {
    return this.repository.getOne(queryFind);
  }

  async createOne({ payload, tenant, creator = null }) {
    const newRecord = new this.Constructor({
      ...payload,
      tenant,
      creator,
    });

    return this.repository.createOne(newRecord);
  }

  async importFromFile({ payload, tenant, creator }) {
    const recordsSaved = await this.repository.createMany({
      payload: payload.map((p) => new this.Constructor({
        ...p,
        tenant,
        creator,
      })),
    });

    return baseFunctions.getImportFromFileResult({
      payload, recordsSaved,
    });
  }

  async exportIntoFile({
    queryFind, fieldSort, userNameFile, columns,
    format, userId, userRole, tenantId, entity,
    separator = ',', sendEmail = false,
  }) {
    const records = await this.repository.get({
      queryFind,
      fieldSort,
    });

    return exportFileService.makeExportOperation({
      rows: records,
      userNameFile,
      columns,
      format,
      userId,
      userRole,
      separator,
      sendEmail,
      entity,
      tenantId,
    });
  }

  async updateOne({ id, payload }) {
    return this.repository.updateOne({
      payload,
      id,
    });
  }

  async updateMany({ ids, payload }) {
    return this.repository.updateMany({ ids, payload });
  }

  async deleteOne(id) {
    return this.repository.deleteOne({ _id: id });
  }

  async deleteMany({
    ids, queryFind,
  }) {
    if (ids && Array.isArray(ids)) {
      // eslint-disable-next-line no-param-reassign
      queryFind = { _id: { $in: ids } };
    }

    return this.repository.deleteMany(queryFind);
  }

  async getResourceWithPermissions({
    tenantId, id,
  }) {
    const queryFind = sharedFunctions.getQueryFindForPublic({
      tenantId,
      idResource: id,
    });

    return this.repository.getOne(queryFind);
  }

  async getResourcesForDelete({ tenantId }) {
    const queryFind = sharedFunctions.getQueryFindForPublic({
      tenantId,
    });

    return this.repository.get({ queryFind });
  }

  async createMany(arrayRecords) {
    return this.repository.createMany({
      payload: arrayRecords,
    });
  }
}

module.exports = BaseService;
