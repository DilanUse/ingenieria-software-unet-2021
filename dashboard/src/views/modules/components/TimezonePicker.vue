<template>
  <div></div>
</template>

<script>
import jQuery from 'jquery';
import 'timezone-picker';
import 'select2';
import 'moment-timezone';

import 'timezone-picker/dist/styles/timezone-picker.css';
import 'select2/dist/css/select2.css';

const $ = jQuery;


export default {
  name: 'TimezonePicker',
  props: {
    value: {
      required: true,
    },
    hideMap: {
      type: Boolean,
      required: false,
      default: false,
    },
    quickLinks: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      timezone: this.value,
      $tzp: null,
    };
  },
  mounted() {
    const options = this.timezone
      ? {
        quickLink: this.quickLinks,
        defaultValue: {
          value: this.timezone,
          attribute: 'timezone',
        },
      }
      : {
        quickLink: this.quickLinks,
      };

    this.$tzp = $(this.$el).timezonePicker(options);
    this.mapMustBeHidden();

    this.timeZoneChanged();
    this.$tzp.on('map:value:changed', this.timeZoneChanged);
  },
  watch: {
    timezone() {
      this.$emit('input', this.timezone);
    },
    $mq() {
      this.mapMustBeHidden();
    },
  },
  methods: {
    timeZoneChanged() {
      this.timezone = this.$tzp.data('timezonePicker').getValue()[0].timezone;
    },
    mapMustBeHidden() {
      if (this.hideMap || this.$mq === this.$enums.mqBreakpoints.MOBILE) {
        $(this.$el).find('.timezone-map').hide();
        $(this.$el).find('.hover-text').hide();
      } else {
        $(this.$el).find('.timezone-map').show();
        $(this.$el).find('.hover-text').show();
      }
    },
  },
};
</script>

<style lang="scss">
.timezone-map polygon[data-selected=true] {
  fill: rgba(var(--vs-primary),1);
  stroke: rgba(var(--vs-primary),1);
}

.timezone-map polygon:hover {
  stroke: rgba(var(--vs-primary),.5);
  fill: rgba(var(--vs-primary),.5);
}

.timezone-map polygon {
  fill: white;
  stroke-width: .2;
  stroke: rgba(var(--vs-primary),1);
}

.timezone-map polygon[data-timezone="Atlantic/Azores"],
.timezone-map polygon[data-timezone="Atlantic/Bermuda"],
.timezone-map polygon[data-timezone="Atlantic/Canary"],
.timezone-map polygon[data-timezone="Atlantic/Cape_Verde"],
.timezone-map polygon[data-timezone="Atlantic/Faroe"],
.timezone-map polygon[data-timezone="Atlantic/Madeira"],
.timezone-map polygon[data-timezone="Atlantic/Reykjavik"],
.timezone-map polygon[data-timezone="Atlantic/South_Georgia"],
.timezone-map polygon[data-timezone="Atlantic/St_Helena"],
.timezone-map polygon[data-timezone="Atlantic/Stanley"],
.timezone-map polygon[data-timezone="Australia/Lord_Howe"],
.timezone-map polygon[data-timezone="Indian/Antananarivo"],
.timezone-map polygon[data-timezone="Indian/Chagos"],
.timezone-map polygon[data-timezone="Indian/Christmas"],
.timezone-map polygon[data-timezone="Indian/Cocos"],
.timezone-map polygon[data-timezone="Indian/Comoro"],
.timezone-map polygon[data-timezone="Indian/Kerguelen"],
.timezone-map polygon[data-timezone="Indian/Mahe"],
.timezone-map polygon[data-timezone="Indian/Maldives"],
.timezone-map polygon[data-timezone="Indian/Mauritius"],
.timezone-map polygon[data-timezone="Indian/Mayotte"],
.timezone-map polygon[data-timezone="Indian/Reunion"],
.timezone-map polygon[data-timezone="Pacific/Apia"],
.timezone-map polygon[data-timezone="Pacific/Chatham"],
.timezone-map polygon[data-timezone="Pacific/Chuuk"],
.timezone-map polygon[data-timezone="Pacific/Easter"],
.timezone-map polygon[data-timezone="Pacific/Enderbury"],
.timezone-map polygon[data-timezone="Pacific/Fakaofo"],
.timezone-map polygon[data-timezone="Pacific/Efate"],
.timezone-map polygon[data-timezone="Pacific/Fiji"],
.timezone-map polygon[data-timezone="Pacific/Funafuti"],
.timezone-map polygon[data-timezone="Pacific/Galapagos"],
.timezone-map polygon[data-timezone="Pacific/Gambier"],
.timezone-map polygon[data-timezone="Pacific/Kwajalein"],
.timezone-map polygon[data-timezone="Pacific/Guadalcanal"],
.timezone-map polygon[data-timezone="Pacific/Guam"],
.timezone-map polygon[data-timezone="Pacific/Honolulu"],
.timezone-map polygon[data-timezone="Pacific/Johnston"],
.timezone-map polygon[data-timezone="Pacific/Kiritimati"],
.timezone-map polygon[data-timezone="Pacific/Kosrae"],
.timezone-map polygon[data-timezone="Pacific/Majuro"],
.timezone-map polygon[data-timezone="Pacific/Midway"],
.timezone-map polygon[data-timezone="Pacific/Marquesas"],
.timezone-map polygon[data-timezone="Pacific/Nauru"],
.timezone-map polygon[data-timezone="Pacific/Niue"],
.timezone-map polygon[data-timezone="Pacific/Norfolk"],
.timezone-map polygon[data-timezone="Pacific/Noumea"],
.timezone-map polygon[data-timezone="Pacific/Pago_Pago"],
.timezone-map polygon[data-timezone="Pacific/Palau"],
.timezone-map polygon[data-timezone="Pacific/Pitcairn"],
.timezone-map polygon[data-timezone="Pacific/Pohnpei"],
.timezone-map polygon[data-timezone="Pacific/Port_Moresby"],
.timezone-map polygon[data-timezone="Pacific/Rarotonga"],
.timezone-map polygon[data-timezone="Pacific/Saipan"],
.timezone-map polygon[data-timezone="Pacific/Tahiti"],
.timezone-map polygon[data-timezone="Pacific/Tarawa"],
.timezone-map polygon[data-timezone="Pacific/Tongatapu"],
.timezone-map polygon[data-timezone="Pacific/Wake"],
.timezone-map polygon[data-timezone="Pacific/Wallis"] {
  display: none;
}

.filter-box {
  .quick-link span {
    &.active, &:hover {
      background-color: rgba(var(--vs-primary),1);
    }
  }

  .select2.select2-container.select2-container--default {
    width: 100% !important;
  }
}
</style>
