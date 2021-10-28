<template>
  <common-cell-renderer-actions
    :actions="filteredActionsByOptOut"
    @restore="restore()"
    @view="viewRecord()"
    @clone="cloneRecord()"
    @edit="editRecord()"
    @delete="confirmDeleteRecord()">
  </common-cell-renderer-actions>
</template>

<script>
import CommonCellRendererActions from '@/views/modules/components/cell-renderer/CommonCellRendererActions.vue';
import commonSingleCellRendererActions from '@/views/modules/mixins/commonSingleCellRendererActions';


export default {
  name: 'ContactListCellRendererActions',
  components: {
    CommonCellRendererActions,
  },
  mixins: [commonSingleCellRendererActions],
  computed: {
    isOptOut() {
      return this.params
        ? this.params.data.marketingStatus.value
        === this.$enums.Contact.MarketingStatus.UNSUBSCRIBED
        : false;
    },
    filteredActionsByOptOut() {
      if (this.isOptOut) {
        return this.filteredActionsFromParent.filter((action) => ![
          this.$enums.Operation.EDIT,
          this.$enums.Operation.DELETE,
        ].includes(action.name));
      }

      return this.filteredActionsFromParent;
    },
  },
  methods: {
    restore() {
      this.params.context.componentParent.confirmRestoreRecord(this.params.node.data);
    },
  },
};
</script>
