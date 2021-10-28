<template>
  <common-cell-renderer-actions
    :actions="filteredActionsFromParent"
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
  name: 'SingleCellRendererActions',
  components: {
    CommonCellRendererActions,
  },
  mixins: [commonSingleCellRendererActions],
};
</script>
