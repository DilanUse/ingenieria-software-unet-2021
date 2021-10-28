<template>
  <common-cell-renderer-actions
    :actions="filteredActionsByUserRole"
    @view="viewRecord()"
    @clone="cloneRecord()"
    @edit="editRecord()"
    @delete="confirmDeleteRecord()">
  </common-cell-renderer-actions>
</template>

<script>
import { mapGetters } from 'vuex';

// Mixins
import commonSingleCellRendererActions from '@/views/modules/mixins/commonSingleCellRendererActions';

// Components
import CommonCellRendererActions from '@/views/modules/components/cell-renderer/CommonCellRendererActions.vue';

export default {
  name: 'UserListInviteCellRendererActions',
  components: {
    CommonCellRendererActions,
  },
  mixins: [commonSingleCellRendererActions],
  computed: {
    ...mapGetters({
      authUserIsOwner: 'auth/isOwner',
    }),
    userIsOwner() {
      if (this.dataRowRecord) {
        const roleSuffix = this.dataRowRecord.role.name.split('-')[1];
        return roleSuffix === this.$enums.Auth.Role.Suffix.OWNER;
      }

      return false;
    },
    filteredActionsByUserRole() {
      if (this.userIsOwner && !this.authUserIsOwner) {
        return this.filteredActionsFromParent.filter(
          (action) => action.name !== this.$enums.Operation.EDIT
            && action.name !== this.$enums.Operation.DELETE,
        );
      }

      return this.filteredActionsFromParent;
    },
  },
};
</script>
