const service = require('./user.service');
const { ROLES_SYSTEM } = require('../shared.constant');

class UserSeeder {
  constructor() {
    this.service = service;
  }

  async seed() {
    const userAdminExist = await this.service.getUserByEmail('admin@gmail.com');

    if (!userAdminExist) {
      const payload = {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin',
        prefixRole: ROLES_SYSTEM.PREFIXES.ADMIN,
        suffixRole: ROLES_SYSTEM.SUFFIXES.OWNER,
      };

      await this.service.createOne({ payload, tenant: null, creator: null });
    }
  }
}

const singletonInstance = new UserSeeder();

module.exports = singletonInstance;
