import enums from '@/enums';
import CampaignSpecifiedChart from '@/views/modules/campaigns/CampaignSpecifiedChart.vue';
import commonListCreateOrEditWithAgGrid from '@/views/modules/mixins/commonListCreateOrEditWithAgGrid';


export default {
  components: {
    CampaignSpecifiedChart,
  },
  mixins: [commonListCreateOrEditWithAgGrid],
  props: {
    statusFilter: {
      type: Object,
      required: false,
    },
    listType: {
      required: true,
      validator(type) {
        return Object.values(enums.Campaign.ListType).includes(type);
      },
    },
  },
  data() {
    return {
      modalsDelay: 0,
      dontConfirmCloseCreateOrEdit: true,
      viewDisabled: true,
      cloneDisabled: true,
      editDisabled: this.listType === this.$enums.Campaign.ListType.History,
      deleteDisabled: this.listType === this.$enums.Campaign.ListType.History,
      confirmDeleteRecordsDialogParams: {
        color: 'warning',
        title: '$Dialogs.ConfirmCancelTitle',
        text: '$Dialogs.ConfirmGeneralCancelMsg',
        acceptText: '$General.Cancel',
        cancelText: '$General.Close',
      },
    };
  },
  computed: {
    campaignMultipleActionOptions() {
      if (this.listType === this.$enums.Campaign.ListType.History) {
        return this.defaultMultipleActionOptions.filter(
          (option) => option.event !== this.$enums.Operation.DELETE,
        );
      }

      if (this.listType === this.$enums.Campaign.ListType.Scheduled) {
        // eslint-disable-next-line array-callback-return
        return this.defaultMultipleActionOptions.map((option) => {
          if (option.event === this.$enums.Operation.DELETE) {
            return {
              ...option,
              label: this.$t('$General.Cancel'),
              icon: 'XIcon',
            };
          }

          return option;
        });
      }

      return this.defaultMultipleActionOptions;
    },
  },
  methods: {
    confirmDeleteCampaign() {
      if (this.listType !== this.$enums.Campaign.ListType.History) {
        this.confirmDeleteRecords();
      }
    },
    onRowClicked(e) {
      const campaignData = e.node.data;

      if (this.$mq !== this.$enums.mqBreakpoints.LAPTOP
        && this.$mq !== this.$enums.mqBreakpoints.DESKTOP) {
        if (campaignData.status === this.$enums.Campaign.Status.PENDING
          || campaignData.status === this.$enums.Campaign.Status.DRAFT) {
          this.editRecord(campaignData);
        } else if (campaignData.status === this.$enums.Campaign.Status.COMPLETED) {
          this.viewRecord(campaignData);
        }
      }
    },
    onRowDoubleClicked(e) {
      const campaignData = e.node.data;

      if (campaignData.status === this.$enums.Campaign.Status.PENDING
        || campaignData.status === this.$enums.Campaign.Status.DRAFT) {
        this.editRecord(campaignData);
      } else if (campaignData.status === this.$enums.Campaign.Status.COMPLETED) {
        this.viewRecord(campaignData);
      }
    },
  },
};
