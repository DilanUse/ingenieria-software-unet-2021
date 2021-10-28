const crypto = require('crypto');
const BaseConstructor = require('../../../http/constructors/base.constructor');
const { MARKETING_STATUS } = require('./contact.constants');

class ContactConstructor extends BaseConstructor {
  constructor({
    firstName, lastName = '', email, phoneInternational, phoneNational, phoneSignificant,
    dialCode, country, tenant, creator, importIndex = null,
    unregistered = false, marketingStatus = MARKETING_STATUS.SUBSCRIBED,
  }) {
    super({ tenant, creator });
    this.firstName = firstName;
    this.lastName = lastName || '';
    this.email = email;
    this.phoneInternational = phoneInternational;
    this.phoneNational = phoneNational;
    this.phoneSignificant = phoneSignificant;
    this.dialCode = dialCode;
    this.country = country;
    this.importIndex = typeof importIndex === 'number' ? importIndex : null;

    const bufToken = crypto.randomBytes(48);
    this.marketingStatus = {
      value: marketingStatus,
      token: bufToken.toString('hex'),
    };
    this.unregistered = unregistered;
  }
}

module.exports = ContactConstructor;
