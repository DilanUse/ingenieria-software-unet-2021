<template>
  <form>
    <div class="vx-row">
      <div
        v-if="!compactDesign"
        class="vx-col w-full sm:w-1/3 flex items-center">
        <span>{{ $t('$CampaignsModules.CampaignName') }}</span>
      </div>
      <div
        class="vx-col w-full"
        :class="{'sm:w-2/3': !compactDesign}">
        <vs-input
          v-model="nameLocal"
          class="w-full"
          :class="{required: compactDesign}"
          :name="$t('$General.Name')"
          :label="compactDesign ? $t('$General.Name') : ''"
          v-validate="'required|max:100'"
          data-vv-validate-on="blur|input"
          @input="$emit('update:name', nameLocal)"/>
        <span
          v-show="errors.has($t('$General.Name'))"
          class="text-danger text-sm">
          {{ errors.first($t('$General.Name')) }}
        </span>
      </div>
    </div>

    <div
      class="vx-row"
      :class="[compactDesign ? 'mt-6' : 'mt-base']">
      <div
        v-if="!compactDesign"
        class="vx-col sm:w-1/3 w-full flex items-center">
        <span>{{ senderIdName }}</span>
      </div>
      <div
        class="vx-col w-full"
        :class="{'sm:w-2/3': !compactDesign}">
        <label
          v-if="compactDesign"
          class="vs-input--label required">
          {{ senderIdName }}
        </label>
        <v-select-server
          :key="vSelectServerKey"
          v-model="senderIdLocal"
          :fetch-function="sendersIdFetchFunction"
          :filter-params="filterParamsToFetchSendersIds"
          closeOnSelect
          :clearable="false"
          :default-options="senderIdDefaultOptions"
          :manage-route-name="senderIdManageRoute"
          :manage-text="senderIdManageText"
          :permission-to-manage="$enums.Auth.Permissions.CAMPAIGNS"
          :option-emphasis="senderIsMailerId ? 'email' : 'phoneInternational'"
          @input="validateSenderId"
          @create="createSenderId"/>
        <div class="mt-1">
          <a
            href="#"
            @click.prevent="createSenderId('')">
            {{ $t('$CampaignsModules.$CampaignInfo.CreateNewSenderIDLink', {
              name: this.senderIdName,
            }) | lowercase }}
          </a>
        </div>

        <vs-input
          :value="senderIdLocal ? senderIdLocal.name : ''"
          type="hidden"
          :name="senderIdName"
          v-validate="'required'"
          data-vv-validate-on="input|blur|change"/>
        <span
          v-show="errors.has(senderIdName)"
          class="text-danger text-sm block">
          {{ errors.first(senderIdName) }}
        </span>
      </div>
    </div>

    <div
      class="vx-row"
      :class="[compactDesign ? 'mt-6': 'mt-base']">
      <div
        v-if="!compactDesign"
        class="vx-col sm:w-1/3 w-full flex items-center">
        <span>{{ $t('$CampaignsModules.CampaignType') }}*</span>
        <feather-icon
          icon="InfoIcon"
          class="cursor-pointer"
          svgClasses="h-4 w-4 ml-3"
          @click="showCampaignTypeModal=true"/>
      </div>
      <div
        class="vx-col w-full"
        :class="{'sm:w-2/3': !compactDesign}">
        <label
          v-if="compactDesign"
          class="vs-input--label">
          <span>
            {{ $t('$CampaignsModules.CampaignType') }}*
          </span>
          <feather-icon
            icon="InfoIcon"
            class="cursor-pointer"
            svgClasses="h-4 w-4 ml-3"
            @click="showCampaignTypeModal=true"/>
        </label>
        <div
          class="vx-row"
          :class="{'mt-3': compactDesign}">

          <div class="vx-col w-full">
            <card-radio-toggle
              v-model="messageTypeLocal"
              :radio-name="$t('$CampaignsModules.CampaignType')"
              :radio-options="messageTypeCardRadioToggleOptions"/>
          </div>

          <div class="vx-col w-full">
            <vs-input
              :value="messageTypeLocal"
              type="hidden"
              :name="$t('$CampaignsModules.CampaignType')"
              v-validate="'required'"
              data-vv-validate-on="input|blur|change"/>
            <span
              v-show="errors.has($t('$CampaignsModules.CampaignType'))"
              class="text-danger text-sm block">
              {{ errors.first($t('$CampaignsModules.CampaignType')) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <vs-alert
      color="warning"
      :active="showReviewsSettingsAlert"
      class="text-center mt-6">
      {{ $t('$CampaignsModules.$CampaignInfo.NoSetUpReviewsAlertText') }}
      <router-link
        to="/reviews"
        class="link-decorate">
        {{ $t('$CampaignsModules.$CampaignInfo.NoSetUpReviewsAlertLink') }}
      </router-link>
    </vs-alert>

    <slot></slot>

    <vs-popup
      :title="$t('$Modals.CreateModalTitle', { entity: this.senderIdName })"
      :active.sync="activeModalCreateOrEditSenderId">
      <caller-id-list-create-or-edit
        v-if="senderIsCallerId && showCreateOrEditComponentSenderId"
        :entity="$enums.Entity.CALLER_ID"
        :operation="$enums.Operation.CREATE"
        :name-to-create="nameToCreateSender"
        @saved="activeModalCreateOrEditSenderId=false"
        @close="activeModalCreateOrEditSenderId=false">
      </caller-id-list-create-or-edit>
    </vs-popup>

    <vs-popup
      :title="$t('$SenderIdsModules.VerificationModalTitle', {
        entity: this.senderIdName,
        name: this.recordToVerify ? this.recordToVerify.name : '',
        value: this.senderVerifyModalTitleValue
      })"
      :active.sync="activeModalVerify">
      <sender-id-verification
        v-if="activeModalVerify"
        :model-payload="recordToVerify"
        :message="senderVerifyMessage"
        :entity="senderIdEntity"
        :send-code="sendVerificationCode"
        @close="activeModalVerify=false"
        @verified="afterVerifySenderId()">
      </sender-id-verification>
    </vs-popup>

    <vs-popup
      :title="$t('$CampaignsModules.$CampaignInfo.CampaignTypeInfoModalTitle')"
      :active.sync="showCampaignTypeModal">
      <p class="text-sm text-justify">
        <strong>{{ $t('$CampaignsModules.$CampaignType.Transactional') }}</strong>:
        {{ $t('$CampaignsModules.$CampaignTypeInfo.Transactional') }}
      </p>

      <p class="text-sm text-justify mt-base ">
        <strong>{{ $t('$CampaignsModules.$CampaignType.Marketing') }}</strong>:
        {{ $t('$CampaignsModules.$CampaignTypeInfo.Marketing') }}
      </p>

      <p class="text-sm text-justify mt-base ">
        <strong>{{ $t('$CampaignsModules.$CampaignType.Review') }}</strong>:
        {{ $t('$CampaignsModules.$CampaignTypeInfo.Review') }}
      </p>

      <div class="mt-base text-center text-sm">
        <a
          href="https://grapesend.com.au/missing-link"
          target="_blank"
          class="link-decorate">
          {{ $t("$General.MoreInfo") }}
        </a>
      </div>
    </vs-popup>
  </form>

</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import enums from '@/enums';

// Mixins
import campaignStep from '@/views/modules/mixins/campaigns/campaignStep';
import senderIdVerification from '@/views/modules/mixins/senderIdVerification.mixin';

// Components
import CallerIdListCreateOrEdit from '@/views/modules/sender-ids/caller-id/CallerIdListCreateOrEdit.vue';
import VSelectServer from '@/views/modules/components/VSelectServer.vue';
import SenderIdVerification from '@/views/modules/sender-ids/SenderIdVerification.vue';
import CardRadioToggle from '@/views/modules/components/CardRadioToggle.vue';

export default {
  name: 'CampaignInformation',
  components: {
    VSelectServer,
    CallerIdListCreateOrEdit,
    SenderIdVerification,
    CardRadioToggle,
  },
  mixins: [campaignStep, senderIdVerification],
  props: {
    name: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      required: true,
    },
    senderId: {
      type: [Object, String],
      required: true,
    },
    senderType: {
      type: String,
      required: false,
      validator(type) {
        return type
          ? [
            enums.Sender.Type.SHARED,
            enums.Sender.Type.PRIVATE,
            enums.Sender.Type.VIRTUAL,
          ].indexOf(type) !== -1
          : true;
      },
      default: '',
    },
  },
  data() {
    return {
      showReviewsSettingsAlert: false,
      nameLocal: this.name,
      messageTypeLocal: this.messageType,
      senderIdLocal: null,
      senderTypeLocal: this.senderType,
      sharedCallerId: {
        id: '',
        name: this.$t('$CampaignsModules.$CampaignInfo.SharedNumberOptions'),
      },
      filterParamsToFetchSendersIds: {
        status: {
          filterType: 'text',
          type: 'equals',
          filter: this.$enums.Sender.Status.VERIFIED,
        },
      },
      activeModalCreateOrEditSenderId: false,
      showCreateOrEditComponentSenderId: false,
      nameToCreateSender: '',
      vSelectServerKey: 0,
      showCampaignTypeModal: false,
      messageTypeCardRadioToggleOptions: [
        {
          value: this.$enums.Campaign.MessageType.TRANSACTIONAL,
          label: this.$t('$CampaignsModules.$CampaignType.Transactional'),
        },
        {
          value: this.$enums.Campaign.MessageType.MARKETING,
          label: this.$t('$CampaignsModules.$CampaignType.Marketing'),
        },
        {
          value: this.$enums.Campaign.MessageType.REVIEW,
          label: this.$t('$CampaignsModules.$CampaignType.Review'),
        },
      ],
    };
  },
  computed: {
    ...mapState({
      lastCreatedCaller: (state) => state.callerId.lastCreated,
    }),
    ...mapGetters({
      getTenantFlag: 'auth/getTenantFlag',
    }),
    isValid() {
      return !this.errors.any()
        && !!this.nameLocal
        && !!this.senderIdLocal
        && !!this.messageTypeLocal;
    },
    lastCreated() {
      return this.lastCreatedCaller;
    },
    senderIsMailerId() {
      return this.campaignType === this.$enums.Campaign.Type.EMAIL;
    },
    senderIsCallerId() {
      return this.campaignType !== this.$enums.Campaign.Type.EMAIL;
    },
    senderIdName() {
      return this.campaignType === this.$enums.Campaign.Type.EMAIL
        ? this.$tc(`$Entities.${this.$enums.Entity.MAILER_ID}`)
        : this.$tc(`$Entities.${this.$enums.Entity.CALLER_ID}`);
    },
    senderIdDefaultOptions() {
      return this.campaignType === this.$enums.Campaign.Type.SMS
        ? [this.sharedCallerId]
        : [];
    },
    sendersIdFetchFunction() {
      return this.campaignType === this.$enums.Campaign.Type.EMAIL
        ? this.fetchAllMailerIds
        : this.fetchAllCallerIds;
    },
    senderIdFetchFunction() {
      return this.campaignType === this.$enums.Campaign.Type.EMAIL
        ? this.fetchMailerId
        : this.fetchCallerId;
    },
    senderIdManageRoute() {
      return this.campaignType === this.$enums.Campaign.Type.EMAIL
        ? 'mailer-ids'
        : 'caller-ids';
    },
    senderIdManageText() {
      return this.campaignType === this.$enums.Campaign.Type.EMAIL
        ? this.$t('$MailerIdModule.ManageMailerIds')
        : this.$t('$CallerIdModule.ManageCallerIds');
    },
    senderVerifyModalTitleValue() {
      const phone = this.recordToVerify ? this.recordToVerify.phoneInternational : '';
      const email = this.recordToVerify ? this.recordToVerify.email : '';

      return this.campaignType === this.$enums.Campaign.Type.EMAIL
        ? email
        : phone;
    },
    senderIdEntity() {
      return this.campaignType === this.$enums.Campaign.Type.EMAIL
        ? this.$enums.Entity.MAILER_ID
        : this.$enums.Entity.CALLER_ID;
    },
    senderVerifyMessage() {
      return this.campaignType === this.$enums.Campaign.Type.EMAIL
        ? this.$t('$MailerIdModule.VerifyEmailMsg')
        : this.$t('$CallerIdModule.VerifyPhoneMsg');
    },
  },
  watch: {
    senderIdLocal(val) {
      this.$emit('update:sender-id', val);

      if (val.id === '') {
        this.senderTypeLocal = this.$enums.Sender.Type.SHARED;
      } else {
        this.senderTypeLocal = this.$enums.Sender.Type.PRIVATE;
      }
    },
    senderTypeLocal(val) {
      this.$emit('update:sender-type', val);
    },
    activeModalCreateOrEditSenderId(val) {
      if (!val) {
        setTimeout(() => {
          this.showCreateOrEditComponentSenderId = false;
        }, 500);
      } else {
        this.showCreateOrEditComponentSenderId = true;
      }
    },
    isValid(val) {
      this.$emit('validate', val);
    },
    messageTypeLocal(newVal, oldVal) {
      if (!this.getTenantFlag('completedReviewsSettings') && newVal === this.$enums.Campaign.MessageType.REVIEW) {
        this.showReviewsSettingsAlert = true;

        this.$nextTick(() => {
          this.messageTypeLocal = '';
          setTimeout(() => {
            this.$validator.reset({ name: this.$enums.Campaign.MessageType.REVIEW });
          });
        });
      } else {
        this.$emit('update:message-type', this.messageTypeLocal);

        if (!(newVal === '' && oldVal === this.$enums.Campaign.MessageType.REVIEW)) {
          this.showReviewsSettingsAlert = false;

          setTimeout(() => {
            this.$validator.validate(this.$t('$CampaignsModules.CampaignType'));
          }, 0);
        }
      }
    },
  },
  created() {
    this.initSenderId();
  },
  methods: {
    ...mapActions({
      fetchAllCallerIds: 'callerId/fetchAllCallerIds',
      fetchCallerId: 'callerId/fetchCallerId',
      fetchAllMailerIds: 'mailerId/fetchAllMailerIds',
      fetchMailerId: 'mailerId/fetchMailerId',
    }),
    async initSenderId() {
      if (this.senderId) {
        if (typeof this.senderId === 'string') {
          this.senderIdLocal = await this.senderIdFetchFunction(this.senderId);
        } else {
          this.senderIdLocal = this.senderId || this.sharedCallerId;
        }
      } else {
        this.senderIdLocal = this.campaignType === this.$enums.Campaign.Type.SMS
          ? this.sharedCallerId
          : null;
      }
    },
    validateSenderId() {
      setTimeout(() => this.$validator.validate(this.senderIdName));
    },
    async validateCampaignInfo() {
      const result = await this.$validator.validateAll();

      if (this.$validator.errors.items.length > 0) {
        const $fieldError = this.$el.querySelector(`[name="${this.$validator.errors.items[0].field}"]`);
        let $fieldToFocus = $fieldError;

        if ($fieldError) {
          if ($fieldError.attributes && $fieldError.attributes.type.value === 'hidden') {
            $fieldToFocus = $fieldError.parentElement;
            $fieldToFocus.scrollIntoView(false);
          } else {
            $fieldToFocus.focus();
          }
        }
      }

      return result;
    },
    createSenderId(name = '') {
      this.nameToCreateSender = name;
      this.activeModalCreateOrEditSenderId = true;
    },
    afterVerifySenderId() {
      this.activeModalVerify = false;
      this.vSelectServerKey += 1;
    },
  },
};
</script>
