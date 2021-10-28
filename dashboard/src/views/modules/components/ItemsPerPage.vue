<template>
  <div class="flex">
    <vs-dropdown
      vs-trigger-click
      class="cursor-pointer">
      <div class="p-3 border border-solid d-theme-border-grey-light rounded-full
      d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
        <span class="mr-2">
          {{ from }} - {{ to }} {{ (!indeterminate ? $t('$General.Of') : '') | lowercase }}
          {{ !indeterminate ? count : '' }}
        </span>
        <feather-icon
          icon="ChevronDownIcon"
          svgClasses="h-4 w-4" />
      </div>

      <vs-dropdown-menu>
        <vs-dropdown-item
          v-for="size in pageSizeOptions"
          :key="size"
          @click="$emit('changed-page-size', size)">
          <span>{{ size }}</span>
        </vs-dropdown-item>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>

export default {
  name: 'ItemPerPage',
  props: {
    count: {
      type: Number,
      required: false,
      default: 0,
    },
    indeterminate: {
      type: Boolean,
      required: false,
      default: false,
    },
    pageSizeOptions: {
      type: Array,
      required: false,
      default() {
        return [10, 25, 50, 100];
      },
      validator(value) {
        return value.every((v) => Number.isInteger(v));
      },
    },
    currentPage: {
      type: Number,
      required: true,
    },
    paginationPageSize: {
      type: Number,
      required: true,
    },
  },
  computed: {
    from() {
      return this.currentPage * this.paginationPageSize - (this.paginationPageSize - 1);
    },
    to() {
      return this.count - (this.currentPage * this.paginationPageSize) > 0 || this.indeterminate
        ? this.currentPage * this.paginationPageSize
        : this.count;
    },
  },
};
</script>
