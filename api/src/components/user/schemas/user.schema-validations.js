const { ROLES_SYSTEM } = require('../../shared.constant');
const { USER_STATUS } = require('../user.constants');

const userValidations = {
  name: {
    max: 50,
  },
  email: {
    regex: "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$",
  },
  password: {
    regex: '^[a-zA-Z0-9]{6,30}$',
  },
  avatar: {},
  role: {
    name: {
      arrayEnum: Object.values(ROLES_SYSTEM.ROLES),
    },
  },
  status: {
    arrayEnum: Object.values(USER_STATUS),
  },
};

module.exports = {
  userValidations,
};
