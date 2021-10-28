<template>
  <cell-renderer-chip
    v-if="params.value"
    :options="chipOptions"
    :selected-option="params.value"/>
</template>

<script>
import CellRendererChip from '@/views/modules/components/CellRendererChip.vue';

export default {
  name: 'UserListCellRendererStatus',
  components: {
    CellRendererChip,
  },
  data() {
    return {
      chipOptions: [
        {
          text: this.$t('$General.Invited'),
          value: this.$enums.Users.Status.INVITED,
          color: 'warning',
          icon: 'SendIcon',
        },
        {
          text: this.$t('$General.Active'),
          value: this.$enums.Users.Status.ACTIVE,
          color: 'success',
          icon: 'UserCheckIcon',
        },
        {
          text: this.$t('$General.Inactive'),
          value: this.$enums.Users.Status.INACTIVE,
          color: 'danger',
          icon: 'UserXIcon',
        },
      ],
    };
  },
};
</script>
