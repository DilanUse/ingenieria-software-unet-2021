import { mapState, mapActions } from 'vuex';
import selectedFromCampaign from './selectedFromCampaign';


export default {
  mixins: [selectedFromCampaign],
  props: {
    loadedContacts: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    ...mapState({
      smsCampaignSelectedContacts: (state) => state.smsCampaign.selectedContacts,
      smsCampaignSelectedGroups: (state) => state.smsCampaign.selectedGroups,
      smsCampaignHasGroups: (state) => state.smsCampaign.hasGroups,
      mmsCampaignSelectedContacts: (state) => state.mmsCampaign.selectedContacts,
      mmsCampaignSelectedGroups: (state) => state.mmsCampaign.selectedGroups,
      mmsCampaignHasGroups: (state) => state.mmsCampaign.hasGroups,
      voiceCampaignSelectedContacts: (state) => state.voiceCampaign.selectedContacts,
      voiceCampaignSelectedGroups: (state) => state.voiceCampaign.selectedGroups,
      voiceCampaignHasGroups: (state) => state.voiceCampaign.hasGroups,
      emilCampaignSelectedContacts: (state) => state.emailCampaign.selectedContacts,
      emailCampaignSelectedGroups: (state) => state.emailCampaign.selectedGroups,
      emailCampaignHasGroups: (state) => state.emailCampaign.hasGroups,
    }),
    selectedContacts() {
      switch (this.onCampaignSelection) {
        case this.$enums.Campaign.Type.SMS:
          return this.smsCampaignSelectedContacts;

        case this.$enums.Campaign.Type.MMS:
          return this.mmsCampaignSelectedContacts;

        case this.$enums.Campaign.Type.VOICEMAIL:
          return this.voiceCampaignSelectedContacts;

        case this.$enums.Campaign.Type.EMAIL:
          return this.emilCampaignSelectedContacts;

        default:
          return [];
      }
    },
    selectedGroups() {
      switch (this.onCampaignSelection) {
        case this.$enums.Campaign.Type.SMS:
          return this.smsCampaignSelectedGroups;

        case this.$enums.Campaign.Type.MMS:
          return this.mmsCampaignSelectedGroups;

        case this.$enums.Campaign.Type.VOICEMAIL:
          return this.voiceCampaignSelectedGroups;

        case this.$enums.Campaign.Type.EMAIL:
          return this.emailCampaignSelectedGroups;

        default:
          return [];
      }
    },
    campaignHasGroups() {
      switch (this.onCampaignSelection) {
        case this.$enums.Campaign.Type.SMS:
          return this.smsCampaignHasGroups;

        case this.$enums.Campaign.Type.MMS:
          return this.mmsCampaignHasGroups;

        case this.$enums.Campaign.Type.VOICEMAIL:
          return this.voiceCampaignHasGroups;

        case this.$enums.Campaign.Type.EMAIL:
          return this.emailCampaignHasGroups;

        default:
          return false;
      }
    },
  },
  methods: {
    ...mapActions({
      resetSmsCampaign: 'smsCampaign/resetSMSCampaign',
      resetMmsCampaign: 'mmsCampaign/resetMMSCampaign',
      resetVoiceCampaign: 'voiceCampaign/resetVoiceCampaign',
      resetEmailCampaign: 'emailCampaign/resetEmailCampaign',
      setSelectedGroupsSMSCampaign: 'smsCampaign/setSelectedGroups',
      setSelectedGroupsMMSCampaign: 'mmsCampaign/setSelectedGroups',
      setSelectedGroupsVoiceCampaign: 'voiceCampaign/setSelectedGroups',
      setSelectedGroupsEmailCampaign: 'emailCampaign/setSelectedGroups',
      setSelectedContactsSMSCampaign: 'smsCampaign/setSelectedContacts',
      setSelectedContactsMMSCampaign: 'mmsCampaign/setSelectedContacts',
      setSelectedContactsVoiceCampaign: 'voiceCampaign/setSelectedContacts',
      setSelectedContactsEmailCampaign: 'emailCampaign/setSelectedContacts',
    }),
    onSelectionContactsChanged({
      rowsSelectedCount = 0,
      rowsSelected = null,
      filters = {},
    }) {
      switch (this.onCampaignSelection) {
        case this.$enums.Campaign.Type.SMS:
          if (this.entity === this.$enums.Entity.CONTACT) {
            this.setSelectedContactsSMSCampaign({
              count: rowsSelectedCount,
              data: rowsSelected,
              filters,
            });
          } else {
            this.setSelectedGroupsSMSCampaign({
              count: rowsSelectedCount,
              data: rowsSelected,
              filters,
            });
          }
          break;

        case this.$enums.Campaign.Type.MMS:
          if (this.entity === this.$enums.Entity.CONTACT) {
            this.setSelectedContactsMMSCampaign(this.rowsSelected);
          } else {
            this.setSelectedGroupsMMSCampaign(this.rowsSelected);
          }
          break;

        case this.$enums.Campaign.Type.VOICEMAIL:
          if (this.entity === this.$enums.Entity.CONTACT) {
            this.setSelectedContactsVoiceCampaign(this.rowsSelected);
          } else {
            this.setSelectedGroupsVoiceCampaign(this.rowsSelected);
          }
          break;

        case this.$enums.Campaign.Type.EMAIL:
          if (this.entity === this.$enums.Entity.CONTACT) {
            this.setSelectedContactsEmailCampaign(this.rowsSelected);
          } else {
            this.setSelectedGroupsEmailCampaign(this.rowsSelected);
          }
          break;

        default:
      }
    },
    async afterInitComponent() {
      if (this.campaignOperation !== undefined
        && ((this.campaignOperation === this.$enums.Operation.CREATE && !this.draftCampaign)
          || this.loadedContacts)
      ) {
        switch (this.onCampaignSelection) {
          case this.$enums.Campaign.Type.SMS:
            this.resetSmsCampaign();
            break;

          case this.$enums.Campaign.Type.MMS:
            this.resetMmsCampaign();
            break;

          case this.$enums.Campaign.Type.VOICEMAIL:
            this.resetVoiceCampaign();
            break;

          case this.$enums.Campaign.Type.EMAIL:
            this.resetEmailCampaign();
            break;

          default:
        }
      } else {
        this.$emit('update:loaded-contacts', true);
      }
    },
  },
};
