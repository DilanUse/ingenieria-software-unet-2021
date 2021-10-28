<template>
  <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
    <common-cell-renderer-actions
      @view="viewRecord"
      @edit="editRecord"
      @delete="confirmDeleteRecord">
    </common-cell-renderer-actions>
  </div>
</template>

<script>
import commonMultipleCellRendererActions from '../../mixins/commonMultipleCellRendererActions';

export default {
  mixins: [commonMultipleCellRendererActions],
  name: 'CellRendererActions',
};
</script>
