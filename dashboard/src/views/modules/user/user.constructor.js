import BaseConstructor from '@/views/modules/base.constructor';
import enums from '@/enums';


export default class UserListInviteOrEdit extends BaseConstructor {
  #basePermissions = {
    permission: 'owner',
    checked: false,
    access: false,
    dependenceOnChildren: false,
    children: [{
      permission: 'admin',
      checked: false,
      access: false,
      dependenceOnChildren: true,
      children: [],
    }],
  };

  #commonPermissions = [
    {
      permission: enums.Auth.Permissions.USERS,
      checked: false,
      access: false,
      children: [],
    },
    {
      permission: enums.Auth.Permissions.BUSINESS,
      checked: false,
      access: false,
      children: [],
    },
    {
      permission: enums.Auth.Permissions.CAMPAIGNS,
      checked: false,
      access: false,
      children: [],
    },
  ];

  #adminPermissions = [
    ...this.#commonPermissions,
    {
      permission: enums.Auth.Permissions.MERCHANTS,
      checked: false,
      access: false,
      children: [],
    },
    {
      permission: enums.Auth.Permissions.APP_SETTINGS,
      checked: false,
      access: false,
      children: [],
    },
    {
      permission: enums.Auth.Permissions.APP_SERVICES,
      checked: false,
      access: false,
      children: [],
    },
  ];

  #merchantPermissions = [
    ...this.#commonPermissions,
  ];

  permissions = this.#basePermissions;

  emails = [];

  status = enums.Users.Status.INVITED;

  #role = enums.Auth.Role.Prefix.MERCHANT;

  constructor(
    operation = enums.Operation.CREATE,
    role = enums.Auth.Role.Prefix.MERCHANT,
    payload = null,
  ) {
    super(operation, payload);

    this.#role = role;
    this.status = operation === enums.Operation.CREATE
      ? enums.Users.Status.INVITED : payload.status;

    if (role === enums.Auth.Role.Prefix.ADMIN) {
      this.permissions.children[0].children = this.#adminPermissions;
    } else if (role === enums.Auth.Role.Prefix.MERCHANT) {
      this.permissions.children[0].children = this.#merchantPermissions;
    } else {
      throw new Error('Invalid Role, must be "admin" or "merchant"');
    }

    if (operation !== enums.Operation.CREATE) {
      if (payload.role.name.split('-')[1] === enums.Auth.Role.Suffix.OWNER) {
        this.permissions.access = true;
        this.permissions.checked = true;
        this.markCheckedAllPermissionsAndChildren(this.permissions.children);
      } else if (payload.role.name.split('-')[1] === enums.Auth.Role.Suffix.ADMIN
        || payload.role.permissions.every((p) => p.access)) {
        this.permissions.children[0].access = true;
        this.permissions.children[0].checked = true;
        this.markCheckedAllPermissionsAndChildren(this.permissions.children[0].children);
      } else {
        this.mapPayloadToModel(this.permissions, payload.role.permissions);
        this.checkPermissions();
      }
    }
  }

  toCreatePayload() {
    return {
      owner: this.permissions.access,
      admin: this.permissions.children[0].access,
      emails: this.emails.filter((e) => e.tiClasses[0] === 'ti-valid').map((e) => e.text),
      permissions: this.convertPermissionsToLineal(this.permissions.children),
    };
  }

  toEditPayload() {
    return {
      id: this.payload.id,
      owner: this.permissions.access,
      admin: this.permissions.children[0].access,
      permissions: this.convertPermissionsToLineal(this.permissions.children),
      status: this.status,
    };
  }

  convertPermissionsToLineal(permissions = []) {
    let linealPermissions = [];

    for (let per = 0; per < permissions.length; per += 1) {
      linealPermissions.push({
        permission: permissions[per].permission,
        access: permissions[per].access,
      });

      if (permissions[per].children.length > 0) {
        linealPermissions = linealPermissions.concat(
          this.convertPermissionsToLineal(permissions[per].children),
        );
      }
    }

    return linealPermissions;
  }

  markCheckedAllPermissionsAndChildren(permissions = []) {
    for (let per = 0; per < permissions.length; per += 1) {
      // eslint-disable-next-line no-param-reassign
      permissions[per].access = true;
      // eslint-disable-next-line no-param-reassign
      permissions[per].checked = true;

      if (permissions[per].children.length > 0) {
        this.markCheckedAllPermissionsAndChildren(permissions[per].children);
      }
    }
  }

  checkPermissions(permission = this.permissions, parent = null) {
    if ((parent !== null && parent.access) || permission.access) {
      // eslint-disable-next-line no-param-reassign
      permission.access = true;
      // eslint-disable-next-line no-param-reassign
      permission.checked = true;
    } else if (permission.children.length > 0) {
      if (permission.dependenceOnChildren && permission.children.every((per) => per.access)) {
        // eslint-disable-next-line no-param-reassign
        permission.access = true;
      }

      if (permission.children.some((per) => per.access)) {
        // eslint-disable-next-line no-param-reassign
        permission.checked = true;
      }
    }

    for (let per = 0; per < permission.children.length; per += 1) {
      const childrenCheck = this.checkPermissions(permission.children[per], permission);

      if (childrenCheck) {
        // eslint-disable-next-line no-param-reassign
        permission.checked = true;
      }
    }

    return permission.checked;
  }

  mapPayloadToModel(permission = this.permissions, payloadPermissions) {
    const payloadPer = payloadPermissions.find((pp) => pp.permission === permission.permission);

    if (payloadPer) {
      // eslint-disable-next-line no-param-reassign
      permission.access = payloadPer.access;
    }

    for (let per = 0; per < permission.children.length; per += 1) {
      this.mapPayloadToModel(permission.children[per], payloadPermissions);
    }
  }
}
