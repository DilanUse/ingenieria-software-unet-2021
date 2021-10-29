import singleCreateOrEdit from '@/views/modules/mixins/singleCreateOrEdit';


export default {
  mixins: [singleCreateOrEdit],
  props: {
    nameToCreate: {
      type: String,
      required: false,
    },
  },
  computed: {
    isVerified() {
      return this.model && this.model.status === this.$enums.Sender.Status.VERIFIED;
    },
    filteredActionsByStatus() {
      if (this.isVerified) {
        return this.mappedActions.filter(
          (action) => action.name !== 'check',
        );
      }

      return this.mappedActions;
    },
  },
};
