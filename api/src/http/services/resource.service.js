const BaseService = require('./base.service.js');
const {
  DAYS_DELETE_TRASH,
} = require('../constants/resource.constants');
const sharedFunctions = require('../../components/shared.functions');

class ResourceService extends BaseService {
  constructor({ repository, Constructor }) {
    super({ repository, Constructor });
    this.repository = repository;
    this.Constructor = Constructor;
  }

  getCountInTrash(queryFind) {
    return this.repository.countTrash(queryFind);
  }

  getAllInTrash({
    queryFind, skip = 0, limit = 0, fieldSort = '',
  }) {
    return this.repository.getInTrash({
      queryFind, skip, limit, fieldSort,
    });
  }

  async getResourceWithPermissions({
    tenantId, resourceId,
  }) {
    const queryFind = {
      tenant: tenantId,
      _id: resourceId,
    };
    return this.repository.getOne(queryFind);
  }

  async getResourcesForDeleteOrRestore({
    tenantId,
  }) {
    const queryFind = {
      tenant: tenantId,
    };

    return this.repository.getAll(queryFind);
  }

  async updatePrivacy({ id, payload }) {
    return this.repository.updateOne({
      payload,
      id,
    });
  }

  async restoreOne(id) {
    const queryFind = { _id: id };
    return this.repository.restoreOne(queryFind);
  }

  async deleteOne({
    id, userId, tenantId, userRole,
  }) {
    return this.repository.deleteOne({
      id,
      userId,
      tenantId,
      userRole,
    });
  }

  async deleteMany({
    ids, queryFind, userId, tenantId, userRole,
  }) {
    if (ids === null) {
      const records = await this.repository.getAll(queryFind);
      // eslint-disable-next-line no-underscore-dangle,no-param-reassign
      ids = records.map((t) => t._id);
    }

    return this.repository.deleteMany({
      ids,
      userId,
      tenantId,
      userRole,
    });
  }

  async deleteTrashTimeOut() {
    const queryFind = sharedFunctions.getQueryFindBeforePastDate({
      field: 'deletedAt',
      daysOffset: DAYS_DELETE_TRASH,
    });

    return this.repository.deleteTrashTimeOut(queryFind);
  }

  async restoreMany({ ids, queryFind }) {
    if (ids && Array.isArray(ids)) {
      // eslint-disable-next-line no-param-reassign
      queryFind = { _id: { $in: ids } };
    }

    return this.repository.restoreMany(queryFind);
  }
}

module.exports = ResourceService;
