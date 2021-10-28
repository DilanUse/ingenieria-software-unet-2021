<template>
  <div class="vx-row mt-5">
    <div class="vx-col w-1/2">
      <slot name="footer-left"></slot>
    </div>

    <div class="vx-col w-1/2 flex items-end">
      <slot name="footer-right"></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BaseAgGridFooter',
};
</script>
