const { MARKETING_STATUS } = require('../contact.constants');

const contactsValidations = {
  firstName: {
    max: 50,
  },
  lastName: {
    max: 50,
  },
  email: {
    regex: "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$",
  },
  codeCountry: {
    min: 2,
    max: 2,
  },
  marketingStatus: {
    value: {
      arrayEnum: Object.values(MARKETING_STATUS),
    },
  },
};

module.exports = {
  contactsValidations,
};
