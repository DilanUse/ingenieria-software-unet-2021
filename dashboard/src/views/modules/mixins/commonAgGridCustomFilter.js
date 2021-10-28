
export default {
  props: {
    header: {
      type: String,
      required: false,
      default: null,
    },
    agGridFloatingFilter: {
      type: Boolean,
      required: false,
      default: true,
    },
    paginationPageSize: {
      type: Number,
      required: false,
      default: 5,
    },
  },
  data() {
    return {
      itemsOptions: [],
      search: '',
      offset: 0,
      limit: this.paginationPageSize,
    };
  },
  computed: {
    filtered() {
      return this.itemsOptions.filter((t) => t.name.includes(this.search));
    },
    paginated() {
      return this.filtered.slice(this.offset, this.limit + this.offset);
    },
    hasNextPage() {
      const nextOffset = this.offset + this.paginationPageSize;
      return Boolean(
        this.filtered.slice(nextOffset, this.limit + nextOffset).length,
      );
    },
    hasPrevPage() {
      const prevOffset = this.offset - this.paginationPageSize;
      return Boolean(
        this.filtered.slice(prevOffset, this.limit + prevOffset).length,
      );
    },
  },
  methods: {
    onFocus() {
      if (this.agGridFloatingFilter) {
        setTimeout(() => {
          const $dropDown = this.$refs.vSelect.$el.querySelector('.vs__dropdown-toggle');
          const dropdownListId = $dropDown.getAttribute('aria-owns');
          const $dropdownList = document.querySelector(`#${dropdownListId}`);
          $dropdownList.classList.add('ag-custom-component-popup');
        });
      }
    },
    hideAgPopupFilter() {
      document.querySelector('.ag-theme-material.ag-popup').classList.add('hidden');
    },
  },
};
