import { mapActions, mapMutations } from 'vuex';

// components
import { FormWizard, TabContent } from 'vue-form-wizard';

// mixins
import singleCreateOrEdit from '@/views/modules/mixins/singleCreateOrEdit';

// custom components
import CampaignInformation from '@/views/modules/campaigns/CampaignInformation.vue';
import CampaignSettings from '@/views/modules/campaigns/CampaignDeliveryType.vue';
import CampaignConfirm from '@/views/modules/campaigns/CampaignConfirm.vue';
import ContactList from '@/views/modules/contacts/contact/ContactList.vue';
import CampaignWizardFooterButtons from '@/views/modules/campaigns/CampaignWizardFooterButtons.vue';

export default {
  components: {
    FormWizard,
    TabContent,
    CampaignSettings,
    CampaignConfirm,
    CampaignInformation,
    ContactList,
    CampaignWizardFooterButtons,
  },
  mixins: [singleCreateOrEdit],
  data() {
    return {
      model: null,
      loadedCampaign: false,
      loadMessage: false,
      loadContacts: false,
      loadSettings: false,
      loadConfirm: false,
      showCheckout: false,
      costInfo: null,
      campaignBaseRoute: '',
      campaignType: '',
      campaignInfoKey: 0,

      initCampaignModelFunction: null,
      additionalInitCampaignFunction: () => {},
      setCampaignPayloadFunction: () => {},
      additionalValidateCampaignInfoFunction: async () => true,
    };
  },
  computed: {
    verifyProperties() {
      return this.model.name !== '';
    },
    startIndex() {
      return this.loadedCampaign
      && (this.model.status === this.$enums.Campaign.Status.DRAFT || this.isEdition)
        ? this.model.step : 0;
    },
    marketingStatusFilterOptions() {
      const marketingStates = [
        this.$enums.Contact.MarketingStatus.SUBSCRIBED,
      ];

      return this.model.messageType === this.$enums.Campaign.MessageType.TRANSACTIONAL
        ? [
          ...marketingStates,
          this.$enums.Contact.MarketingStatus.UNSUBSCRIBED,
        ]
        : marketingStates;
    },
  },
  created() {
    this.initCampaign();
  },
  beforeDestroy() {
    this.setCampaignPayloadFunction(null);
  },
  methods: {
    ...mapActions({
      saveDraftCampaign: 'user/saveDraftCampaign',
      discardDraftCampaign: 'user/discardDraftCampaign',
    }),
    ...mapMutations({
      deleteCampaignDraftAuthUser: 'auth/DELETE_CAMPAIGN_DRAFT',
    }),
    async initCampaign() {
      const isDraft = (!this.modelPayload && !!this.draftCampaign)
        || (!!this.modelPayload && !!this.modelPayload.id
          && this.modelPayload.status === this.$enums.Campaign.Status.DRAFT
          && this.operation === this.$enums.Operation.EDIT);
      const payload = !this.modelPayload && !!this.draftCampaign
        ? this.draftCampaign : this.modelPayload;

      if ((this.operation === this.$enums.Operation.EDIT
        || this.operation === this.$enums.Operation.CLONE)
        && !this.modelPayload && this.campaignBaseRoute) {
        await this.$router.push(`${this.campaignBaseRoute}/create`);
      }

      if (this.initCampaignModelFunction) {
        this.initCampaignModelFunction({ isDraft, payload });
      } else {
        throw new Error('initCampaignModelFunction must be defined');
      }

      if (this.isEdition || this.draftCampaign) {
        this.additionalInitCampaignFunction();
        this.loadedCampaign = true;
        this.loadResourcesFromCampaign();
      } else {
        this.loadedCampaign = true;
      }
    },
    loadResourcesFromCampaign() {
      this.loadMessage = this.model.step > 0;
      this.loadContacts = this.model.step > 1;
      this.loadSettings = this.model.step > 2;
      this.loadConfirm = this.model.step > 3;
    },
    onChangeTab(prevIndex, nextIndex) {
      this.model.step = nextIndex;
      this.$refs.wizard.$el.scrollIntoView(true);
    },
    async validateCampaignInfo() {
      const stepInfoValid = await this.$refs.campaignInfo.validateCampaignInfo();
      const AdditionalStepInfoValid = await this.additionalValidateCampaignInfoFunction();

      if (stepInfoValid && AdditionalStepInfoValid) {
        this.campaignInfoIsValid();
        return true;
      }

      return false;
    },
    campaignInfoIsValid() {
      this.loadMessage = true;
    },
    async validateCampaignMessage() {
      this.campaignMessageIsValid();
      return true;
    },
    campaignMessageIsValid() {
      this.loadContacts = true;
    },
    async validateSelectedContacts() {
      this.campaignContactsIsValid();
      return true;
    },
    campaignContactsIsValid() {
      this.loadSettings = true;
    },
    async validateCampaignSettings() {
      const result = await this.$refs.campaignSettings.$validator.validateAll();

      if (result) {
        await this.campaignSettingsIsValid();
        return true;
      }

      return false;
    },
    async campaignSettingsIsValid() {
      this.loadConfirm = true;
    },
    async continueCampaignStep() {
      if (this.model.id) {
        if (this.model.status !== this.$enums.Campaign.Status.PENDING) {
          await this.saveCampaignAsDraft();
        }
      } else {
        await this.saveCampaignAsDraft();
      }
    },
    async confirmSaveAndQuitCampaign() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'warning',
        title: this.$t('$CampaignsModules.ConfirmSaveAndQuitCampaignTitle'),
        text: this.$t('$CampaignsModules.ConfirmSaveAndQuitCampaignMsg'),
        accept: this.saveAndQuitCampaign,
      });
    },
    async saveAndQuitCampaign() {
      if (this.model.id) {
        if (this.model.status !== this.$enums.Campaign.Status.PENDING) {
          await this.saveCampaignAsDraft();
        }
      } else {
        await this.saveCampaignAsDraft(true);
      }

      await this.deleteCampaignDraftAuthUser(this.campaignType);
      await this.restartCampaign(false);
    },
    async saveCampaignAsDraft(hardDraft = false) {
      this.model.status = this.$enums.Campaign.Status.DRAFT;
      const payload = this.model.toDraftPayload();

      const resp = await this.saveDraftCampaign({
        campaignDraft: payload,
        campaignType: this.campaignType,
        hardDraft,
      });

      this.model.id = resp.id;
    },
    returnToStep(step) {
      this.$refs.wizard.changeTab(this.model.step, step);
    },
    async confirmRestartCampaign() {
      let restartType = 'StartOver';

      if (this.model.isDraft) {
        restartType = 'DiscardDraft';
      }

      if (this.operation === this.$enums.Operation.EDIT
        && this.model.deliveryType === this.$enums.Campaign.DeliveryType.LATER) {
        restartType = 'CancelScheduled';
      }

      this.$vs.dialog({
        type: 'confirm',
        color: 'warning',
        title: this.$t(`$CampaignsModules.Confirm${restartType}CampaignTitle`),
        text: this.$t(`$CampaignsModules.Confirm${restartType}CampaignMsg`),
        accept: this.restartCampaign,
      });
    },
    async restartCampaign(discardDraft = true) {
      if (discardDraft) {
        await this.discardDraftCampaign({
          campaignId: this.model.id,
          campaignType: this.campaignType,
        });
      }

      this.setCampaignPayloadFunction(null);

      if (this.isEdition) {
        await this.$router.push(`${this.campaignBaseRoute}/create`);
      } else {
        this.loadedCampaign = false;
        this.loadMessage = false;
        this.loadContacts = false;
        this.loadSettings = false;
        this.loadConfirm = false;
        this.showCheckout = false;
        this.costInfo = null;

        this.campaignInfoKey += 1;
        await this.initCampaign();
        this.$refs.wizard.reset();
      }
    },
    confirmTestCampaign({ campaignType, senderId, cost }) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'primary',
        title: this.$t('$CampaignsModules.ConfirmTestCampaignTitle'),
        text: this.$t('$CampaignsModules.ConfirmTestCampaignMsg', {
          type: campaignType,
          senderId,
          cost: this.$options.filters.dollar(cost),
        }),
        accept: () => this.sendTestCampaign(senderId),
        acceptText: this.$t('$General.Send'),
      });
    },
    async sendTestCampaign(sender) {
      await this.testCampaign({
        ...this.model.toTestPayload(),
        sender,
      });

      this.$vs.notify({
        title: this.$t('$CampaignsModules.TestCampaignSuccessNotifyTitle'),
        text: this.$t('$CampaignsModules.TestCampaignSuccessNotifyMsg'),
        color: 'success',
        iconPack: 'feather',
        icon: 'icon-check',
      });
    },
    confirmSendCampaign(contacts, cost) {
      const deliveryText = this.model.deliveryType === this.$enums.Campaign.DeliveryType.LATER
        ? 'Schedule' : 'Send';

      this.$vs.dialog({
        type: 'confirm',
        title: this.$t(`$CampaignsModules.Confirm${deliveryText}CampaignTitle`),
        text: this.$t(`$CampaignsModules.Confirm${deliveryText}CampaignMsg`, {
          contacts,
          entity: this.$tc(`$Entities.${this.entity}`),
          cost: this.$options.filters.dollar(cost),
        }),
        accept: this.saveCampaign,
        acceptText: this.$t(`$General.${deliveryText}`),
      });
    },
    async saveCampaign() {
      if (this.model.deliveryType === this.$enums.Campaign.DeliveryType.IMMEDIATELY) {
        this.model.status = this.$enums.Campaign.Status.RUNNING;
      } else {
        this.model.status = this.$enums.Campaign.Status.PENDING;
      }

      await this.save(this.model.toSavePayload());

      if (this.campaignBaseRoute) {
        const path = this.model.status === this.$enums.Campaign.Status.PENDING
          ? 'scheduled' : 'history';
        await this.$router.push(`${this.campaignBaseRoute}/${path}`);
      }
    },
  },
};
