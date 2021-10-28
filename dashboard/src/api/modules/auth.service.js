import grapePerksAppService from '../index';
import configApi from '../config';

const authService = {};
const baseRoutesUrl = configApi.baseRoutesUrls.auth;


authService.signIn = ({ email, password }) => grapePerksAppService.post(`${baseRoutesUrl}/sign-in`, {}, {
  auth: {
    username: email,
    password,
  },
}).then((resp) => resp.data);


authService.verifyToken = () => grapePerksAppService.get(`${baseRoutesUrl}/verify-token`)
  .then((resp) => resp.data);


authService.validateEmailAccountByCode = ({
  email,
  securityCode,
}) => grapePerksAppService.get(
  `${baseRoutesUrl}/validate-email-account/code/${email}/${securityCode}`,
).then((resp) => resp.data);


authService.resendEmailValidateAccount = (email) => grapePerksAppService.get(
  `${baseRoutesUrl}/resend-email-validate-account/${email}`,
).then((resp) => resp.data);


authService.signUp = (user) => grapePerksAppService.post(`${baseRoutesUrl}/sign-up`, user)
  .then((resp) => resp.data);


authService.signInSecondStep = ({ code, tokenSecondStep }) => grapePerksAppService.post(`${baseRoutesUrl}/second-step-login/${code}`, {}, { headers: { Authorization: `Bearer ${tokenSecondStep}` } })
  .then((resp) => resp.data);


authService.invitedSignUp = ({ securityToken, user }) => grapePerksAppService.post(`${baseRoutesUrl}/invited-sign-up/${securityToken}`, user)
  .then((resp) => resp.data);


authService.recoverPassword = (email) => grapePerksAppService.post(`${baseRoutesUrl}/recover-password/${email}`, {})
  .then((resp) => resp.data);


authService.changePassword = ({ securityToken, password }) => grapePerksAppService.post(`${baseRoutesUrl}/change-password/${securityToken}`, { password })
  .then((resp) => resp.data);


authService.refreshTokens = () => grapePerksAppService.post(`${baseRoutesUrl}/refresh-tokens`, {}, { headers: { Authorization: configApi.refreshToken ? `Bearer ${configApi.refreshToken}` : '' } })
  .then((resp) => resp.data);

authService.logout = () => grapePerksAppService.post(`${baseRoutesUrl}/log-out`)
  .then((resp) => resp.data);

export default authService;
