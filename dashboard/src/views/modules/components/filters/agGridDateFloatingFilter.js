import Vue from 'vue';

export default Vue.extend({
  template: `
    <div>
      <p v-show="startDate">from: {{ startDate }}</p>
<!--      <p class="text-center" v-if="endDate"> to </p>-->
      <p v-show="endDate">to: {{ endDate }}</p>
    </div>
    `,
  data() {
    return {
      startDate: '',
      endDate: '',
    };
  },
  computed: {
  },
  methods: {
    onParentModelChanged(parentModel) {
      if (parentModel) {
        this.startDate = parentModel.startDate;
        this.endDate = parentModel.endDate;
      } else {
        this.startDate = '';
        this.endDate = '';
      }
    },
  },
});
