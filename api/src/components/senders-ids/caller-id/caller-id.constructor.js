const BaseConstructor = require('../../../http/constructors/base.constructor');
const { STATUS } = require('../../../http/constants/sender-id.constants');

class CallerIdConstructor extends BaseConstructor {
  constructor({
    name, status = STATUS.UNVERIFIED, phoneInternational, phoneNational, phoneSignificant, dialCode,
    country, codeCountry, tenant, creator,
  }) {
    super({ tenant, creator });
    this.name = name;
    this.status = status || STATUS.UNVERIFIED;
    this.phoneInternational = phoneInternational;
    this.phoneNational = phoneNational;
    this.phoneSignificant = phoneSignificant;
    this.dialCode = dialCode;
    this.country = country;
    this.codeCountry = codeCountry;
  }
}

module.exports = CallerIdConstructor;
