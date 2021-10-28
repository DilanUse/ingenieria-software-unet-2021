<template>
  <div class="w-full">
    <div class="w-full">
      <div class="w-full flex items-center">
        <vs-checkbox
          v-model="acceptTermsAndConditions"
          style="margin-top: 0 !important"
          class="mt-6 inline-flex mt-0"
          @change="$validator.validate($t('$General.TermsAndConditions'))">
        </vs-checkbox>
        <span v-html="$t('$Auth.IAgreeWithTermsAndConditions')"/>
      </div>
      <div class="w-full">
        <vs-input
          :value="acceptTermsAndConditions ? 'ok' : ''"
          type="hidden"
          :name="$t('$General.TermsAndConditions')"
          v-validate="'required'"
          :danger="errors.has($t('$General.TermsAndConditions'))"
          :danger-text="errors.first($t('$General.TermsAndConditions'))"/>
      </div>
    </div>

    <div class="w-full mt-5">
      <div class="w-full flex items-center">
        <vs-checkbox
          v-model="acceptReceiveNewsAndUpdates"
          style="margin-top: 0 !important"
          class="mt-6 inline-flex mt-0">
        </vs-checkbox>
        <span>
          {{ $t('$Auth.IAgreeWithReceiveNewsAndUpdates') }}
        </span>
      </div>
    </div>

    <slot
      name="buttons-wrapper"
      v-bind:termsAndConditionsValid="formIsValid">
      <vs-button
        v-if="confirmButton"
        class="mt-base"
        @click="redirectSignUpGoogle()">
        <slot>
          {{ $t('$Auth.SignUp') }}
        </slot>
      </vs-button>
    </slot>
  </div>
</template>

<script>
import configApi from '@/api/config';

export default {
  name: 'ReviewTermsAndConditions',
  props: {
    confirmButton: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      acceptTermsAndConditions: false,
      acceptReceiveNewsAndUpdates: false,
    };
  },
  watch: {
    acceptTermsAndConditions() {
      this.$emit('termsAndConditions', this.acceptTermsAndConditions);
    },
    acceptReceiveNewsAndUpdates() {
      this.$emit('newsAndUpdates', this.acceptReceiveNewsAndUpdates);
    },
  },
  methods: {
    async formIsValid() {
      const formIsValid = await this.$validator.validate();

      if (!formIsValid) {
        document.getElementsByName([this.$validator.errors.items[0].field])[0].focus();
      }

      return formIsValid;
    },
    async redirectSignUpGoogle() {
      const valid = await this.formIsValid();

      if (valid) {
        window.location.href = `${configApi.url}/auth/google/${this.acceptTermsAndConditions}/${this.acceptReceiveNewsAndUpdates}`;
      }
    },
  },
};
</script>
