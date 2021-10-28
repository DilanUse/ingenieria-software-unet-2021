const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const random = require('random');
const BaseConstructor = require('../../http/constructors/base.constructor');
const { ROLES_SYSTEM } = require('../shared.constant');
const { USER_STATUS } = require('./user.constants');
const { TYPE: CAMPAIGN_TYPE } = require('../../http/constants/common-campaign.constants');

class UserConstructor extends BaseConstructor {
  constructor({
    name, email, password = null,
    prefixRole = ROLES_SYSTEM.PREFIXES.MERCHANT,
    suffixRole = ROLES_SYSTEM.SUFFIXES.OWNER,
    status = USER_STATUS.ACTIVE, tenant,
    creator = null, _id = null, acceptTermsAndConditions = false,
    acceptReceiveNewsAndUpdates = false,
  }) {
    super({
      tenant: tenant || null,
      creator: creator || null,
    });

    if (Object.values(ROLES_SYSTEM.PREFIXES)
      .indexOf(prefixRole) === -1) {
      throw new Error('Prefix Role is invalid.');
    }

    if (Object.values(ROLES_SYSTEM.SUFFIXES)
      .indexOf(suffixRole) === -1) {
      throw new Error('Suffix Role is invalid.');
    }

    if (Object.values(USER_STATUS)
      .indexOf(status) === -1) {
      throw new Error('Status is invalid.');
    }

    // todo: this is necessary?
    // eslint-disable-next-line no-underscore-dangle
    if (_id) this._id = _id;

    this.name = name;
    this.email = email;
    this.password = password ? bcrypt.hashSync(password, 10) : null;
    this.role = {
      name: `${prefixRole}-${suffixRole}`,
    };
    this.status = USER_STATUS.ACTIVE;
    this.securityToken = uuidv4();
    this.securityCode = random.int(100000, 999999);
    this.codeRecoverAccount = random.int(100000, 999999);
    this.campaignsDrafts = {
      [CAMPAIGN_TYPE.SMS]: null,
    };
    this.flags = {
      acceptTermsAndConditions,
      acceptReceiveNewsAndUpdates,
      welcomeTourSkipped: false,
      hasPassword: !!password,
    };
    this.markers = [];
  }
}

module.exports = UserConstructor;
