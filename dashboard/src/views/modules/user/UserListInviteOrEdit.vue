<template>
  <form>
    <div
      v-if="isCreation"
      class="vx-row">
      <div class="vx-col w-full">
        <label class="vs-input--label required">
          {{ $t('$UserModule.EmailAddresses') }}
        </label>
        <vue-tags-input
          ref="vueTagsInput"
          v-model="email"
          :name="$t('$UserModule.EmailAddresses')"
          :class="{'border-danger': errors.has($t('$UserModule.EmailAddresses'))}"
          placeholder="Add emails"
          :add-on-key="[13, 32, ':', ';', ',']"
          :tags="model.emails"
          :allow-edit-tags="true"
          :validation="validationsEmails"
          @tags-changed="emailsChanged"
        />
        <vs-input
          :value="model.emails.length > 0 ? 'emails' : ''"
          type="hidden"
          :name="$t('$UserModule.EmailAddresses')"
          v-validate="'required'"
          data-vv-validate-on="input|blur"
          :danger="errors.has($t('$UserModule.EmailAddresses'))"
          :danger-text="errors.first($t('$UserModule.EmailAddresses'))"/>
      </div>
    </div>

    <div
      v-if="isEdition || isView"
      class="vx-row mt-3">
      <div class="vx-col w-full">
        <label
          class="vs-input--label"
          :class="{required: !isView && model.status !== this.$enums.Users.Status.INVITED}">
          {{ $t('$General.Status') }}
        </label>
        <v-select
          v-model="model.status"
          placeholder="status"
          :disabled="isView || model.status === this.$enums.Users.Status.INVITED"
          :options="userStatusOptionsFiltered.map((s) => s.value)"
          :clearable="false"
          :multiple="false"
          close-on-select
          :get-option-label="(option) =>
          userStatusOptionsFiltered.find((s) => s.value === option).label"
        />
      </div>
    </div>

    <vx-card
      class="mt-base"
      no-shadow card-border>
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="flex items-end px-3">
            <feather-icon
              svgClasses="w-6 h-6"
              icon="LockIcon"
              class="mr-2" />
            <span class="font-medium text-lg leading-none">
              {{ $t('$General.Permissions') }}
            </span>
          </div>

          <vs-divider />
        </div>
      </div>

      <ul>
        <user-list-invite-or-edit-permission
          :permission.sync="model.permissions"
          :disabled="isView"/>
      </ul>
    </vx-card>

    <base-form-footer-action-buttons
      :hide-save="isView"
      :actions="mappedFilteredByRole"
      @action="onAction"
      @save="save(model.toSavePayload())"
      @cancel="$emit('close')">
      <template v-slot:save>
        {{ $t(buttonSaveText) }}
      </template>
      <template
        v-if="isView"
        v-slot:cancel>
        {{ $t("$General.Close") }}
      </template>
    </base-form-footer-action-buttons>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

// Components
import vSelect from 'vue-select';
import VueTagsInput from '@johmun/vue-tags-input';

// Custom Components
import UserListInviteOrEditPermission from '@/views/modules/user/UserListInviteOrEditPermission.vue';
import BaseFormFooterActionButtons from '@/views/modules/components/BaseFormFooterActionButtons.vue';

// Mixins
import singleCreateOrEdit from '@/views/modules/mixins/singleCreateOrEdit';

// constructors and utils
import UserListInviteOrEdit from '@/views/modules/user/user.constructor';
import { validateEmail } from '@/util/util.validate';


export default {
  name: 'UserListInviteOrEdit',
  components: {
    vSelect,
    VueTagsInput,
    UserListInviteOrEditPermission,
    BaseFormFooterActionButtons,
  },
  mixins: [singleCreateOrEdit],
  data() {
    return {
      model: new UserListInviteOrEdit(this.operation, this.authUserRole, this.modelPayload),
      email: '',
      validationsEmails: [{
        classes: 'text-danger',
        rule(text) {
          return !validateEmail(text.text);
        },
        disableAdd: true,
      }],
      userStatusOptions: [
        {
          label: this.$t('$General.Invited'),
          value: this.$enums.Users.Status.INVITED,
        },
        {
          label: this.$t('$General.Active'),
          value: this.$enums.Users.Status.ACTIVE,
        },
        {
          label: this.$t('$General.Inactive'),
          value: this.$enums.Users.Status.INACTIVE,
        },
      ],
      addItemFunction: this.inviteUser,
      editItemFunction: this.editUser,
    };
  },
  computed: {
    ...mapGetters({
      authUserRole: 'auth/rolePrefix',
    }),
    isAnyEmail() {
      return this.model.emails.length > 0;
    },
    verifyProperties() {
      if (this.isCreation) {
        return this.isAnyEmail;
      }

      return true;
    },
    buttonSaveText() {
      return this.operation === this.$enums.Operation.CREATE
        ? '$General.Invite' : '$General.Edit';
    },
    userStatusOptionsFiltered() {
      return this.userStatusOptions.filter(
        (option) => !(this.isEdition
          && this.model.status !== this.$enums.Users.Status.INVITED
          && option.value === this.$enums.Users.Status.INVITED),
      );
    },
    mappedFilteredByRole() {
      return this.mappedActions.filter(
        (action) => !(this.modelPayload
          && this.modelPayload.role.name.split('-')[1] === this.$enums.Auth.Role.Suffix.OWNER
          && (action.name === this.$enums.Operation.EDIT
            || action.name === this.$enums.Operation.DELETE)),
      );
    },
  },
  methods: {
    ...mapActions({
      inviteUser: 'user/inviteUser',
      editUser: 'user/editUser',
    }),
    emailsChanged(emails) {
      this.model.emails = emails;

      this.$nextTick(() => {
        this.$validator.validate(this.$t('$UserModule.EmailAddresses'));
      });
    },
    async validateFormToSave() {
      const formIsValid = await this.$validator.validate();

      if (!formIsValid) {
        const { field } = this.$validator.errors.items[0];
        if (field === this.$t('$UserModule.EmailAddresses')) {
          this.$refs.vueTagsInput.$el.scrollIntoView(false);
        } else {
          this.$el.querySelector(`[name='${field}']`).focus();
        }
      }

      return formIsValid && this.verifyProperties;
    },
  },
};
</script>
