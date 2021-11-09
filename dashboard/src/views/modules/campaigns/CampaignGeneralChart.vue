<template>
  <vx-card
    collapse-action
    :collapsed="collapsed"
    :title="$t('$CampaignsModules.DetailGeneralChartTitle', {
      entity: $tc(`$Entities.${entity}`, 2)
    })">
    <div class="w-full">
      <vx-card no-shadow>
        <vue-apex-charts
          type="area"
          height="350"
          :options="apexChartData.lineAreaChartSpline.chartOptions"
          :series="apexChartData.lineAreaChartSpline.series"></vue-apex-charts>
      </vx-card>
    </div>
  </vx-card>
</template>

<script>
import apexChartData from '@/views/charts-and-maps/charts/apex-charts/apexChartData';
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'CampaignGeneralChart',
  components: {
    VueApexCharts,
  },
  props: {
    entity: {
      type: String,
      required: true,
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      apexChartData,
    };
  },
};
</script>
