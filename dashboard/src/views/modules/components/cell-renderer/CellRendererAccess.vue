<template>
    <vs-chip class="ag-grid-cell-chip" :color="chipColor(params.value)">
      <feather-icon :icon="chipIcon(params.value)" svgClasses="h-5 w-5 mr-1" />
      <span>{{ chipText(params.value) }}</span>
    </vs-chip>
</template>

<script>
// todo: delete this component? It is not use anymore?
export default {
  name: 'CellRendererStatus',
  computed: {
    chipColor() {
      return (value) => (value ? 'success' : 'danger');
    },
    chipText() {
      return (value) => (value ? 'public' : 'private');
    },
    chipIcon() {
      return (value) => (value ? 'Share2Icon' : 'LockIcon');
    },
  },
};
</script>
