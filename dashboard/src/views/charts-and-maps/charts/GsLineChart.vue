<template>
  <div>
    <div class="flex items-center">
      <date-picker
        v-model="dateRangeFilter"
        range
        format="DD-MM-YYYY"
        :disabled-date="disabledDateRange"
        :placeholder="$t('$DashboardAnalyticsPage.DateRangeFilterPlaceholder')"
        :clearable="false"
        class="w-2/3 md:w-2/6 lg:w-1/3">
      </date-picker>
      <vs-button
        class="ml-3"
        icon-pack="feather"
        icon="icon-bar-chart-2"
        @click="getData()">
        {{ $t('$General.Apply') }}
      </vs-button>
    </div>

    <vue-apex-charts
      :key="chartKey"
      type="area"
      height="350"
      :options="chartOptions"
      :series="chartSeries"></vue-apex-charts>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import moment from 'moment';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

// Mixins
import commonChartsAndAnalytics from '@/views/charts-and-maps/charts/commonChartsAndAnalytics';

// Others
import { deepCopy } from '@/util';


export default {
  name: 'GsLineChart',
  components: {
    VueApexCharts,
    DatePicker,
  },
  mixins: [commonChartsAndAnalytics],
  props: {
    yAxisTitle: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      dateRangeFilter: [
        moment().subtract(1, 'months').toDate(),
        moment().toDate(),
      ],
    };
  },
  computed: {
    chartsNoDataOptions() {
      const commonOptions = deepCopy(this.commonChartsNoDataOptions);
      const options = {
        ...commonOptions,
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          labels: {
            show: false,
          },
        },
        yaxis: {
          show: false,
        },
        chart: {
          toolbar: {
            show: false,
          },
        },
      };
      options.title.text = this.noDataTitle;
      options.subtitle.text = this.noDataSubtitle;

      return options;
    },
    chartDefaultOptions() {
      return {
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        colors: [],
        yaxis: {
          forceNiceScale: true,
          min: 0,
          title: {
            text: '',
          },
          labels: {
            formatter(val) {
              return val.toFixed(0);
            },
          },
        },
        xaxis: {
          type: 'datetime',
          categories: [],
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy',
          },
        },
        chart: {
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
            },
          },
        },
      };
    },
    isThereDataToChart() {
      return this.chartAnalyticsData
        && this.chartAnalyticsData.data
        && Array.isArray(this.chartAnalyticsData.data)
        && this.chartAnalyticsData.data.length > 0;
    },
    chartSeries() {
      return this.isThereDataToChart
        ? this.seriesInfo.map((series) => ({
          name: series.name,
          data: this.chartAnalyticsData.data.map((d) => d[series.key]),
        }))
        : [{
          name: '',
          data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 40)),
        }];
    },
    chartMaxSeriesValue() {
      if (this.isThereDataToChart) {
        const maxSeriesValues = this.chartSeries.map(
          (series) => Math.max(...series.data),
        );

        return Math.max(...maxSeriesValues);
      }

      return 0;
    },
    chartOptions() {
      if (this.isThereDataToChart) {
        const defaultOptions = {
          ...this.chartDefaultOptions,
          colors: this.seriesInfo.map((series) => series.color),
        };

        const options = this.getChartsOptions(
          defaultOptions,
          this.chartAnalyticsData.groupedBy,
          this.chartMaxSeriesValue,
        );

        options.xaxis.categories = this.getChartsCategories(
          this.chartAnalyticsData.groupedBy,
          this.chartAnalyticsData.data,
        );

        options.yaxis.title.text = this.yAxisTitle;

        return options;
      }

      return { ...this.chartsNoDataOptions };
    },
  },
  created() {
    this.getData();
  },
  methods: {
    disabledDateRange(date) {
      return moment().startOf('day').diff(
        moment(date).startOf('day'),
        'days',
      ) < 0;
    },
    async getData() {
      if (this.dateRangeFilter.length === 0
        || this.dateRangeFilter.every((date) => date === null)) {
        this.dateRangeFilter = [
          moment().subtract(1, 'months').toDate(),
          moment().toDate(),
        ];
      }

      const params = {
        dateStart: this.dateRangeFilter[0],
        dateEnd: this.dateRangeFilter[1],
      };

      const resp = await this.fetchDataFunction(params);

      if (resp) {
        this.chartAnalyticsData = resp;
      }
    },
    getChartsOptions(options, periodOfTime, maxSeriesValue) {
      const newOptions = {
        ...options,
      };

      newOptions.xaxis.type = periodOfTime === this.$enums.PeriodsOfTime.DAY
      || periodOfTime === this.$enums.PeriodsOfTime.WEEK
        ? 'datetime' : 'category';

      if (periodOfTime === this.$enums.PeriodsOfTime.WEEK) {
        newOptions.tooltip.x.formatter = (val) => {
          const start = moment(val).startOf('week').format('DD MMM YYYY');
          const end = moment(val).endOf('week').format('DD MMM YYYY');
          return `${start} - ${end}`;
        };
      } else {
        newOptions.tooltip.x.formatter = undefined;
      }

      if (maxSeriesValue < 3) {
        newOptions.yaxis.max = 3;
      }

      return newOptions;
    },
    getChartsCategories(periodOfTime, data) {
      switch (periodOfTime) {
        case this.$enums.PeriodsOfTime.WEEK:
          return data.map((d) => {
            // eslint-disable-next-line no-underscore-dangle
            const year = d._id.split('-')[0];
            // eslint-disable-next-line no-underscore-dangle
            const weak = d._id.split('-')[1];

            return moment(year).add(weak, 'weeks').format('YYYY-MM-DD');
          });

        case this.$enums.PeriodsOfTime.MONTH:
          // eslint-disable-next-line no-underscore-dangle
          return data.map((d) => moment(d._id, 'YYYY-MM').format('MMM YYYY'));

        case this.$enums.PeriodsOfTime.YEAR:
          // eslint-disable-next-line no-underscore-dangle
          return data.map((d) => d._id);

        default:
          // eslint-disable-next-line no-underscore-dangle
          return data.map((d) => moment(d._id, 'YYYY-MM-DD').format('YYYY-MM-DD'));
      }
    },
  },
};
</script>
