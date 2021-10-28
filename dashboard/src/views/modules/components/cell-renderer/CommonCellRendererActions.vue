<template>
  <div class="flex justify-around">
    <vx-tooltip
      v-for="(action, index) in actions"
      :key="index"
      :color="action.color"
      :text="$t(action.text) | lowercase"
      :position="action.position"
      class="inline-block">
      <slot :name="`icon-${action.name}`">
        <feather-icon
          :icon="action.iconVue"
          :svgClasses="getClasses(index, action.color)"
          @click="$emit(action.name)"/>
      </slot>
    </vx-tooltip>
  </div>
</template>

<script>

export default {
  name: 'CommonCellRenderActions',
  props: {
    actions: {
      type: Array,
      required: true,
      validator(actions) {
        return actions.every((action) => action !== null
          && typeof action === 'object'
          && 'name' in action
          && 'color' in action
          && 'text' in action
          && 'position' in action
          && 'iconVue' in action);
      },
      default() {
        return [];
      },
    },
  },
  computed: {
    getClasses() {
      return (pos, color = 'primary') => [
        'h-5', 'w-5', `hover:text-${color}`, 'cursor-pointer',
        pos === 1 ? 'ml-4' : '',
        pos === 1 ? 'mr-2' : '',
        pos > 1 ? 'mx-2' : '',
      ];
    },
  },
};
</script>
