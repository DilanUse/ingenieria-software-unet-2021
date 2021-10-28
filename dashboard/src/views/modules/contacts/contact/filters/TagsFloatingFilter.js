import Vue from 'vue';
import ContactListCellRendererTags
  from '@/views/modules/contacts/contact/ContactListCellRendererTags.vue';


export default Vue.extend({
  name: 'TagsFloatingFilter',
  template: `
    <contact-list-cell-renderer-tags
      :items="tags"
      :show-maximum="2"
      show-clear
      @clear="remove"
      />
    `,
  components: {
    ContactListCellRendererTags,
  },
  data() {
    return {
      tags: [],
    };
  },
  methods: {
    remove() {
      this.tags = [];
      this.params.parentFilterInstance((instance) => {
        instance.setModel(null);
      });
    },
    onParentModelChanged(parentModel) {
      if (parentModel && parentModel.filter && Array.isArray(parentModel.filter)) {
        this.tags = parentModel.filter;
      } else {
        this.tags = [];
      }
    },
  },
});
