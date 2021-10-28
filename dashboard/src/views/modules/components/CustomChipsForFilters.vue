<template>
  <div>
    <vs-chip
      v-if="collection.length > 0"
      closable
      @click="remove">
      {{ collection.length }} {{ localTitle | lowercase }}
    </vs-chip>
  </div>
</template>

<script>

export default {
  name: 'CustomChipsForFilters',
  props: {
    collection: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      required: false,
      default: '$General.Item',
    },
  },
  computed: {
    localTitle() {
      if (this.collection.length > 1) {
        return this.$tc(this.title, 2);
      }

      return this.$tc(this.title, 1);
    },
  },
  methods: {
    remove() {
      this.$emit('removed');
    },
  },
};
</script>
