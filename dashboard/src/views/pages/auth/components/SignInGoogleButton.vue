<template>
  <div class="google-btn flex items-center w-full"
    @click="$emit('click')">
    <div class="google-icon-wrapper">
      <img
        class="google-icon"
        alt="Google Logo"
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
    </div>
    <p class="btn-text mx-auto">
      <slot>
        {{ $t('$Auth.SignInWithGoogle') }}
      </slot>
    </p>
  </div>
</template>

<script>

export default {
  name: 'SignInGoogleButton',
};
</script>

<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:500);

.google-btn {
  width: 184px;
  height: 42px;
  background-color: #4285f4;
  border-radius: 6px;
  box-shadow: 0 3px 4px 0 rgba(0,0,0,.25);
  .google-icon-wrapper {
    position: absolute;
    margin-left: 1px;
    width: 40px;
    height: 40px;
    border-radius: 6px;
    background-color: #fff;
  }
  .google-icon {
    margin-top: 11px;
    margin-left: 11px;
    width: 18px;
    height: 18px;
  }
  .btn-text {
    color: #fff;
    font-size: 14px;
    letter-spacing: 0.2px;
    font-family: "Roboto", serif;
  }

  &:hover {
    box-shadow: 0 0 6px #4285f4;
    cursor: pointer;
  }

  &:active {
    background: #1669F2;
  }
}
</style>
