<template>
  <div class="h-screen w-full bg-white">
    <auth-logo-banner/>

    <div class="vx-row no-gutter w-full items-center justify-center pb-base">
      <div class="vx-col w-full sm:w-6/12 md:w-5/12 lg:w-4/12 xl:w-3/12 py-base">
        <vx-card no-shadow card-border>
          <div
            slot="no-body">
            <div class="vx-row no-gutter justify-center items-center p-8">
              <div class="vx-col w-full">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">{{ $t('$Auth.ResetPasswordTitle') }}</h4>
                  <p>{{ $t('$Auth.ResetPasswordMsg') }}</p>
                </div>

                <form>
                  <vs-input
                    v-model="password"
                    type="password"
                    v-validate="'required|min:6|max:30'"
                    data-vv-validate-on="input"
                    :name="$t('$Auth.NewPassword')"
                    :label-placeholder="$t('$Auth.NewPassword')"
                    icon-no-border
                    icon="icon icon-lock"
                    icon-pack="feather"
                    class="w-full"
                    :danger="errors.has($t('$Auth.NewPassword'))"
                    :danger-text="errors.first($t('$Auth.NewPassword'))"
                    val-icon-danger="clear"/>

                  <div class="mt-8">
                    <vs-button
                      class="w-full"
                      @click.prevent="sendRequestToChange()">
                      {{ $t('$Auth.ResetPasswordTitle') }}
                    </vs-button>

                    <vs-button
                      type="border"
                      to="/log-in"
                      class="w-full mt-3">
                      {{ $t('$Auth.BackToLogin') }}
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
  name: 'TheResetPassword',
  components: {
    AuthLogoBanner,
  },
  data() {
    return {
      securityToken: this.$route.params.securityToken,
      password: '',
    };
  },
  methods: {
    ...mapActions({
      changePassword: 'auth/changePassword',
    }),
    async sendRequestToChange() {
      const formIsValid = await this.$validator.validate();

      if (!formIsValid) {
        document.getElementsByName([this.$validator.errors.items[0].field])[0].focus();
        return;
      }

      this.$vs.loading({ type: 'radius' });
      await this.changePassword({ securityToken: this.securityToken, password: this.password });
      await this.$router.push({ name: 'login' });
      this.$vs.loading.close();

      this.$vs.notify({
        title: this.$t('$Auth.ResetPasswordTitle'),
        text: this.$t('$Auth.ResetPasswordSuccess'),
        iconPack: 'feather',
        icon: 'icon-check',
        color: 'success',
      });

    },
  },
};
</script>
