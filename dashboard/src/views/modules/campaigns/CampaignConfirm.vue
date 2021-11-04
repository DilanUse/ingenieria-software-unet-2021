<template>
  <div>
    <div class="mb-base">
      <h2
        class="text-center mb-3"
        v-html="$t(`$CampaignsModules.$CampaignConfirm.CampaignReadyTo${deliveryTypeText}Title`, {
          cost: this.$options.filters.dollar(costInfo.campaignTotalPrice),
        })">
      </h2>
      <h5 class="text-center">
        {{ $t(`$CampaignsModules.$CampaignConfirm.CampaignReadyTo${deliveryTypeText}Subtitle`) }}
      </h5>
    </div>

    <div class="confirm-wrapper">
      <campaign-confirm-item
        :title="$t('$CampaignsModules.CampaignInfo')"
        first
        @return="$emit('return', 0)">
        <p>
          <span class="font-bold">{{ $t('$General.Name') }}:</span>
          <span class="pl-2">{{ model.name }}</span>
        </p>

        <p class="mt-3">
          <span class="font-bold">{{ senderIdTitle }}:</span>
          <span class="pl-2">{{ senderIdText }}</span>
        </p>

        <p class="mt-3">
          <span class="font-bold">{{ $tc('$General.Type') }}:</span>
          <span class="pl-2">{{ $t(`$CampaignsModules.$CampaignType.${model.messageType}`) }}</span>
        </p>
        <slot name="info"></slot>
      </campaign-confirm-item>

      <campaign-confirm-item
        :title="messageTitle"
        @return="$emit('return', 1)">
        <template
          v-slot:subtitle
          v-if="messagePreviewLink">
          <a
            href="#"
            @click.prevent="$emit('message-preview')">
            {{ $t('$General.Preview') }}
          </a>
        </template>
        <slot name="message"></slot>
      </campaign-confirm-item>

      <campaign-confirm-item
        :title="$tc('$Entities.Contact', 2)"
        :subtitle="$t('$CampaignsModules.$CampaignConfirm.ContactsStepSubtitle', {
          count: costInfo.totalContactsToSend,
        })"
        @return="$emit('return', 2)">
        <vs-alert
          active="true"
          :color="contactsAlertColor"
          icon-pack="feather"
          :icon="contactsAlertIcon"
          style="height: auto">
          <strong>
            {{ $t('$CampaignsModules.$CampaignConfirm.ContactsYouCanSend', {
              count: this.costInfo.contactsCanSend,
              total: this.costInfo.totalContactsToSend,
            }) }}
          </strong>
          <vs-progress
            :height="8"
            :percent="contactsAlertPercent"
            :color="contactsAlertColor"></vs-progress>

          <div v-if="!costInfo.userHasSufficientBalance">
            {{ $t('$CampaignsModules.$CampaignConfirm.InsufficientBalanceMsg1') }}
            <a
              href="#"
              @click.prevent="showCheckout=true">
              {{ $t('$General.Here') | lowercase }}
            </a>
            {{ $t('$CampaignsModules.$CampaignConfirm.InsufficientBalanceMsg2') }}
          </div>
        </vs-alert>

        <slot
          name="contacts"
          v-bind:costInfo="costInfo">
        </slot>
      </campaign-confirm-item>

      <campaign-confirm-item
        :title="$t('$CampaignsModules.CampaignDeliveryType')"
        @return="$emit('return', 3)">

        <p>
          <span class="font-bold">{{ $t('$General.DeliveryTime') }}:</span>
          <span class="pl-2">{{ deliveryTypeValue }}</span>
        </p>

        <div v-if="this.model.deliveryType === this.$enums.Campaign.DeliveryType.LATER">
          <p class="mt-3">
            <span class="font-bold">{{ $tc('$General.TimeZone') }}:</span>
            <span class="pl-2">{{ model.timeZone }}</span>
          </p>

          <p class="mt-3">
            <span class="font-bold">{{ $t('$CampaignsModules.LocalStartTime') }}:</span>
            <span class="pl-2">{{ model.localStartDate | date }}</span>
          </p>
        </div>
      </campaign-confirm-item>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

// Components
import CampaignConfirmItem from '@/views/modules/campaigns/CampaignConfirmItem.vue';

// Mixins
import campaignStep from '@/views/modules/mixins/campaigns/campaignStep';

export default {
  name: 'CampaignConfirm',
  components: {
    CampaignConfirmItem,
  },
  mixins: [campaignStep],
  props: {
    model: {
      type: Object,
      required: true,
    },
    messageTitle: {
      type: String,
      required: true,
    },
    fetchCampaignCostInfo: {
      type: Function,
      required: true,
    },
    messagePreviewLink: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      costInfo: {
        amountUserCanPay: 0,
        userHasSufficientBalance: true,
        numberOfMessagesCanPaid: 0,
        campaignTotalPrice: 0,
        totalContactsToSend: 0,
        contactsCanSend: 0,
      },
      showCheckout: false,
    };
  },
  computed: {
    ...mapGetters({
      authUserBalance: 'auth/balance',
    }),
    deliveryTypeText() {
      return this.model.deliveryType === this.$enums.Campaign.DeliveryType.LATER
        ? 'Schedule' : 'Send';
    },
    senderIdTitle() {
      return this.campaignType === this.$enums.Campaign.Type.EMAIL
        ? this.$tc(`$Entities.${this.$enums.Entity.MAILER_ID}`)
        : this.$tc(`$Entities.${this.$enums.Entity.CALLER_ID}`);
    },
    senderIdText() {
      switch (this.campaignType) {
        case this.$enums.Campaign.Type.EMAIL:
          return `${this.model.senderId.name}(${this.model.senderId.email})`;
        case this.$enums.Campaign.Type.SMS:
        case this.$enums.Campaign.Type.VOICEMAIL:
          switch (this.model.senderType) {
            case this.$enums.Sender.Type.SHARED:
              return this.$options.filters.uppercaseDash(this.$t('$General.SharedNumber'));
            case this.$enums.Sender.Type.PRIVATE:
            case this.$enums.Sender.Type.VIRTUAL:
              return `${this.model.senderId.name}(${this.model.senderId.phoneInternational})`;

            default:
              return this.$options.filters.uppercaseDash(this.$t('$General.ReplyNumber'));
          }

        default:
          return this.$options.filters.uppercaseDash(this.$t('$General.ReplyNumber'));
      }
    },
    deliveryTypeValue() {
      return this.$t(`$CampaignsModules.${
        this.model.deliveryType === this.$enums.Campaign.DeliveryType.IMMEDIATELY
          ? 'CampaignStartImmediately'
          : 'CampaignScheduleLater'}`);
    },
    contactsAlertColor() {
      return this.costInfo.userHasSufficientBalance ? 'success' : 'warning';
    },
    contactsAlertIcon() {
      return this.costInfo.userHasSufficientBalance ? 'icon-check' : 'icon-alert-circle';
    },
    contactsAlertPercent() {
      return this.costInfo
        ? (this.costInfo.contactsCanSend * 100) / this.costInfo.totalContactsToSend
        : 0;
    },
  },
  watch: {
    authUserBalance() {
      this.getCampaignCostInfo();
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      await this.getCampaignCostInfo();
    },
    async getCampaignCostInfo() {
      this.costInfo = await this.fetchCampaignCostInfo(this.model.toGetCostPayload());
      this.$emit('const-info', this.costInfo);
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-wrapper {
  border: 1px solid rgba(var(--vs-grey),1);
  border-radius: 3px;
}
</style>
