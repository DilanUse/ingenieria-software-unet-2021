<template>
  <div>
    <a
      v-if="toggleButton"
      href="#"
      @click.prevent="() => showElements=!showElements">
      {{
      showElements
      ? $t('$Components.$ShareResource.HideShareOptions')
      : $t('$Components.$ShareResource.ShowShareOptions')
      }}
    </a>

    <vx-card
      v-if="!toggleButton || showElements"
      class="mb-5"
      noShadow
      cardBorder>
      <div class="mb-3">
        <vs-radio
          v-model="isPublicLocal"
          vs-value="private">
          {{ $t('$General.Private') }}
        </vs-radio>
        <vs-radio
          v-model="isPublicLocal"
          vs-value="public"
          class="ml-3">
          {{ $t('$General.Public') }}
        </vs-radio>
      </div>

      <label class="vs-input--label">{{ $t('$Components.$ShareResource.SharedWith') }}</label>
      <div class="flex">
        <div class="flex-grow">
          <v-select
            v-model="sharedUsers"
            label="name"
            :disabled="isPublicLocal === 'public'"
            :placeholder="$t('$Components.$ShareResource.SelectUsersToSharePlaceholder')"
            :options="usersToShareFiltered"
            :clearable="true"
            :multiple="true"
            :close-on-select="false"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>
        <div class="ml-3 flex justify-center">
          <div class="dropdown-button-container">
            <vs-button
              class="btnx px-0"
              color="primary"
              type="border"
              icon-pack="feather"
              :icon="selectedPermission.icon2"></vs-button>
            <vs-dropdown vs-trigger-click>
              <vs-button
                class="btn-drop px-0"
                type="border"
                color="primary"
                icon="expand_more"></vs-button>
              <vs-dropdown-menu>

                <vs-dropdown-item
                  v-for="per in permissions"
                  :key="per.permission"
                  @click="() => selectedPermission = per">
                  <div class="flex items-center">
                    <feather-icon
                      :icon="per.icon"
                      :class="selectedPermission.permission === per.permission
                    ? 'text-primary' : ''" />
                    <span :class="{
                    'ml-3': true,
                    'text-primary': selectedPermission.permission === per.permission
                  }">
                    {{ per.text }}
                  </span>
                  </div>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </div>
        </div>
      </div>

      <div class="flex justify-end px-0 mt-3 w-full">
        <vs-button
          color="primary"
          type="filled"
          :disabled="sharedUsers.length < 1"
          @click="onShare()">{{ $t('$General.Share') }}</vs-button>
      </div>
    </vx-card>

    <vs-table
      v-if="!toggleButton || showElements"
      :data="collaborators"
      :no-data-text="this.isPublicLocal === 'public'
      ? $t('$Components.$ShareResource.SelectPublicMsg')
      : $t('$Components.$ShareResource.NoCollaboratorsMsg')"
      stripe >
      <template slot="header">
        <h3>
          {{ $t('$General.Collaborators') }}
        </h3>
      </template>
      <template slot-scope="{data}">
        <vs-tr
          v-for="(tr, indextr) in data"
          :key="indextr" >

          <vs-td :data="data[indextr].name">
            {{ data[indextr].name }}
          </vs-td>

          <vs-td :data="data[indextr]">
            <vs-dropdown
              vs-trigger-click
              class="cursor-pointer">
              <a
                class="flex items-center"
                href="#">
                {{ getPermissionObject(data[indextr].permission).text }}
                <i class="material-icons">expand_more</i>
              </a>

              <vs-dropdown-menu>
                <vs-dropdown-item
                  v-for="per in permissions"
                  :key="per.permission"
                  @click="updateCollaboratorPermission(data[indextr].id, per.permission)">
                  <div class="flex items-center">
                    <feather-icon
                      :icon="per.icon"
                      :class="data[indextr].permission === per.permission
                    ? 'text-primary' : ''" />
                    <span :class="{
                    'ml-3': true,
                    'text-primary': data[indextr].permission === per.permission
                  }">
                    {{ per.text }}
                  </span>
                  </div>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vs-td>

          <vs-td :data="data[indextr].id">
            <feather-icon
              icon="XIcon"
              class="text-danger cursor-pointer"
              @click="removeCollaborator(data[indextr].id)"/>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <base-form-footer-action-buttons
      v-if="buttons"
      @save="onSaveShare()"
      @cancel="$emit('cancel')"/>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import BaseFormFooterActionButtons from './BaseFormFooterActionButtons.vue';
import enums from '@/enums';


export default {
  name: 'ShareResource',
  components: {
    vSelect,
    BaseFormFooterActionButtons,
  },
  props: {
    isPublic: {
      type: Boolean,
      required: true,
    },
    usersPrivateAccess: {
      type: Array,
      required: true,
      validator(usersPrivateAccess) {
        return usersPrivateAccess.every((option) => typeof option === 'object'
          && option !== null
          && 'user' in option
          && typeof option.user === 'string'
          && 'permission' in option
          && typeof option.permission === 'string'
          && [
            enums.SharedPermission.VIEW,
            enums.SharedPermission.MODIFY,
            enums.SharedPermission.ALL,
          ].includes(option.permission));
      },
    },
    usersToShare: {
      type: Array,
      required: true,
      validator(usersToShare) {
        return usersToShare.every((option) => typeof option === 'object'
          && option !== null
          && 'id' in option
          && 'name' in option);
      },
    },
    buttons: {
      type: Boolean,
      required: false,
      default: false,
    },
    toggleButton: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isPublicLocal: this.isPublic ? 'public' : 'private',
      usersPrivateAccessLocal: [...this.usersPrivateAccess],
      sharedUsers: [],
      permissions: [
        {
          permission: this.$enums.SharedPermission.VIEW,
          icon: 'EyeIcon',
          icon2: 'icon-eye',
          text: this.$t('$Components.$ShareResource.CanView'),
        },
        {
          permission: this.$enums.SharedPermission.MODIFY,
          icon: 'Edit2Icon',
          icon2: 'icon-edit-2',
          text: this.$t('$Components.$ShareResource.CanEdit'),
        },
        {
          permission: this.$enums.SharedPermission.ALL,
          icon: 'Share2Icon',
          icon2: 'icon-share-2',
          text: this.$t('$Components.$ShareResource.CanEditAndShare'),
        },
      ],
      selectedPermission: null,
      showElements: false,
    };
  },
  computed: {
    collaborators() {
      const collaborators = [];
      this.usersPrivateAccessLocal.forEach((userPrivateAccess) => {
        const collaborator = this.usersToShare.find((user) => user.id === userPrivateAccess.user);

        if (collaborator) {
          collaborators.push({
            id: collaborator.id,
            name: collaborator.name,
            permission: userPrivateAccess.permission,
          });
        }
      });

      return collaborators;
    },
    usersToShareFiltered() {
      return this.usersToShare.filter(
        (user) => !this.usersPrivateAccessLocal.map((upa) => upa.user).includes(user.id),
      );
    },
    isPublicLocalBool() {
      return this.isPublicLocal === 'public';
    },
  },
  watch: {
    isPublicLocal(value) {
      if (value === 'public') {
        this.usersPrivateAccessLocal = [];
        this.sharedUsers = [];
        this.$emit('update:users-private-access', this.usersPrivateAccessLocal);
      }

      this.$emit('update:is-public', this.isPublicLocalBool);
    },
    isPublic(value) {
      this.isPublicLocal = value ? 'public' : 'private';
    },
    usersPrivateAccess(value) {
      this.usersPrivateAccessLocal = [...value];
    },
  },
  created() {
    // eslint-disable-next-line prefer-destructuring
    this.selectedPermission = this.permissions[0];
  },
  methods: {
    onShare() {
      this.sharedUsers.map((user) => ({
        user: user.id,
        permission: this.selectedPermission.permission,
      })).forEach((user) => this.usersPrivateAccessLocal.push(user));
      this.sharedUsers = [];
      this.$emit('update:users-private-access', this.usersPrivateAccessLocal);
    },
    getPermissionObject(permission) {
      return this.permissions.find((p) => p.permission === permission);
    },
    removeCollaborator(userId) {
      const index = this.usersPrivateAccessLocal.findIndex((u) => u.user === userId);

      if (index !== -1) {
        this.usersPrivateAccessLocal.splice(index, 1);
        this.$emit('update:users-private-access', this.usersPrivateAccessLocal);
      }
    },
    updateCollaboratorPermission(userId, permission) {
      const index = this.usersPrivateAccessLocal.findIndex((u) => u.user === userId);

      if (index !== -1) {
        this.usersPrivateAccessLocal[index].permission = permission;
        this.$emit('update:users-private-access', this.usersPrivateAccessLocal);
      }
    },
    onSaveShare() {
      this.$emit('save', {
        isPublic: this.isPublicLocalBool,
        usersPrivateAccess: this.usersPrivateAccessLocal,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/vuexy/pages/dropdown.scss";

.con-vs-dropdown--menu {
  z-index: 54000 !important;
}

.dropdown-button-container .vs-button.px-0 {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
