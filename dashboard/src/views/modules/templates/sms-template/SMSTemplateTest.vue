<template>
  <vx-card>
    <vs-tabs
      alignment="fixed"
      :value="0">
      <vs-tab
        label="Active template">
        <s-m-s-template-list
          :actions-min-width="200"/>
      </vs-tab>

      <vs-tab
        label="Paper bin">
        <s-m-s-template-list
          trash
          :actions-min-width="150"/>
      </vs-tab>
    </vs-tabs>
  </vx-card>
</template>

<script>
import SMSTemplateList from '@/views/modules/templates/sms-template/SMSTemplateList.vue';

export default {
  name: 'SMSTemplateTest',
  components: {
    SMSTemplateList,
  },
};
</script>

<style scoped>

</style>
