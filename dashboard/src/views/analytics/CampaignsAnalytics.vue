<template>
  <div>
    <div class="vx-row mb-base">
      <div class="vx-col w-full md:w-1/3 mt-5 md:mt-0">
        <gs-statistics-card-count
          :fetch-data-function="fetchCountSMSCampaigns"
          :title="$tc('$General.Campaign', 2)"
          icon="SendIcon"
          color="success"/>
      </div>
    </div>

    <vx-card
      :title="$t('$DashboardAnalyticsPage.CampaignsAnalyticsCardTitle')"
      collapse-action>
      <gs-line-chart
        :fetch-data-function="fetchAnalyticsSmsCampaigns"
        :series-info="smsCampaignsSeriesInfo"
        :y-axis-title="$tc('$General.Message', 2)"
        :no-data-title="$t('$DashboardAnalyticsPage.CampaignsLineChartsNoDataTitle')"
        :no-data-subtitle="$t('$DashboardAnalyticsPage.CampaignsLineChartsNoDataSubtitle')"/>
    </vx-card>

  </div>
</template>

<script>
import { mapActions } from 'vuex';

// Components
import GsLineChart from '@/views/charts-and-maps/charts/GsLineChart.vue';
import GsStatisticsCardCount from '@/views/charts-and-maps/charts/GsStatisticsCardCount.vue';

// Others
import themeConfig from '../../../themeConfig';


export default {
  components: {
    GsLineChart,
    GsStatisticsCardCount,
  },
  data() {
    return {
      smsCampaignsSeriesInfo: [
        {
          name: this.$t('$General.Outbound'),
          key: 'outbound',
          color: themeConfig.colors.success,
        },
        {
          name: this.$t('$General.Bounced'),
          key: 'bounced',
          color: themeConfig.colors.danger,
        },
        {
          name: this.$t('$General.Inbound'),
          key: 'inbound',
          color: themeConfig.colors.primary,
        },
      ],
    };
  },
  methods: {
    ...mapActions({
      fetchAnalyticsSmsCampaigns: 'smsCampaign/fetchAnalytics',
      fetchCountSMSCampaigns: 'smsCampaign/fetchCountSMSCampaigns',
    }),
  },
};
</script>
