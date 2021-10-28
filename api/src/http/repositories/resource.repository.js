const BaseRepository = require('./base.repository');
const { deleteResource } = require('../functions/resource.functions');

class ResourceRepository extends BaseRepository {
  constructor({ model }) {
    super({ model });
    this.model = model;
  }

  countTrash(queryFind) {
    return this.model.findDeleted(queryFind).countDocuments();
  }

  getInTrash({
    queryFind, skip = 0, limit = 0, fieldSort = '',
  }) {
    return this.model.findDeleted(queryFind).sort(fieldSort)
      .skip(skip)
      .limit(limit)
      .populate('creator', 'name');
  }

  getAll(queryFind) {
    return this.model.findWithDeleted(queryFind);
  }

  getOne(queryFind) {
    return this.model.findOneWithDeleted(queryFind)
      .populate('creator', 'name');
  }

  restoreOne(queryFind) {
    return this.model.restore(queryFind);
  }

  deleteOne({
    id, userId, tenantId, userRole,
  }) {
    return this.model.findOneWithDeleted({ _id: id }, (err, payload) => {
      deleteResource({
        resourceModel: payload,
        userId,
        tenantId,
        userRole,
      });
    });
  }

  deleteMany({
    ids, userId, tenantId, userRole,
  }) {
    return this.model.findWithDeleted(
      { _id: { $in: ids } },
      (err, payload) => {
        payload.forEach((p) => {
          deleteResource({
            resourceModel: p,
            userId,
            tenantId,
            userRole,
          });
        });
      },
    );
  }

  deleteTrashTimeOut(queryFind) {
    return this.model.deleteMany(queryFind);
  }

  restoreMany(queryFind) {
    return this.model.restore(queryFind);
  }
}

module.exports = ResourceRepository;
