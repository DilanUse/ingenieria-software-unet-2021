
export default {
  computed: {
    dataRowRecord() {
      return this.params && this.params.node && this.params.node.data
        ? this.params.node.data
        : null;
    },
    idRowRecord() {
      return this.dataRowRecord
        ? this.dataRowRecord.id
        : null;
    },
    nameRowRecord() {
      return this.dataRowRecord
        ? this.dataRowRecord.name
        : null;
    },
    actionsFromParent() {
      return this.params && this.params.context && this.params.context.componentParent
        ? this.params.context.componentParent.actionsOnList
        : [];
    },
    filteredActionsFromParent() {
      return this.actionsFromParent.filter((action) => action.active);
    },
    confirmDeleteRecordDialogParams() {
      return {};
    },
    deleteSuccessNotificationParams() {
      return {};
    },
  },
  methods: {
    viewRecord() {
      this.params.context.componentParent.viewRecord(this.dataRowRecord);
    },
    editRecord() {
      this.params.context.componentParent.editRecord(this.dataRowRecord);
    },
    cloneRecord() {
      this.params.context.componentParent.cloneRecord(this.dataRowRecord);
    },
    async confirmDeleteRecord() {
      return this.params.context.componentParent.confirmDeleteRecord(
        this.nameRowRecord, this.idRowRecord,
        this.confirmDeleteRecordDialogParams,
        this.deleteSuccessNotificationParams,
      );
    },
  },
};
