<template>
  <div class="container-fluid">
    <vs-navbar v-model="activeItem" class="p-2">

      <div slot="title">
        <vs-navbar-title><span>Loyalty App</span></vs-navbar-title>
      </div>

      <vs-navbar-item index="0">
        <a href="#">Home</a>
      </vs-navbar-item>

      <vs-navbar-item index="1">
        <a href="/login">Login</a>
      </vs-navbar-item>

      <vs-navbar-item index="2">
        <a href="/register">Register</a>
      </vs-navbar-item>
    </vs-navbar>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    activeItem: 0,
  }),
};
</script>

<style scoped>

</style>
