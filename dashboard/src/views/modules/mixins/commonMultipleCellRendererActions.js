import multipleDeleteData from './multipleDeleteData';
import CommonCellRendererActions from '../components/cell-renderer/CommonCellRendererActions.vue';

export default {
  mixins: [multipleDeleteData],
  components: {
    CommonCellRendererActions,
  },
  computed: {
    urlEditName() {
      // eslint-disable-next-line no-underscore-dangle
      return this.params.context.componentParent.routes.edit.name;
    },
    urlEditPath() {
      // eslint-disable-next-line no-underscore-dangle
      return this.params.context.componentParent.routes.edit.path;
    },
    urlViewName() {
      // eslint-disable-next-line no-underscore-dangle
      return this.params.context.componentParent.routes.view.name;
    },
    urlViewPath() {
      // eslint-disable-next-line no-underscore-dangle
      return this.params.context.componentParent.routes.view.path;
    },
  },
  // todo: handle error routes
  methods: {
    viewRecord() {
      // eslint-disable-next-line no-underscore-dangle
      this.$router.push(`${this.urlViewPath}/${this.params.data._id}`).catch((e) => { console.log(e); });
    },
    editRecord() {
      // eslint-disable-next-line no-underscore-dangle
      this.$router.push(`${this.urlEditPath}/${this.params.data._id}`).catch((e) => { console.log(e); });
    },
  },
};
