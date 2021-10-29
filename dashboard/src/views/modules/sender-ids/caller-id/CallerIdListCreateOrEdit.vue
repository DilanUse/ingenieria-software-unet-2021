<template>
  <form>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="model.name"
          class="w-full"
          :class="{required: !isView}"
          :disabled="isView"
          :name="$t('$General.Name')"
          :label="$t('$General.Name')"
          v-validate="'required|max:100'"
          data-vv-validate-on="blur|input"
          :danger="errors.has($t('$General.Name'))"
          :danger-text="errors.first($t('$General.Name'))"
          val-icon-danger="clear"/>
      </div>
    </div>

    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label
          class="vs-input--label"
          :class="{ required: !isView && model.status !== $enums.Sender.Status.VERIFIED }">
          {{ $tc('$General.Phone') }}
        </label>
        <vue-tel-input
          v-model="model.phoneNational"
          :class="{ 'border-danger': invalidPhoneNumber || requiredPhoneNumber }"
          :disabled="isView || model.status === $enums.Sender.Status.VERIFIED"
          :disabledFetchingCountry="true"
          :dynamicPlaceholder="false"
          :enabledCountryCode="true"
          :validCharactersOnly="true"
          :preferredCountries="['AU', 'CO']"
          :defaultCountry="model.codeCountry || 'AU'"
          @validate="(payload) => (this.model.phoneValidate = payload)"
          @input="onPhoneInput()">
        </vue-tel-input>
        <div
          v-show="invalidPhoneNumber"
          class="con-text-validation span-text-validation-danger vs-input--text-validation-span"
          style="height: 19px;">
          <span class="span-text-validation">
          {{ $t('$CallerIdModule.InvalidPhoneNumberMsg') }}
          </span>
        </div>
        <div
          v-show="requiredPhoneNumber"
          class="con-text-validation span-text-validation-danger vs-input--text-validation-span"
          style="height: 19px;">
          <span class="span-text-validation">
          {{ $t('$CallerIdModule.PhoneNumberRequiredMsg') }}
          </span>
        </div>
      </div>
    </div>

    <base-form-footer-action-buttons
      :hide-save="isView"
      :actions="filteredActionsByStatus"
      @action="onAction"
      @save="save(model.toSavePayload())"
      @cancel="$emit('close')">
      <template
        v-if="isView"
        v-slot:cancel>
        {{ $t("$General.Close") }}
      </template>
    </base-form-footer-action-buttons>
  </form>
</template>

<script>
import { mapActions } from 'vuex';
import { VueTelInput } from 'vue-tel-input';
import CallerIdConstructor from '@/views/modules/sender-ids/caller-id/caller-id.constructor';
import commonCreateOrEditSenderId from '@/views/modules/sender-ids/mixins/commonCreateOrEditSenderId';
import BaseFormFooterActionButtons from '@/views/modules/components/BaseFormFooterActionButtons.vue';


export default {
  name: 'CallerIdListCreateOrEdit',
  mixins: [commonCreateOrEditSenderId],
  components: {
    VueTelInput,
    BaseFormFooterActionButtons,
  },
  data() {
    return {
      model: new CallerIdConstructor(this.operation, this.modelPayload, this.nameToCreate),
      phoneInput: false,
      validateOnSave: false,
      addItemFunction: this.addCallerId,
      editItemFunction: this.editCallerId,
    };
  },
  computed: {
    verifyProperties() {
      return this.model.name !== '' && this.model.phoneValidate.isValid;
    },
    invalidPhoneNumber() {
      return this.phoneInput && !this.model.phoneValidate.isValid && this.model.phoneNational !== '';
    },
    requiredPhoneNumber() {
      return ((this.phoneInput && !this.model.phoneValidate.isValid) || this.validateOnSave)
        && this.model.phoneNational === '';
    },
  },
  methods: {
    ...mapActions({
      addCallerId: 'callerId/addCallerId',
      editCallerId: 'callerId/editCallerId',
    }),
    onPhoneInput() {
      this.phoneInput = true;
      this.validateOnSave = false;
    },
    async additionalValidateFormToSave() {
      this.validateOnSave = true;
      return !this.requiredPhoneNumber && !this.invalidPhoneNumber;
    },
  },
};

</script>
