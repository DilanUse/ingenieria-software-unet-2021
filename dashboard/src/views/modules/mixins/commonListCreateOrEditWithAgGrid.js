import commonAgGrid from '@/views/modules/mixins/commonAgGrid';
import commonListCreateOrEdit from '@/views/modules/mixins/commonListCreateOrEdit';


export default {
  mixins: [commonAgGrid, commonListCreateOrEdit],
  data() {
    return {
      actionFromHeaderSelectionFunction: this.actionFromHeaderSelection,
      exportCollectionFunction: null,
      afterDeleteRecordFunction: this.resetDataSourceAndSelection,
      confirmDeleteRecordsDialogParams: {},
      deleteRecordsFunction: null,
      afterDeleteRecordsFunction: this.resetDataSourceAndSelection,
    };
  },
  methods: {
    actionFromHeaderSelection(action = '') {
      switch (action) {
        case this.$enums.Operation.DELETE:
          this.confirmDeleteRecords({
            isAnyRowsSelected: this.isAnyRowsSelected,
            rowsSelectedCount: this.rowsSelectedCountWithAllSelection,
            rowsSelected: this.rowsSelectedWithAllSelectionOrNull,
            filters: this.getMappedFilterModel(),
          });
          break;

        case this.$enums.Operation.EXPORT:
          this.exportData(this.isAnyRowsSelected);
          break;

        default:
      }
    },
    savedItemOnAgGridTable(item) {
      if (Array.isArray(item)) {
        this.lastSavedIds = item.map((i) => i.id);
      } else if (item) {
        this.lastSavedId = item.id;
      }

      this.savedItem();
      this.resetDataSourceAndSelection();
    },
    confirmDeleteRecords() {
      if (this.isAnyRowsSelected) {
        this.$vs.dialog({
          type: 'confirm',
          color: this.confirmDeleteRecordsDialogParams.color || 'danger',
          title: this.confirmDeleteRecordsDialogParams.title || this.$t('$Dialogs.ConfirmDeleteTitle'),
          text: this.confirmDeleteRecordsDialogParams.text || this.$tc('$Dialogs.ConfirmGeneralDeleteMsg', this.rowsSelectedCountWithAllSelection, {
            count: this.rowsSelectedCountWithAllSelection,
            entity: this.$tc(`$Entities.${this.entity}`, this.rowsSelectedCountWithAllSelection),
          }),
          accept: () => this.deleteRecords(),
          acceptText: this.confirmDeleteRecordsDialogParams.acceptText || this.$t('$General.Delete'),
          cancelText: this.confirmDeleteRecordsDialogParams.cancelText || this.$t('$General.Cancel'),
        });
      } else {
        this.showNoSelectedRowsMessage();
      }
    },
    async deleteRecords() {
      if (typeof this.deleteRecordsFunction !== 'function') {
        throw new Error('value must ve a valid function');
      }

      this.$vs.loading({ type: 'radius' });
      await this.deleteRecordsFunction({
        data: this.rowsSelectedWithAllSelectionOrNull,
        filters: this.getMappedFilterModel(),
      });
      this.$vs.loading.close();

      this.$vs.notify({
        color: 'success',
        title: this.$t('$Notifications.DeletedTitle', {
          entity: this.$tc(`$Entities.${this.entity}`, this.rowsSelectedCountWithAllSelection),
        }),
        text: this.$tc('$Notifications.DeletedMsg', this.rowsSelectedCountWithAllSelection, {
          entity: this.$tc(`$Entities.${this.entity}`, this.rowsSelectedCountWithAllSelection),
        }),
      });

      if (typeof this.afterDeleteRecordsFunction === 'function') {
        this.afterDeleteRecordsFunction();
      }
    },
    exportData() {
      if (this.isAnyRowsSelected) {
        this.activeModalToExport = true;
      } else {
        this.showNoSelectedRowsMessage();
      }
    },
    async onExport({
      columns = [], name = '', format = '', separator = '', sendEmail = false,
    }) {
      await this.exportList({
        columns,
        name,
        format,
        separator,
        sendEmail,
        data: this.rowsSelectedWithAllSelectionOrNull,
        filters: this.getMappedFilterModel(),
        sortBy: this.getSortModel(),
        entity: this.entity,
        exportFunction: this.exportCollectionFunction,
      });
    },
    onRowClicked(params) {
      if (this.$mq !== this.$enums.mqBreakpoints.LAPTOP
        && this.$mq !== this.$enums.mqBreakpoints.DESKTOP) {
        this.viewRecord(params.node.data);
      }
    },
    onRowDoubleClicked(params) {
      this.viewRecord(params.node.data);
    },
  },
};
