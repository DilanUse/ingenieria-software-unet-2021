<template>
  <vs-dropdown
    vs-trigger-click
    class="cursor-pointer">

    <div
      class="p-3 shadow-drop rounded-lg d-theme-dark-light-bg cursor-pointer
      flex items-end justify-center text-lg font-medium w-32">
      <span class="mr-2 leading-none">{{ $tc('$General.Action', 2) }}</span>
      <feather-icon
        icon="ChevronDownIcon"
        svgClasses="h-4 w-4" />
    </div>

    <vs-dropdown-menu>
      <vs-dropdown-item
        v-for="(option, index) in options"
        :key="index"
        @click="$emit(option.event)">
        <span class="flex items-center">
          <feather-icon
            :icon="option.icon"
            svgClasses="h-4 w-4"
            class="mr-2" />
          <span>{{ option.label }}</span>
        </span>
      </vs-dropdown-item>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>

export default {
  name: 'ListActionDropDown',
  props: {
    options: {
      type: Array,
      required: false,
      default() {
        return [];
      },
      validator(options) {
        return options.every((o) => 'label' in o && 'icon' in o && 'event' in o);
      },
    },
  },
};
</script>
