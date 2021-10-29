<template>
  <form>
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-input
          v-model="model.name"
          class="w-full"
          :class="{required: !isView}"
          :disabled="isView"
          :label="$t('$General.Name')"
          :name="$t('$General.Name')"
          v-validate="'required|max:100'"
          data-vv-validate-on="input|blur"
          :danger="errors.has($t('$General.Name'))"
          :danger-text="errors.first($t('$General.Name'))"
          val-icon-danger="clear"/>
      </div>
    </div>

    <div class="vx-row mt-6">
      <div class="vx-col w-full">
        <sms-text-box
          ref="smsTexBox"
          v-model="model.message"
          :has-interpolations.sync="model.hasInterpolations"
          :interpolations.sync="model.interpolations"
          :disabled="isView"
          @state-change="(state) => this.smsTextBoxIsValid = state"
          @form-was-changed="(val) => this.smsTexBoxWasChanged = val">
        </sms-text-box>
      </div>
    </div>

    <base-form-footer-action-buttons
      :hide-save="isView"
      :actions="mappedActions"
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
import SmsTemplateConstructor from '@/views/modules/templates/sms-template/sms-template.constructor';

// Custom components
import SmsTextBox from '@/views/modules/components/SMSTextBox.vue';
import BaseFormFooterActionButtons from '@/views/modules/components/BaseFormFooterActionButtons.vue';

// mixins
import singleCreateOrEdit from '@/views/modules/mixins/singleCreateOrEdit';


export default {
  name: 'SMSTemplateListCreateOrEdit',
  components: {
    BaseFormFooterActionButtons,
    SmsTextBox,
  },
  mixins: [singleCreateOrEdit],
  data() {
    return {
      model: new SmsTemplateConstructor(this.operation, this.modelPayload),
      smsTextBoxIsValid: false,
      smsTexBoxWasChanged: false,
      addItemFunction: this.addSMSTemplate,
      editItemFunction: this.editSMSTemplate,
    };
  },
  computed: {
    verifyProperties() {
      return this.model.name !== '' && this.model.message !== '' && this.smsTextBoxIsValid;
    },
    additionalModelWasChanged() {
      return this.smsTexBoxWasChanged;
    },
  },
  methods: {
    ...mapActions({
      addSMSTemplate: 'smsTemplate/addSMSTemplate',
      editSMSTemplate: 'smsTemplate/editSMSTemplate',
    }),
    async additionalValidateFormToSave() {
      return this.$refs.smsTexBox.$validator.validate();
    },
  },
};
</script>
