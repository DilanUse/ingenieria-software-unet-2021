<template>
  <vx-card class="mb-base">
    <form-wizard
      ref="wizard"
      class="wizard-no-title"
      color="rgba(var(--vs-primary), 1)"
      errorColor="rgba(var(--vs-danger), 1)"
      :title="null"
      :subtitle="null"
      :start-index="startIndex"
      @on-complete="confirmSendCampaign(costInfo.totalContactsToSend, costInfo.campaignTotalPrice)"
      @on-change="onChangeTab">

      <!-- Campaign info -->
      <tab-content
        :title="$t('$CampaignsModules.CampaignInfo')"
        class="mb-5 pt-4"
        icon="feather icon-info"
        :before-change="validateCampaignInfo">
        <div class="lg:px-32">
          <campaign-information
            v-if="model.step === 0"
            ref="campaignInfo"
            :key="campaignInfoKey"
            :campaign-type="$enums.Campaign.Type.SMS"
            :operation="operation"
            :name.sync="model.name"
            :message-type.sync="model.messageType"
            :sender-id.sync="model.senderId"
            :sender-type.sync="model.senderType"/>
        </div>
      </tab-content>

      <!-- Message -->
      <tab-content
        :title="$tc('$General.Message')"
        class="mb-5"
        icon="feather icon-message-square"
        :before-change="validateCampaignMessage">
        <campaign-message
          v-if="loadMessage  && model.step === 1"
          ref="campaignMessage"
          :message.sync="model.message"
          :has-interpolations.sync="model.hasInterpolations"
          :interpolations.sync="model.interpolations"
          :message-type="model.messageType"
          :sender-type="model.senderType"
          :sender-id="model.senderId"
          :attributes-from-contacts="[]"
          @test="onTest"
          @back="$refs.wizard.prevTab()"/>
      </tab-content>

      <!-- Contacts-->
      <tab-content
        :title="$tc('$Entities.Contact', 2)"
        class="mb-5 px-0"
        icon="feather icon-users"
        :before-change="validateSelectedContacts">
        <contact-list
          v-if="loadContacts && model.step === 2"
          selected-from-campaign
          :initial-filters.sync="model.filters"
          :marketing-status-filter-options="marketingStatusFilterOptions"
        />
      </tab-content>

      <!-- Delivery type -->
      <tab-content
        :title="$t('$CampaignsModules.CampaignDeliveryType')"
        class="mb-5 md:px-16 lg:px-32 xl:px-32"
        icon="feather icon-settings"
        :before-change="validateCampaignSettings">
        <campaign-settings
          ref="campaignSettings"
          v-if="loadSettings && loadedCampaign  && model.step === 3"
          :campaign-type="$enums.Campaign.Type.SMS"
          :operation="operation"
          :delivery-type.sync="model.deliveryType"
          :local-start-date.sync="model.localStartDate"
          :time-zone.sync="model.timeZone">
        </campaign-settings>
      </tab-content>

      <!-- Confirm -->
      <tab-content
        :title="$t('$CampaignsModules.ConfirmCampaign')"
        class="mb-5 md:px-16 lg:px-32 xl:px-32 py-6"
        icon="feather icon-file-text">
        <campaign-confirm
          v-if="loadConfirm && loadedCampaign && model.step === 4"
          :model="model"
          :campaignType="$enums.Campaign.Type.SMS"
          :fetch-campaign-cost-info="fetchCostSMSCampaign"
          :operation="operation"
          :message-title="$tc('$General.Message')"
          preview-link
          @return="returnToStep"
          @const-info="(info) => costInfo=info"
          @message-preview="showPreview=true">
          <template v-slot:message>
            {{ model.message }}
          </template>

          <template v-slot:contacts>
            <vs-alert
              v-if="costInfo.contactsWithCutMessage"
              active="true"
              color="warning"
              icon-pack="feather"
              icon="icon-alert-circle"
              class="h-auto mt-5">
              <div class="flex justify-between items-center">
                <strong>
                  {{ $t('$CampaignsModules.$CampaignConfirm.ContactsWithCutMessages', {
                  count: costInfo.contactsWithCutMessage,
                }) }}
                </strong>

                <a
                  href="#"
                  @click.prevent="returnToStep(1)">
                  Return to message
                </a>
              </div>

              <p>
                {{ $t('$CampaignsModules.$CampaignConfirm.ContactsWithCutMessagesMsg') }}
              </p>
            </vs-alert>
          </template>
        </campaign-confirm>
      </tab-content>

      <template
        slot="footer"
        slot-scope="props">
        <campaign-wizard-footer-buttons
          class="mt-base"
          :valid-send="!!costInfo"
          :wizard-props="props"
          :operation="operation"
          :is-draft="model.isDraft"
          :delivery-type="model.deliveryType"
          @save-and-quit="confirmSaveAndQuitCampaign()"
          @reset="confirmRestartCampaign()"
          @test="showPreview=true">
        </campaign-wizard-footer-buttons>
      </template>
    </form-wizard>

    <vs-popup
      title="SMS Preview"
      :active.sync="showPreview">
      <message-preview
        v-if="showPreview"
        :message="model.message"
        :message-type="model.messageType"
        :interpolations="model.interpolations"
        :sender-type="model.senderType"
        :sender-id="model.senderId"
        :attributes-from-contacts="[]"
        @test="onTest"/>
    </vs-popup>
  </vx-card>
</template>

<script>
import {
  mapActions, mapState, mapMutations,
} from 'vuex';
import store from '@/store/store';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import enums from '@/enums';

// Constructor
import SmsCampaignConstructor from '@/views/modules/campaigns/sms-campaign/sms-campaign.constructor';

// components
import SMSCampaignListCreateOrEditMessage from '@/views/modules/campaigns/sms-campaign/SMSCampaignListCreateOrEditMessage.vue';
import SMSCampaignListCreateOrEditMessagePreview from '@/views/modules/campaigns/sms-campaign/SMSCampaignListCreateOrEditMessagePreview.vue';

// Mixins
import commonCampaigns from '@/views/modules/mixins/campaigns/commonCampaigns';


export default {
  name: 'SMSCampaignListCreateOrEdit',
  components: {
    campaignMessage: SMSCampaignListCreateOrEditMessage,
    messagePreview: SMSCampaignListCreateOrEditMessagePreview,
  },
  mixins: [commonCampaigns],
  props: {
    modelPayload: {
      type: Object,
      required: false,
      default() {
        return store.state.smsCampaign.payload
          ? store.state.smsCampaign.payload
          : null;
      },
    },
  },
  data() {
    return {
      showPreview: false,
      campaignBaseRoute: '/sms-campaigns',
      campaignType: this.$enums.Campaign.Type.SMS,
      addItemFunction: this.addSMSCampaign,
      editItemFunction: this.editSMSCampaign,
      initCampaignModelFunction: this.initCampaignModel,
      setCampaignPayloadFunction: this.setSMSCampaignPayload,
    };
  },
  computed: {
    ...mapState({
      fromSMSTemplate: (state) => state.smsCampaign.fromSMSTemplate,
    }),
  },
  methods: {
    ...mapActions({
      fetchItem: 'smsCampaign/fetchSMSCampaign',
      addSMSCampaign: 'smsCampaign/addSMSCampaign',
      editSMSCampaign: 'smsCampaign/editSMSCampaign',
      removeItem: 'smsCampaign/removeSMSCampaign',
      getTestCostSMSCampaign: 'smsCampaign/fetchTestCostSMSCampaign',
      testCampaign: 'smsCampaign/testSMSCampaign',
      fetchCostSMSCampaign: 'smsCampaign/fetchCostSMSCampaign',
    }),
    ...mapMutations({
      setTemplateToCampaign: 'smsCampaign/SET_FROM_SMS_TEMPLATE',
      setSMSCampaignPayload: 'smsCampaign/SET_SMS_CAMPAIGN_PAYLOAD',
    }),
    initCampaignModel({ isDraft, payload }) {
      const messageType = this.$route.query.messageType || null;

      this.model = new SmsCampaignConstructor(
        this.operation,
        payload,
        isDraft,
        false,
        messageType,
      );

      if (this.fromSMSTemplate && this.operation === this.$enums.Operation.CREATE) {
        this.model.message += this.fromSMSTemplate.message;
        this.model.hasInterpolations = this.fromSMSTemplate.hasInterpolations;
        this.model.interpolations = this.fromSMSTemplate.interpolations;
        this.setTemplateToCampaign(null);
      }
    },
    async validateCampaignMessage() {
      const isValid = await this.$refs.campaignMessage.validateMessage();

      if (isValid) {
        // await this.continueCampaignStep();
        this.campaignMessageIsValid();
        return true;
      }

      return false;
    },
    async onTest(phoneNumber) {
      this.showPreview = false;
      const resp = await this.getTestCostSMSCampaign({
        ...this.model.toTestPayload(),
        sender: phoneNumber,
      });

      if (resp.canPaid) {
        this.confirmTestCampaign({
          campaignType: this.$tc('$General.SMS'),
          senderId: phoneNumber,
          cost: resp.cost,
        });
      } else {
        this.$vs.dialog({
          type: 'confirm',
          color: 'warning',
          title: 'Test SMS Campaign message',
          text: 'You do not have enough balance to send this test SMS',
          accept: () => { this.showCheckout = true; },
          acceptText: this.$t('$General.Recharge'),
        });
      }
    },
  },
};
</script>
