<template>
    <vs-chip
      v-if="params.value"
      class="ag-grid-cell-chip"
      :color="chipColor(params.value)">
      <feather-icon
        :icon="chipIcon(params.value)"
        svgClasses="h-5 w-5 mr-1" />
      <span>
        <a
          href="#"
          :class="[
            `text-${chipColor(params.value)}`,
            this.isVerified ? 'pointer-events-none' : ''
          ]"
          @click="verifySenderId()">
          {{ $t(`$SenderIdsModules.$Status.${params.value}`) }}
        </a>
      </span>
    </vs-chip>
</template>

<script>

export default {
  name: 'SenderIdCellRendererStatus',
  computed: {
    chipColor() {
      return (value) => (value === this.$enums.Sender.Status.VERIFIED ? 'success' : 'danger');
    },
    chipIcon() {
      return (value) => (value === this.$enums.Sender.Status.VERIFIED ? 'CheckCircleIcon' : 'XOctagonIcon');
    },
    isVerified() {
      return this.params.value === this.$enums.Sender.Status.VERIFIED;
    },
  },
  methods: {
    verifySenderId() {
      if (!this.isVerified) {
        this.params.context.componentParent.recordToVerify = this.params.data;
        this.params.context.componentParent.activeModalVerify = true;
      }
    },
  },
};
</script>
