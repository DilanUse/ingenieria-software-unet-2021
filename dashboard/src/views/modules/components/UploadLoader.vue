<template>
  <div id="loading-file-bg">
    <div class="loading-logo">
      <p class="text-primary font-medium text-center">{{ textLocal }}...</p>

    </div>
    <div class="loading">
      <vs-progress
        style="z-index: 300001"
        indeterminate
        color="primary"
        class="mt-3">
      </vs-progress>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UploadLoader',
  props: {
    text: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      textLocal: this.text !== '' ? this.text : this.$t('$General.Uploading'),
    };
  },
};
</script>

<style lang="scss" scoped>
  #loading-file-bg{
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.8);
    /*opacity: 0.8;*/
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 30000;
  }
  .loading-logo{
    position: absolute;
    width: 200px;
    left: calc(50% - 100px);
    top: 40%;
  }
  .loading {
    position: absolute;
    width: 300px;
    left: calc(50% - 150px);
    top: 45%;
    border-radius: 50%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 3px solid transparent;
  }
  .loading .effect-1,  .loading .effect-2{
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-left: 3px solid rgba(121, 97, 249,1);
    border-radius: 50%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .loading .effect-1{
    animation: rotate 1s ease infinite;
  }
  .loading .effect-2{
    animation: rotateOpacity 1s ease infinite .1s;
  }
  .loading .effect-3{
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-left: 3px solid rgba(121, 97, 249,1);
    -webkit-animation: rotateOpacity 1s ease infinite .2s;
    animation: rotateOpacity 1s ease infinite .2s;
    border-radius: 50%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .loading .effects{
    transition: all .3s ease;
  }

  @keyframes rotate{
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(1turn);
      transform: rotate(1turn);
    }
  }
  @keyframes rotateOpacity{
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
      opacity: .1;
    }
    100% {
      -webkit-transform: rotate(1turn);
      transform: rotate(1turn);
      opacity: 1;
    }
  }
</style>
