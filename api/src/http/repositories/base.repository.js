class BaseRepository {
  constructor({ model }) {
    this.model = model;
  }

  count(queryFind) {
    return this.model.find(queryFind).countDocuments();
  }

  get({
    queryFind, skip = 0, limit = 0, fieldSort = '',
  }) {
    return this.model.find(queryFind)
      .sort(fieldSort)
      .skip(skip)
      .limit(limit);
  }

  getDistinct({ queryFind, field }) {
    return this.model.distinct(field, queryFind);
  }

  getOne(queryFind) {
    return this.model.findOne(queryFind);
  }

  getOneById(id) {
    return this.getOne({ _id: id });
  }

  async createOne(payload) {
    return this.model.create(payload);
  }

  createMany({ payload, populate = [] }) {
    return this.model.insertMany(payload, {
      ordered: false,
      populate,
    });
  }

  updateOne({ id, payload }) {
    return this.model.findOneAndUpdate(
      { _id: id }, { $set: payload }, { new: true },
    );
  }
  /*
  updateOneWithoutSet({ queryFind, objectReplace }) {
    return this.model.findOneAndUpdate(queryFind, objectReplace, { new: true });
  }
  */

  async updateMany({ ids, payload }) {
    return this.model.updateMany({ _id: { $in: ids } }, { $set: payload });
  }

  deleteOne(query) {
    return this.model.deleteOne(query);
  }

  deleteMany(query) {
    return this.model.deleteMany(query);
  }

  updateOneByQueryFind({ queryFind, payload }) {
    return this.model.findOneAndUpdate(
      queryFind, { $set: payload }, { new: true },
    );
  }

  updateManyByQueryFind({ queryFind, payload }) {
    return this.model.update(
      queryFind, { $set: payload }, { new: true },
    );
  }

  updateWithoutSet({ queryFind, queryUpdate }) {
    return this.model.updateMany(queryFind, queryUpdate);
  }

  executeBulkWriteOperations({ operations, ordered = true }) {
    return this.model.bulkWrite(operations, { ordered });
  }
}

module.exports = BaseRepository;
