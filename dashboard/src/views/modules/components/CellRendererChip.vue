<template>
    <vs-chip
      class="ag-grid-cell-chip"
      :color="chipColor">
      <feather-icon
        :icon="chipIcon"
        svgClasses="h-5 w-5 mr-1" />
      <span>{{ chipText }}</span>
    </vs-chip>
</template>

<script>


export default {
  name: 'CellRendererChip',
  props: {
    options: {
      type: Array,
      required: true,
      validator(data) {
        return data.every((obj) => ('value' in obj)
          && ('text' in obj)
          && ('color' in obj)
          && ('icon' in obj));
      },
    },
    selectedOption: {
      type: [Boolean, String, Number],
      required: true,
    },
  },
  computed: {
    chipColor() {
      return this.options.find((d) => d.value === this.selectedOption).color;
    },
    chipText() {
      return this.options.find((d) => d.value === this.selectedOption).text;
    },
    chipIcon() {
      return this.options.find((d) => d.value === this.selectedOption).icon;
    },
  },
};
</script>
