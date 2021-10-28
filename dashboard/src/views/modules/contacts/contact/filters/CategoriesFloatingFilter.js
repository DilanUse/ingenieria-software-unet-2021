import Vue from 'vue';
import ContactListCellRendererCategories
  from '@/views/modules/contacts/contact/ContactListCellRendererCategories.vue';


export default Vue.extend({
  name: 'CategoriesFloatingFilter',
  template: `
    <contact-list-cell-renderer-categories
      :items="categories"
      :show-maximum="2"
      show-clear
      @clear="remove"/>
    `,
  components: {
    ContactListCellRendererCategories,
  },
  data() {
    return {
      categories: [],
      condition: 'one',
    };
  },
  methods: {
    remove() {
      this.categories = [];
      this.params.parentFilterInstance((instance) => {
        instance.setModel(null);
      });
    },
    onParentModelChanged(parentModel) {
      if (parentModel) {
        this.categories = parentModel.filter;
        this.condition = parentModel.type;
      } else {
        this.categories = [];
        this.condition = 'one';
      }
    },
  },
});
