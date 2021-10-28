<template>
  <vs-chip
    v-if="params.value"
    class="ag-grid-cell-chip"
    :color="chipColor">
    <span>
      {{ chipText }}
    </span>
  </vs-chip>
</template>

<script>


export default {
  name: 'ContactListCellRendererMarketingStatus',
  computed: {
    chipColor() {
      if (this.params && this.params.value) {
        switch (this.params.value.value) {
          case this.$enums.Contact.MarketingStatus.SUBSCRIBED:
            return 'success';

          case this.$enums.Contact.MarketingStatus.UNSUBSCRIBED:
            return 'danger';

          default:
            return '';
        }
      }

      return '';
    },
    chipText() {
      if (this.params && this.params.value) {
        return this.$t(`$ContactModule.$MarketingStatus.${this.params.value.value}`);
      }

      return '';
    },
  },
};
</script>
