import Vue from 'vue';
import vSelect from 'vue-select';
import commonAgGridCustomFilter from '@/views/modules/mixins/commonAgGridCustomFilter';


export default Vue.extend({
  name: 'agGridStatusFilter',
  template: `
    <div
      :class="{'p-3': agGridFloatingFilter}"
      :style="{
        'min-width': (agGridFloatingFilter ? '20rem' : 'auto'),
        'max-width': (agGridFloatingFilter ? '25rem' : 'auto'),
      }">
      <v-select
        ref="vSelect"
        v-model="selectedStatus"
        class="w-full"
        label="name"
        :placeholder="$t('$ContactModule.SelectCategoriesOptions') | lowercase"
        :options="statusOptions"
        clearable
        :appendToBody="agGridFloatingFilter">
        <template #header>
          <div style="opacity: .8">{{ header }}</div>
        </template>
        <template #option="{ name }">
          <span :title="name">{{ name | truncateEllipsis(70) }}</span>
        </template>
        <template #selected-option="{ name }">
          <span :title="name">{{ name | truncateEllipsis(15) }}</span>
        </template>
        <template #no-options="{ search, searching, loading }">
          {{ $t('$General.NotFound') }}.
          <a
            v-show="$refs.vSelect.search && $refs.vSelect.search.length > 0"
            href="#"
            @click.prevent="clearSearch">
            {{ $t('$General.Clean') }}
          </a>
        </template>
        <template #footer>
          <ul class="pb-1 mt-4">
            <li v-if="agGridFloatingFilter">
              <div class="ag-filter-apply-panel py-0">
                <button
                  type="button"
                  class="ag-standard-button ag-filter-apply-panel-button"
                  @click="resetFilter">
                  {{ $t('$General.Reset') }}
                </button>
                <button
                  type="button"
                  class="ag-standard-button ag-filter-apply-panel-button"
                  @click="applyFilter">
                  {{ $t('$General.Apply') }}
                </button>
              </div>
            </li>
          </ul>
        </template>
      </v-select>
    </div>`,
  mixins: [commonAgGridCustomFilter],
  components: {
    vSelect,
  },
  data() {
    return {
      selectedStatus: null,
      statusOptions: [],
    };
  },
  created() {
    this.statusOptions = this.params.statusOptions || [];
  },
  methods: {
    clearSearch() {
      this.$refs.vSelect.search = '';
    },
    applyFilter() {
      if (this.params) {
        this.params.filterChangedCallback();
        this.hideAgPopupFilter();
      }
    },
    resetFilter() {
      if (this.params) {
        this.selectedStatus = null;
        this.params.filterChangedCallback();
        this.hideAgPopupFilter();
      }
    },
    isFilterActive() {
      return !!this.selectedStatus;
    },
    getModel() {
      if (this.isFilterActive()) {
        const filter = {
          filterType: this.$enums.AppFilterType.TEXT,
          type: this.$enums.AppFilter.FilterType.Text.Type.EQUALS,
          filter: this.selectedStatus.value,
        };

        if (this.params.filterInner) {
          filter.filterInner = this.params.filterInner;
        }

        return filter;
      }

      return null;
    },
    setModel(model) {
      if (model) {
        this.selectedStatus = model.filter;
      } else {
        this.selectedStatus = null;
      }

      this.params.filterChangedCallback();
    },
  },
});
