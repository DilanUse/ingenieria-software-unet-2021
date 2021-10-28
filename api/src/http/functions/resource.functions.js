const { RESOURCE_PERMISSION } = require('../constants/resource.constants');
const { ROLES_SYSTEM } = require('../../components/shared.constant');
const { subRoleIsOwnerOrAdmin } = require('../../components/user/user.functions');
const { getFiltersForQueryFind } = require('../../components/shared.functions');

function getQueryPermissionForResource(permission) {
  switch (permission) {
    case RESOURCE_PERMISSION.ALL:
      return [RESOURCE_PERMISSION.ALL];
    case RESOURCE_PERMISSION.MODIFY:
      return [
        RESOURCE_PERMISSION.MODIFY,
        RESOURCE_PERMISSION.ALL,
      ];
    case RESOURCE_PERMISSION.VIEW:
      return [
        RESOURCE_PERMISSION.VIEW,
        RESOURCE_PERMISSION.MODIFY,
        RESOURCE_PERMISSION.ALL,
      ];

    default:
      return [];
  }
}

function getQueryFindForSharedResources({
  userRole, userId, tenantId, isPublicCondition = true,
  validation = false, queryPermission = '', payloadId = '', filters = {},
  filtersMatch = 'all',
}) {
  let queryFind;

  const conditionalUsersPrivateAccess = (!validation) ? { user: userId }
    : { user: userId, permission: { $in: queryPermission } };

  const conditionals = [{
    usersPrivateAccess: {
      $elemMatch: conditionalUsersPrivateAccess,
    },
  },
  {
    creator: userId,
  }];

  if (isPublicCondition) {
    conditionals.push({
      isPublic: true,
      tenant: tenantId,
    });
  }

  if (userRole === ROLES_SYSTEM.ROLES.MERCHANT_USER) {
    queryFind = {
      $or: conditionals,
    };
  } else if (userRole === ROLES_SYSTEM.ROLES.MERCHANT_OWNER
    || userRole === ROLES_SYSTEM.ROLES.MERCHANT_ADMIN) {
    queryFind = {
      tenant: tenantId,
    };
  }

  // eslint-disable-next-line no-underscore-dangle
  if (validation && payloadId !== '') queryFind._id = payloadId;

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

function deleteMemberUsersPrivateAccess({ userId, resourceModel }) {
  const indexFound = resourceModel.usersPrivateAccess.findIndex(
    (userPermission) => (userPermission.user).toString() === userId,
  );

  if (indexFound !== -1) {
    resourceModel.usersPrivateAccess.splice(indexFound, 1);
    resourceModel.save();
  }
}

function deleteResource({
  resourceModel, userId, tenantId, userRole,
}) {
  if (userId === (resourceModel.creator).toString()
    || (subRoleIsOwnerOrAdmin(userRole) && tenantId === (resourceModel.tenant).toString())) {
    if (resourceModel.deleted === true) {
      resourceModel.remove();
    } else {
      resourceModel.delete();
    }
  } else {
    deleteMemberUsersPrivateAccess({ userId, resourceModel });
  }
}

module.exports = {
  deleteMemberUsersPrivateAccess,
  deleteResource,
  getQueryPermissionForResource,
  getQueryFindForSharedResources,
};
