<template>
  <div class="layout--public-page">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created() {
    const $html = document.getElementsByTagName('html')[0];

    $html.classList.remove('vuexy');
    document.body.classList.remove('vuexy');
    $html.classList.add('aeroland');
    document.body.classList.add('aeroland');
  },
};
</script>
