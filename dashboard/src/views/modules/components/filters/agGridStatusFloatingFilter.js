import Vue from 'vue';
import ContactListCellRendererCategories
  from '@/views/modules/contacts/contact/ContactListCellRendererCategories.vue';


export default Vue.extend({
  name: 'agGridStatusFloatingFilter',
  template: `
    <div class="flex w-full justify-center items-center">
    <span>{{ statusName | truncateEllipsis(100)  }}</span>

    <vx-tooltip
      color="danger"
      :text="$t('$General.Reset') | lowercase"
      class="inline-block" >
      <vs-button
        v-if="status"
        radius
        color="danger"
        size="small"
        type="flat"
        icon-pack="feather"
        icon="icon-x"
        class="ml-1"
        @click="reset"></vs-button>
    </vx-tooltip>
    </div>
    `,
  components: {
    ContactListCellRendererCategories,
  },
  data() {
    return {
      status: '',
    };
  },
  computed: {
    statusName() {
      return this.params
      && this.params.filterParams
      && this.params.filterParams.i18nPrefixStatus
      && this.status
        ? this.$t(`${this.params.filterParams.i18nPrefixStatus}${this.status}`)
        : this.status;
    },
  },
  created() {
    console.log('floating filter params', this.params);
  },
  methods: {
    reset() {
      this.status = '';
      this.params.parentFilterInstance((instance) => {
        instance.setModel(null);
      });
    },
    onParentModelChanged(parentModel) {
      if (parentModel) {
        this.status = parentModel.filter;
      } else {
        this.status = '';
      }
    },
  },
});
