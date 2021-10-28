<template>
  <div
    class="btn-add-new p-2 mb-0 rounded-lg cursor-pointer flex
          items-center justify-end text-lg font-medium text-base text-primary
          border border-solid border-primary"
    @click="$emit('clicked')">
    <feather-icon
      :icon="icon"
      svgClasses="h-4 w-4"/>
    <span class="ml-2 text-base text-primary">
      <slot>{{ $t("$General.AddNew") }}</slot>
    </span>
  </div>
</template>

<script>


export default {
  name: 'BaseFlatIconButton',
  props: {
    icon: {
      type: String,
      required: false,
      default: 'PlusIcon',
    },
  },
};
</script>
