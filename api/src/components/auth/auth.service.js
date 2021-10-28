const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const random = require('random');
const { config } = require('../../config');
const UserConstructor = require('../user/user.constructor');
const userService = require('../user/user.service');
const tenantService = require('../tenant/tenant.service');
const { USER_STATUS } = require('../user/user.constants');
const { AUTH_HTTP_ERRORS_MSG } = require('./auth.constant');
const BurstSmsService = require('../../http/services/burst-sms/burst-sms.service');
const emailService = require('../../http/services/email.service');
const emailTemplateHtmlService = require('../../http/services/emailTemplateHtmlService');
const { getUserAuthPayload, getUserTokenPayload } = require('./auth.functions');

class AuthService {
  constructor() {
    this.userService = userService;
    this.emailService = emailService;
    this.tenantService = tenantService;
  }

  // eslint-disable-next-line class-methods-use-this
  getSignedToken({ payload, secret, expireIn }) {
    return jwt.sign(payload, secret, {
      expiresIn: expireIn,
    });
  }

  getSignedAccessToken(user) {
    return this.getSignedToken({
      payload: getUserTokenPayload(user),
      secret: config.authJwtSecret,
      expireIn: config.tokenExpiresInSeconds,
    });
  }

  getSignedRefreshToken(user) {
    return this.getSignedToken({
      payload: getUserTokenPayload(user),
      secret: config.authJwtSecretRefreshToken,
      expireIn: config.refreshTokenExpiresInSeconds,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async signUp(user) {
    const checkExistEmailUser = await this.userService.getUserByEmail(user.email);

    if (checkExistEmailUser) throw new Error('email already exist');

    const idUser = new ObjectID();
    const burstSmsService = new BurstSmsService({});

    let burstSMSClientId;

    try {
      burstSMSClientId = await burstSmsService.createClient(
        {
          name: user.name,
          contact: user.name,
          email: user.email,
          msisdn: 61450969337,
          client_pays: false,
        },
      );
    } catch (err) {
      let clientFind = await burstSmsService.getClientByEmail(user.email);

      if (clientFind) {
        burstSMSClientId = clientFind.id;
      } else {
        try {
          burstSMSClientId = await burstSmsService.createClient({
            name: user.name,
            contact: user.name,
            email: `${(user.email).split('@')[0]}@grapesend.com`,
            msisdn: 61450969337,
            client_pays: false,
          });
        } catch (err2) {
          clientFind = await burstSmsService.getClientByEmail(`${(user.email).split('@')[0]}@grapesend.com`);

          if (clientFind) burstSMSClientId = clientFind.id;
          else throw new Error('Error in burst');
        }
      }
    }

    const tenantCreated = await this.tenantService.createOne({
      payload: {
        burstSMSClientId,
      },
    });

    const userCreated = await this.userService.createOne(
      {
        payload: {
          ...user,
          _id: idUser,
        },
        tenant: tenantCreated._id,
        creator: null,
      },
    );

    return userCreated;
  }

  // eslint-disable-next-line class-methods-use-this
  async invitedSignUp({ securityToken, user }) {
    let userSecurityToken = { };

    const userReplace = { ...user };

    userReplace.password = await bcrypt.hash(userReplace.password, 10);
    userReplace.status = USER_STATUS.ACTIVE;

    userSecurityToken = await this.userService.getOneByQueryFind({ securityToken });

    if (!userSecurityToken) throw new Error('User not find');

    const securityTokenNew = uuidv4();

    userSecurityToken = await this.userService.updateOne({
      id: userSecurityToken._id,
      payload: { ...userReplace, securityToken: securityTokenNew },
    });

    return userSecurityToken;
  }

  // eslint-disable-next-line class-methods-use-this
  async changePassword({ password, securityToken }) {
    if (password && password !== '') {
      password = await bcrypt.hash(password, 10);
    }

    const user = await this.userService.getOneByQueryFind({ securityToken });

    if (!user) throw new Error('User not find');

    const newSecurityToken = uuidv4();

    await this.userService.updateOne(
      {
        id: user._id,
        payload: { password, securityToken: newSecurityToken, 'flags.hasPassword': true },
      },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  async validateAccount(securityToken) {
    const user = await this.userService.getOneByQueryFind({ securityToken });
    const newSecurityToken = uuidv4();

    if (!user) {
      return false;
      // throw new Error('User not find');
    }

    const userUpdated = await this.userService.updateOne(
      {
        // eslint-disable-next-line no-underscore-dangle
        id: user._id,
        payload: { status: USER_STATUS.ACTIVE, securityToken: newSecurityToken },
      },
    );

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  async loginCommon(user) {
    const tenant = await this.tenantService.getOne(user.tenant);

    const userReturn = getUserAuthPayload(
      {
        user,
        tenant,
      },
    );

    if (user.status === USER_STATUS.EMAIL_NOT_VERIFIED) {
      throw new Error(AUTH_HTTP_ERRORS_MSG.EMAIL_ACCOUNT_NOT_VERIFIED);
    } else if (user.status === USER_STATUS.INACTIVE) {
      throw new Error(AUTH_HTTP_ERRORS_MSG.USER_INACTIVE);
    } else if (user.status === USER_STATUS.INVITED) {
      throw new Error(AUTH_HTTP_ERRORS_MSG.USER_INVITED);
    }

    return {
      token: this.getSignedAccessToken(userReturn),
      refreshToken: this.getSignedRefreshToken(userReturn),
      user: userReturn,
    };
  }

  async sendVerificationEmailAccount({
    user, securityCode, securityToken,
  }) {
    const basePath = config.baseUrlApi;

    await this.emailService.sendTransactionalEmailWithAnEmailTemplate({
      emailTemplateName: emailTemplateHtmlService.EMAIL_TEMPLATES_NAMES.VERIFY_EMAIL_ACCOUNT,
      emailTemplateParams: {
        userName: user.name,
        verifyCode: securityCode,
        verificationLink: `${basePath}/auth/validate-email-account/link/${user.email}/${securityToken}`,
      },
      to: user.email,
      subject: 'Validate your email account',
    });
  }

  async sendRecoveryPasswordEmail({
    user, securityToken,
  }) {
    const basePath = config.baseUrlApi;

    await this.emailService.sendTransactionalEmailWithAnEmailTemplate({
      emailTemplateName: emailTemplateHtmlService.EMAIL_TEMPLATES_NAMES.RECOVERY_PASSWORD,
      emailTemplateParams: {
        userName: user.name,
        recoveryLink: `${basePath}/reset-password/${securityToken}`,
      },
      to: user.email,
      subject: 'Recovery of password',
    });
  }

  async sendEmailRecoverAccount({ userId }) {
    const user = await userService.getOne(userId);

    const newCodeRecoverAccount = random.int(100000, 999999);

    await userService.updateOne({
      id: userId,
      payload: {
        codeRecoverAccount: newCodeRecoverAccount,
      },
    });

    await this.emailService.sendTransactionalEmail({
      to: user.email,
      subject: 'Recover account',
      html: `The code for recover your account is ${newCodeRecoverAccount}`,
    });
  }

  async verifyEmailRecoverAccount({ userId, codeRecoverAccount }) {
    const user = await userService.getOne(userId);

    const codeRecoverAccountUser = user.codeRecoverAccount;

    if (codeRecoverAccountUser !== codeRecoverAccount) {
      throw new Error('Code recover account wrong');
    } else {
      await userService.updateOne({
        id: userId,
        payload: {
          codeRecoverAccount: '',
        },
      });

      user.passSecondStep = true;

      return this.loginCommon(user);
    }
  }
}

const singletonInstance = new AuthService();

module.exports = singletonInstance;
