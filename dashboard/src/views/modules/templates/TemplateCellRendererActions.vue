<template>
  <common-cell-renderer-actions
    :actions="filteredActionsFromParent"
    @restore="restore()"
    @send="sendCampaign()"
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
  components: {
    CommonCellRendererActions,
  },
  mixins: [commonSingleCellRendererActions],
  name: 'TemplateCellRendererActions',
  computed: {
  },
  methods: {
    restore() {
      this.params.context.componentParent.confirmRestoreRecord(this.params.node.data);
    },
    sendCampaign() {
      this.params.context.componentParent.sendCampaignFromTemplateFunction(this.params.node.data);
    },
  },
};
</script>
