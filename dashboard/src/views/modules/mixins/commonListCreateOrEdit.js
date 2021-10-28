
export default {
  data() {
    return {
      entity: '',
      activeModalCreateOrEdit: false,
      activeModalView: false,
      showCreateOrEditComponent: false,
      activeModalToExport: false,
      showExportComponent: false,
      showImportComponent: false,
      importComponentKey: 0,
      operation: this.$enums.Operation.CREATE,
      recordSelected: null,
      modalsDelay: 500,
      exportingList: false,
      exportedList: false,
      urlFileExported: '',
      createOrEditModelWasChanged: false,
      viewDisabled: false,
      cloneDisabled: false,
      editDisabled: false,
      deleteDisabled: false,
      dontConfirmCloseCreateOrEdit: false,
      deleteRecordFunction: null,
      afterDeleteRecordFunction: () => {},
      redirectRouteNameFromCreateOrEdit: '',
    };
  },
  computed: {
    defaultMultipleActionOptions() {
      return [
        {
          label: this.$t('$General.Export'),
          event: this.$enums.Operation.EXPORT,
          icon: 'DownloadIcon',
        },
        {
          label: this.$t('$General.Delete'),
          event: this.$enums.Operation.DELETE,
          icon: 'TrashIcon',
        },
      ];
    },
    titleModalName() {
      return this.recordSelected && this.recordSelected.name
        ? this.recordSelected.name : '';
    },
    titleModal() {
      switch (this.operation) {
        case this.$enums.Operation.CREATE:
          return this.$t('$Modals.CreateModalTitle', { entity: this.$tc(`$Entities.${this.entity}`) });

        case this.$enums.Operation.CLONE:
          return this.$t('$Modals.CloneModalTitle', {
            entity: this.$tc(`$Entities.${this.entity}`),
            name: this.titleModalName,
          });

        case this.$enums.Operation.EDIT:
          return this.$t('$Modals.EditModalTitle', {
            entity: this.$tc(`$Entities.${this.entity}`),
            name: this.titleModalName,
          });

        case this.$enums.Operation.VIEW:
          return this.$t('$Modals.ViewModalTitle', {
            entity: this.$tc(`$Entities.${this.entity}`),
            name: this.titleModalName,
          });

        default:
          return '';
      }
    },
    headerButtonsSizeByResolution() {
      return this.$mq !== this.$enums.mqBreakpoints.MOBILE ? 'default' : 'small';
    },
    exportModalTitle() {
      return this.$t('$Modals.ExportModalTitle', {
        entity: this.$tc(`$Entities.${this.entity}`, this.rowsSelectedCount),
      });
    },
    additionalActionsOnList() {
      return [];
    },
    actionsOnList() {
      return [
        ...this.additionalActionsOnList,
        {
          name: this.$enums.Operation.VIEW,
          color: 'primary',
          text: '$General.View',
          position: 'top',
          icon: 'icon-eye',
          iconVue: 'EyeIcon',
          activeCreateOrEdit: false,
          active: !this.viewDisabled,
        },
        {
          name: this.$enums.Operation.EDIT,
          color: 'warning',
          text: '$General.Edit',
          position: 'top',
          icon: 'icon-edit',
          iconVue: 'EditIcon',
          activeList: true,
          activeCreateOrEdit: this.operation === this.$enums.Operation.VIEW,
          active: !this.editDisabled,
        },
        {
          name: this.$enums.Operation.CLONE,
          color: 'primary',
          text: '$General.Clone',
          position: 'top',
          icon: 'icon-copy',
          iconVue: 'CopyIcon',
          activeCreateOrEdit: this.operation === this.$enums.Operation.VIEW,
          active: !this.cloneDisabled,
        },
        {
          name: this.$enums.Operation.DELETE,
          color: 'danger',
          text: '$General.Delete',
          position: 'top',
          icon: 'icon-trash-2',
          iconVue: 'Trash2Icon',
          activeCreateOrEdit: this.operation === this.$enums.Operation.VIEW
            || this.operation === this.$enums.Operation.EDIT,
          active: !this.deleteDisabled,
        },
      ];
    },
    actionsOnCreateOrEdit() {
      return this.actionsOnList.map((action) => ({
        ...action,
        active: action.activeCreateOrEdit && action.active,
      }));
    },
  },
  watch: {
    async activeModalCreateOrEdit(val) {
      if (val) {
        this.showCreateOrEditComponent = true;
      } else if (this.dontConfirmCloseCreateOrEdit) {
        setTimeout(() => {
          this.showCreateOrEditComponent = false;
        }, this.modalsDelay);
        this.dontConfirmCloseCreateOrEdit = false;
      } else {
        const confirmed = await this.confirmCloseCreateOrEditModal();

        if (confirmed) {
          this.recordSelected = null;
          this.createOrEditModelWasChanged = false;

          setTimeout(() => {
            this.showCreateOrEditComponent = false;
            if (this.redirectRouteNameFromCreateOrEdit) {
              this.$router.push({ name: this.redirectRouteNameFromCreateOrEdit });
              this.this.redirectRouteNameFromCreateOrEdit = '';
            }
          }, this.modalsDelay);
        } else {
          this.activeModalCreateOrEdit = true;
        }
      }
    },
    activeModalToExport(val) {
      if (!val) {
        setTimeout(() => {
          this.showExportComponent = false;
        }, this.modalsDelay);
      } else {
        this.showExportComponent = true;
      }
    },
  },
  methods: {
    redirectFromCreateOrEdit(routeName) {
      this.redirectRouteNameFromCreateOrEdit = routeName;
      this.activeModalCreateOrEdit = false;
    },
    async confirmCloseCreateOrEditModal() {
      if ((this.operation === this.$enums.Operation.CREATE
        || this.operation === this.$enums.Operation.EDIT
        || this.operation === this.$enums.Operation.CLONE)
        && this.createOrEditModelWasChanged) {
        return new Promise((resolve) => {
          this.$vs.dialog({
            type: 'confirm',
            color: 'warning',
            title: this.$t('$Dialogs.ConfirmCloseWithoutSaveChangesTitle'),
            text: this.$t('$Dialogs.ConfirmCloseWithoutSaveChangesMsg'),
            accept: () => resolve(true),
            cancel: () => resolve(false),
            acceptText: this.$t('$General.Confirm'),
            cancelText: this.$t('$General.Back'),
          });
        });
      }

      return true;
    },
    onActionFromCreateOrEdit(action) {
      switch (action) {
        case this.$enums.Operation.EDIT:
          this.editRecord(this.recordSelected);
          break;

        case this.$enums.Operation.CLONE:
          this.cloneRecord(this.recordSelected);
          break;

        case this.$enums.Operation.DELETE:
          this.deleteFromCreateOrEdit(this.recordSelected);
          break;

        default:
      }
    },
    viewRecord(recordSelected = null) {
      this.operation = this.$enums.Operation.VIEW;
      this.recordSelected = recordSelected;
      this.activeModalCreateOrEdit = true;
    },
    newItem() {
      this.operation = this.$enums.Operation.CREATE;
      this.activeModalCreateOrEdit = true;
    },
    savedItem() {
      this.dontConfirmCloseCreateOrEdit = true;
      this.activeModalCreateOrEdit = false;
      this.createOrEditModelWasChanged = false;
    },
    cloneRecord(recordSelected = null) {
      this.operation = this.$enums.Operation.CLONE;
      this.recordSelected = recordSelected;
      this.activeModalCreateOrEdit = true;
    },
    editRecord(recordSelected = null) {
      this.operation = this.$enums.Operation.EDIT;
      this.recordSelected = recordSelected;
      this.activeModalCreateOrEdit = true;
    },
    async confirmDeleteRecord(
      name = '', id = null,
      confirmDeleteRecordDialogParams = {},
      deleteSuccessNotificationParams = {},
    ) {
      return new Promise((resolve) => {
        this.$vs.dialog({
          type: confirmDeleteRecordDialogParams.type || 'confirm',
          color: confirmDeleteRecordDialogParams.color || 'danger',
          title: confirmDeleteRecordDialogParams.title || this.$t('$Dialogs.ConfirmDeleteTitle'),
          text: confirmDeleteRecordDialogParams.text || this.$t('$Dialogs.ConfirmSpecificDeleteMsg', { entity: name }),
          accept: () => {
            this.deleteRecord(id, deleteSuccessNotificationParams);
            resolve(true);
          },
          cancel: () => resolve(false),
          acceptText: confirmDeleteRecordDialogParams.acceptText || this.$t('$General.Delete'),
          cancelText: confirmDeleteRecordDialogParams.cancelText || this.$t('$General.Cancel'),
        });
      });
    },
    async deleteRecord(id, deleteSuccessNotificationParams = {}) {
      if (typeof this.deleteRecordFunction !== 'function') {
        throw new Error('value must ve a valid function');
      }

      this.$vs.loading({ type: 'radius' });
      await this.deleteRecordFunction(id);

      if (typeof this.afterDeleteRecordFunction === 'function') {
        this.afterDeleteRecordFunction();
      }

      this.$vs.loading.close();
      this.showDeleteSuccess(deleteSuccessNotificationParams);
    },
    showDeleteSuccess(deleteSuccessNotificationParams = {}) {
      this.$vs.notify({
        color: 'success',
        title: deleteSuccessNotificationParams.title
          || this.$t(deleteSuccessNotificationParams.$title || '$Notifications.DeletedTitle',
            { entity: this.$tc(`$Entities.${this.entity}`) }),
        text: deleteSuccessNotificationParams.msg
          || this.$tc(deleteSuccessNotificationParams.$msg || '$Notifications.DeletedMsg',
            1,
            { entity: this.$tc(`$Entities.${this.entity}`) }),
      });
    },
    showNoSelectedRowsMessage() {
      this.$vs.notify({
        color: 'warning',
        title: this.$t('$Notifications.NoSelectionTitle', {
          entity: this.$tc(`$Entities.${this.entity}`, 2),
        }),
        text: this.$t('$Notifications.NoSelectionMsg', {
          entity: this.$tc(`$Entities.${this.entity}`),
        }),
      });
    },
    async exportList({
      columns = [], name = '', format = '', data = null,
      filters = {}, sortBy = [], separator = '', sendEmail = false,
      exportFunction = async () => '', entity = '',
    }) {
      this.activeModalToExport = false;
      this.exportingList = true;

      this.urlFileExported = await exportFunction({
        columns,
        name,
        format,
        data: data !== null ? data.map((d) => d.id) : null,
        filters,
        sortBy,
        separator,
        sendEmail,
        entity,
      });

      this.exportingList = false;
      this.exportedList = true;
    },
    async deleteFromCreateOrEdit(payload) {
      this.dontConfirmCloseCreateOrEdit = true;
      this.activeModalCreateOrEdit = false;

      const confirmed = await this.confirmDeleteRecord(payload.name, payload.id);

      if (confirmed) {
        this.showCreateOrEditComponent = false;
      } else {
        this.activeModalCreateOrEdit = true;
      }

      this.dontConfirmCloseCreateOrEdit = false;
    },
  },
};
