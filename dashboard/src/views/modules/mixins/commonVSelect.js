import themeConfig from '../../../../themeConfig';


export default {
  props: {
    minimalistStyle: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  mounted() {
    if (this.minimalistStyle) {
      const $vSelect = this.$refs.vSelect.$el.querySelector('.vs__dropdown-toggle');
      $vSelect.style.border = 'none';
      $vSelect.style.borderBottom = `1px solid ${themeConfig.colors['grey-light']}`;
      $vSelect.style.borderRadius = 'initial';
    }
  },
};
