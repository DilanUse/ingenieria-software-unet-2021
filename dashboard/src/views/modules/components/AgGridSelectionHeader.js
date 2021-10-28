import Vue from 'vue';


export default Vue.extend({
  name: 'AgGridSelectionHeader',
  template: `
    <div class="flex items-center">
      <div
        v-if="params.checkboxSelection"
        class="flex mr-3">
        <vs-checkbox
          v-model="selected"
          icon-pack="feather"
          :icon="rowsSelectedAreReallyAll || selectedAllRows ? 'icon-check' : 'icon-minus'"
          class="mx-0"
          @click="onClickCheckbox(selected ? 'none' : 'page')"/>
        <vs-dropdown
          vs-trigger-click
          class="cursor-pointer">
          <feather-icon
            icon="ChevronDownIcon"
            svgClasses="h-4 w-4" />
          <vs-dropdown-menu>
            <vs-dropdown-item
              v-for="(option, index) in selectionOptionsByResolution"
              :key="index"
              @click="onClickDropDownCheckbox(option.event)">
              {{ option.label }}
            </vs-dropdown-item>

            <vs-dropdown-group
              v-if="actionOptionsByResolution.length > 0 && isAnyRowsSelectedOrAll"
              :vs-label="$tc('$General.Action', 2)">
              <vs-dropdown-item
                v-for="(option, index) in actionOptionsByResolution"
                :key="index"
                @click="makeActionInComponentParent(option.event)">
                {{ option.label }}
              </vs-dropdown-item>
            </vs-dropdown-group>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <span :class="{ 'ag-grid-header-tooltip': !!params.tooltipText }">
        <vx-tooltip
          v-if="params.tooltipText"
          :text="params.tooltipText">
          <a v-if="params.tooltipUrl"
             :href="params.tooltipUrl"
             target="_blank">
            <feather-icon
              :icon="params.tooltipIcon || 'InfoIcon'"
              class="ml-2"
              svgClasses="h-4 w-4"/>
          </a>
          <feather-icon
            v-else
            icon="InfoIcon"
            class="ml-2"
            svgClasses="h-4 w-4"/>
        </vx-tooltip>
        <abbr
          v-if="params.abbr"
          :title="params.abbr">
          {{ params.displayName }}
        </abbr>
        <template v-else>
          {{ params.displayName }}
        </template>
      </span>

      <feather-icon
        v-show="filter"
        icon="FilterIcon"
        class="ml-2"
        svgClasses="h-4 w-4"/>
      <feather-icon
        v-if="params.enableSorting"
        icon="ArrowUpIcon"
        :class="{ 'opacity-50': !ascSort}"
        class="ml-2"
        svgClasses="h-4 w-4"
        @click="onSortRequested('asc', $event)"/>
      <feather-icon
        v-if="params.enableSorting"
        icon="ArrowDownIcon"
        :class="{ 'opacity-50': !descSort}"
        svgClasses="h-4 w-4"
        @click="onSortRequested('desc', $event)"/>
    </div>
  `,
  data() {
    return {
      ascSort: false,
      descSort: false,
      filter: false,
      selected: false,
      selectionOptions: [
        {
          label: this.$t('$General.All'),
          event: 'all',
        },
        {
          label: this.$t('$General.None'),
          event: 'none',
        },
        {
          label: this.$t('$General.CurrentPage'),
          event: 'page',
        },
      ],
    };
  },
  computed: {
    isAnyRowsSelectedOrAll() {
      return this.params.context.componentParent.isAnyRowsSelectedOrAll;
    },
    rowsSelectedCount() {
      return this.params.context.componentParent.rowsSelectedCount;
    },
    rowsSelectedAreReallyAll() {
      return this.params.context.componentParent.rowsSelectedAreReallyAll;
    },
    selectedAllRows() {
      return this.params.context.componentParent.selectedAllRows;
    },
    actionOptions() {
      return this.params.context.componentParent.allActionOptions
        || this.params.context.componentParent.actionOptions
        || [];
    },
    actionOptionsByResolution() {
      return this.$mq === 'mobile' ? this.actionOptions : [];
    },
    selectionOptionsByResolution() {
      return this.$mq === 'mobile' ? this.selectionOptions.slice(0, 2) : this.selectionOptions;
    },
  },
  watch: {
    rowsSelectedCount(newVal) {
      this.selected = newVal > 0;
    },
  },
  mounted() {
    this.params.column.addEventListener('sortChanged', this.onSortChanged);
    this.params.column.addEventListener('filterChanged', this.onFilterChanged);
    this.onSortChanged();
    this.onFilterChanged();
  },
  methods: {
    makeActionInComponentParent(action = '') {
      this.params.context.componentParent.actionFromHeaderSelectionFunction(action);
    },
    onSortChanged() {
      this.ascSort = false;
      this.descSort = false;

      if (this.params.column.isSortAscending()) {
        this.ascSort = true;
      } else if (this.params.column.isSortDescending()) {
        this.descSort = true;
      }
    },
    onFilterChanged() {
      this.filter = this.params.column.isFilterActive();
    },
    onSortRequested(order, event) {
      let orderToApply = order;

      if ((order === 'asc' && this.ascSort) || (order === 'desc' && this.descSort)) {
        orderToApply = '';
      }

      this.params.setSort(orderToApply, event.shiftKey);
    },
    onSelection(selection = 'all', fromCheckbox = false) {
      this.params.context.componentParent.selectFromHeader(selection, fromCheckbox);
    },
    onClickCheckbox(selection) {
      this.onSelection(selection, true);
    },
    onClickDropDownCheckbox(selection = 'all') {
      this.selected = selection === 'all' || selection === 'page';
      this.onSelection(selection);
    },
  },
});
