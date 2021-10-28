<template>
  <div>
    <vs-divider/>
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="flex flex-wrap items-center justify-end">
          <vx-tooltip
            v-for="(action, index) in actions"
            :key="index"
            :color="action.color"
            :text="$t(action.text) | lowercase"
            :position="action.position"
            class="inline-block">
            <vs-button
              :class="[index > 0 ? 'ml-2' : '']"
              :color="action.color"
              size="small"
              icon-pack="feather"
              :icon="action.icon"
              @click="emitAction(action)">
            </vs-button>
          </vx-tooltip>

          <vs-button
            v-if="!hideSave"
            class="ml-auto"
            @click="$emit('save')"
            :disabled="disabledSave">
            <slot name="save">{{ $t('$General.Save') }}</slot>
          </vs-button>
          <vs-button
            :class="hideSave ? 'ml-auto' : 'ml-4'"
            color="warning"
            @click="$emit('cancel')">
            <slot name="cancel">{{ $t('$General.Cancel') }}</slot>
          </vs-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'BaseFormFooterActionButtons',
  props: {
    disabledSave: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideSave: {
      type: Boolean,
      required: false,
      default: false,
    },
    actions: {
      type: Array,
      required: false,
      validator(actions) {
        return actions.every(
          (a) => 'name' in a && 'color' in a
            && 'text' in a && 'position' in a && 'icon' in a,
        );
      },
      default() {
        return [];
      },
    },
  },
  methods: {
    emitAction(action) {
      this.$emit('action', action.name);
    },
  },
};
</script>
