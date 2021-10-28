const boom = require('@hapi/boom');
const { HTTP_ERRORS_MSG } = require('../constants');

function scopesMiddleware({
  permissions = [],
  all = true,
  rolesAccepted,
}) {
  // eslint-disable-next-line func-names
  return function (req, res, next) {
    /*
    if (!Array.isArray(permissions) || permissions.length === 0) {
      next();
    }
    */

    if (!req.user || (req.user && !req.user.role.permissions)) {
      next(boom.unauthorized(HTTP_ERRORS_MSG.missingScopes));
    }
    if (rolesAccepted) {
      const accessRole = rolesAccepted.some((role) => role === req.params.userRolePayloadToken);

      if (accessRole === false) next(boom.unauthorized(HTTP_ERRORS_MSG.insufficientScopes));
    }

    const userPermissions = req.user.role.permissions;
    const hasAccess = all
      ? permissions.every((p) => {
        const userPer = userPermissions.find((up) => up.permission === p);
        return userPer && userPer.access;
      })
      : permissions.some((p) => {
        const userPer = userPermissions.find((up) => up.permission === p);
        return userPer && userPer.access;
      });

    if (hasAccess) {
      next();
    } else {
      next(boom.unauthorized(HTTP_ERRORS_MSG.insufficientScopes));
    }
  };
}

module.exports = scopesMiddleware;
