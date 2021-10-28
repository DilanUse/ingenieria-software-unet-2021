const ROLES_SYSTEM = {
  PREFIXES: {
    ADMIN: 'admin',
    MERCHANT: 'merchant',
  },
  SUFFIXES: {
    OWNER: 'owner',
    ADMIN: 'admin',
    USER: 'user',
  },
  ROLES: {
    ADMIN_OWNER: 'admin-owner',
    ADMIN_ADMIN: 'admin-admin',
    ADMIN_USER: 'admin-user',
    MERCHANT_OWNER: 'merchant-owner',
    MERCHANT_ADMIN: 'merchant-admin',
    MERCHANT_USER: 'merchant-user',
  },
};

const BILLABLE_PRODUCT_TYPES = {
  PACKAGE: 'package',
  PLAN: 'plan',
  VIRTUAL_NUMBER: 'virtual-number',
};

const MESSAGE_ERROR_GENERAL = 'Unexpected Error';

const COMMON_HTTP_ERROR_MSG = {
  GET_ALL: 'Error List',
  GET_ONE: 'Error Retrieve',
  CREATED: 'Error Create',
  UPDATED: 'Error Update',
  DELETED: 'Error Delete',
  CONFIG_PRIVACY: 'Error Configuring Privacy',
  RESTORED: 'Error Restore',
  EXPORTED_FILE: 'Error Export File',
  IMPORTED_FILE: 'Error Imported File',
};

const COMMON_HTTP_SUCCESS_MSG = {
  GET_ALL: 'List Successfully',
  GET_ONE: 'Retrieve Successfully',
  CREATED: 'Created Successfully',
  UPDATED: 'Updated Successfully',
  DELETED: 'Deleted Successfully',
  CONFIG_PRIVACY: 'Configuring Privacy Successfully',
  RESTORED: 'Restored Successfully',
  EXPORTED_FILE: 'Exported File Successfully',
  IMPORTED_FILE: 'Imported File Successfully',
};
/*
const MODULES_SCOPES = {
  MERCHANTS: 'merchants',
  APP_SETTINGS: 'app-settings',
  APP_SERVICES: 'app-services',
  TEMPLATES: 'templates',
  SENDERS_IDS: 'senders-ids',
  CONTACTS: 'contacts',
  CAMPAIGNS: 'campaigns',
  USERS: 'users',
  BILLING: 'billing',
};
 */
const MODULES_SCOPES = {
  USERS: 'users',
  CAMPAIGNS: 'campaigns',
  BUSINESS: 'business',
  APP_SETTINGS: 'app-settings',
  APP_SERVICES: 'app-services',
};

const PATH_TEMPORAL_FILES = 'temp';

module.exports = {
  ROLES_SYSTEM,
  MESSAGE_ERROR_GENERAL,
  COMMON_HTTP_ERROR_MSG,
  COMMON_HTTP_SUCCESS_MSG,
  PATH_TEMPORAL_FILES,
  MODULES_SCOPES,
  BILLABLE_PRODUCT_TYPES,
};
