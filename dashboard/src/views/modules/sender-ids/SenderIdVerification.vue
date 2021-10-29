<template>
  <div>
    <vs-alert
      color="success"
      active="true">
      <p>{{ message }} {{ $t('$General.Or') | lowercase }}
        <a
          href="#"
          @click.prevent="requestVerifySender()">
          {{ $t('$SenderIdsModules.GenerateANewCode') | lowercase }}
        </a>.
      </p>
    </vs-alert>
    <form>
      <div class="vx-row mb-6 mt-6">
        <div class="vx-col w-full">
          <vs-input
            v-model="localCode"
            class="w-full required"
            :label="$t('$SenderIdsModules.VerifyCodeLabel')"
            :name="$t('$General.Code')"
            v-validate="'required|digits:4'"
            data-vv-validate-on="blur|input"
            :danger="errors.has($t('$General.Code'))"
            :danger-text="errors.first($t('$General.Code'))"
            val-icon-danger="clear"/>
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
import { mapActions } from 'vuex';
import { deepCopy } from '@/util';
import enums from '@/enums';
import BaseFormFooterActionButtons from '@/views/modules/components/BaseFormFooterActionButtons.vue';


export default {
  name: 'SenderIdVerification',
  components: {
    BaseFormFooterActionButtons,
  },
  props: {
    modelPayload: {
      type: Object,
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      required: true,
      validator(entity) {
        return [enums.Entity.CALLER_ID, enums.Entity.MAILER_ID].indexOf(entity) !== -1;
      },
    },
    code: {
      type: String,
      required: false,
      default: '',
    },
    sendCode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      model: deepCopy(this.modelPayload),
      localCode: this.code,
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.localCode !== '';
    },
  },
  created() {
    if (this.code) {
      this.checkEnteredCode();
    } else if (this.sendCode) {
      this.requestVerifySender();
    }
  },
  methods: {
    ...mapActions({
      initVerifyPhone: 'callerId/initVerifyPhone',
      checkVerifyPhoneCode: 'callerId/checkVerifyPhoneCode',
      initVerifyEmail: 'mailerId/initVerifyEmail',
      checkVerifyEmailCode: 'mailerId/checkVerifyEmailCode',
    }),
    async requestVerifySender() {
      this.$vs.loading({ type: 'radius' });

      const resp = this.entity === this.$enums.Entity.CALLER_ID
        ? await this.initVerifyPhone({
          callerId: this.model.id,
        })
        : await this.initVerifyEmail({
          mailerId: this.model.id,
        });

      this.$vs.notify({
        title: this.$t('$SenderIdsModules.VerificationNotificationTitle', {
          entity: this.$tc(`$Entities.${this.entity}`),
        }),
        text: this.$t(`$SenderIdsModules.VerificationNotification${resp ? 'Ok' : 'Error'}Msg`),
        iconPack: 'feather',
        icon: resp ? 'icon-check' : 'icon-alert-circle',
        color: resp ? 'success' : 'danger',
      });

      if (!resp) {
        this.$emit('close');
      }

      this.$vs.loading.close();
    },
    async checkEnteredCode() {
      const formIsValid = await this.$validator.validate();

      if (!formIsValid) {
        this.$el.querySelector(`[name='${this.$validator.errors.items[0].field}']`).focus();
        return;
      }

      this.$vs.loading({ type: 'radius' });

      const resp = this.entity === this.$enums.Entity.CALLER_ID
        ? await this.checkVerifyPhoneCode({
          callerId: this.model.id,
          code: this.localCode,
        })
        : await this.checkVerifyEmailCode({
          mailerId: this.model.id,
          code: this.localCode,
        });

      this.$vs.notify({
        title: this.$t('$SenderIdsModules.VerificationNotificationTitle', {
          entity: this.$tc(`$Entities.${this.entity}`),
        }),
        text: this.$t(`$SenderIdsModules.VerificationCompleteNotification${
          resp.statusCode === 200 && !resp.error ? 'Ok' : 'Error'
        }Msg`, {
          entity: this.$tc(`$Entities.${this.entity}`),
        }),
        iconPack: 'feather',
        icon: resp.statusCode === 200 && !resp.error ? 'icon-check' : 'icon-alert-circle',
        color: resp.statusCode === 200 && !resp.error ? 'success' : 'danger',
      });

      this.localCode = '';
      this.$vs.loading.close();
      this.$emit('verified');
    },
  },
};
</script>
