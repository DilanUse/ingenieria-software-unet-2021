<template>
<div>
  <div class="vx-row">
    <div class="vx-col w-full mb base">
      <vx-card
        title="Messages information"
        no-shadow>
        <vue-apex-charts
          type="bar"
          height="250"
          :options="barChartOptions"
          :series="barChartSeries">
        </vue-apex-charts>
      </vx-card>
    </div>
  </div>

  <div class="vx-row">
    <div class="vx-col w-full md:w-1/2 mb base">
      <vx-card
        title="Outbound vs Bounced"
        no-shadow>
        <vue-apex-charts
          type="pie"
          height="250"
          :options="OutboundBouncedPieChartOptions"
          :series="outboundBouncedPieChartSeries">
        </vue-apex-charts>
      </vx-card>
    </div>
    <div class="vx-col w-full md:w-1/2 mb base">
      <vx-card
        :title="`${isVoicemail ? 'DNC' : 'Opt-out'} rate`"
        no-shadow>
        <vue-apex-charts
          type="pie"
          height="250"
          :options="optOutDncPieChartOptions"
          :series="optOutDncPieChartSeries">
        </vue-apex-charts>
      </vx-card>
    </div>
  </div>

  <details-table
    :campaign-id="modelPayload.id"
    :fetch-details-function="fetchDetailsFunction"
    hide-actions-column
    hide-timestamps-columns>
  </details-table>
</div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import enums from '@/enums';

// Custom Components
import CampaignSpecifiedChartDetailsTable from '@/views/modules/campaigns/CampaignSpecifiedChartDetailsTable.vue';

// Others
import commonChartsAndAnalytics from '@/views/charts-and-maps/charts/commonChartsAndAnalytics';
import themeConfig from '../../../../themeConfig';

export default {
  name: 'CampaignSpecifiedChart',
  components: {
    VueApexCharts,
    detailsTable: CampaignSpecifiedChartDetailsTable,
  },
  mixins: [commonChartsAndAnalytics],
  props: {
    entity: {
      type: String,
      required: true,
    },
    campaignType: {
      type: String,
      required: true,
      validator(value) {
        return Object.values(enums.Campaign.Type).indexOf(value) !== -1;
      },
    },
    fetchFunction: {
      type: Function,
      required: true,
    },
    fetchDetailsFunction: {
      type: Function,
      required: true,
    },
    modelPayload: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      model: null,
      details: [],
      detailsTotalCount: 0,
      maxDetailsPerPage: 5,
      OutboundBouncedPieChartOptions: {
        labels: ['Outbound', 'Bounced'],
        colors: [
          themeConfig.colors.success,
          themeConfig.colors.danger,
        ],
      },
      optOutDncPieChartOptions: {
        labels: this.campaignType === this.$enums.Campaign.Type.VOICEMAIL
          ? ['Out DNC', 'In DNC']
          : ['No opt-out', 'opt-out'],
        colors: [
          themeConfig.colors.success,
          themeConfig.colors.warning,
        ],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        }],
      },
    };
  },
  computed: {
    isSMS() {
      return this.campaignType === this.$enums.Campaign.Type.SMS;
    },
    isVoicemail() {
      return this.campaignType === this.$enums.Campaign.Type.VOICEMAIL;
    },
    isEmail() {
      return this.campaignType === this.$enums.Campaign.Type.EMAIL;
    },
    outbound() {
      return this.model ? this.model.outbound : 0;
    },
    bounced() {
      return this.model ? this.model.bounced : 0;
    },
    inbound() {
      return this.model ? this.model.inbound : 0;
    },
    contactsInDNC() {
      return this.model ? this.model.contactsInDNC : 0;
    },
    optOuts() {
      return this.model ? this.model.optOut || 0 : 0;
    },
    dncOrOptOuts() {
      return this.isVoicemail
        ? this.contactsInDNC
        : this.optOuts;
    },
    maxSeriesValue() {
      let max = this.outbound > this.bounced ? this.outbound : this.bounced;

      if (this.isSMS) {
        max = max > this.inbound ? max : this.inbound;
        max = max > this.optOuts ? max : this.optOuts;
      }

      if (this.isVoicemail) {
        max = max > this.contactsInDNC ? max : this.contactsInDNC;
      }

      if (this.isEmail) {
        max = max > this.optOuts ? max : this.optOuts;
      }

      return max;
    },
    barChartSeries() {
      const data = [
        this.outbound,
        this.bounced,
      ];

      if (this.isSMS) {
        data.push(this.inbound);
        data.push(this.optOuts);
      }

      if (this.isVoicemail) {
        data.push(this.contactsInDNC);
      }

      if (this.isEmail) {
        data.push(this.optOuts);
      }

      return [{
        name: 'Messages',
        data,
      }];
    },
    barChartOptions() {
      const colors = [
        themeConfig.colors.success,
        themeConfig.colors.danger,
      ];

      const categories = [
        'Outbound',
        'Bounced',
      ];

      if (this.isSMS) {
        colors.push(themeConfig.colors.primary);
        colors.push(themeConfig.colors.warning);
        categories.push('Inbound');
        categories.push('Opt-out');
      }

      if (this.isVoicemail) {
        colors.push(themeConfig.colors.warning);
        categories.push('To contacts in DNC');
      }

      if (this.isEmail) {
        colors.push(themeConfig.colors.warning);
        categories.push('Opt-out');
      }

      const options = {
        colors,
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories,
          labels: {
            style: {
              colors,
              fontSize: '12px',
              fontWeight: 'bold',
            },
          },
        },
        yaxis: {
          title: {
            text: 'Messages',
          },
          labels: {
            formatter(val) {
              return val.toFixed(0);
            },
          },
        },
        legend: {
          show: false,
        },
        fill: {
          opacity: 1,
        },
      };

      if (this.maxSeriesValue < 3) {
        options.yaxis.tickAmount = this.maxSeriesValue;
      }

      return options;
    },
    outboundBouncedPieChartOptions() {
      return this.contactsPieAnalyticsChartSeries.length < 2
        ? this.pieChartsContactsNoDataOptions
        : this.contactsPieChartDefaultOptions;
    },
    outboundBouncedPieChartSeries() {
      if (this.outbound === 0 && this.bounced === 0) {
        return [1];
      }

      return [
        this.outbound,
        this.bounced,
      ];
    },
    optOutDncPieChartSeries() {
      return [
        this.outbound - this.dncOrOptOuts,
        this.dncOrOptOuts,
      ];
    },
  },
  created() {
    this.fetchInfo();
  },
  methods: {
    async fetchInfo() {
      this.$vs.loading({ type: 'radius' });
      await this.fetchCampaign();
      // await this.fetchCampaignDetails();
      this.$vs.loading.close();
    },
    async fetchCampaign() {
      this.model = await this.fetchFunction(this.modelPayload.id);
    },
    async fetchCampaignDetails(page = 1) {
      const resp = await this.fetchDetailsFunction({
        id: this.modelPayload.id,
        params: {
          skip: (page - 1) * this.maxDetailsPerPage,
          limit: this.maxDetailsPerPage,
          populate: [
            {
              path: 'contact',
              select: 'id firstName lastName name',
            },
          ],
        },
      });

      this.details = resp.data || [];
      this.detailsTotalCount = resp.count || 0;
    },
    textColorByStatus(status) {
      switch (status) {
        case 'pending':
          return 'text-warning';
        case 'bounced':
          return 'text-danger';
        case 'outbound':
          return 'text-success';

        default:
          return '';
      }
    },
    iconByStatus(status) {
      switch (status) {
        case 'pending':
          return 'ClockIcon';
        case 'bounced':
          return 'XIcon';
        case 'outbound':
          return 'CheckIcon';

        default:
          return '';
      }
    },
    async handleChangePage(page) {
      await this.fetchCampaignDetails(page);
    },
  },
};
</script>
