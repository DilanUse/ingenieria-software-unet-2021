export default {
  data() {
    return {
      itemData: {},
      itemNotFound: false,
    };
  },
  methods: {
    async getItem(itemId) {
      try {
        this.$vs.loading({ type: 'radius' });
        const resp = await this.fetchItem(itemId);
        this.$vs.loading.close();

        this.itemData = resp;
      } catch (e) {
        this.$vs.loading.close();

        if (e.response.status === 500 || e.response.status === 404) {
          this.itemNotFound = true;
        }
      }
    },
  },
};
