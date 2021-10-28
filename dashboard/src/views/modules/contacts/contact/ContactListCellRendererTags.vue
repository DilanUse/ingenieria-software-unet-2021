<template>
  <div class="ag-grid-cell-container">
    <vs-chip
      v-for="tag in firstItems"
      :key="tag.id"
      class="ag-grid-cell-tag">
      <span :title="tag.name">{{ tag.name | truncateEllipsis(15) }}</span>
    </vs-chip>

    <vs-dropdown
      v-if="itemsLocal.length > showMaximum"
      class="cursor-pointer"
      vs-custom-content
      vs-trigger-click>
      <a class="flex items-center cursor-pointer ml-2" href.prevent>
        <span>{{ $t('$ContactModule.ShowMoreItemCellRenderers', {
          count: itemsLocal.length - showMaximum
        })}}</span>
      </a>

      <vs-dropdown-menu>
        <span
          v-for="(tag, index) in lastItems"
          :key="tag.id"
          class="text-primary">
          {{ tag.name }}<span v-if="index !== lastItems.length - 1"> - </span>
        </span>
      </vs-dropdown-menu>
    </vs-dropdown>

    <vx-tooltip
      color="danger"
      :text="$t('$General.Reset') | lowercase"
      class="inline-block" >
      <vs-button
        v-if="showClear && itemsLocal.length > 0"
        radius
        color="danger"
        size="small"
        type="flat"
        icon-pack="feather"
        icon="icon-x"
        class="ml-4"
        @click="$emit('clear')"></vs-button>
    </vx-tooltip>
  </div>

</template>

<script>
import commonCellRendererItems from '@/views/modules/mixins/commonCellRendererItems';

export default {
  name: 'ContactListCellRendererTags',
  mixins: [commonCellRendererItems],
};
</script>

<style lang="scss" scoped>
  .ag-grid-cell-container {
    display: flex;
    height: 100%;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;

    .ag-grid-cell-tag {
      background: rgba(var(--vs-primary),.15);
      color: rgba(var(--vs-primary),1) !important;
      font-weight: 500;
      line-height: 1;
      margin-bottom: 0;
      min-width: 50px;
      margin-right: 0.2rem;
      margin-left: 0.2rem;
    }
  }
</style>
