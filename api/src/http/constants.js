const HTTP_ERRORS_MSG = {
  missingScopes: 'Missing Scopes',
  insufficientScopes: 'Insufficient Scopes',
};

const AUTH_STRATEGIES = {
  BEARER: 'bearer',
  JWT: 'jwt',
  BASIC: 'basic',
  REFRESH_TOKEN: 'renovateToken',
};

const HTTP_OPERATIONS = {
  GET_ONE: 'getOne',
  UPDATE_ONE: 'updateOne',
  DELETE_ONE: 'deleteOne',
  CONFIG_PRIVACY: 'configPrivacy',
  RESTORE_ONE: 'restoreOne',
  DELETE_MANY: 'deleteMany',
  RESTORE_MANY: 'restoreMany',
};

const HTTP_OPERATIONS_AUDIENCE_DEPENDENTS = {
  PERMISSION_ON_AUDIENCE: 'permissionOnAudience',
  PERMISSION_ON_AUDIENCE_ELEMENT: 'permissionOnAudienceElement',
};

module.exports = {
  HTTP_ERRORS_MSG,
  AUTH_STRATEGIES,
  HTTP_OPERATIONS,
  HTTP_OPERATIONS_AUDIENCE_DEPENDENTS,
};
