<template>
  <vs-chip
    v-if="params.value"
    class="ag-grid-cell-chip"
    :color="chipColor(params.value)">
    <feather-icon :icon="chipIcon(params.value)" svgClasses="h-5 w-5 mr-1" />
    <span>
      {{ $t(`$CampaignsModules.$CampaignDetailsStatus.${params.value}`) }}
    </span>
  </vs-chip>
</template>

<script>

export default {
  name: 'CampaignSpecifiedChartDetailsTableCellRendererStatus',
  computed: {
    chipColor() {
      return (value) => {
        switch (value) {
          case this.$enums.Campaign.DetailStatus.PENDING:
            return 'warning';
          case this.$enums.Campaign.DetailStatus.OUTBOUND:
            return 'success';
          case this.$enums.Campaign.DetailStatus.BOUNCED:
            return 'danger';

          default:
            return '';
        }
      };
    },
    chipIcon() {
      return (value) => {
        switch (value) {
          case this.$enums.Campaign.DetailStatus.PENDING:
            return 'ClockIcon';
          case this.$enums.Campaign.DetailStatus.OUTBOUND:
            return 'CheckIcon';
          case this.$enums.Campaign.DetailStatus.BOUNCED:
            return 'XIcon';

          default:
            return '';
        }
      };
    },
  },
};
</script>
