<template>
<div class="flex justify-center items-center">
  <form class="w-full">
    <vs-col class="sm:p-2 p-4">
      <vs-input
        v-model="email"
        class="w-full mt-0"
        v-validate="'required|email|min:5|max:35'"
        data-vv-validate-on="input"
        :name="$tc('$General.Email')"
        icon-no-border
        icon="icon icon-mail"
        icon-pack="feather"
        :label-placeholder="$tc('$General.Email')"
        :danger="errors.has($tc('$General.Email'))"
        :danger-text="errors.first($tc('$General.Email'))"
        val-icon-danger="clear"/>

      <vs-input
        v-model="password"
        class="w-full mt-10"
        data-vv-validate-on="input"
        v-validate="'required|min:4|max:15'"
        type="password"
        :name="$t('$General.Password')"
        icon-no-border
        icon="icon icon-lock"
        icon-pack="feather"
        :label-placeholder="$t('$General.Password')"
        :danger="errors.has($t('$General.Password'))"
        :danger-text="errors.first($t('$General.Password'))"
        val-icon-danger="clear"/>

      <div class="w-full mt-2">
        <router-link
          to="/forgot-password"
          class="link-decorate">
          {{ $t('$Auth.ForgotPasswordMsg') }}
        </router-link>
      </div>

      <div class="w-full mt-5">
        <vs-button
          class="w-full"
          @click="login()" >{{ $t('$Auth.LoginWithEmail') }}</vs-button>
      </div>
    </vs-col>
  </form>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import configApi from '@/api/config';

export default {
  name: 'TheAuthLogin',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  created() {
    this.verifyQueryParamToken();
  },
  methods: {
    ...mapActions({
      signIn: 'auth/login',
      verifyToken: 'auth/verifyToken',
    }),
    redirectLoginGoogle() {
      window.location.href = `${configApi.url}/auth/google/false/false`;
    },
    async verifyQueryParamToken() {
      if (this.$route.query.token && this.$route.query.refreshToken) {
        this.$vs.loading({ type: 'radius' });
        await this.verifyToken({
          token: this.$route.query.token,
          refreshToken: this.$route.query.refreshToken,
        });
        await this.$router.push({ name: 'home' });
        this.$vs.loading.close();

        this.$vs.notify({
          title: this.$t('$Auth.LoginAttempt'),
          text: this.$t('$Auth.SuccessfullyLoginMsg'),
          iconPack: 'feather',
          icon: 'icon-check',
          color: 'success',
        });
      } else if (this.$route.query.authEmailVerificationSuccess) {
        this.$vs.notify({
          title: this.$t('$Auth.$EmailAccountVerification.VerificationNotificationTitle'),
          text: this.$t('$Auth.$EmailAccountVerification.VerificationNotificationOkMsg'),
          iconPack: 'feather',
          icon: 'icon-check',
          color: 'success',
          time: 5000,
        });
      } else if (this.$route.query.authEmailVerificationError) {
        this.$emit('email-unverified-login-attempt', this.$route.query.email);

        this.$vs.notify({
          title: this.$t('$Auth.$EmailAccountVerification.VerificationNotificationTitle'),
          text: this.$t('$Auth.$EmailAccountVerification.InvalidLinkClickedErrorMsg'),
          iconPack: 'feather',
          icon: 'icon-x',
          color: 'warning',
          time: 5000,
        });
      } else if (this.$route.query.authGoogleError) {
        this.$vs.notify({
          title: this.$t('$Auth.GoogleLoginErrorNotifyTitle'),
          text: this.$t('$Auth.GoogleLoginErrorNotifyMsg'),
          iconPack: 'feather',
          icon: 'icon-x',
          color: 'warning',
          time: 5000,
        });
      }
    },
    async login() {
      const formIsValid = await this.$validator.validate();

      if (!formIsValid) {
        document.getElementsByName([this.$validator.errors.items[0].field])[0].focus();
        return;
      }

      this.$vs.loading({ type: 'radius' });

      try {
        const { data } = await this.signIn({
          email: this.email,
          password: this.password,
        });

        if (data.twoFactorAuthenticationActivate) {
          await this.$router.push({ name: 'login-second-step', query: { tokenSecondStep: data.tokenSecondStep } });
          this.$vs.loading.close();
        } else {
          await this.$router.push({ name: 'home' });
          this.$vs.loading.close();

          this.$vs.notify({
            title: this.$t('$Auth.LoginAttempt'),
            text: this.$t('$Auth.SuccessfullyLoginMsg'),
            iconPack: 'feather',
            icon: 'icon-check',
            color: 'success',
          });
        }
      } catch (e) {
        console.log('component', e.response);
        this.$vs.loading.close();

        if (e.response && e.response.data
          && e.response.data.attributes
          && e.response.data.attributes.status === this.$enums.Users.Status.EMAIL_NOT_VERIFIED) {
          this.$emit('email-unverified-login-attempt', this.email);
        }
      }
    },
  },
};
</script>
