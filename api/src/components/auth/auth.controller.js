const speakeasy = require('speakeasy');

const BaseController = require('../../http/controllers/base.controller');
const authService = require('./auth.service');
const userService = require('../user/user.service');
const tenantService = require('../tenant/tenant.service');
const { getUserAuthPayload } = require('./auth.functions');
const { USER_STATUS } = require('../user/user.constants');

require('../../http/auth/basic');

class AuthController extends BaseController {
  constructor() {
    super({ service: authService });
    this.authService = authService;
    this.userService = userService;
    this.tenantService = tenantService;
  }

  async verifyTokenHandler(req) {
    const { userIdPayloadToken } = req.params;
    const user = await this.userService.getOne(userIdPayloadToken);
    const tenant = await this.tenantService.getOne(user.tenant);

    return {
      user: getUserAuthPayload(
        {
          user,
          tenant,
        },
      ),
    };
  }

  async googleCallbackHandler(req) {
    const { user: userGmail } = req;
    const { acceptTermsAndConditions, acceptReceiveNewsAndUpdates } = req.params;

    let user = await this.authService.signInGoogle({
      emailUser: userGmail.emails[0].value,
      name: `${userGmail.name.givenName} ${userGmail.name.familyName}`,
    });

    // eslint-disable-next-line no-underscore-dangle
    if (user && !user._id) {
      user.acceptTermsAndConditions = acceptTermsAndConditions;
      user.acceptReceiveNewsAndUpdates = acceptReceiveNewsAndUpdates;
      user = await this.authService.signUp(user);
    }

    try {
      return this.loginHandler({
        user,
        req,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async loginHandler({ user, req }) {
    return new Promise((resolve, reject) => {
      req.login(user, { session: false }, async (errorLog) => {
        if (errorLog) {
          reject(errorLog);
        }

        try {
          const data = await this.authService.loginCommon(user);
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  async signUpHandler(req) {
    const userPayload = req.body;
    const user = await this.authService.signUp({
      ...userPayload,
      status: USER_STATUS.EMAIL_NOT_VERIFIED,
    });

    const {
      securityCode,
      securityToken,
    } = await this.userService.updateSecurityTokenAndCodeById({
      // eslint-disable-next-line no-underscore-dangle
      userId: user._id,
      updateSecurityToken: true,
      updateSecurityCode: true,
    });

    await this.service.sendVerificationEmailAccount({
      user,
      securityCode,
      securityToken,
    });

    return true;
  }

  async signInHandler(req) {
    const data = await this.loginHandler({ user: req.user, req });
    return data;
  }

  async signInSecondStepHandler(req) {
    const { userToken, userIdPayloadToken } = req.params;

    const user = await userService.getOne(userIdPayloadToken);

    const base32Secret = user.tokenTwoFactorAuthentication;

    const verified = speakeasy.totp.verify({
      secret: base32Secret,
      encoding: 'base32',
      token: userToken,
    });

    if (!verified) {
      if (user.tokenTwoFactorAuthentication !== userToken) throw new Error('The token is not valid');
    }

    const data = await this.loginHandler({ user: { ...req.user, passSecondStep: true }, req });
    return data;
  }

  async invitedSignUpHandler(req) {
    const { email, securityToken } = req.params;
    const { user } = req.body;

    const tokenIsValid = await this.userService.isValidTheSecurityTokenByEmail({
      email,
      securityToken,
    });

    if (!tokenIsValid) throw new Error('The token is not valid');

    let data;

    if (tokenIsValid) {
      const userSecurityToken = this.authService.invitedSignUp({ securityToken, user });

      try {
        data = await this.loginHandler({ user: userSecurityToken, req });
      } catch (err) {
        throw new Error(err);
      }
    }

    return data;
  }

  async sendRecoveryPasswordEmailHandler(req) {
    const { emailUser } = req.params;
    const user = await this.userService.getUserByEmail(emailUser);

    if (user) {
      const { securityToken } = await this.userService.updateSecurityTokenAndCodeById({
        // eslint-disable-next-line no-underscore-dangle
        userId: user._id,
        updateSecurityToken: true,
      });

      await this.service.sendRecoveryPasswordEmail({
        user,
        securityToken,
      });
    }
  }

  async refreshTokenHandler(req) {
    const { user: userToken } = req;

    const user = await this.userService.getOne(userToken.sub);
    return {
      token: this.authService.getSignedAccessToken(user),
      refreshToken: this.authService.getSignedRefreshToken(user),
    };
  }

  async changePasswordHandler(req) {
    const { securityToken } = req.params;
    const { password } = req.body;
    return this.authService.changePassword({ password, securityToken });
  }

  async validateEmailAccountBySecurityTokenHandler(req) {
    const { email, securityToken } = req.params;

    const tokenIsValid = await this.userService.isValidTheSecurityTokenByEmail({
      email,
      securityToken,
    });

    if (tokenIsValid) {
      await this.userService.updateStatusByEmail({
        email,
        status: USER_STATUS.ACTIVE,
        updateSecurityToken: true,
      });
    }

    return tokenIsValid;
  }

  async validateEmailAccountBySecurityCodeHandler(req) {
    const { email, securityCode } = req.params;

    const codeIsValid = await this.userService.isValidTheSecurityCodeByEmail({
      email,
      securityCode,
    });

    if (codeIsValid) {
      await this.userService.updateStatusByEmail({
        email,
        status: USER_STATUS.ACTIVE,
        updateSecurityCode: true,
      });
    }

    return codeIsValid;
  }

  async resendEmailValidateAccount(req) {
    const { email } = req.params;
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      return false;
    }

    const { securityToken, securityCode } = await this.userService.updateSecurityTokenAndCodeById({
      // eslint-disable-next-line no-underscore-dangle
      userId: user._id,
      updateSecurityToken: true,
      updateSecurityCode: true,
    });

    await this.service.sendVerificationEmailAccount({
      user,
      securityCode,
      securityToken,
    });

    return true;
  }

  async sendEmailRecoverAccountHandler(req) {
    const { userIdPayloadToken: userId } = req.params;

    return this.service.sendEmailRecoverAccount({ userId });
  }

  async verifyEmailRecoverAccountHandler(req) {
    const { userIdPayloadToken: userId, codeRecoverAccount } = req.params;

    return this.service.verifyEmailRecoverAccount({
      userId,
      codeRecoverAccount,
    });
  }
}

const singletonInstance = new AuthController();

module.exports = singletonInstance;
