<!-- =========================================================================================
  File Name: FullPage.vue
  Description: Full page layout
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="layout--full-page">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    created() {
      const $html = document.getElementsByTagName('html')[0];

      $html.classList.remove('aeroland');
      document.body.classList.remove('aeroland');
      $html.classList.add('vuexy');
      document.body.classList.add('vuexy');
    },
  };
</script>
