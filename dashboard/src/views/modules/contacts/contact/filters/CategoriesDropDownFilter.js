import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import vSelect from 'vue-select';
import commonAgGridCustomFilter from '@/views/modules/mixins/commonAgGridCustomFilter';
import NameConstructor from '@/views/modules/name.constructor';


export default Vue.extend({
  name: 'CategoriesDropDownFilter',
  template: `
    <div
      id="categories-drop-down-filter-wrapper"
      :class="{'p-3': agGridFloatingFilter}"
      :style="{
        'min-width': (agGridFloatingFilter ? '20rem' : 'auto'),
        'max-width': (agGridFloatingFilter ? '25rem' : 'auto'),
      }">
    <v-select
      v-if="agGridFloatingFilter"
      v-model="condition"
      class="w-full mb-4"
      :options="categoriesConditionOptions.map(c => c.value)"
      :clearable="false"
      :get-option-label="(option) =>
          categoriesConditionOptions.find((s) => s.value === option).label"
      :appendToBody="agGridFloatingFilter">
    </v-select>

      <v-select
        ref="vSelect"
        v-model="selectedCategories"
        class="w-full"
        label="name"
        :placeholder="$t('$ContactModule.SelectCategoriesOptions')"
        :multiple="true"
        :closeOnSelect="false"
        :options="paginated"
        :clearable="false"
        :filterable="false"
        :appendToBody="agGridFloatingFilter"
        @search="(query) => search = query"
        @search:focus="onFocus()">
        <template #header>
          <div style="opacity: .8">{{ header }}</div>
        </template>
        <template #list-header >
          <ul>
            <li v-if="agGridFloatingFilter">
              <div class="flex justify-end">
                <a
                  href="#"
                  @click="resetFilter">
                  {{ $t('$General.Reset') | uppercase }}
                </a>
                <a
                  href="#"
                  class="mx-4"
                  @click="applyFilter">
                  {{ $t('$General.Apply') | uppercase }}
                </a>
              </div>
            </li>
            <li v-else>
              <span v-show="selectedCategories.length > 0">
                <a
                  href="#"
                  @click.prevent="cleanCategories">
                  {{ $t('$General.Clean') }}
                </a>
              </span>
            </li>

            <vs-divider class="my-1"/>
          </ul>
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
           -
          <a
            v-show="$refs.vSelect.search && $refs.vSelect.search.length > 0"
            href="#"
            @click.prevent="addItemToCategory">
            {{ $t('$General.Create') }}
          </a>
        </template>
        <template #list-footer>
          <template v-if="hasPrevPage || hasNextPage">
            <vs-divider class="my-1"/>
            <div class="vue-select-pagination">
              <vs-button
                size="small"
                class="mr-1"
                :disabled="!hasPrevPage"
                @click="offset -= paginationPageSize">
                {{ $t('$General.Prev') }}
              </vs-button>
              <vs-button
                size="small"
                class="ml-1"
                :disabled="!hasNextPage"
                @click="offset += paginationPageSize">
                {{ $t('$General.Next') }}
              </vs-button>
            </div>
          </template>

          <template v-if="userHasPermissionTo($enums.Auth.Permissions.CAMPAIGNS)">
            <vs-divider class="my-1"/>

            <div class="text-center">
              <router-link
                :to="{ name: 'custom-fields' }">
                {{ $t('$ContactModule.ManageAudienceAttributes') }}
              </router-link>
            </div>
          </template>
        </template>
        <template #footer>
          <ul
            v-if="agGridFloatingFilter"
            class="pb-1 mt-4">
            <li>
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
      selectedCategories: [],
      modelCategory: null,
      itemsOptions: [],
      condition: this.$enums.AppFilterOperation.ONE,
      categoriesConditionOptions: Object.values(
        this.$enums.AppFilter.FilterType.Categories.Type,
      ).map((condition) => ({
        label: this.$t(`$AppFilters.$Operation.${condition}`),
        value: condition,
      })),
    };
  },
  computed: {
    ...mapGetters({
      userHasPermissionTo: 'auth/userHasPermissionTo',
    }),
  },
  created() {
    this.fetchCategory();
  },
  methods: {
    ...mapActions({
      fetchAttribute: 'attribute/fetchAttribute',
      addItemToAttribute: 'attribute/addItemToAttribute',
    }),
    async fetchCategory() {
      this.modelCategory = await this.fetchAttribute(this.params.colDef.field);
      this.itemsOptions = this.modelCategory.items;
    },
    async addItemToCategory() {
      const newItem = new NameConstructor(this.$refs.vSelect.search);

      if (this.modelCategory) {
        await this.addItemToAttribute({
          attributeId: this.modelCategory.id,
          payload: newItem,
        });

        this.offset = 0;
        await this.fetchCategory();
      }
    },
    clearSearch() {
      this.$refs.vSelect.search = '';
    },
    cleanCategories() {
      this.selectedCategories = [];
    },
    applyFilter() {
      if (this.params) {
        this.params.filterChangedCallback();
        this.hideAgPopupFilter();
      }
    },
    resetFilter() {
      if (this.params) {
        this.selectedCategories = [];
        this.condition = this.$enums.AppFilter.FilterType.Categories.Type.ONE;
        this.params.filterChangedCallback();
        this.hideAgPopupFilter();
      }
    },
    isFilterActive() {
      return this.selectedCategories.length > 0;
    },
    getModel() {
      if (this.isFilterActive()) {
        return {
          filterType: this.$enums.AppFilterType.CATEGORIES,
          type: this.condition,
          filter: this.selectedCategories,
        };
      }

      return null;
    },
    setModel(model) {
      if (model) {
        this.selectedCategories = model.filter;
        this.condition = model.type;
      } else {
        this.selectedCategories = [];
        this.condition = this.$enums.AppFilter.FilterType.Categories.Type.ONE;
      }

      this.params.filterChangedCallback();
    },
  },
});
