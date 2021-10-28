import Vue from 'vue';

export default Vue.extend({
  template: `
    <div class="p-2">
      <vs-input v-model="startDate" type="date" size="small" label="Start date"/>
      <br>
      <vs-input v-model="endDate" type="date" size="small" label="End date"/>
    </div>`,
  computed: {
    startTime() {
      return this.startDate !== '' ? new Date(this.startDate).getTime() : null;
    },
    endTime() {
      return this.endDate !== '' ? new Date(this.endDate).getTime() : null;
    },
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      valueGetter: null,
    };
  },
  methods: {
    isFilterActive() {
      return this.startDate !== '' || this.endDate !== '';
    },
    doesFilterPass(params) {
      const columnTime = new Date(this.valueGetter(params.node)).getTime();
      let filterPass = false;

      if (this.startTime !== null) {
        filterPass = columnTime >= this.startTime;
      }

      if (this.endTime !== null) {
        // eslint-disable-next-line max-len
        filterPass = (this.startTime === null || columnTime >= this.startTime) && columnTime <= this.endTime;
      }

      return filterPass;
    },
    getModel() {
      if (this.isFilterActive()) {
        return { startDate: this.startDate, endDate: this.endDate };
      }

      return null;
    },
    setModel(model) {
      if (model) {
        this.startDate = model.startDate;
        this.endDate = model.endDate;
      } else {
        this.startDate = '';
        this.endDate = '';
      }

      this.params.filterChangedCallback();
    },
  },
  watch: {
    startDate(val, oldVal) {
      if (val !== oldVal) {
        this.params.filterChangedCallback();
      }
    },
    endDate(val, oldVal) {
      if (val !== oldVal) {
        this.params.filterChangedCallback();
      }
    },
  },
  created() {
    this.valueGetter = this.params.valueGetter;
  },
});
