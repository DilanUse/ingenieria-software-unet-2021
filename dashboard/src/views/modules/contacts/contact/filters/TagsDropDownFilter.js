import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import vSelect from 'vue-select';
import NameConstructor from '@/views/modules/name.constructor';
import commonAgGridCustomFilter from '@/views/modules/mixins/commonAgGridCustomFilter';


export default Vue.extend({
  name: 'TagsDropDownFilter',
  template: `
    <div
      id="tags-drop-down-filter-wrapper"
      :class="{'p-3': agGridFloatingFilter}"
      :style="{
        'min-width': (agGridFloatingFilter ? '20rem' : 'auto'),
        'max-width': (agGridFloatingFilter ? '25rem' : 'auto'),
      }">
      <v-select
        v-if="agGridFloatingFilter"
        v-model="condition"
        class="w-full mb-4"
        :options="filterConditionOptions.map(c => c.value)"
        :clearable="false"
        :get-option-label="(option) =>
          filterConditionOptions.find((s) => s.value === option).label"
        :appendToBody="agGridFloatingFilter">
      </v-select>

      <v-select
        ref="vSelect"
        v-model="selectedTagsLocal"
        :disabled="disabled"
        class="w-full"
        label="name"
        :placeholder="$t('$ContactModule.SelectTags')"
        :multiple="true"
        :closeOnSelect="false"
        :options="options"
        :filterable="false"
        :appendToBody="agGridFloatingFilter"
        @search="(query) => search = query"
        @input="selectedTagsChanged"
        @search:focus="onFocus()">
        <template
          v-if="header"
          #header>
          <div style="opacity: .8">{{ header }}</div>
        </template>
        <template #list-header>
          <ul
            v-show="isSearchActive || search.length > 0"
            @click.prevent.stop>
            <li
              class="text-center">
              <div class="vue-select-pagination">
                <vs-button
                  size="small"
                  icon-pack="feather"
                  icon="icon-refresh-cw"
                  class="mx-1"
                  :disabled="!isSearchActive"
                  @click="makeSearch(true)">
                  {{ $t('$General.ResetSearch') }}
                </vs-button>
                <vs-button
                  size="small"
                  icon-pack="feather"
                  icon="icon-search"
                  class="ml-1"
                  :disabled="search.length === 0"
                  @click="makeSearch()">
                  {{ $t('$General.Search') }}
                </vs-button>
              </div>
            </li>
            <vs-divider class="my-1"/>
          </ul>
          <ul
            v-if="agGridFloatingFilter">
            <li>
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
          {{ $t('$General.NotFound') }}
          <template v-if="userHasPermissionTo($enums.Auth.Permissions.CAMPAIGNS)">
            <span v-show="$refs.vSelect.search && $refs.vSelect.search.length > 0">
              -
              <a
                href="#"
                @click.prevent="addTag">
                {{ $t('$General.Create') }}
              </a>
            </span>
          </template>
        </template>
        <template #list-footer>
          <template v-if="hasPrevPage || hasNextPage">
            <vs-divider class="my-1"/>
            <div class="vue-select-pagination">
              <vs-button
                size="small"
                class="mr-1"
                icon-pack="feather"
                icon="icon-chevron-left"
                :disabled="!hasPrevPage"
                @click="prevPage()">
                {{ $t('$General.Prev') }}
              </vs-button>
              <vs-button
                size="small"
                class="ml-1"
                icon-pack="feather"
                icon="icon-chevron-right"
                icon-after
                :disabled="!hasNextPage"
                @click="nextPage()">
                {{ $t('$General.Next') }}
              </vs-button>
            </div>
          </template>

          <template v-if="userHasPermissionTo($enums.Auth.Permissions.CAMPAIGNS)">
            <vs-divider class="my-1"/>

            <div class="text-center">
              <a
                href="#"
                @click="manageAudienceTags()">
                {{ $t('$ContactModule.ManageAudienceTags') }}
              </a>
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
  props: {
    selectedTags: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    manageRedirectOnlyEvent: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      selectedTagsLocal: this.selectedTags,
      options: [],
      condition: this.$enums.AppFilterOperation.ONE,
      count: 0,
      search: '',
      offset: 0,
      isSearchActive: false,
      filterConditionOptions: Object.values(
        this.$enums.AppFilter.FilterType.Tags.Type,
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
    hasNextPage() {
      const nextOffset = this.offset + this.paginationPageSize;
      return this.count > nextOffset;
    },
    hasPrevPage() {
      const prevOffset = this.offset - this.paginationPageSize;
      return prevOffset >= 0;
    },
    filter() {
      return !this.isSearchActive ? {} : {
        name: {
          filterType: 'text',
          type: 'contains',
          filter: this.search,
        },
      };
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions({
      fetchAllTags: 'tag/fetchAllTags',
      addTagToSelectedAudience: 'tag/addTag',
    }),
    async fetchData(filters = {}) {
      const data = await this.fetchAllTags({
        sortBy: [{ colId: 'createdAt', sort: 'desc' }],
        filters,
        skip: this.offset,
        limit: this.paginationPageSize,
      });

      this.count = data.count;
      this.options = data.data;
    },
    makeSearch(reset = false) {
      if (reset) {
        this.clearSearch();
      }

      this.isSearchActive = !reset;
      this.fetchData(this.filter);
    },
    nextPage() {
      this.offset += this.paginationPageSize;
      this.fetchData(this.filter);
    },
    prevPage() {
      this.offset -= this.paginationPageSize;
      this.fetchData(this.filter);
    },
    manageAudienceTags() {
      this.$emit('redirect', 'tags');

      if (!this.manageRedirectOnlyEvent) {
        const $this = this;
        setTimeout(() => {
          $this.$router.push({ name: 'tags' });
        }, 0);
      }
    },
    async addTag() {
      const newTag = new NameConstructor(this.$refs.vSelect.search);
      await this.addTagToSelectedAudience(newTag);
      this.offset = 0;
      this.makeSearch(true);
    },
    clearSearch() {
      this.$refs.vSelect.search = '';
    },
    cleanTags() {
      this.selectedTagsLocal = [];
    },
    selectedTagsChanged() {
      this.$emit('update:selected-tags', this.selectedTagsLocal);
    },
    applyFilter() {
      if (this.params) {
        this.params.filterChangedCallback();
        this.hideAgPopupFilter();
      }
    },
    resetFilter() {
      if (this.params) {
        this.selectedTagsLocal = [];
        this.condition = this.$enums.AppFilter.FilterType.Categories.Type.ONE;
        this.params.filterChangedCallback();
        this.hideAgPopupFilter();
      }
    },
    isFilterActive() {
      return this.selectedTagsLocal.length > 0;
    },
    getModel() {
      if (this.isFilterActive()) {
        return {
          filterType: this.$enums.AppFilterType.TAGS,
          type: this.condition,
          filter: this.selectedTagsLocal,
        };
      }

      return null;
    },
    setModel(model) {
      if (model) {
        this.selectedTagsLocal = [...model.filter];
        this.condition = model.type;
      } else {
        this.selectedTagsLocal = [];
        this.condition = this.$enums.AppFilter.FilterType.Categories.Type.ONE;
      }

      this.params.filterChangedCallback();
    },
  },
});
