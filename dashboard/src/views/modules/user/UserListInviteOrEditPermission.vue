<template>
  <li class="mt-5">
    <vs-checkbox
      v-model="permission.checked"
      :disabled="disabled"
      icon-pack="feather"
      :icon="icon"
      :color="color"
      @click="onPermissionClicked">
      {{ $t(`$UserModule.$Permissions.${this.name}PermissionName`) }}
    </vs-checkbox>
    <p class="pl-10 text-sm text-justify">
      {{ $t(`$UserModule.$Permissions.${this.name}PermissionDescription`) }}
    </p>

    <ul
      v-if="children.length > 0"
      class="pl-5">
      <user-list-invite-or-edit-permission
        v-for="(per) in children"
        :key="per.permission"
        :permission.sync="per"
        :disabled="disabled">
      </user-list-invite-or-edit-permission>
    </ul>
  </li>
</template>

<script>

export default {
  name: 'UserListInviteOrEditPermission',
  props: {
    permission: {
      type: Object,
      required: true,
      validator(per) {
        return ('permission' in per) && (typeof per.permission === 'string')
          && ('checked' in per) && (typeof per.checked === 'boolean')
          && ('access' in per) && (typeof per.access === 'boolean')
          && ('children' in per) && Array.isArray(per.children);
      },
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      suppressAccessWatch: false,
    };
  },
  computed: {
    access() {
      return this.permission.access;
    },
    name() {
      return this.permission.permission;
    },
    children() {
      return this.permission.children || [];
    },
    dependenceOnChildren() {
      return this.permission.dependenceOnChildren;
    },
    icon() {
      return this.access ? 'icon-check' : 'icon-minus';
    },
    color() {
      return this.access ? 'primary' : 'warning';
    },
  },
  watch: {
    access() {
      this.onPermissionAccessChange();
    },
    children: {
      deep: true,
      handler() {
        this.onChildrenChange();
      },
    },
  },
  methods: {
    onPermissionClicked() {
      setTimeout(() => {
        this.permission.access = !this.permission.access;
      });
    },
    onPermissionAccessChange() {
      if (!this.suppressAccessWatch) {
        this.$emit('update-permission', this.permission);
        this.permission.checked = this.access;

        for (let i = 0; i < this.children.length; i += 1) {
          this.children[i].access = this.access;
        }
      }
    },
    onChildrenChange() {
      this.suppressAccessWatch = true;

      if (this.children.some((child) => child.access)) {
        this.permission.checked = true;

        if (this.children.every((child) => child.access) && this.dependenceOnChildren) {
          this.permission.access = true;
        }

        if (this.children.some((child) => !child.access)) {
          this.permission.access = false;
        }
      } else {
        this.permission.checked = this.children.some((child) => child.checked);
        this.permission.access = false;
      }

      setTimeout(() => {
        this.suppressAccessWatch = false;
      });
    },
  },
};
</script>
