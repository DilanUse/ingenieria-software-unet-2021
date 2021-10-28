import themeConfig from '../../../../themeConfig';


export default {
  props: {
    fetchDataFunction: {
      type: Function,
      required: true,
    },
    seriesInfo: {
      type: Array,
      required: true,
      validator(seriesInfo) {
        return seriesInfo.every(
          (s) => typeof s === 'object'
            && 'name' in s
            && 'key' in s
            && 'color' in s,
        );
      },
    },
    noDataTitle: {
      type: String,
      required: true,
    },
    noDataSubtitle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      commonChartsNoDataOptions: {
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        title: {
          text: '',
          align: 'center',
          offsetY: 150,
          style: {
            fontSize: '1.3rem',
            color: themeConfig.colors.content,
          },
        },
        subtitle: {
          text: '',
          align: 'center',
          offsetY: 180,
          style: {
            fontSize: '1rem',
            color: themeConfig.colors.content,
          },
        },
        colors: [
          themeConfig.colors['grey-light'],
        ],
        tooltip: {
          enabled: false,
        },
      },
      chartAnalyticsData: null,
      chartKey: 0,
    };
  },
  watch: {
    chartOptions() {
      this.chartKey += 1;
    },
    chartAnalyticsData(data) {
      this.$emit('chart-data', data);
    },
  },
};
