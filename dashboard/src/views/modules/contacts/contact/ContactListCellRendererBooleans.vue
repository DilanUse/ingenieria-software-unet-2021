<template>
  <div>
    {{ yesOrNo }}
  </div>
</template>

<script>


export default {
  name: 'ContactListCellRendererBooleans',
  computed: {
    yesOrNo() {
      if (this.params.value !== null && this.params.value !== undefined) {
        return this.params.value ? this.$t('$General.Yes') : this.$t('$General.No');
      }

      return '';
    },
  },
};
</script>
