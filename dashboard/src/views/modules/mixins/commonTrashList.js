
export default {
  props: {
    trash: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      fetchAllCollectionFunction: null,
      fetchAllCollectionTrashFunction: null,
      restoreItemFunction: null,
      restoreItemsFunction: null,
      afterRestoreRecordFunction: null,
      afterRestoreRecordsFunction: null,
    };
  },
  computed: {
    trashMultipleActionOptions() {
      return this.trash
        ? [{
          label: this.$t('$General.Restore'),
          event: 'restore',
          icon: 'RotateCcwIcon',
        }]
        : [];
    },
  },
  methods: {
    async fetchCollection(params) {
      if (typeof this.fetchAllCollectionTrashFunction !== 'function'
        || typeof this.fetchAllCollectionFunction !== 'function') {
        throw new Error('value must ve a valid function');
      }

      if (this.trash) {
        return this.fetchAllCollectionTrashFunction(params);
      }

      return this.fetchAllCollectionFunction(params);
    },
    async confirmRestoreRecord(record) {
      return new Promise((resolve) => {
        this.$vs.dialog({
          type: 'confirm',
          color: 'warning',
          title: this.$t('$Dialogs.ConfirmRestoreTitle'),
          text: this.$t('$Dialogs.ConfirmSpecificRestoreMsg', { entity: record.name }),
          accept: () => {
            this.restoreRecord(record.id);
            resolve(true);
          },
          cancel: () => resolve(false),
          acceptText: this.$t('$General.Restore'),
        });
      });
    },
    async restoreRecord(id) {
      if (typeof this.restoreItemFunction !== 'function') {
        throw new Error('value must ve a valid function');
      }

      this.$vs.loading({ type: 'radius' });
      await this.restoreItemFunction(id);

      if (typeof this.afterRestoreRecordFunction === 'function') {
        this.afterRestoreRecordFunction();
      }

      this.$vs.loading.close();
      this.showRestoreSuccess();
    },
    showRestoreSuccess() {
      this.$vs.notify({
        color: 'success',
        title: this.$t('$Notifications.RestoredTitle', { entity: this.$tc(`$Entities.${this.entity}`) }),
        text: this.$tc('$Notifications.RestoredMsg', 1, { entity: this.$tc(`$Entities.${this.entity}`) }),
      });
    },
    confirmRestoreRecords({
      isAnyRowsSelected = false,
      rowsSelectedCount = 0,
      rowsSelected = null,
      filters = {},
    }) {
      if (isAnyRowsSelected) {
        this.$vs.dialog({
          type: 'confirm',
          color: 'warning',
          title: this.$t('$Dialogs.ConfirmRestoreTitle'),
          text: this.$tc('$Dialogs.ConfirmGeneralRestoreMsg', rowsSelectedCount, {
            count: rowsSelectedCount,
            entity: this.$tc(`$Entities.${this.entity}`, rowsSelectedCount),
          }),
          accept: () => this.restoreRecords({ rowsSelectedCount, rowsSelected, filters }),
          acceptText: this.$t('$General.Restore'),
        });
      } else {
        this.showNoSelectedRowsMessage();
      }
    },
    async restoreRecords({
      rowsSelectedCount = 0,
      rowsSelected = null,
      filters = {},
    }) {
      if (typeof this.restoreItemsFunction !== 'function') {
        throw new Error('value must ve a valid function');
      }

      this.$vs.loading({ type: 'radius' });
      await this.restoreItemsFunction({
        data: rowsSelected,
        filters,
      });
      this.$vs.loading.close();

      this.$vs.notify({
        color: 'success',
        title: this.$t('$Notifications.RestoredTitle', {
          entity: this.$tc(`$Entities.${this.entity}`, rowsSelectedCount),
        }),
        text: this.$tc('$Notifications.RestoredMsg', rowsSelectedCount, {
          entity: this.$tc(`$Entities.${this.entity}`, rowsSelectedCount),
        }),
      });

      if (typeof this.afterRestoreRecordsFunction === 'function') {
        this.afterRestoreRecordsFunction();
      }
    },
  },
};
