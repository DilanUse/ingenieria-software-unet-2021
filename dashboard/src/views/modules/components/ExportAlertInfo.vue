<template>
  <div v-show="show">
    <vs-alert
      :active.sync="exportingLocal"
      closable
      color="warning"
      icon-pack="feather"
      icon="icon-clock"
      close-icon="icon-x">
      {{ $t('$Components.$ExportAlertInfo.ExportingMsg', { entity: this.entity }) }}
    </vs-alert>

    <vs-alert
      :active.sync="exportedLocal"
      closable
      color="success"
      icon-pack="feather"
      icon="icon-check-circle"
      close-icon="icon-x">
      <span v-html="$t('$Components.$ExportAlertInfo.ExportedMsg', {
        entity: this.entity, url: this.fileUrl
      })">
      </span>
    </vs-alert>
  </div>
</template>

<script>


export default {
  name: 'ExportAlertInfo',
  props: {
    exporting: {
      type: Boolean,
      required: false,
      default: false,
    },
    exported: {
      type: Boolean,
      required: false,
      default: false,
    },
    entity: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      exportingLocal: this.exporting,
      exportedLocal: this.exported,
    };
  },
  computed: {
    show() {
      return this.exporting || this.exported;
    },
  },
  watch: {
    exporting(val) {
      if (val) {
        this.exportedLocal = false;
      }

      this.exportingLocal = val;
    },
    exported(val) {
      if (val) {
        this.exportingLocal = false;
      }

      this.exportedLocal = val;
    },
    exportingLocal(val) {
      if (!val) {
        this.$emit('update:exporting', false);
      }
    },
    exportedLocal(val) {
      if (!val) {
        this.$emit('update:exported', false);
      }
    },
  },
};
</script>
