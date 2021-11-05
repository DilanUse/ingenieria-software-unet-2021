<template>
  <div :class="{container: !compactDesign}">
    <div class="vx-row">
      <div
          v-if="compactDesign"
          class="vx-col w-full mb-3">
        <label
            class="vs-input--label">
          {{ $t('$CampaignsModules.CampaignDeliveryType') }}*
        </label>
      </div>

      <div class="vx-col w-full">
        <card-radio-toggle
          v-model="deliveryTypeLocal"
          :radio-name="$t('$CampaignsModules.CampaignDeliveryType')"
          :radio-options="deliveryTypeCardRadioToggleOptions"/>

        <vs-input
          :value="deliveryTypeLocal"
          type="hidden"
          :name="$t('$CampaignsModules.CampaignDeliveryType')"
          v-validate="'required'"
          data-vv-validate-on="blur|input|change"/>
        <span
          v-show="errors.has($t('$CampaignsModules.CampaignDeliveryType'))"
          class="text-danger text-sm block">
            {{ errors.first($t('$CampaignsModules.CampaignDeliveryType')) }}
        </span>
      </div>
    </div>

    <div
      v-if="deliveryTypeLocal === $enums.Campaign.DeliveryType.LATER"
      class="mt-6">
      <div
        class="vx-row"
        :class="{'mb-base': compactDesign || $mq === this.$enums.mqBreakpoints.MOBILE}">
        <div class="vx-col w-full">
          <label
              class="vs-input--label">
            {{ $tc('$General.TimeZone') }}*
          </label>
          <time-zone-picker
            v-model="timeZoneLocal"
            :hide-map="compactDesign"/>
          <span
            v-show="errors.has($tc('$General.TimeZone'))"
            class="text-danger text-sm">
            {{ errors.first($tc('$General.TimeZone')) }}
          </span>
        </div>
      </div>

      <div class="vx-row mb-6">
        <div
            v-if="!compactDesign"
            class="vx-col sm:w-1/3 w-full">
          <span>{{ $t('$CampaignsModules.LocalStartTime') }}*</span>
        </div>
        <div
            class="vx-col w-full"
            :class="{'sm:w-2/3': !compactDesign}">
          <label
              v-if="compactDesign"
              class="vs-input--label required">
            {{ $tc('$CampaignsModules.LocalStartTime') }}
          </label>
          <flat-pickr
            v-model="localStartDateLocal"
            :config="configDateTimePicker"
            class="w-full"
            :placeholder="$t('$CampaignsModules.LocalStartTime')"/>
          <vs-input
            :value="localStartDateLocal"
            type="hidden"
            :name="$t('$CampaignsModules.LocalStartTime')"
            v-validate="'required'"
            data-vv-validate-on="blur|input|change"/>
          <span
            v-show="errors.has($t('$CampaignsModules.LocalStartTime'))"
            class="text-danger text-sm block">
            {{ errors.first($t('$CampaignsModules.LocalStartTime')) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import 'flatpickr/dist/flatpickr.css';
import flatPickr from 'vue-flatpickr-component';

import enums from '@/enums';
import campaignStep from '@/views/modules/mixins/campaigns/campaignStep';

// Components
import TimeZonePicker from '@/views/modules/components/TimezonePicker.vue';
import CardRadioToggle from '@/views/modules/components/CardRadioToggle.vue';


export default {
  name: 'CampaignDeliveryType',
  components: {
    flatPickr,
    TimeZonePicker,
    CardRadioToggle,
  },
  mixins: [campaignStep],
  props: {
    deliveryType: {
      type: String,
      required: true,
      validator(value) {
        return Object.values(enums.Campaign.DeliveryType).includes(value);
      },
    },
    localStartDate: {
      type: String,
      required: true,
    },
    timeZone: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      deliveryTypeLocal: this.deliveryType,
      timeZoneLocal: this.timeZone,
      localStartDateLocal: this.localStartDate,
      configDateTimePicker: {
        defaultDate: this.localStartDate ? new Date(this.localStartDate) : '',
        enableTime: true,
        enableSeconds: true,
        minDate: new Date(),
        minTime: this.campaignType === this.$enums.Campaign.Type.EMAIL ? '' : '8:00',
        maxTime: this.campaignType === this.$enums.Campaign.Type.EMAIL ? '' : '16:00',
        disable: this.campaignType === this.$enums.Campaign.Type.EMAIL
          ? []
          : [(date) => (date.getDay() === 0)],
        locale: {
          firstDayOfWeek: 1, // start week on Monday
        },
        // dateFormat: 'd-m-Y H:i:s',
      },
      deliveryTypeCardRadioToggleOptions: [
        {
          value: this.$enums.Campaign.DeliveryType.IMMEDIATELY,
          label: this.$t('$CampaignsModules.CampaignStartImmediately'),
        },
        {
          value: this.$enums.Campaign.DeliveryType.LATER,
          label: this.$t('$CampaignsModules.CampaignScheduleLater'),
        },
      ],
    };
  },
  computed: {
    isValid() {
      return !this.errors.any()
        && !!this.deliveryTypeLocal
        && (this.deliveryTypeLocal === this.$enums.Campaign.DeliveryType.IMMEDIATELY
          || (!!this.timeZoneLocal && !!this.localStartDateLocal));
    },
  },
  watch: {
    deliveryTypeLocal(val) {
      if (val === this.$enums.Campaign.DeliveryType.LATER) {
        this.timeZoneLocal = '';
        this.localStartDateLocal = '';
      }

      this.$emit('update:delivery-type', val);
    },
    localStartDateLocal(val) {
      this.validateLocalStartDateLocal();
      this.$emit('update:local-start-date', val);
    },
    timeZoneLocal(val) {
      this.$emit('update:time-zone', val);
    },
    isValid: {
      immediate: true,
      handler(val) {
        this.$emit('validate', val);
      },
    },
  },
  methods: {
    validateLocalStartDateLocal() {
      setTimeout(() => this.$validator.validate(this.$t('$CampaignsModules.LocalStartTime')));
    },
  },
};
</script>
