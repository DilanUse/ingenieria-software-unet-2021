import commonListCreateOrEditWithAgGrid
  from '@/views/modules/mixins/commonListCreateOrEditWithAgGrid';
import commonTrashList from '@/views/modules/mixins/commonTrashList';


export default {
  mixins: [commonListCreateOrEditWithAgGrid, commonTrashList],
  data() {
    return {
      cloneDisabled: this.trash,
      editDisabled: this.trash,
      actionFromHeaderSelectionFunction: this.actionFromHeaderSelectionForTrash,
      afterRestoreRecordFunction: this.resetDataSourceAndSelection,
      afterRestoreRecordsFunction: this.resetDataSourceAndSelection,
    };
  },
  computed: {
    additionalActionsOnList() {
      return this.additionalActionsOnListForTrash;
    },
    additionalActionsOnListForTrash() {
      return [
        {
          name: 'restore',
          color: 'warning',
          text: '$General.Restore',
          position: 'top',
          icon: 'icon-rotate-ccw',
          iconVue: 'RotateCcwIcon',
          activeCreateOrEdit: this.operation === this.$enums.Operation.VIEW,
          active: this.trash,
        },
      ];
    },
    allMultipleActionOptions() {
      return [
        ...this.trashMultipleActionOptions,
        ...this.defaultMultipleActionOptions,
      ];
    },
  },
  methods: {
    confirmRestoreRecordsForTrashWithAgGrid() {
      this.confirmRestoreRecords({
        isAnyRowsSelected: this.isAnyRowsSelected,
        rowsSelectedCount: this.rowsSelectedCountWithAllSelection,
        rowsSelected: this.rowsSelectedWithAllSelectionOrNull,
        filters: this.getMappedFilterModel(),
      });
    },
    actionFromHeaderSelectionForTrash(action = '') {
      switch (action) {
        case 'restore':
          this.confirmRestoreRecordsForTrashWithAgGrid();
          break;

        default:
          this.actionFromHeaderSelection(action);
      }
    },
    onActionFromCreateOrEditForTrash(action) {
      switch (action) {
        case 'restore':
          this.onRestoreFromCreateOrEdit(this.recordSelected);
          break;

        default:
          this.onActionFromCreateOrEdit(action);
      }
    },
    async onRestoreFromCreateOrEdit(payload) {
      this.dontConfirmCloseCreateOrEdit = true;
      this.activeModalCreateOrEdit = false;

      const confirmed = await this.confirmRestoreRecord(payload);

      if (confirmed) {
        this.showCreateOrEditComponent = false;
      } else {
        this.activeModalCreateOrEdit = true;
      }

      this.dontConfirmCloseCreateOrEdit = false;
    },
  },
};
