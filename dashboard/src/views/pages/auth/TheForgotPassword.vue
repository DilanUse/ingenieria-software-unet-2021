<template>
  <div class="h-screen w-full bg-white">
    <auth-logo-banner/>

    <div class="vx-row no-gutter w-full items-center justify-center pb-base">
      <div class="vx-col w-full sm:w-8/12 md:w-6/12 lg:w-4/12 py-base">
        <vx-card no-shadow card-border>
          <div slot="no-body">
            <div class="vx-row no-gutter justify-center items-center p-8">
              <div class="vx-col w-full">
                <div class="vx-card__title mb-base">
                  <h4 class="mb-4 text-center lg:text-left">
                    {{ $t('$Auth.RecoverPasswordTitle') }}
                  </h4>
                  <p class="text-justify">{{ $t('$Auth.RecoverPasswordMsg') }}</p>
                </div>

                <form>
                  <vs-input
                    v-model="email"
                    type="email"
                    v-validate="'required|email|min:5'"
                    data-vv-validate-on="input"
                    :name="$tc('$General.Email')"
                    :label-placeholder="$tc('$General.Email')"
                    class="w-full"
                    icon-no-border
                    icon="icon icon-mail"
                    icon-pack="feather"
                    :danger="errors.has($tc('$General.Email'))"
                    :danger-text="errors.first($tc('$General.Email'))"
                    val-icon-danger="clear"/>

                  <div class="flex flex-wrap-reverse justify-between items-center mt-base">
                    <vs-button
                      type="border"
                      to="/log-in"
                      class="w-full lg:w-auto">
                      {{ $t('$Auth.BackToLogin' )}}
                    </vs-button>

                    <vs-button
                      class="w-full lg:w-auto mb-5 lg:mb-0"
                      @click.prevent="sendEmailToRecover()">
                      {{ $t('$Auth.RecoverPasswordTitle') }}
                    </vs-button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import AuthLogoBanner from '@/views/pages/auth/components/AuthLogoBanner.vue';


export default {
  name: 'TheForgotPassword',
  components: {
    AuthLogoBanner,
  },
  data() {
    return {
      email: '',
    };
  },
  methods: {
    ...mapActions({
      recoverPassword: 'auth/recoverPassword',
    }),
    async sendEmailToRecover() {
      const formIsValid = await this.$validator.validate();

      if (!formIsValid) {
        document.getElementsByName([this.$validator.errors.items[0].field])[0].focus();
        return;
      }

      this.$vs.loading({ type: 'radius' });
      await this.recoverPassword(this.email);
      this.$vs.loading.close();

      this.$vs.notify({
        title: this.$t('$Auth.RecoveryEmail'),
        text: this.$t('$Auth.RecoveryEmailSent'),
        iconPack: 'feather',
        icon: 'icon-check',
        color: 'success',
      });

      this.email = '';
    },
  },
};
</script>
