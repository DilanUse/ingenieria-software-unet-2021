<template>
  <vue-apex-charts
    type="radialBar"
    :height="height"
    :options="chartOptions"
    :series="series"/>
</template>

<script>
import Color from 'color';
import VueApexCharts from 'vue-apexcharts';
import themeConfig from '../../../../themeConfig';

export default {
  name: 'GsRadialPercentChart',
  components: {
    VueApexCharts,
  },
  props: {
    percentage: {
      type: Number,
      required: false,
      default: 0,
    },
    height: {
      type: Number || String,
      required: false,
      default: 180,
    },
  },
  data() {
    return {
      chartOptions: {
        plotOptions: {
          radialBar: {
            size: 110,
            startAngle: -150,
            endAngle: 150,
            hollow: {
              size: '77%',
            },
            track: {
              background: '#bfc5cc',
              strokeWidth: '50%',
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: 18,
                color: '#99a2ac',
                fontSize: '4rem',
              },
            },
          },
        },
        colors: [Color(themeConfig.colors.primary).alpha(0.5).lighten(0.5).hex()],
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: [themeConfig.colors.primary],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: 'round',
        },
        chart: {
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            blur: 3,
            left: 1,
            top: 1,
            opacity: 0.1,
          },
        },
      },
    };
  },
  computed: {
    series() {
      return [this.percentage];
    },
  },
};
</script>
