const { v4: uuidv4 } = require('uuid');
const random = require('random');
const { ROLES_SYSTEM } = require('../shared.constant');
const { getFiltersForQueryFind } = require('../shared.functions');
const { USER_STATUS } = require('./user.constants');

function roleIsValid(roleName) {
  return Object.values(ROLES_SYSTEM.ROLES).indexOf(roleName) !== -1;
}

function rolePrefix(roleName) {
  return roleIsValid(roleName) ? roleName.split('-')[0] : null;
}

function roleSuffix(roleName) {
  return roleIsValid(roleName) ? roleName.split('-')[1] : null;
}

function roleIsAdmin(roleName) {
  return rolePrefix(roleName) === ROLES_SYSTEM.PREFIXES.ADMIN;
}

function roleIsMerchant(roleName) {
  return rolePrefix(roleName) === ROLES_SYSTEM.PREFIXES.MERCHANT;
}

function subRoleIsOwner(roleName) {
  return roleSuffix(roleName) === ROLES_SYSTEM.SUFFIXES.OWNER;
}

function subRoleIsAdmin(roleName) {
  return roleSuffix(roleName) === ROLES_SYSTEM.SUFFIXES.ADMIN;
}

function subRoleIsUser(roleName) {
  return roleSuffix(roleName) === ROLES_SYSTEM.SUFFIXES.USER;
}

function subRoleIsOwnerOrAdmin(roleName) {
  return subRoleIsOwner(roleName) || subRoleIsAdmin(roleName);
}

function getQueryFindForUsersByRole({
  userId, tenantId, userRole, idResource = '', filters = {}, filtersMatch = 'all',
}) {
  let queryFind = {};

  if (roleIsAdmin(userRole)) {
    queryFind = {
      $or: [
        {
          'role.name': ROLES_SYSTEM.ROLES.ADMIN_OWNER,
        },
        {
          'role.name': ROLES_SYSTEM.ROLES.ADMIN_ADMIN,
        },
        {
          'role.name': ROLES_SYSTEM.ROLES.ADMIN_USER,
        },
      ],
    };
  }

  if (roleIsMerchant(userRole)) {
    queryFind = {
      $or: [
        {
          tenant: tenantId,
        },
        {
          _id: userId,
        },
      ],
    };
  }

  if (idResource !== '') {
    // eslint-disable-next-line no-underscore-dangle
    queryFind._id = idResource;
  }

  if (Object.keys(filters).length > 0) {
    const objectFiltersField = getFiltersForQueryFind({
      filters,
      filtersMatch,
    });

    queryFind = {
      ...queryFind,
      ...objectFiltersField,
    };
  }

  return queryFind;
}

function generateNewSecurityToken() {
  return uuidv4();
}

function generateNewSecurityCode() {
  return random.int(100000, 999999);
}

function getQueryFindForUsersToShare({
  userId, tenantId, userRole, idResource = '', filters = {}, filtersMatch = 'all',
}) {
  let queryFind = getQueryFindForUsersByRole({
    userId,
    tenantId,
    userRole,
    filters,
    idResource,
    filtersMatch,
  });

  if (roleIsAdmin(userRole)) {
    queryFind = {
      ...queryFind,
      'role.name': { $nin: [ROLES_SYSTEM.ROLES.ADMIN_OWNER, ROLES_SYSTEM.ROLES.ADMIN_ADMIN] },
    };
  }

  if (roleIsMerchant(userRole)) {
    queryFind = {
      ...queryFind,
      'role.name': { $nin: [ROLES_SYSTEM.ROLES.MERCHANT_OWNER, ROLES_SYSTEM.ROLES.MERCHANT_ADMIN] },
    };
  }

  queryFind = {
    ...queryFind,
    _id: { $ne: userId },
    status: USER_STATUS.ACTIVE,
  };

  return queryFind;
}

function getQueryFindForMerchantsUsers({
  idResource = '', filters = {}, filtersMatch = 'all',
}) {
  let queryFind = {
    'role.name': ROLES_SYSTEM.ROLES.MERCHANT_OWNER,
  };

  if (idResource !== '') {
    // eslint-disable-next-line no-underscore-dangle
    queryFind._id = idResource;
  }

  if (Object.keys(filters).length > 0) {
    const objectFiltersField = getFiltersForQueryFind(
      {
        filters,
        filtersMatch,
      },
    );

    queryFind = {
      ...queryFind,
      ...objectFiltersField,
    };
  }

  return queryFind;
}

function discountFromPlanBalance({
  balance, unitPriceToDiscount, quantity,
}) {
  let quantityThatCanBePaid = 0;
  let quantityPendingToPay = quantity;
  let quantityPaid;
  let amountPaid = 0;
  const discountInfo = {};
  let isPossibleToDiscount = false;

  if (balance > 0) {
    quantityThatCanBePaid = Math.floor(balance / unitPriceToDiscount);
  }

  if (quantityThatCanBePaid > 0) {
    if (quantityThatCanBePaid >= quantity) {
      quantityPendingToPay = 0;
      quantityPaid = quantity;
    } else {
      quantityPendingToPay -= quantityThatCanBePaid;
      quantityPaid = quantityThatCanBePaid;
    }

    amountPaid = unitPriceToDiscount * quantityPaid;
    discountInfo.quantity = quantityPaid;
    discountInfo.price = unitPriceToDiscount;
    discountInfo.discountTotal = amountPaid;
    isPossibleToDiscount = true;
  }

  return {
    quantityPendingToPay,
    amountPaid,
    discountInfo,
    isPossibleToDiscount,
  };
}

// This is the function modified
function getInformationForDiscountPlan({
  planUser, service, planCountry = null, namePrice,
}) {
  const { balance, balancesFrozen } = planUser;
  let unitPriceToDiscount = 0;
  let totalBalanceFrozen = 0;

  // This part i think that can be modified sending the prepaidPrice o monthlyPrice
  // like an attribute

  if (planCountry) {
    const { optionCode } = planUser;

    unitPriceToDiscount = planCountry.options[optionCode][service][namePrice];
  } else {
    unitPriceToDiscount = planUser[service][namePrice];
  }
  if (balancesFrozen) {
    const arrayBalancesFrozen = Object.keys(balancesFrozen);

    arrayBalancesFrozen.forEach((keyBalanceFrozen) => {
      if (keyBalanceFrozen !== '_id') {
        totalBalanceFrozen += Number(balancesFrozen[keyBalanceFrozen]);
      }
    });
  }

  return {
    totalBalanceFrozen,
    unitPriceToDiscount,
    balance,
  };
}

/**
 * Function to calculate the balance of the user passing the parameters prepaidPackages, activeMonthlyPackage and inactiveMonthlyPackage
 * @param {Object} $0
 * @param {Object[]} $0.prepaidPackages - An array of object with the information of all prepaids plans of the user
 * @param {Object} $0.activeMonthlyPackage - The object with the information of the plan monthly active of the user
 * @param {Object} $0.inactiveMonthlyPackage - The object with the information of the plan monthly inactive of the user
 * @returns - Return the balance of the user
 */
// eslint-disable-next-line class-methods-use-this
function calculateBalanceUser({ prepaidPackages, activeMonthlyPackage, inactiveMonthlyPackage }) {
  let balance = 0;

  prepaidPackages.forEach((prepaidPackage) => {
    balance += prepaidPackage.balance;
  });

  if (activeMonthlyPackage) balance += activeMonthlyPackage.balance;

  if (inactiveMonthlyPackage) balance += inactiveMonthlyPackage.balance;

  return balance;
}

module.exports = {
  roleIsValid,
  rolePrefix,
  roleSuffix,
  roleIsAdmin,
  roleIsMerchant,
  subRoleIsOwner,
  subRoleIsAdmin,
  subRoleIsUser,
  subRoleIsOwnerOrAdmin,
  getQueryFindForUsersByRole,
  getQueryFindForUsersToShare,
  getQueryFindForMerchantsUsers,
  discountFromPlanBalance,
  getInformationForDiscountPlan,
  calculateBalanceUser,
  generateNewSecurityToken,
  generateNewSecurityCode,
};
