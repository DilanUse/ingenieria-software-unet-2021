<template>
  <vue-apex-charts
    :key="chartKey"
    type="pie"
    height="350"
    :options="chartOptions"
    :series="chartSeries"/>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import commonChartsAndAnalytics from '@/views/charts-and-maps/charts/commonChartsAndAnalytics';
import { deepCopy } from '@/util';

export default {
  name: 'GsPieChart',
  components: {
    VueApexCharts,
  },
  mixins: [commonChartsAndAnalytics],
  computed: {
    chartsNoDataOptions() {
      const commonOptions = deepCopy(this.commonChartsNoDataOptions);
      const options = {
        ...commonOptions,
        labels: [''],
        states: {
          hover: {
            filter: {
              type: 'none',
            },
          },
          active: {
            filter: {
              type: 'none',
            },
          },
        },
      };

      options.title.text = this.noDataTitle;
      options.subtitle.text = this.noDataSubtitle;
      options.title.align = 'center';
      options.title.offsetY = 170;
      options.subtitle.align = 'center';
      options.subtitle.offsetY = 200;

      return options;
    },
    isThereDataToChart() {
      return this.chartAnalyticsData
        && this.seriesInfo.every((series) => this.chartAnalyticsData[series.key] !== undefined)
        && !this.seriesInfo.every((series) => this.chartAnalyticsData[series.key] === 0);
    },
    chartSeries() {
      if (!this.isThereDataToChart) {
        return [1];
      }

      return this.seriesInfo.map((series) => this.chartAnalyticsData[series.key] || 0);
    },
    chartOptions() {
      if (!this.isThereDataToChart) {
        return this.chartsNoDataOptions;
      }

      return {
        labels: this.seriesInfo.map((series) => series.name),
        colors: this.seriesInfo.map((series) => series.color),
      };
    },
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const resp = await this.fetchDataFunction();

      if (resp) {
        this.chartAnalyticsData = resp;
      }
    },
  },
};
</script>
