import commonListCreateOrEditWithAgGrid from '@/views/modules/mixins/commonListCreateOrEditWithAgGrid';
import senderIdVerification from '@/views/modules/mixins/senderIdVerification.mixin';

export default {
  mixins: [
    commonListCreateOrEditWithAgGrid,
    senderIdVerification,
  ],
  data() {
    return {
      cloneDisabled: true,
    };
  },
  computed: {
    additionalActionsOnList() {
      return [
        {
          name: 'check',
          color: 'success',
          text: '$General.Check',
          position: 'top',
          icon: 'icon-check-circle',
          iconVue: 'CheckCircleIcon',
          activeCreateOrEdit: this.operation === this.$enums.Operation.VIEW
            || this.operation === this.$enums.Operation.EDIT,
          active: true,
        },
      ];
    },
  },
  methods: {
    onActionFromCreateOrEditForSender(action) {
      switch (action) {
        case 'check':
          this.onCheckSenderFromCreateOrEdit(this.recordSelected);
          break;

        default:
          this.onActionFromCreateOrEdit(action);
      }
    },
    async onCheckSenderFromCreateOrEdit(payload) {
      this.dontConfirmCloseCreateOrEdit = true;
      this.activeModalCreateOrEdit = false;

      const confirmed = await this.confirmCloseCreateOrEditModal();

      if (confirmed) {
        this.showCreateOrEditComponent = false;
        this.recordToVerify = payload;
        this.activeModalVerify = true;
      } else {
        this.activeModalCreateOrEdit = true;
      }

      this.dontConfirmCloseCreateOrEdit = false;
    },
    afterVerifySenderId() {
      this.activeModalVerify = false;
      this.resetDataSourceAndSelection();
    },
  },
};
