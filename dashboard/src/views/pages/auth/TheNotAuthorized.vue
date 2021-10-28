<template>
  <div class="h-screen bg-white flex w-full">
    <div
      class="vx-col flex items-center justify-center
      flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center">
        <img
          src="@/assets/img/vuexy/pages/not-authorized.png"
          alt="graphic-not-authorized" class="mx-auto mb-4">
        <h1 class="sm:mx-0 mx-4 sm:mb-12 mb-8 text-5xl d-theme-heading-color">
          {{ $t('$Auth.YouAreNotAuthorizedTitle') }}
        </h1>
        <p class="sm:mx-0 mx-4 sm:mb-12 mb-8">
          {{ $t('$Auth.YouAreNotAuthorizedMsg') }}
        </p>
        <vs-button size="large" to="/">{{ $t('$Auth.BackToDashboard') }}</vs-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TheNotAuthorized',
};
</script>
