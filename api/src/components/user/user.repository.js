const BaseRepository = require('../../http/repositories/base.repository');
const model = require('./user.model');

class UserRepository extends BaseRepository {
  constructor() {
    super({
      model,
    });
    this.model = model;
  }

  updateOneByEmail({ email, payload }) {
    return this.model.findOneAndUpdate(
      { email }, { $set: payload }, { new: true },
    );
  }

}

const singletonInstance = new UserRepository();

module.exports = singletonInstance;
