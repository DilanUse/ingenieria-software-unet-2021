import enums from '@/enums';

export default {
  isUserLoggedIn(state) {
    return state.isUserLoggedIn;
  },

  isRefreshingToken(state) {
    return state.isRefreshingToken;
  },

  role(state) {
    return state.user && state.user.role ? state.user.role : null;
  },

  roleName(state) {
    return state.user && state.user.role ? state.user.role.name : null;
  },

  permissions(state, getters) {
    return getters.role ? getters.role.permissions : [];
  },

  rolePrefix(state) {
    return state.user && state.user.role ? state.user.role.name.split('-')[0] : null;
  },

  roleSuffix(state) {
    return state.user && state.user.role ? state.user.role.name.split('-')[1] : null;
  },

  roleIsAdmin(state, getters) {
    return getters.rolePrefix === enums.Auth.Role.Prefix.ADMIN;
  },

  roleIsMerchant(state, getters) {
    return getters.rolePrefix === enums.Auth.Role.Prefix.MERCHANT;
  },

  isOwner(state, getters) {
    return getters.roleSuffix === enums.Auth.Role.Suffix.OWNER;
  },

  isAdmin(state, getters) {
    return getters.roleSuffix === enums.Auth.Role.Suffix.ADMIN;
  },

  userId(state, getters) {
    if (getters.isUserLoggedIn && state.user && state.user.id) {
      return state.user.id;
    }

    return null;
  },

  markers(state, getters) {
    if (getters.isUserLoggedIn && state.user && state.user.markers) {
      return state.user.markers || [];
    }

    return [];
  },

  userHasFlags(state) {
    return !!(state.user && state.user.flags);
  },

  userFlags(state, getters) {
    return getters.userHasFlags
      ? state.user.flags || {}
      : {};
  },

  getUserFlag: (state, getters) => (flagName) => (
    getters.userHasFlags
      ? getters.userFlags[flagName] || null
      : null
  ),

  tenant(state) {
    if (state.user && state.user.tenant) {
      return state.user.tenant;
    }

    return null;
  },

  tenantId(state, getters) {
    if (getters.tenant && getters.tenant.id) {
      return getters.tenant.id;
    }

    return null;
  },

  tenantHasFlags(state, getters) {
    return !!(getters.tenant && getters.tenant.flags);
  },

  tenantFlags(state, getters) {
    return getters.tenantHasFlags
      ? state.user.tenant.flags || {}
      : {};
  },

  getTenantFlag: (state, getters) => (flagName) => (
    getters.tenantHasFlags
      ? getters.tenantFlags[flagName] || null
      : null
  ),

  tenantAccountSettingsReviews(state, getters) {
    if (getters.tenant
      && getters.tenant.accountSettings
      && getters.tenant.accountSettings.review) {
      return getters.tenant.accountSettings.review;
    }

    return null;
  },

  tenantAccountDetails(state, getters) {
    if (getters.tenant
      && getters.tenant.accountSettings
      && getters.tenant.accountSettings.details) {
      return getters.tenant.accountSettings.details;
    }

    return null;
  },

  basePathTenantToUploadResources(state, getters) {
    if (getters.isUserLoggedIn) {
      return getters.tenantId;
    }

    return '';
  },

  basePathUserToUploadResources(state, getters) {
    if (getters.isUserLoggedIn) {
      return `${getters.tenantId}/${getters.userId}`;
    }

    return '';
  },

  avatarUrl(state) {
    return state.user.avatar ? state.user.avatar.url : '';
  },

  avatarBucketPath(state) {
    return state.user.avatar ? state.user.avatar.bucketPath : '';
  },

  userHasAnyPrepaidPackage(state, getters) {
    return getters.tenant
      && Array.isArray(getters.tenant.prepaidPackages)
      && getters.tenant.prepaidPackages.length > 0;
  },

  userHasMonthlyPackage(state, getters) {
    return getters.tenant
      && getters.tenant.monthlyPackage !== null
      && typeof getters.tenant.monthlyPackage === 'object';
  },

  userMonthlyPackageNumber(state, getters) {
    return getters.tenant
      && getters.userHasMonthlyPackage
      ? getters.tenant.monthlyPackage.packageNumber
      : null;
  },

  userHasAnyPackage(state, getters) {
    return getters.userHasAnyPrepaidPackage || getters.userHasMonthlyPackage;
  },

  userMonthlyPackage(state, getters) {
    return getters.userHasMonthlyPackage
      ? getters.tenant.monthlyPackage
      : null;
  },

  userPrepaidPackages(state, getters) {
    return getters.userHasAnyPrepaidPackage
      ? getters.tenant.prepaidPackages
      : [];
  },

  balanceMonthlyPackage(state, getters) {
    return getters.userHasMonthlyPackage
      ? getters.tenant.monthlyPackage.balance || 0
      : 0;
  },

  balancePrepaidPackages(state, getters) {
    let balance = 0;

    if (getters.userHasAnyPrepaidPackage) {
      getters.tenant.prepaidPackages.forEach((el) => {
        // eslint-disable-next-line no-restricted-globals
        balance += isNaN(el.balance) ? 0 : el.balance;
      });
    }

    return balance;
  },

  balance(state, getters) {
    return Number(
      Number(getters.balancePrepaidPackages + getters.balanceMonthlyPackage)
        .toFixed(2),
    );
  },

  getAuthUserPermissionOfSharedResource: (state, getters) => ({
    isPublic,
    usersPrivateAccess,
    creator,
  }) => {
    let permission = enums.SharedPermission.NONE;

    if (getters.userId === creator || getters.isOwner || getters.isAdmin) {
      permission = enums.SharedPermission.ALL;
    } else if (isPublic) {
      permission = enums.SharedPermission.VIEW;
    } else {
      const access = usersPrivateAccess.find((a) => a.user === getters.userId);

      if (access) {
        permission = access.permission;
      }
    }

    return permission;
  },

  userHasPermissionTo: (state, getters) => (permission) => {
    if (getters.isOwner || getters.isAdmin) {
      return true;
    }

    const userPermission = getters.permissions.find((p) => p.permission === permission);

    return userPermission && userPermission.access;
  },

  userHasPermissionsTo: (state, getters) => ({ all = false, permissions = [] }) => {
    if (getters.isOwner || getters.isAdmin) {
      return true;
    }

    if (all) {
      return permissions.every((per) => getters.userHasPermissionTo(per));
    }

    return permissions.some((per) => getters.userHasPermissionTo(per));
  },
};
