<template>
  <div class="confirm-item">
    <div
      class="confirm-item-title flex justify-between items-center py-3 px-5"
      :class="{first: first, last: last}">
      <div class="flex items-center">
        <feather-icon
          icon="CheckCircleIcon"
          svgClasses="h-5 w-5 mr-2 text-success" />
        <h4 class="font-bold text-gray-dark">{{ title }}</h4>
        <small class="ml-5"><slot name="subtitle">{{ subtitle }}</slot></small>
      </div>

      <a
        href="#"
        @click.prevent="$emit('return')">
        {{ $t('$CampaignsModules.$CampaignConfirm.ReturnToStepLink') }}
      </a>
    </div>
    <div class="confirm-item-body py-6 px-5">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CampaignConfirmItem',
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
    first: {
      type: Boolean,
      required: false,
    },
    last: {
      type: Boolean,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-wrapper {
  .confirm-item-title {
    border-top: 1px solid rgba(var(--vs-grey),1);
    border-bottom: 1px solid rgba(var(--vs-grey),1);
    background: rgba(var(--vs-grey-light),0.20);

    &.first {
      border-top: none;
    }

    &.last {
      border-bottom: none;
    }
  }
}

@media (max-width: 600px) {
  .confirm-wrapper {
    .confirm-item-title {
      flex-wrap: wrap !important;

      .flex.items-center {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: start !important;
      }

      a {
        text-align: right;
      }

      h4 {
        padding-right: 1.5rem;
        margin-bottom: 0.5rem;
        width: 170px;
        margin-right: auto;
      }

      small {
        width: 100%;
        margin-left: 0 !important;
        margin-bottom: 0.5rem;
        text-align: left;
      }
    }
  }
}

@media (max-width: 350px) {
  .confirm-wrapper {
    .confirm-item-title {

      h4 {
        width: 130px;
      }

    }
  }
}

</style>
