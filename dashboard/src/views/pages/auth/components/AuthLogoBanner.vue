<template>
  <div class="w-full flex py-base px-base items-center justify-center md:justify-start">
    <router-link
      tag="div"
      class="vx-logo w-6/12 md:w-3/12 lg:w-2/12 cursor-pointer"
      to="/">
      <logo
        full
        width="100%"/>
    </router-link>
  </div>
</template>

<script>
import Logo from '@/layouts/components/Logo.vue';

export default {
  name: 'AuthLogoBanner',
  components: {
    Logo,
  },
};
</script>
