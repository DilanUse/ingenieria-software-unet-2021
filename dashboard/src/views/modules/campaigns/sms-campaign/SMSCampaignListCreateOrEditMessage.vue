<template>
<div>
  <div class="vx-row mt-base">
    <div class="vx-col flex flex-wrap items-center w-full md:w-3/5">
      <div class="w-full">
        <slot name="before-msg"></slot>
      </div>

      <div class="w-full">
        <sms-text-box
          ref="smsTextBox"
          v-model="messageLocal"
          :placeholder="smsTextBoxPlaceholder"
          :attributes-from-contacts="attributesFromContactsLocal"
          :has-interpolations.sync="hasInterpolationsLocal"
          :interpolations.sync="interpolationsLocal"
          :message-length-offset="messageOffset"
          @add-template="showTemplates=true"
          @state-change="(val) => smsTextBoxIsValid=val">
        </sms-text-box>

        <shorter-url
          class="mt-5"
          @insert="insertShorterUrl"/>

        <insert-template
          class="mt-5"
          @insert="insertTemplate"/>

        <vs-alert
          color="warning"
          class="mt-base"
          :active="hasInterpolationsLocal">
          {{ $t('$TextCampaignsModules.TextMessageExceededLimitMsg' ) }}
        </vs-alert>
      </div>

      <div class="w-full">
        <slot name="after-msg"></slot>
      </div>
    </div>
    <div class="vx-col hidden md:block md:w-2/5">
      <message-preview
        ref="messagePreview"
        :message="messageLocal"
        :message-type="messageType"
        :interpolations="interpolationsLocal"
        :attributes-from-contacts="attributesFromContactsLocal"
        :sender-type="senderType"
        :sender-id="senderId"
        @test="(phoneNumber) => $emit('test', phoneNumber)"
        @opt-out-message-length="(length) => optOutMessageLength = length"/>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex';
import enums from '@/enums';

// Components
import SMSTextBox from '@/views/modules/components/SMSTextBox.vue';
import SMSCampaignListCreateOrEditMessagePreview
  from '@/views/modules/campaigns/sms-campaign/SMSCampaignListCreateOrEditMessagePreview.vue';
import SMSCampaignListCreateOrEditMessageShorterUrl
  from '@/views/modules/campaigns/sms-campaign/SMSCampaignListCreateOrEditMessageShorterUrl.vue';
import SMSCampaignListCreateOrEditMessageInsertTemplate
  from '@/views/modules/campaigns/sms-campaign/SMSCampaignListCreateOrEditMessageInsertTemplate.vue';


export default {
  name: 'SMSCampaignListCreateOrEditMessage',
  components: {
    SmsTextBox: SMSTextBox,
    messagePreview: SMSCampaignListCreateOrEditMessagePreview,
    shorterUrl: SMSCampaignListCreateOrEditMessageShorterUrl,
    insertTemplate: SMSCampaignListCreateOrEditMessageInsertTemplate,
  },
  props: {
    message: {
      type: String,
      required: true,
    },
    hasInterpolations: {
      type: Boolean,
      required: false,
      default: false,
    },
    interpolations: {
      type: Array,
      required: false,
      default() {
        return [];
      },
      validator(interpolations) {
        return interpolations.every((interpolation) => typeof interpolation === 'object'
          && interpolation !== null
          && 'shorthand' in interpolation
          && typeof interpolation.shorthand === 'string'
          && 'attribute' in interpolation
          && typeof interpolation.attribute === 'string');
      },
    },
    messageType: {
      type: String,
      required: true,
      validator(type) {
        return Object.values(enums.Campaign.MessageType).includes(type);
      },
    },
    senderType: {
      type: String,
      required: true,
      validator(type) {
        return Object.values(enums.Sender.Type).includes(type);
      },
    },
    senderId: {
      type: [Object, String],
      required: true,
    },
    attributesFromContacts: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      attributesFromContactsLocal: [],
      messageLocal: this.message,
      hasInterpolationsLocal: this.hasInterpolations,
      interpolationsLocal: this.interpolations,
      optOutMessageLength: 0,
      smsTextBoxIsValid: false,
    };
  },
  computed: {
    messageOffset() {
      return this.messageType === this.$enums.Campaign.MessageType.MARKETING
        ? this.optOutMessageLength
        : 0;
    },
    smsTextBoxPlaceholder() {
      switch (this.messageType) {
        case enums.Campaign.MessageType.REVIEW:
          return this.$t('$TextCampaignsModules.ReviewCampaignPlaceholder');

        case enums.Campaign.MessageType.MARKETING:
        case enums.Campaign.MessageType.TRANSACTIONAL:
          return '';

        default:
          return '';
      }
    },
  },
  watch: {
    attributesFromContacts() {
      this.attributesFromContactsLocal = this.attributesFromContacts;
    },
    messageLocal() {
      this.$emit('update:message', this.messageLocal);
    },
    hasInterpolationsLocal() {
      this.$emit('update:has-interpolations', this.hasInterpolationsLocal);
    },
    interpolationsLocal() {
      this.$emit('update:interpolations', this.interpolationsLocal);
    },
    smsTextBoxIsValid(val) {
      this.$emit('validate', val);
    },
  },
  created() {
    if (!this.attributesFromContacts) {
      this.fetchContactsAttributes();
    } else {
      this.attributesFromContactsLocal = this.attributesFromContacts;
    }
  },
  mounted() {
    this.optOutMessageLength = this.$refs.messagePreview.optOutMessage.length;
  },
  methods: {
    ...mapActions({
      fetchAllAttributes: 'attribute/fetchAllAttributes',
    }),
    async fetchContactsAttributes() {
      const resp = await this.fetchAllAttributes({});
      this.attributesFromContactsLocal = resp.data;
    },
    insertTemplate(template) {
      this.$refs.smsTextBox.insertText(template);
    },
    insertShorterUrl(url) {
      this.$refs.smsTextBox.insertText(url);
    },
    async validateMessage() {
      let valid = true;
      await this.$refs.smsTextBox.$validator.validateAll();
      valid = this.$refs.smsTextBox.isValid;

      if (this.messageType === this.$enums.Campaign.MessageType.REVIEW) {
        if (!this.hasInterpolationsLocal
          || !this.interpolationsLocal.some(
            (interpolation) => interpolation.type === 'special'
              && interpolation.attribute === this.$enums.Campaign.EspecialPlaceholders.REVIEW_LINK,
          )
        ) {
          valid = false;

          this.$vs.dialog({
            type: 'confirm',
            color: 'warning',
            title: this.$t('$SMSCampaignModule.ReviewLinkMissingNotifyTitle'),
            text: this.$t('$SMSCampaignModule.ReviewLinkMissingNotifyMsg'),
            acceptText: this.$t('$SMSCampaignModule.ReviewLinkMissingAcceptButtonText'),
            cancelText: this.$t('$SMSCampaignModule.ReviewLinkMissingCancelButtonText'),
            accept: () => this.$refs.smsTextBox.insertReviewLink(),
            cancel: () => this.$emit('back'),
          });
        }
      }

      return valid;
    },
  },
};
</script>
