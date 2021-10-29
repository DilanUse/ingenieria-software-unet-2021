<template>
  <common-cell-renderer-actions
    :actions="filteredActionsByStatus"
    @check="verifySenderId()"
    @view="viewRecord()"
    @clone="cloneRecord()"
    @edit="editRecord()"
    @delete="confirmDeleteRecord()">
  </common-cell-renderer-actions>
</template>

<script>
import commonSingleCellRendererActions from '@/views/modules/mixins/commonSingleCellRendererActions';
import CommonCellRendererActions from '@/views/modules/components/cell-renderer/CommonCellRendererActions.vue';


export default {
  components: {
    CommonCellRendererActions,
  },
  mixins: [commonSingleCellRendererActions],
  name: 'SenderIdCellRendererActions',
  computed: {
    isVerified() {
      return this.params.data.status === this.$enums.Sender.Status.VERIFIED;
    },
    filteredActionsByStatus() {
      if (this.isVerified) {
        return this.filteredActionsFromParent.filter(
          (action) => action.name !== 'check',
        );
      }

      return this.filteredActionsFromParent;
    },
  },
  methods: {
    verifySenderId() {
      this.params.context.componentParent.recordToVerify = this.params.data;
      this.params.context.componentParent.activeModalVerify = true;
    },
  },
};
</script>
