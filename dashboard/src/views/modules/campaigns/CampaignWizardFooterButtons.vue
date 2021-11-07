<template>
  <div class="vx-row flex flex-wrap-reverse mx-0 w-full">
    <div class="vx-col w-full md:w-1/2 flex flex-wrap justify-between md:justify-start">
      <wizard-button
        v-if="wizardProps.activeTabIndex > 0"
        :style="wizardProps.fillButtonStyle"
        class="w-full md:w-auto mr-0 md:mr-3 mb-3 md:mb-0 nav-prev"
        @click.native="wizardProps.prevTab()">
        <i class="nav-icon feather icon-arrow-left"></i>
        <div class="nav-text">
        {{ $t('$General.Back') }}
        </div>
      </wizard-button>

      <wizard-button
        :style="wizardProps.fillButtonStyle"
        class="w-full md:w-auto nav-reset"
        @click.native="$emit('reset')">
        <i
          class="nav-icon feather"
          :class="resetButtonIcon"/>
        <div class="nav-text">
        {{ resetButtonText  }}
        </div>
      </wizard-button>

      <wizard-button
        v-if="showSaveAndQuitButton"
        :style="wizardProps.fillButtonStyle"
        class="w-full md:w-auto mr-0 md:mr-3 mt-3 md:mt-0 nav-save-continue"
        @click.native="onSaveAndQuit">
        <i class="nav-icon feather icon-save"></i>
        <div class="nav-text">
          {{ $t('$General.SaveAndQuit') }}
        </div>
      </wizard-button>

      <wizard-button
        v-if="!wizardProps.isLastStep"
        :style="wizardProps.fillButtonStyle"
        class="w-full md:w-auto nav-next"
        @click.native="wizardProps.nextTab()">
        <i class="nav-icon feather icon-arrow-right"></i>
        <div class="nav-text">
          {{ $t('$General.Continue') }}
        </div>
      </wizard-button>

      <template
        v-if="wizardProps.isLastStep">
        <wizard-button
          :style="wizardProps.fillButtonStyle"
          class="w-full md:w-auto mr-0 md:mr-3 mt-3 md:mt-0 nav-test"
          @click.native="$emit('test')">
          <i class="nav-icon feather icon-tablet"></i>
          <div class="nav-text">
          {{ $t('$General.Test') }}
          </div>
        </wizard-button>

        <wizard-button
          :disabled="!validSend"
          :style="wizardProps.fillButtonStyle"
          class="w-full md:w-auto nav-send"
          @click.native="wizardProps.nextTab()">
          <i
            class="nav-icon feather"
            :class="sendButtonIcon"/>
          <div class="nav-text">
          {{ sendButtonText }}
          </div>
        </wizard-button>
      </template>
    </div>
  </div>
</template>

<script>
import { WizardButton } from 'vue-form-wizard';
import enums from '@/enums';

export default {
  name: 'CampaignWizardFooterButtons',
  components: {
    WizardButton,
  },
  props: {
    wizardProps: {
      type: Object,
      required: true,
    },
    validSend: {
      type: Boolean,
      required: true,
    },
    isDraft: {
      type: Boolean,
      required: false,
      default: false,
    },
    deliveryType: {
      type: String,
      required: true,
      validator(value) {
        return Object.values(enums.Campaign.DeliveryType).includes(value);
      },
    },
    operation: {
      type: String,
      required: true,
      validator(value) {
        return [
          enums.Operation.CREATE,
          enums.Operation.EDIT].indexOf(value) !== -1;
      },
    },
  },
  computed: {
    sendButtonText() {
      if (this.deliveryType === enums.Campaign.DeliveryType.LATER) {
        return this.operation === this.$enums.Operation.EDIT
          ? this.$t('$General.Update')
          : this.$t('$General.Schedule');
      }

      return this.$t('$General.Send');
    },
    sendButtonIcon() {
      if (this.deliveryType === enums.Campaign.DeliveryType.LATER) {
        return this.operation === this.$enums.Operation.EDIT
          ? 'icon-save'
          : 'icon-clock';
      }

      return 'icon-send';
    },
    resetButtonText() {
      if (this.isDraft) {
        return this.$t('$CampaignsModules.DiscardDraft');
      }

      if (this.operation === this.$enums.Operation.EDIT
        && this.deliveryType === this.$enums.Campaign.DeliveryType.LATER) {
        return this.$t('$General.Cancel');
      }

      return this.$t('$General.StartOver');
    },
    resetButtonIcon() {
      if (this.isDraft) {
        return 'icon-trash-2';
      }

      if (this.operation === this.$enums.Operation.EDIT
        && this.deliveryType === this.$enums.Campaign.DeliveryType.LATER) {
        return 'icon-x';
      }

      return 'icon-rotate-ccw';
    },
    showSaveAndQuitButton() {
      return this.operation === this.$enums.Operation.CREATE
        || this.isDraft;
    },
  },
  methods: {
    onSaveAndQuit() {
      this.$emit('save-and-quit');
    },
  },
};
</script>
