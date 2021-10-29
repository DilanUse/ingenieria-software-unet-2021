import commonTrashListCreateOrEditWithAgGrid
  from '@/views/modules/mixins/commonTrashListCreateOrEditWithAgGrid';


export default {
  mixins: [commonTrashListCreateOrEditWithAgGrid],
  data() {
    return {
      sendCampaignFromTemplateFunction: () => {},
    };
  },
  computed: {
    additionalActionsOnList() {
      return this.additionalActionsOnListForTemplate;
    },
    additionalActionsOnListForTemplate() {
      return [
        {
          name: 'send',
          color: 'success',
          text: '$General.SendCampaign',
          position: 'top',
          icon: 'icon-send',
          iconVue: 'SendIcon',
          activeCreateOrEdit: this.operation === this.$enums.Operation.VIEW
            || this.operation === this.$enums.Operation.EDIT,
          active: !this.trash,
        },
        ...this.additionalActionsOnListForTrash,
      ];
    },
  },
  methods: {
    onActionFromCreateOrEditForTemplate(action) {
      switch (action) {
        case 'send':
          this.onSendCampaignFromCreateOrEdit(this.recordSelected);
          break;

        default:
          this.onActionFromCreateOrEditForTrash(action);
      }
    },
    async onSendCampaignFromCreateOrEdit(payload) {
      this.dontConfirmCloseCreateOrEdit = true;
      this.activeModalCreateOrEdit = false;

      const confirmed = await this.confirmCloseCreateOrEditModal();

      if (confirmed) {
        this.showCreateOrEditComponent = false;
        this.sendCampaignFromTemplateFunction(payload);
      } else {
        this.activeModalCreateOrEdit = true;
      }

      this.dontConfirmCloseCreateOrEdit = false;
    },
  },
};
