<template>
  <div class="h-screen w-full bg-white">
    <auth-logo-banner/>

    <div class="vx-row no-gutter w-full items-center justify-center pb-base">
      <div class="vx-col w-full sm:w-8/12 md:w-6/12 lg:w-4/12">
        <vx-card no-shadow card-border>
          <div
            slot="no-body"
            class="full-page-bg-color">
            <div class="vx-row no-gutter justify-center items-center">
              <div class="vx-col w-full d-theme-dark-bg">
                <div class="px-4 xl:px-8 py-base login-tabs-container">
                  <vs-tabs
                    alignment="fixed"
                    :value="tabValue">
                    <vs-tab
                      :label="$t('$Auth.Login')"
                      @click="onTabChanged('Login')">
                      <login
                        class="mt-base"
                        @email-unverified-login-attempt="showEmailAccountVerifyModal"></login>
                    </vs-tab>

                    <vs-tab
                      :label="$t('$Auth.SignUpFree')"
                      @click="onTabChanged('SignUp')">
                      <register
                        class="mt-base"
                        @registered-user="showEmailAccountVerifyModal"></register>
                    </vs-tab>
                  </vs-tabs>
                </div>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>

    <vs-popup
      :title="$t('$Auth.$EmailAccountVerification.VerificationModalTitle', {
        email: this.emailToVerify
      })"
      :active.sync="activeModalVerify">
      <email-account-verification
        v-if="activeModalVerify"
        :email="emailToVerify"
        @close="activeModalVerify=false"
        @verified="activeModalVerify=false">
      </email-account-verification>
    </vs-popup>
  </div>
</template>

<script>
// Components
import AuthLogoBanner from '@/views/pages/auth/components/AuthLogoBanner.vue';
import TheAuthLogin from '@/views/pages/auth/TheAuthLogin.vue';
import TheAuthRegister from '@/views/pages/auth/TheAuthRegister.vue';
import EmailAccountVerification from '@/views/pages/auth/components/EmailAccountVerification.vue';

export default {
  name: 'TheAuth',
  components: {
    AuthLogoBanner,
    login: TheAuthLogin,
    register: TheAuthRegister,
    EmailAccountVerification,
  },
  props: {
    operation: {
      type: String,
      required: false,
      default: 'Login',
      validator(operation) {
        return ['Login', 'SignUp'].some((op) => op === operation);
      },
    },
  },
  data() {
    return {
      localOperation: this.operation,
      activeModalVerify: false,
      emailToVerify: '',
    };
  },
  computed: {
    tabValue() {
      return this.localOperation === 'Login' ? 0 : 1;
    },
  },
  methods: {
    onTabChanged(operation) {
      this.localOperation = operation;
    },
    showEmailAccountVerifyModal(email) {
      this.localOperation = 'Login';
      this.emailToVerify = email;
      this.activeModalVerify = true;
    },
  },
};
</script>
