<template>
  <div class="w-full card-radio-toggle">
    <vs-radio
      v-for="(option, index) in radioOptions"
      :key="index"
      v-model="valueLocal"
      :name="radioName"
      :vs-value="option.value"
      :disabled="option.disabled"
      class="radio-card"
      :class="getPositionClasses(index)"
      @click="$emit('clicked')">
      {{ option.label | uppercase }}
    </vs-radio>
  </div>
</template>

<script>

export default {
  name: 'CardRadioToggle',
  props: {
    value: {
      type: String,
      required: true,
    },
    radioName: {
      type: String,
      required: true,
    },
    radioOptions: {
      type: Array,
      required: true,
      validator(radioOptions) {
        return radioOptions.length > 1
          && radioOptions.every((opt) => opt !== null
          && typeof opt === 'object'
          && 'value' in opt
          && 'label' in opt);
      },
    },
  },
  data() {
    return {
      valueLocal: this.value,
    };
  },
  watch: {
    value(val) {
      this.valueLocal = val;
    },
    valueLocal(val) {
      this.$emit('input', val);
    },
  },
  methods: {
    getPositionClasses(index) {
      const classes = [];

      if (index > 0 && index < this.radioOptions.length - 1) {
        classes.push('middle');
      } else {
        if (index === 0) {
          classes.push('first');
        }

        if (index === this.radioOptions.length - 1) {
          classes.push('last');
        }
      }

      return classes;
    },
  },
};
</script>

<style lang="scss">
.card-radio-toggle {
  display: flex;
  border: 1px solid rgba(var(--vs-dark),0.3);
  padding: 4px;
  border-radius: 100px;

  .radio-card {
    width: 100%;
    height: 40px;
    position: relative;
    display: flex;
    justify-content: center !important;
    align-items: center !important;

    input, .vs-radio {
      width: 100%;
      height: 100%;
    }

    .vs-radio--label {
      position: absolute;
      font-size: 11px;
      font-weight: 600;
      margin-left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .vs-radio--label .wizard-icon {
      font-size: 25px;
      margin-bottom: 5px;
    }
  }

  .vs-radio .vs-radio--circle {
    background: rgba(var(--vs-grey-light),0.5);
    border: 2px solid rgba(var(--vs-primary),1);
    box-shadow: none;
  }

  .vs-radio--borde {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  .first .vs-radio {
    .vs-radio--borde {
      border-width: 2px 0 2px 2px !important;
    }

    .vs-radio--borde, .vs-radio--circle {
      border-radius: 5px 0 0 5px;
    }
  }

  .middle .vs-radio {
    .vs-radio--borde {
      border-width: 2px 0 2px 0 !important;
    }

    .vs-radio--borde, .vs-radio--circle {
      border-radius: 0;
    }
  }

  .last .vs-radio {
    .vs-radio--borde {
      border-width: 2px 2px 2px 0 !important;
    }

    .vs-radio--borde, .vs-radio--circle {
      border-radius: 0 5px 5px 0;
    }
  }

  .vs-radio--input:disabled + .vs-radio + .vs-radio--label {
    color: rgba(var(--vs-grey), 1);
  }

  .vs-radio--input:checked + .vs-radio .vs-radio--circle {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
      background: rgba(var(--vs-primary), 1);
      border: 2px solid rgba(var(--vs-primary), 1);
      border-radius: 100px;
  }

  .vs-radio--input:checked + .vs-radio + .vs-radio--label {
    color: white;
    transition: 0.3s;
  }
}

@media screen and (max-width: 575px) {
  .card-radio-toggle {
    display: table;
    //border-radius: 20px;
    border: none;
    padding: 0;
    border-radius: 0;

    .radio-card {
      margin: 3px 0px;
    }

    .radio-card .vs-radio {
      margin: 3px 0px 3px 10px;
      left: 0px;
      position: absolute;
      width: 30px;
      height: 30px;
    }

    .vs-radio--input:checked + .vs-radio + .vs-radio--label {
      color: rgba(var(--vs-primary), 1);
      transition: 0.3s;
    }

    .con-vs-radio {
      display: flex;
    }

    .con-vs-radio .vs-radio--input {
      width: 10%;
      margin: 3px 0px 3px 10px
    }

    .radio-card .vs-radio--label {
      display: block;
      text-align: left;
    }

    .con-vs-radio .vs-radio--label {
      width: 70%;
    }

    .vs-radio--input:checked + .vs-radio .vs-radio--circle {
      height: 100%;
    }

    .vs-radio--input + .vs-radio .vs-radio--circle {
      opacity: 1;
      transform: scale(1);
      border: 1px solid rgba(var(--vs-primary), 0.3);
      border-radius: 100px;
    }
  }
}

@media screen and (max-width: 390px) {
  .card-radio-toggle {
    .con-vs-radio .vs-radio--label {
      width: 60%;
    }
  }
}

@media screen and (max-width: 320px) {
  .card-radio-toggle {
    .con-vs-radio .vs-radio--label {
      padding-left: 8px;
    }
  }
}
</style>
