<template>
  <div class="ag-grid-cell-container">
    <span>{{ firstCategories | truncateEllipsis(100)  }}</span>

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
        <span>{{ lastCategories }}</span>
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
  name: 'ContactListCellRendererCategories',
  mixins: [commonCellRendererItems],
  computed: {
    firstCategories() {
      return this.firstItems.map((category) => category.name).toString().replace(/,/g, ', ');
    },
    lastCategories() {
      return this.lastItems.map((category) => category.name).toString().replace(/,/g, ', ');
    },
  },
};
</script>

<style lang="scss" scoped>
  .ag-grid-cell-container {
    display: flex;
    height: 100%;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
  }
</style>
