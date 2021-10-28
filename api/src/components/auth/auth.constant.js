const AUTH_HTTP_ERRORS_MSG = {
  googleAuth: 'Google Auth Error',
  savingUser: 'Error Saving User',
  credentials: 'Invalid Credentials',
  emailNotExist: 'Email Not Exist',
  sessionExpired: 'Session Expired',
  invalidSecurityToken: 'Invalid Security Token',
  EMAIL_ACCOUNT_NOT_VERIFIED: 'You have to verify your email account for login',
  USER_INACTIVE: 'Your user is inactive, contact with your organization admin',
  USER_INVITED: 'You must confirm the invitation sent to your email to be able to login',
};

const AUTH_HTTP_SUCCESS_MSG = {
  login: 'User log-in successfully',
  register: 'User sign-up successfully',
  logout: 'User Log-out successfully',
  recoveryEmailSend: 'Email of recovery send successfully',
  passwordChanged: 'Password changed successfully',
  extendedSession: 'Renovation of token successfully',
};

module.exports = {
  AUTH_HTTP_ERRORS_MSG,
  AUTH_HTTP_SUCCESS_MSG,
};
