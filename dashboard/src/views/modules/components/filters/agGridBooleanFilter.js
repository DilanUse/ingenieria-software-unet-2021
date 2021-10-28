import Vue from 'vue';
import commonAgGridCustomFilter from '@/views/modules/mixins/commonAgGridCustomFilter';


export default Vue.extend({
  name: 'agGridBooleanFilter',
  template: `
    <div>
      <div class="ag-filter-body-wrapper ag-simple-filter-body-wrapper">
        <ul>
          <li
            v-for="(item,index) in options"
            :key="index">
            <vs-radio v-model="value" :vs-value="item.value">{{ item.text }}</vs-radio>
          </li>
        </ul>
      </div>

      <div class="ag-filter-apply-panel">
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
    </div>

`,
  mixins: [commonAgGridCustomFilter],
  data() {
    return {
      value: null,
      options: [],
    };
  },
  created() {
    if (!this.params.suppressUndeterminedOption) {
      this.options.push({
        text: this.params.undeterminedOptionText || this.$t('$General.Undetermined'),
        value: 'undetermined',
      });
    }

    this.options.push({
      text: this.params.yesOptionText || this.$t('$General.Yes'),
      value: 'yes',
    });

    this.options.push({
      text: this.params.noOptionText || this.$t('$General.No'),
      value: 'no',
    });

    if (this.params.reverseOptions) {
      this.options.reverse();
    }
  },
  methods: {
    applyFilter() {
      if (this.params) {
        this.params.filterChangedCallback();
        this.hideAgPopupFilter();
      }
    },
    resetFilter() {
      if (this.params) {
        this.value = null;
        this.params.filterChangedCallback();
        this.hideAgPopupFilter();
      }
    },
    isFilterActive() {
      return this.value !== null;
    },
    getModel() {
      if (this.isFilterActive()) {
        const filter = {
          filterType: 'boolean',
          filter: this.value,
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
        this.value = model.filter;
      } else {
        this.value = null;
      }

      this.params.filterChangedCallback();
    },
  },
});
