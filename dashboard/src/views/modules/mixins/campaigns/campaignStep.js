import enums from '@/enums';


export default {
  props: {
    campaignType: {
      type: String,
      required: true,
      validator(value) {
        return Object.values(enums.Campaign.Type).indexOf(value) !== -1;
      },
    },
    operation: {
      type: String,
      required: true,
      validator(value) {
        return [
          enums.Operation.CREATE,
          enums.Operation.EDIT].indexOf(value) !== -1;
      },
    },
    compactDesign: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
