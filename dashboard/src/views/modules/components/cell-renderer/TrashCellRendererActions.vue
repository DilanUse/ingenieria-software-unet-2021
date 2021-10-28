<template>
  <span>
    <vx-tooltip
      color="warning"
      :text="$t('$General.Restore') | lowercase"
      position="top"
      class="inline-block">
      <feather-icon
        v-if="trash"
        icon="RotateCcwIcon"
        :svgClasses="getClasses(initialPosition, 'warning')"
        @click="$emit('restore')"/>
    </vx-tooltip>
    <common-cell-renderer-actions
      :initial-position="posActions"
      :view-disabled="trash || viewDisabled"
      :edit-disabled="trash || editDisabled"
      :delete-disabled="deleteDisabled"
      :clone-disabled="trash || cloneDisabled"
      @view="$emit('view')"
      @edit="$emit('edit')"
      @clone="$emit('clone')"
      @delete="$emit('delete')">
    </common-cell-renderer-actions>
  </span>
</template>

<script>
import CommonCellRendererActions from '@/views/modules/components/cell-renderer/CommonCellRendererActions.vue';
import commonCellRendererActions from '@/views/modules/mixins/commonCellRendererActions';

export default {
  components: {
    CommonCellRendererActions,
  },
  mixins: [commonCellRendererActions],
  name: 'TrashCellRendererActions',
  props: {
    trash: {
      type: Boolean,
      required: true,
    },
    viewDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    editDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    cloneDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    deleteDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    posActions() {
      return this.trash ? this.initialPosition + 1 : this.initialPosition;
    },
  },
};
</script>
