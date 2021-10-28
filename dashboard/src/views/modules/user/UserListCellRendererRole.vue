<template>
  <cell-renderer-chip
    v-if="params.value"
    :options="chipOptions"
    :selected-option="params.value.split('-')[1]"/>
</template>

<script>
import CellRendererChip from '@/views/modules/components/CellRendererChip.vue';


export default {
  name: 'UserListCellRendererRole',
  components: {
    CellRendererChip,
  },
  data() {
    return {
      chipOptions: [
        {
          text: this.$tc('$General.Owner'),
          value: this.$enums.Auth.Role.Suffix.OWNER,
          color: 'primary',
          icon: 'KeyIcon',
        },
        {
          text: this.$t('$General.Admin'),
          value: this.$enums.Auth.Role.Suffix.ADMIN,
          color: 'success',
          icon: 'UsersIcon',
        },
        {
          text: this.$tc('$General.Collaborator'),
          value: this.$enums.Auth.Role.Suffix.USER,
          color: 'warning',
          icon: 'UserIcon',
        },
      ],
    };
  },
};
</script>
