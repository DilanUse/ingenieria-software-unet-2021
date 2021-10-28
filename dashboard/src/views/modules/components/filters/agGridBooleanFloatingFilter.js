import Vue from 'vue';


export default Vue.extend({
  name: 'agGridBooleanFloatingFilter',
  template: `
    <div class="flex content-center">
      <vs-chip @click="remove()" closable v-show="this.value !== null">{{ getYesOrNoValue }}</vs-chip>
    </div>
    `,
  data() {
    return {
      value: null,
    };
  },
  computed: {
    getYesOrNoValue() {
      switch (this.value) {
        case 'yes':
          return this.params.filterParams.yesOptionText || this.$t('$General.Yes');
        case 'no':
          return this.params.filterParams.noOptionText || this.$t('$General.No');
        case 'undetermined':
          return this.params.filterParams.undeterminedOptionText || this.$t('$General.Undetermined');

        default:
          return '';
      }
    },
  },
  methods: {
    remove() {
      this.value = null;
      this.params.parentFilterInstance((instance) => {
        instance.setModel(null);
      });
    },
    onParentModelChanged(parentModel) {
      if (parentModel) {
        this.value = parentModel.filter;
      } else {
        this.value = null;
      }
    },
  },
});
