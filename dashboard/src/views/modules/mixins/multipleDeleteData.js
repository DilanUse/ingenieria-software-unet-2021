export default {
  computed: {
    itemId() {
      // eslint-disable-next-line no-underscore-dangle
      return this.$route.meta.operation === 'view' ? this.itemData._id : this.params.data._id;
    },
    itemName() {
      return this.$route.meta.operation === 'view' ? this.itemData.name : this.params.data.name;
    },
    operation() {
      return this.$route.meta.operation;
    },
    urlListName() {
      if (this.$route.meta.operation === 'view') {
        return this.routes.list.name;
      }

      return this.params.context.componentParent.routes.list.name;
    },
    entityName() {
      if (this.$route.meta.operation === 'view') {
        return this.entity;
      }

      return this.params.context.componentParent.entity;
    },
  },
  data() {
    return {
    };
  },
  methods: {
    confirmDeleteRecord() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.itemName}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete',
      });
    },
    async deleteRecord() {
      try {
        if (this.$route.meta.operation === 'view') {
          this.$vs.loading({ type: 'radius' });
          await this.removeItem(this.itemId);
          this.$vs.loading.close();
          this.$router.push({ name: this.urlListName, query: { avoid: 'true' } }).catch(() => {});
        } else { // I am in a Cell Renderer Action
          this.$vs.loading({ type: 'radius' });
          await this.params.context.componentParent.removeItem(this.itemId);
          this.$vs.loading.close();
        }

        this.showDeleteSuccess();
      } catch (e) {
        this.$vs.loading.close();
        // todo: error handle
      }
    },
    showDeleteSuccess() {
      this.$vs.notify({
        color: 'success',
        title: `${this.entityName} Deleted`,
        text: `The selected ${this.entityName} was successfully deleted`,
      });
    },
  },
};
