<template>
<div>
  <div class="vx-row">
    <vx-card
      title="Column Chart"
      no-shadow>
      <vue-apex-charts
        type="bar"
        height="220"
        :options="apexChartData.columnChart.chartOptions"
        :series="apexChartData.columnChart.series"></vue-apex-charts>
    </vx-card>
  </div>

  <div class="v-row mt-5">
    <vs-table stripe  max-items="5" pagination :data="users">
      <template slot="thead">
        <vs-th>Name</vs-th>
        <vs-th>Phone</vs-th>
        <vs-th>Status</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="tr.username">
            {{tr.name}}
          </vs-td>
          <vs-td :data="tr.phone">
            {{tr.phone}}
          </vs-td>
          <vs-td :data="tr.status">
            {{tr.status}}
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</div>
</template>

<script>
import apexChartData from '@/views/charts-and-maps/charts/apex-charts/apexChartData';
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'CampaignCompareChart',
  components: {
    VueApexCharts,
  },
  data() {
    return {
      apexChartData,
      users: [
        {
          phone: 55156155,
          name: 'Johana Graham',
          status: 'recibido',
        },
        {
          phone: 12123312,
          name: 'Leanne Ana',
          status: 'recibido',
        },
        {
          phone: 12375673,
          name: 'Daniel Graham',
          status: 'recibido',
        },
        {
          phone: 76876567567,
          name: 'Adam Graham',
          status: 'recibido',
        },
        {
          phone: 978978322,
          name: 'Nicole Ana',
          status: 'recibido',
        },
        {
          phone: 44576587656,
          name: 'Maria Graham',
          status: 'recibido',
        },

      ],
    };
  },
};
</script>
