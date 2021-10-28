<template>
  <div class="flex flex-wrap items-center justify-between mb-2 md:mb-5 base-ag-grid-header">
    <div class="hidden md:flex flex-wrap w-full md:w-auto justify-between md:justify-start">
      <div class="flex w-full md:w-auto justify-between md:justify-start">
        <slot name="header-left"></slot>
      </div>

      <div
        v-if="rowsSelectedCount > 0 || filtersCount > 0"
        class="flex items-center ml-0 lg:ml-3 pl-0 lg:pl-3
          w-full md:w-auto justify-between md:justify-start mt-6 md:mt-0
          border-0 lg:border-l border-solid border-grey-light">
        <vs-chip
          v-if="rowsSelectedCount > 0"
          color="content-light"
          closable
          class="h-full"
          @click="$emit('reset-selection')">
          <vs-avatar
            icon-pack="feather"
            icon="icon-check"
            color="white"
            badge-color="content"
            size="30px"/>
          <span>{{ rowsSelectedCount }} {{ $t('$General.Selected') | lowercase }}</span>
        </vs-chip>
        <vs-chip
          v-if="filtersCount > 0"
          color="content-light"
          closable
          class="h-full"
          @click="$emit('reset-filters')">
          <vs-avatar
            icon-pack="feather"
            icon="icon-filter"
            color="white"
            badge-color="content"
            size="30px"/>
          <v-select
            v-if="filtersCount > 1"
            ref="vSelect"
            v-model="filtersMatchLocal"
            class="w-auto mr-1 filter-match-select"
            :options="filtersMatchOptions.map((s) => s.value)"
            :get-option-label="(option) =>
          this.filtersMatchOptions.find((s) => s.value === option).label"
            :clearable="false"
            :multiple="false"
            close-on-select>
          </v-select>
          <span>
            {{ $tc('$Components.$BaseAgGridHeader.FiltersChipMsg', filtersCount) | lowercase }}
          </span>
        </vs-chip>
      </div>
    </div>

    <div class="flex w-full md:w-auto justify-between md:justify-end mt-0 md:mt-6 lg:mt-0">
      <slot name="header-right"></slot>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import enums from '@/enums';


export default {
  name: 'BaseAgGridHeader',
  components: {
    vSelect,
  },
  props: {
    rowsSelectedCount: {
      type: Number,
      required: false,
      default: 0,
    },
    filtersCount: {
      type: Number,
      required: false,
      default: 0,
    },
    filtersMatch: {
      type: String,
      required: false,
      default: enums.AppFilter.FilterMathType.ALL,
    },
  },
  data() {
    return {
      filtersMatchLocal: this.filtersMatch,
      filtersMatchOptions: Object.values(
        this.$enums.AppFilter.FilterMathType,
      ).map((type) => ({
        label: this.$t(`$AppFilters.$FilterMatch.${type}`),
        value: type,
      })),
    };
  },
  watch: {
    filtersMatch(val) {
      this.filtersMatchLocal = val;
    },
    filtersMatchLocal(val) {
      this.$emit('update:filters-match', val);
    },
  },
};
</script>

<style lang="scss">
.base-ag-grid-header {
  .filter-match-select {
    min-width: 80px;

    .vs__dropdown-toggle {
      background: rgba(var(--vs-content), 0.7);
      border: none;
      border-radius: initial;

      .vs__selected {
        color: rgba(var(--vs-white), 1);
      }
    }

    .vs__dropdown-option--highlight {
      background: rgba(var(--vs-content), 0.8) !important;
    }
  }

  .con-vs-chip {
    background: rgba(var(--vs-content), 0.8);

    .vs-chip--text {
      font-size: 0.95rem !important;
    }

    .con-vs-avatar {
      .material-icons {
        font-size: 1.2rem !important;
        font-weight: bold;
        color: rgba(var(--vs-content), 0.8) !important;
      }
    }
  }
}
</style>
