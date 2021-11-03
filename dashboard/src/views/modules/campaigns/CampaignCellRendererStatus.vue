<template>
  <vs-chip
    v-if="params.value"
    class="ag-grid-cell-chip"
    :color="chipColor(params.value)">
    <feather-icon :icon="chipIcon(params.value)" svgClasses="h-5 w-5 mr-1" />
    <span>
      {{ $t(`$CampaignsModules.$CampaignStatus.${params.value}`) }}
    </span>
  </vs-chip>
</template>

<script>

export default {
  name: 'CampaignCellRendererStatus',
  computed: {
    chipColor() {
      return (value) => {
        switch (value) {
          case this.$enums.Campaign.Status.PENDING:
          case this.$enums.Campaign.Status.RUNNING:
          case this.$enums.Campaign.Status.DRAFT:
            return 'warning';
          case this.$enums.Campaign.Status.COMPLETED:
            return 'success';

          default:
            return '';
        }
      };
    },
    chipIcon() {
      return (value) => {
        switch (value) {
          case this.$enums.Campaign.Status.PENDING:
            return 'ClockIcon';
          case this.$enums.Campaign.Status.RUNNING:
            return 'PlayIcon';
          case this.$enums.Campaign.Status.DRAFT:
            return 'EditIcon';
          case this.$enums.Campaign.Status.COMPLETED:
            return 'CheckSquareIcon';

          default:
            return '';
        }
      };
    },
  },
};
</script>
