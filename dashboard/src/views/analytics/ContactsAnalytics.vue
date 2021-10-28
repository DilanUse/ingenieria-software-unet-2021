<template>
  <div>
    <div class="vx-row mb-base">
      <div class="vx-col w-full md:w-1/3">
        <gs-statistics-card-count
          :fetch-data-function="fetchCountContacts"
          :title="$tc('$Entities.Contact', 2)"
          icon="UserIcon"/>
      </div>
    </div>

    <vx-card
      :title="$t('$DashboardAnalyticsPage.ContactsAnalyticsCardTitle')"
      collapse-action
      class="mt-base">
      <vs-tabs>
        <vs-tab
          :label="$t('$DashboardAnalyticsPage.ContactsBehaviorTabsTitle')">
          <gs-line-chart
            :series-info="contactsLinesSeriesInfo"
            :fetch-data-function="fetchAnalyticsLinesContacts"
            :y-axis-title="$tc('$Entities.Contact', 2)"
            :no-data-title="$t('$DashboardAnalyticsPage.ContactsLineChartsNoDataTitle')"
            :no-data-subtitle="$t('$DashboardAnalyticsPage.ContactsLineChartsNoDataSubtitle')"/>
        </vs-tab>

        <vs-tab
          :label="$t('$DashboardAnalyticsPage.ContactsMarketingStatusTabsTitle')">
          <gs-pie-chart
            :series-info="contactsPieSeriesInfo"
            :fetch-data-function="fetchAnalyticsPieContacts"
            :no-data-title="this.$t('$DashboardAnalyticsPage.ContactsPieChartsNoDataTitle')"
            :no-data-subtitle="this.$t('$DashboardAnalyticsPage.ContactsPieChartsNoDataSubtitle')"/>
        </vs-tab>
      </vs-tabs>
    </vx-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import GsStatisticsCardCount from '@/views/charts-and-maps/charts/GsStatisticsCardCount.vue';
import GsLineChart from '@/views/charts-and-maps/charts/GsLineChart.vue';
import GsPieChart from '@/views/charts-and-maps/charts/GsPieChart.vue';
import themeConfig from '../../../themeConfig';


export default {
  name: 'ContactsAnalytics',
  components: {
    GsStatisticsCardCount,
    GsLineChart,
    GsPieChart,
  },
  data() {
    return {
      contactsLinesSeriesInfo: [{
        name: this.$tc('$Entities.Contact', 2),
        key: 'numberContacts',
        color: themeConfig.colors.primary,
      }],
      contactsPieSeriesInfo: [
        {
          name: this.$t('$General.Subscribed'),
          key: 'contactsSubscribed',
          color: themeConfig.colors.primary,
        },
        {
          name: this.$t('$General.Unsubscribed'),
          key: 'contactsUnsubscribed',
          color: themeConfig.colors.warning,
        },
      ],
    };
  },
  methods: {
    ...mapActions({
      fetchCountContacts: 'contact/fetchCountContacts',
      fetchAnalyticsLinesContacts: 'contact/fetchAnalyticsLines',
      fetchAnalyticsPieContacts: 'contact/fetchAnalyticsPie',
    }),
  },
};
</script>

<style scoped>

</style>
