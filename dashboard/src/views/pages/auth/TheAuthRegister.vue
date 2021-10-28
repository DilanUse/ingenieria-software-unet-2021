<template>
  <div class="w-full">
    <form class="w-full">
      <vs-row>
        <vs-col
          class="px-2 sm:px-4"
          vs-w="12"
          vs-xs="12"
          vs-sm="12"
          vs-lg="12">
          <vs-input
            v-model="model.name"
            class="w-full required"
            :label="$t('$General.Name')"
            :name="$t('$General.Name')"
            icon-no-border
            icon="icon icon-user"
            icon-pack="feather"
            v-validate="'required|alpha_spaces|min:2|max:35'"
            data-vv-validate-on="input"
            :danger="errors.has($t('$General.Name'))"
            :danger-text="errors.first($t('$General.Name'))"
            val-icon-danger="clear"/>
        </vs-col>
      </vs-row>

      <vs-row class="mt-5">
        <vs-col
          vs-w="12"
          vs-xs="12"
          vs-sm="12"
          vs-lg="12"
          class="px-2 sm:px-4">
          <vs-input
            v-model="model.email"
            class="w-full required"
            type="email"
            :name="$tc('$General.Email')"
            :label="$tc('$General.Email')"
            icon-no-border
            icon="icon icon-mail"
            icon-pack="feather"
            v-validate="'required|email|min:5|max:35'"
            data-vv-validate-on="input"
            :danger="errors.has($tc('$General.Email'))"
            :danger-text="errors.first($tc('$General.Email'))"
            val-icon-danger="clear"/>
        </vs-col>
      </vs-row>

      <vs-row class="mt-5">
        <vs-col
          vs-w="12"
          vs-xs="12"
          vs-sm="12"
          vs-lg="12"
          class="px-2 sm:px-4">
          <vs-input
            v-model="model.password"
            type="password"
            class="w-full required"
            :name="$t('$General.Password')"
            :label="$t('$General.Password')"
            icon-no-border
            icon="icon icon-lock"
            icon-pack="feather"
            v-validate="'required|min:6|max:30'"
            data-vv-validate-on="input"
            :danger="errors.has($t('$General.Password'))"
            :danger-text="errors.first($t('$General.Password'))"
            val-icon-danger="clear"/>
        </vs-col>
      </vs-row>

      <vs-row class="mt-5">
        <vs-col
          vs-w="12"
          vs-xs="12"
          vs-sm="12"
          vs-lg="12"
          class="flex items-center px-2 sm:px-4">
          <vs-button
            class="w-full"
            @click.prevent="register()">{{ $t('$Auth.SignUpWithEmail') }}
          </vs-button>
        </vs-col>
      </vs-row>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'TheAuthRegister',
  components: {
  },
  data() {
    return {
      model: {
        name: '',
        email: '',
        password: '',
        acceptTermsAndConditions: true,
        acceptReceiveNewsAndUpdates: false,
      },
    };
  },
  methods: {
    ...mapActions({
      signUp: 'auth/signUp',
    }),
    async register() {
      const formIsValid = await this.$validator.validate();

      if (!formIsValid) {
        document.getElementsByName([this.$validator.errors.items[0].field])[0].focus();
        return;
      }

      this.$vs.loading({ type: 'radius' });
      await this.signUp(this.model);
      this.$vs.loading.close();

      this.$vs.notify({
        title: this.$t('$Auth.SignUpAttempt'),
        text: this.$t('$Auth.SuccessfullySignUpMsg'),
        iconPack: 'feather',
        icon: 'icon-check',
        color: 'success',
      });

      this.$emit('registered-user', this.model.email);
    },
  },
};
</script>
