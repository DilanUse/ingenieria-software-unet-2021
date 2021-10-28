const bcrypt = require('bcrypt');
const BaseService = require('../../http/services/base.service');
const repository = require('./user.repository');
const Constructor = require('./user.constructor');
const emailService = require('../../http/services/email.service');
const userFunctions = require('./user.functions');
const { USER_STATUS } = require('./user.constants');
const { ROLES_SYSTEM } = require('../shared.constant');
const { config } = require('../../config');
const { TYPE } = require('../../http/constants/common-campaign.constants');

/**
 * UserService class
 */
class UserService extends BaseService {
  constructor() {
    super({ repository, Constructor });
    this.repository = repository;
    this.Constructor = Constructor;
    this.functions = userFunctions;
  }

  async getUserByEmail(email) {
    return this.repository.getOne({
      email,
    });
  }

  async getUserByGoogleEmail(googleEmail) {
    return this.repository.getOne({
      googleEmail,
    });
  }

  async updateOneByEmail({ email, payload }) {
    return this.repository.updateOneByEmail({
      email,
      payload,
    });
  }

  async inviteUsers({
    emails, admin, owner, userRole, tenant, creator, populate = [],
  }) {
    const usersPayload = [];
    const emailsPayload = [];

    emails.forEach((email) => {
      const prefixRole = userFunctions.roleIsAdmin(userRole)
        ? ROLES_SYSTEM.PREFIXES.ADMIN
        : ROLES_SYSTEM.PREFIXES.MERCHANT;

      let suffixRole;

      if (owner) suffixRole = ROLES_SYSTEM.SUFFIXES.OWNER;
      else if (admin) suffixRole = ROLES_SYSTEM.SUFFIXES.ADMIN;
      else suffixRole = ROLES_SYSTEM.SUFFIXES.USER;

      const objectUserSave = new this.Constructor({
        name: email.replace(/@(.+)$/g, ''),
        email,
        password: null,
        companyName: null,
        prefixRole,
        suffixRole,
        status: USER_STATUS.INVITED,
        tenant,
        creator,
      });
      usersPayload.push(objectUserSave);

      const basePath = config.baseUrlDashboard;
      const emailInfo = {
        to: email,
        subject: 'Join to GrapePerks!',
        html: `For join to GrapePerks click this <a href="${basePath}/invited-sign-up/${email}/${objectUserSave.securityToken}" target="_blank">link</a>`,
      };
      emailsPayload.push(emailInfo);
    });

    try {
      await emailService.sendTransactionalEmails(emailsPayload);
    } catch (err) {
      throw new Error('Fail in the send of emails');
    }

    return this.repository.createMany({
      payload: usersPayload,
      populate,
    });
  }

  async deleteMonthlyPlansTimeOut() {
    const dateNow = new Date();

    return this.repository.updateManyByQueryFind({
      queryFind: { 'monthlyPackage.validFrom': { $lt: dateNow }, 'monthlyPackage.active': false },
      payload: { monthlyPackage: null },
    });
  }

  async updatePassword({ payload, id }) {
    const user = await this.getOne(id);
    const userPass = await bcrypt.compare(payload.currentPassword, user.password);
    let newPasswordHash;

    if (userPass) {
      newPasswordHash = await bcrypt.hash(payload.newPassword, 10);
    } else {
      throw new Error('BadCurrentPassword');
    }

    return this.repository.updateOne({
      id: user.id,
      payload: { password: newPasswordHash, 'flags.hasPassword': true },
    });
  }

  async getCurrentlyCampaign({ id, nameService }) {
    const user = await this.repository.getOneById(id);

    if (nameService === TYPE.SMS) return user.campaignsDrafts.campaignDraftSms;
    if (nameService === TYPE.VOICEMAIL) return user.campaignsDrafts.campaignDraftVoice;
    return user.campaignsDrafts.campaignDraftEmail;
  }

  async setDraftCampaign({ userId, campaignType, payload }) {
    return this.repository.updateOne({
      payload: { [`campaignsDrafts.${campaignType}`]: payload },
      id: userId,
    });
  }

  async isValidTheSecurityCodeByEmail({ email = '', securityCode = null }) {
    if (!email || !securityCode) {
      return false;
    }

    const user = await this.getUserByEmail(email);
    return user && user.securityCode === Number(securityCode);
  }

  async isValidTheSecurityTokenByEmail({ email = '', securityToken = '' }) {
    if (!email || !securityToken) {
      return false;
    }

    const user = await this.getUserByEmail(email);
    return user && user.securityToken === securityToken;
  }

  async updateStatusByEmail({
    email = '',
    status = '',
    updateSecurityToken = false,
    updateSecurityCode = false,
  }) {
    if (!Object.values(USER_STATUS).includes(status)) {
      throw new Error(`The status '${status}' is not valid for update the user`);
    }

    const payload = { status };

    if (updateSecurityCode) {
      payload.securityCode = this.functions.generateNewSecurityCode();
    }

    if (updateSecurityToken) {
      payload.securityToken = this.functions.generateNewSecurityToken();
    }

    await this.updateOneByEmail({
      email,
      payload,
    });

    return payload;
  }

  async updateSecurityTokenAndCodeById({
    userId = '',
    updateSecurityToken = false,
    updateSecurityCode = false,
  }) {
    const payload = {};

    if (!updateSecurityToken && !updateSecurityCode) {
      return payload;
    }

    if (updateSecurityCode) {
      payload.securityCode = this.functions.generateNewSecurityCode();
    }

    if (updateSecurityToken) {
      payload.securityToken = this.functions.generateNewSecurityToken();
    }

    await this.updateOne({
      id: userId,
      payload,
    });

    return payload;
  }
}

const singletonInstance = new UserService();

module.exports = singletonInstance;
