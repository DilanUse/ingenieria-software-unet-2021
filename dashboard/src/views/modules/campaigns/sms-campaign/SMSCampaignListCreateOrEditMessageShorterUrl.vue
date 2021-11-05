<template>
  <div class="flex items-end input-short-url-insert">
    <div class="w-full">
      <vs-input
        v-model="urlToShorted"
        :placeholder="$t('$SMSCampaignModule.InsertShortUrlPlaceholder')"
        class="w-full"
        :name="$tc('$General.URL')"
        :label="$t('$SMSCampaignModule.InsertShortUrlLabel')"
        icon-no-border
        icon="icon icon-link"
        icon-pack="feather"
        v-validate="'url'"
        data-vv-validate-on="blur|input"
        :danger="errors.has($t('$General.URL'))"
        :danger-text="errors.first($t('$General.URL'))"
        val-icon-danger="clear"/>
    </div>

    <vs-button
      :disabled="!urlToShorted || errors.has($t('$General.URL'))"
      class="ml-5"
      :class="{ 'mb-5': errors.has($t('$General.URL')) }"
      @click="insertShortUrl()">
      {{ $t('$SMSCampaignModule.InsertShortUrlButton') }}
    </vs-button>
  </div>
</template>

<script>
import shorterUrlService from '@/api/shorter-url-service';


export default {
  name: 'SMSCampaignListCreateOrEditMessageShorterUrl',
  data() {
    return {
      urlToShorted: '',
    };
  },
  methods: {
    async insertShortUrl() {
      this.$vs.loading({ type: 'radius' });
      const shorterUrl = await shorterUrlService.getUrlShorter(this.urlToShorted);
      this.$emit('insert', shorterUrl);
      this.urlToShorted = '';
      this.$vs.loading.close();
    },
  },
};
</script>

<style lang="scss" scoped>

.input-short-url-insert .vs-button {
  width: 170px;
  max-height: 38px;
}

@media (max-width: 540px) {
  .input-short-url-insert {
    flex-wrap: wrap;
    .vs-button {
      margin-left: 0px !important;
      margin-top: 0.5rem !important;
      width: 100%;
    }
  }
}

</style>
