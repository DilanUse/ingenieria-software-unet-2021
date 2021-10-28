<template>
  <div>
    <vs-alert
      color="success"
      :active="!invalidEnteredCode">
      <p>{{ $t('$Auth.$EmailAccountVerification.AlertMsg') }}
        <a
          href="#"
          @click.prevent="resendVerificationEmail()">
          {{ $t('$Auth.$EmailAccountVerification.ResendNewVerificationEmail') | lowercase }}
        </a>.
      </p>
    </vs-alert>
    <vs-alert
      color="warning"
      :active="invalidEnteredCode">
      <p>{{ $t('$Auth.$EmailAccountVerification.EnteredCodeInvalidAlertMsg') }}
        <a
          href="#"
          @click.prevent="resendVerificationEmail()">
          {{ $t('$Auth.$EmailAccountVerification.ResendNewVerificationEmail') | lowercase }}
        </a>.
      </p>
    </vs-alert>
    <form>
      <div class="vx-row mb-6 mt-6">
        <div class="vx-col w-full">
          <vs-input
            v-model="verificationCode"
            class="w-full required"
            :label="$t('$Auth.$EmailAccountVerification.VerificationCode')"
            :name="$t('$Auth.$EmailAccountVerification.VerificationCode')"
            v-validate="'required|digits:6'"
            data-vv-validate-on="blur|input"
            :danger="verifyCodeInputIsInvalid"
            :danger-text="invalidEnteredCodeErrorMsg"
            val-icon-danger="clear"
            @input="showInvalidEnteredCodeError = false"/>
        </div>
      </div>

      <base-form-footer-action-buttons
        @save="checkEnteredCode"
        @cancel="$emit('close')">
        <template v-slot:save>
          {{ $t('$General.Verify')}}
        </template>
      </base-form-footer-action-buttons>
    </form>
  </div>
</template>

<script>
// Components
import BaseFormFooterActionButtons from '@/views/modules/components/BaseFormFooterActionButtons.vue';

// Services
import authService from '@/api/modules/auth.service';

export default {
  name: 'SenderIdVerification',
  components: {
    BaseFormFooterActionButtons,
  },
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      verificationCode: '',
      invalidEnteredCode: false,
      showInvalidEnteredCodeError: false,
    };
  },
  computed: {
    verifyCodeInputIsInvalid() {
      return this.errors.has(this.$t('$Auth.$EmailAccountVerification.VerificationCode'))
        || this.showInvalidEnteredCodeError;
    },
    invalidEnteredCodeErrorMsg() {
      if (this.errors.has(this.$t('$Auth.$EmailAccountVerification.VerificationCode'))) {
        return this.errors.first(this.$t('$Auth.$EmailAccountVerification.VerificationCode'));
      }

      if (this.showInvalidEnteredCodeError) {
        return this.$t('$Auth.$EmailAccountVerification.InvalidEnteredCodeErrorMsg');
      }

      return '';
    },
  },
  watch: {
    invalidEnteredCode(val) {
      if (val) {
        this.showInvalidEnteredCodeError = true;
      }
    },
  },
  methods: {
    async resendVerificationEmail() {
      this.$vs.loading({ type: 'radius' });
      await authService.resendEmailValidateAccount(this.email);
      this.$vs.loading.close();

      this.verificationCode = '';
      this.invalidEnteredCode = false;
      this.showInvalidEnteredCodeError = false;

      this.$vs.notify({
        title: this.$t('$Auth.$EmailAccountVerification.ResendVerificationEmailNotifyTitle'),
        text: this.$t('$Auth.$EmailAccountVerification.ResendVerificationEmailNotifyMsg'),
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'success',
      });

      await this.$validator.reset();
    },
    async checkEnteredCode() {
      const formIsValid = await this.$validator.validate();

      if (!formIsValid) {
        document.getElementsByName([this.$validator.errors.items[0].field])[0].focus();
        return;
      }

      this.$vs.loading({ type: 'radius' });
      const resp = await authService.validateEmailAccountByCode({
        email: this.email,
        securityCode: this.verificationCode,
      });
      this.$vs.loading.close();
      const validationSuccess = resp.data;

      if (validationSuccess) {
        this.$vs.notify({
          title: this.$t('$Auth.$EmailAccountVerification.VerificationNotificationTitle'),
          text: this.$t('$Auth.$EmailAccountVerification.VerificationNotificationOkMsg'),
          iconPack: 'feather',
          icon: 'icon-check',
          color: 'success',
        });

        this.verificationCode = '';
        this.$emit('verified');
      } else {
        this.invalidEnteredCode = true;
      }
    },
  },
};
</script>
