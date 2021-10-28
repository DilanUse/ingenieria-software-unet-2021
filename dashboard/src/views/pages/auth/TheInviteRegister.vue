<template>
  <div class="h-screen w-full bg-white">
    <auth-logo-banner/>

    <div class="vx-row no-gutter w-full items-center justify-center pb-base">
      <div class="vx-col w-full sm:w-6/12 md:w-5/12 lg:w-4/12 xl:w-3/12">
        <vx-card no-shadow card-border>
          <div slot="no-body">
            <div class="vx-row no-gutter justify-center items-center p-8">
              <div class="vx-col w-full">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">{{ $t('$Auth.InviteSignUpTitle') }}</h4>
                  <p class="text-justify">{{ $t('$Auth.InviteSignUpMsg') }}</p>
                </div>

                <form>
                  <vs-input
                    v-model="model.firstName"
                    class="w-full required"
                    :label="$t('$General.Name')"
                    :name="$t('$General.Name')"
                    icon-no-border
                    icon="icon icon-user"
                    icon-pack="feather"
                    v-validate="'required|alpha_spaces|min:2|max:35'"
                    data-vv-validate-on="input"
                    :danger="errors.has($tc('$General.Name'))"
                    :danger-text="errors.first($tc('$General.Name'))"
                    val-icon-danger="clear"/>

                  <vs-input
                    v-model="model.password"
                    type="password"
                    class="w-full required mt-8"
                    :name="$t('$General.Password')"
                    :label="$t('$General.Password')"
                    icon-no-border
                    icon="icon icon-lock"
                    icon-pack="feather"
                    autocomplete="new-password"
                    v-validate="'required|min:6|max:30'"
                    data-vv-validate-on="input"
                    :danger="errors.has($tc('$General.Password'))"
                    :danger-text="errors.first($tc('$General.Password'))"
                    val-icon-danger="clear"/>

                  <div class=" mt-8">
                    <vs-button
                      class="w-full"
                      @click.prevent="signUp()">
                      {{ $t('$Auth.SignUp') }}
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
  name: 'TheInviteRegister',
  components: {
    AuthLogoBanner,
  },
  data() {
    return {
      model: {
        firstName: '',
        password: '',
      },
      securityToken: this.$route.params.securityToken,
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.model.firstName !== '' && this.model.password !== '';
    },
  },
  methods: {
    ...mapActions({
      invitedSignUp: 'auth/invitedSignUp',
    }),
    async signUp() {
      const formIsValid = await this.$validator.validate();

      if (!formIsValid) {
        document.getElementsByName([this.$validator.errors.items[0].field])[0].focus();
        return;
      }

      this.$vs.loading({ type: 'radius' });
      await this.invitedSignUp({ securityToken: this.securityToken, user: this.model });
      await this.$router.push({ name: 'home' });
      this.$vs.loading.close();

      this.$vs.notify({
        title: this.$t('$Auth.SignUpAttempt'),
        text: this.$t('$Auth.SuccessfullySignUpMsg'),
        iconPack: 'feather',
        icon: 'icon-check',
        color: 'success',
      });
    },
  },
};
</script>
