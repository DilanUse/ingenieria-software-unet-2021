<template>
  <div class="h-screen w-full bg-white">
    <auth-logo-banner/>

    <div class="vx-row no-gutter w-full items-center justify-center pb-base">
      <div class="vx-col w-full sm:w-6/12 md:w-5/12 lg:w-4/12 py-base">
        <vx-card no-shadow card-border>
          <div
            slot="no-body">
            <div class="vx-row no-gutter justify-center items-center p-8">
              <div class="vx-col w-full">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">
                    {{ $t('$Auth.ConfirmTermsConditionsTitle') }}
                  </h4>
                  <p>
                    {{ $t('$Auth.ConfirmTermsConditionsMsg') }}
                  </p>
                </div>

                <review-terms-and-conditions
                  :confirm-button="false"
                  @termsAndConditions="(val) => acceptTermsAndConditions = val"
                  @newsAndUpdates="(val) => acceptReceiveNewsAndUpdates = val">
                  <template v-slot:buttons-wrapper="{ termsAndConditionsValid }">
                    <div class="mt-base">
                      <vs-button
                        class="w-full"
                        @click.prevent="startWithUserAccount(termsAndConditionsValid)">
                        {{ $t('$Auth.StartWithMyAccount') }}
                      </vs-button>

                      <vs-button
                        type="border"
                        class="w-full mt-3"
                        @click="logout">
                        {{ $t('$Auth.BackToLogin') }}
                      </vs-button>
                    </div>
                  </template>
                </review-terms-and-conditions>
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
import ReviewTermsAndConditions from '@/views/pages/auth/components/ReviewTermsAndConditions.vue';


export default {
  name: 'TheAcceptTermsAndConditions',
  components: {
    AuthLogoBanner,
    ReviewTermsAndConditions,
  },
  data() {
    return {
      acceptTermsAndConditions: false,
      acceptReceiveNewsAndUpdates: false,
    };
  },
  created() {
    this.$vs.loading.close();
  },
  methods: {
    ...mapActions({
      actionLogout: 'auth/logout',
      acceptedTermsAndConditions: 'auth/acceptedTermsAndConditions',
    }),
    async startWithUserAccount(validateFormFunction) {
      const valid = await validateFormFunction();

      if (valid) {
        await this.acceptedTermsAndConditions({
          acceptTermsAndConditions: this.acceptTermsAndConditions,
          acceptReceiveNewsAndUpdates: this.acceptReceiveNewsAndUpdates,
        });
        this.$router.push({ name: 'home' }).catch(() => {});
      }
    },
    async logout() {
      await this.actionLogout();
      this.$router.push({ name: 'login' }).catch(() => {});
    },
  },
};
</script>
