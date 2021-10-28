<template>
  <div
    v-if="params.value"
    class="flex items-center overflow-auto">
    <vs-avatar
      class="flex-shrink-0 mr-2"
      size="30px"
      :src="params.data.avatar"
      @click="clickAction" />

    <a
      href="#"
      class="text-inherit hover:text-primary"
      @click.stop.prevent="clickAction">
      {{ params.value }}
    </a>
  </div>
</template>

<script>


export default {
  name: 'UserListCellRendererLink',
  methods: {
    clickAction() {
      this.params.context.componentParent.viewRecord(this.params.data);
    },
  },
};
</script>
