
export default {
  props: {
    items: {
      type: Array,
      required: false,
      default() {
        return null;
      },
      validator(items) {
        return items.every((t) => typeof t === 'object'
          && 'id' in t && 'name' in t);
      },
    },
    showMaximum: {
      type: Number,
      required: false,
      default: 3,
    },
    showClear: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      itemsLocal: [],
    };
  },
  computed: {
    firstItems() {
      if (this.itemsLocal && Array.isArray(this.itemsLocal)
        && this.itemsLocal.length > this.showMaximum) {
        return this.itemsLocal.slice(0, this.showMaximum);
      }

      return this.itemsLocal;
    },
    lastItems() {
      if (this.itemsLocal && Array.isArray(this.itemsLocal)
        && this.itemsLocal.length > this.showMaximum) {
        return this.itemsLocal.slice(this.showMaximum);
      }

      return this.itemsLocal;
    },
  },
  watch: {
    items(newVal) {
      this.itemsLocal = newVal === null ? this.params.value : newVal;
    },
  },
  created() {
    this.itemsLocal = this.items === null ? this.params.value : this.items;
  },
};
