<template>
  <v-select
    ref="vSelect"
    v-model="selectedItems"
    class="v-select-server w-full"
    :label="label"
    :placeholder="placeholder"
    :multiple="multiple"
    :taggable="taggable"
    :createOption="createOption"
    :closeOnSelect="closeOnSelect"
    :options="allOptions"
    :clearable="clearable"
    :filterable="false"
    :loading="loading"
    :selectable ="selectable"
    @search="(query) => search = query"
    @input="$emit('input', selectedItems)"
    @search:blur="makeSearch(true)">
    <template #spinner="{ loading }">
      <div
        v-if="loading"
        class="vs__spinner">
      </div>
    </template>
    <template
      v-if="header"
      #header>
      <div style="opacity: .8">{{ header }}</div>
    </template>
    <template #list-header >
      <ul v-show="isFilterActive || search.length > 0">
        <li class="text-center">
          <div class="vue-select-pagination">
            <vs-button
              size="small"
              icon-pack="feather"
              icon="icon-refresh-cw"
              class="mx-1"
              :disabled="!isFilterActive"
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
    </template>
    <template #option="item">
      <span
        v-if="optionEmphasis && item[optionEmphasis]"
        :title="item.name">
        {{ `${item.name} (${item[optionEmphasis]})` | truncateEllipsis(70) }}
      </span>
      <span
        v-else
        :title="item.name">
        {{ `${item.name}` | truncateEllipsis(70) }}
      </span>
    </template>
    <template #selected-option="item">
      <span
        v-if="optionEmphasis && item[optionEmphasis]"
        :title="item.name">
        {{ `${item.name} (${item[optionEmphasis]})` | truncateEllipsis(70) }}
      </span>
      <span
        v-else
        :title="item.name">
        {{ `${item.name}` | truncateEllipsis(70) }}
      </span>
    </template>
    <template #no-options="{ search, searching, loading }">
      {{ $t('$General.NotFound') }}
      <template v-if="!permissionToManage || userHasPermissionTo(permissionToManage)">
        <span>
          -
          <a
            href="#"
            @click.prevent="$emit('create', $refs.vSelect.search)">
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

      <template v-if="manageRouteName
        && manageText
        && (!permissionToManage || userHasPermissionTo(permissionToManage))">
        <vs-divider class="my-1"/>

        <div class="text-center">
          <a
            href="#"
            @click="manageCollection()">
            {{ manageText }}
          </a>
        </div>
      </template>
    </template>
  </v-select>
</template>

<script>
import vSelect from 'vue-select';
import commonVSelect from '@/views/modules/mixins/commonVSelect';
import { mapGetters } from 'vuex';
import enums from '@/enums';

export default {
  name: 'VSelectServer',
  components: {
    vSelect,
  },
  mixins: [commonVSelect],
  props: {
    value: {
      required: true,
    },
    fetchFunction: {
      type: Function,
      required: true,
    },
    header: {
      type: String,
      required: false,
      default: null,
    },
    label: {
      type: String,
      required: false,
      default: 'name',
    },
    paginationPageSize: {
      type: Number,
      required: false,
      default: 5,
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true,
    },
    taggable: {
      type: Boolean,
      required: false,
      default: false,
    },
    createOption: {
      type: Function,
      required: false,
      default(newOption) {
        if (typeof this.optionList[0] === 'object') {
          // eslint-disable-next-line no-param-reassign
          newOption = { [this.label]: newOption };
        }

        this.$emit('option:created', newOption);
        return newOption;
      },
    },
    selectable: {
      type: Function,
      required: false,
      default: () => true,
    },
    closeOnSelect: {
      type: Boolean,
      required: false,
      default: false,
    },
    optionEmphasis: {
      type: String,
      required: false,
      default: '',
    },
    manageRouteName: {
      type: String,
      required: false,
      default: '',
    },
    manageText: {
      type: String,
      required: false,
      default: '',
    },
    filterParams: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    sortByField: {
      type: String,
      required: false,
      default: 'createdAt',
    },
    sortByOrder: {
      type: String,
      required: false,
      default: enums.AppSortBy.DESC,
      validator(val) {
        return [
          enums.AppSortBy.ASC,
          enums.AppSortBy.DESC,
        ].indexOf(val) !== -1;
      },
    },
    defaultOptions: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    permissionToManage: {
      type: String,
      required: false,
      default: '',
    },
    manageRedirectOnlyEvent: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      selectedItems: this.value,
      serverOptions: [],
      countServerOptions: 0,
      search: '',
      offset: 0,
      page: 0,
      isFilterActive: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      userHasPermissionTo: 'auth/userHasPermissionTo',
    }),
    countDefaultOptions() {
      return this.defaultOptions.length;
    },
    defaultOptionsFiltered() {
      if (this.countDefaultOptions > 0 && this.isFilterActive) {
        const regex = new RegExp(this.search, 'gi');
        return this.defaultOptions.filter((option) => option.name.match(regex));
      }

      return this.defaultOptions;
    },
    countDefaultOptionsFiltered() {
      return this.defaultOptionsFiltered.length;
    },
    defaultOptionPagesCount() {
      return Math.ceil(this.countDefaultOptionsFiltered / this.paginationPageSize);
    },
    defaultOptionsLastPage() {
      return this.defaultOptionPagesCount - 1;
    },
    defaultOptionsOffsetByPageSize() {
      return this.defaultOptionPagesCount * this.paginationPageSize;
    },
    defaultOptionsLastPageFreeSpaces() {
      return this.defaultOptionsOffsetByPageSize - this.countDefaultOptionsFiltered;
    },
    defaultOptionsInCurrentPage() {
      if (this.defaultOptionsLastPage >= 0) {
        const offset = this.page * this.paginationPageSize;

        if (this.defaultOptionsLastPage > this.page) {
          return this.defaultOptionsFiltered.slice(offset, this.paginationPageSize);
        }

        if (this.defaultOptionsLastPage === this.page) {
          return this.defaultOptionsFiltered.slice(offset, this.countDefaultOptionsFiltered);
        }
      }

      return [];
    },
    totalCount() {
      return this.countServerOptions + this.countDefaultOptionsFiltered;
    },
    totalPagesCount() {
      return Math.ceil(this.totalCount / this.paginationPageSize);
    },
    lastPage() {
      return this.totalPagesCount - 1;
    },
    offsetToAddOrSubtract() {
      if (this.defaultOptionsLastPage >= 0) {
        if (this.defaultOptionsLastPage >= this.page) {
          return 0;
        }

        if (this.page - this.defaultOptionsLastPage === 1) {
          return this.defaultOptionsLastPageFreeSpaces;
        }
      }

      return this.paginationPageSize;
    },
    limit() {
      if (this.defaultOptionsLastPage >= 0) {
        if (this.defaultOptionsLastPage > this.page) {
          return 1;
        }

        if (this.defaultOptionsLastPage === this.page) {
          return this.defaultOptionsLastPageFreeSpaces;
        }
      }

      return this.paginationPageSize;
    },
    hasNextPage() {
      return this.page < this.lastPage;
    },
    hasPrevPage() {
      return this.page > 0;
    },
    filter() {
      return !this.isFilterActive
        ? this.filterParams
        : {
          name: {
            filterType: 'text',
            type: 'contains',
            filter: this.search,
          },
          ...this.filterParams,
        };
    },
    allOptions() {
      return [
        ...this.defaultOptionsInCurrentPage,
        ...this.serverOptions,
      ].slice(0, this.paginationPageSize);
    },
  },
  created() {
    this.fetchData();
  },
  watch: {
    value() {
      this.selectedItems = this.value;
    },
  },
  methods: {
    async fetchData() {
      const data = await this.fetchFunction({
        sortBy: [{ colId: this.sortByField, sort: this.sortByOrder }],
        filters: this.filter,
        skip: this.offset,
        limit: this.limit,
      });

      this.countServerOptions = data.count;
      this.serverOptions = data.data;
    },
    async makeSearch(reset = false) {
      this.loading = true;

      if (reset) {
        this.clearSearch();
      }

      this.isFilterActive = !reset;
      await this.fetchData();
      this.loading = false;
    },
    clearSearch() {
      this.$refs.vSelect.search = '';
    },
    async nextPage() {
      this.loading = true;
      this.page += 1;
      this.offset += this.offsetToAddOrSubtract;
      await this.fetchData();
      this.loading = false;
    },
    async prevPage() {
      this.loading = true;
      this.offset -= this.offsetToAddOrSubtract;
      this.page -= 1;
      await this.fetchData();
      this.loading = false;
    },
    manageCollection() {
      this.$emit('redirect', this.manageRouteName);

      if (!this.manageRedirectOnlyEvent) {
        const $this = this;
        setTimeout(() => {
          $this.$router.push({ name: this.manageRouteName });
        }, 0);
      }
    },
  },
};
</script>

<style lang="scss">
.v-select-server {
  .vs__spinner {
    border-left-color: rgba(var(--vs-primary), 1);
  }
}
</style>
