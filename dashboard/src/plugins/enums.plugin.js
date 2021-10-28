import enums from '@/enums';

export default function enumsPlugin(Vue) {
  Vue.mixin({
    beforeCreate() {
      this.$enums = enums;
    },
  });
}
