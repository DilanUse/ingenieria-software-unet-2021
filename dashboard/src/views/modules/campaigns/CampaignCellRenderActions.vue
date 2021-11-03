<template>
  <common-cell-renderer-actions
    :actions="filteredActionsByCampaignStatus"
    clone-disabled
    @view="viewRecord()"
    @edit="editRecord()"
    @clone="cloneRecord()"
    @delete="confirmDeleteRecord()">
  </common-cell-renderer-actions>
</template>

<script>
import commonSingleCellRendererActions from '@/views/modules/mixins/commonSingleCellRendererActions';
import CommonCellRendererActions from '@/views/modules/components/cell-renderer/CommonCellRendererActions.vue';


export default {
  name: 'CampaignCellRenderActions',
  components: {
    CommonCellRendererActions,
  },
  mixins: [commonSingleCellRendererActions],
  computed: {
    confirmDeleteRecordDialogParams() {
      if (this.dataRowRecord.status === this.$enums.Campaign.Status.PENDING) {
        return {
          type: 'alert',
          color: 'warning',
          title: this.$t('$Dialogs.ConfirmCancelTitle'),
          text: this.$t('$Dialogs.ConfirmSpecificCancelMsg', { entity: this.nameRowRecord }),
          acceptText: this.$t('$General.Confirm'),
        };
      }

      return {};
    },
    deleteSuccessNotificationParams() {
      if (this.dataRowRecord.status === this.$enums.Campaign.Status.PENDING) {
        return {
          $title: '$Notifications.CanceledTitle',
          $msg: '$Notifications.CanceledMsg',
        };
      }

      return {};
    },
    filteredActionsByCampaignStatus() {
      const bannedActions = [];

      switch (this.dataRowRecord.status) {
        case this.$enums.Campaign.Status.COMPLETED:
          bannedActions.push(this.$enums.Operation.EDIT);
          bannedActions.push(this.$enums.Operation.DELETE);
          break;
        case this.$enums.Campaign.Status.RUNNING:
          bannedActions.push(this.$enums.Operation.EDIT);
          bannedActions.push(this.$enums.Operation.DELETE);
          break;
        case this.$enums.Campaign.Status.PENDING:
        case this.$enums.Campaign.Status.DRAFT:
          bannedActions.push(this.$enums.Operation.VIEW);
          break;

        default:
      }

      return this.mappedActionsByCampaignStatus.filter(
        (action) => !bannedActions.includes(action.name),
      );
    },
    mappedActionsByCampaignStatus() {
      if (this.dataRowRecord.status === this.$enums.Campaign.Status.PENDING) {
        return this.filteredActionsFromParent.map((action) => {
          if (action.name === this.$enums.Operation.DELETE) {
            return {
              ...action,
              color: 'warning',
              text: '$General.Cancel',
              icon: 'icon-x-circle',
              iconVue: 'XCircleIcon',
            };
          }

          return action;
        });
      }

      return this.filteredActionsFromParent;
    },
  },
};
</script>
