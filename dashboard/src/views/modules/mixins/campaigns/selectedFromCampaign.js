import enums from '@/enums';


export default {
  props: {
    onCampaignSelection: {
      type: String,
      required: false,
      validator(value) {
        return Object.values(enums.Campaign.Type).indexOf(value) !== -1;
      },
    },
    campaignOperation: {
      type: String,
      required: false,
      validator(value) {
        return [
          enums.Operation.CREATE,
          enums.Operation.EDIT].indexOf(value) !== -1;
      },
    },
  },
};
