<template>
  <statistics-card-line
    hideChart
    :icon="icon"
    icon-right
    :color="color"
    :statistic="count"
    :statisticTitle="title">
    <template
      v-if="$slots.footer"
      v-slot:footer>
      <slot name="footer"></slot>
    </template>
  </statistics-card-line>
</template>

<script>
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue';


export default {
  name: 'GsStatisticsCardCount',
  components: {
    StatisticsCardLine,
  },
  props: {
    fetchDataFunction: {
      type: Function,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  data() {
    return {
      count: 0,
    };
  },
  created() {
    this.getCount();
  },
  methods: {
    async getCount() {
      this.count = await this.fetchDataFunction() || 0;
      this.$emit('count', this.count);
    },
  },
};
</script>
