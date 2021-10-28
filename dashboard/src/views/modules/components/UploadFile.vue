<template>
  <div class="excel-import">
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      :name="fileInputName"
      :accept="acceptExtList"
      v-validate="`ext:${acceptExtListVeeValidate}|size:${maxFileSize}`"
      data-vv-validate-on="blur|input|change"
      @change="onInputFileChange">
    <div
      @click="onClickDragContainer"
      @drop="onDropContainer"
      @dragover="onDragoverContainer"
      @dragenter="onDragoverContainer"
      @dragleave="onDragLeaveContainer"
      :class="[
        'px-8',
        !minimal ? 'py-8' : 'py-2',
        'text-center', 'border-dashed', 'text-xl', 'border-2',
        borderDanger || errors.has(fileInputName) ? 'border-danger' : 'd-theme-border-grey-light',
        'd-theme-dark-bg',
        this.file === null ? 'cursor-pointer' : '',
        this.dragIn ? 'bg-drag-color' : ''
        ]">
      <template v-if="file === null">
        <feather-icon
          v-if="!minimal"
          icon="UploadCloudIcon"
          svgClasses="h-16 w-16 stroke-current text-grey"
          class="block" />
        <span>{{ $t('$Components.$UploadFile.ContainerDropMsg', { type: this.fileType }) }} </span>
        <span
          class="font-medium text-primary"
          @click.stop="$refs.fileInput.click()">{{ $t('$General.Browse') }}</span>
      </template>
      <template v-else>
        <feather-icon
          v-if="!minimal"
          icon="TrashIcon"
          svgClasses="h-16 w-16 stroke-current text-grey cursor-pointer"
          class="block"
          @click.prevent="removeFile" />
        <p>{{ this.file.name }}</p>
      </template>
    </div>
    <span
      v-show="errors.has(fileInputName)"
      class="text-danger text-sm">
      {{ errors.first(fileInputName) }}
    </span>
  </div>
</template>

<script>

export default {
  name: 'UploadFile',
  props: {
    fileType: {
      type: String,
      required: false,
      default: '',
    },
    acceptExt: {
      type: Array,
      required: true,
      validator(extensions) {
        let valid = true;
        const patter = /\.([a-zA-Z]|[0-9])+/;

        extensions.forEach((ext) => {
          if (typeof ext !== 'string' || !patter.test(ext)) {
            valid = false;
          }
        });

        return valid;
      },
    },
    minimal: {
      type: Boolean,
      required: false,
      default: false,
    },
    borderDanger: {
      type: Boolean,
      required: false,
      default: false,
    },
    maxFileSize: {
      type: Number,
      required: false,
      default: 5120,
    },
    fileInputName: {
      type: String,
      required: false,
      default: 'File',
    },
  },
  data() {
    return {
      file: null,
      dragIn: false,
    };
  },
  computed: {
    acceptExtList() {
      return this.acceptExt.toString().replaceAll(',', ', ');
    },
    acceptExtListVeeValidate() {
      return this.acceptExt.toString().replaceAll('.', '');
    },
    acceptExtListPatter() {
      return this.acceptExt.toString().replace(/\./g, '').replace(/,/g, '|');
    },
  },
  watch: {
    file(val) {
      this.$emit('file', val);
    },
  },
  methods: {
    onClickDragContainer() {
      if (this.file === null) {
        this.$refs.fileInput.click();
      }
    },
    onDragoverContainer(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      this.dragIn = true;
    },
    onDragLeaveContainer(e) {
      e.stopPropagation();
      e.preventDefault();
      this.dragIn = false;
    },
    onDropContainer(e) {
      e.stopPropagation();
      e.preventDefault();
      this.dragIn = false;
      const { files } = e.dataTransfer;
      if (files.length !== 1) {
        this.$vs.notify({
          title: this.$t('$Components.$UploadFile.UploadAttemptTitle'),
          text: this.$t('$Components.$UploadFile.UploadCountFailMsg'),
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning',
        });

        this.resetFileInput();
      } else {
        const rawFile = files[0];
        this.checkFileType(rawFile);
      }
    },
    async onInputFileChange(e) {
      const { files } = e.target;
      const rawFile = files[0];

      const fileIsValid = await this.$validator.validate(this.fileInputName);

      if (fileIsValid) {
        this.checkFileType(rawFile);
      }
    },
    checkFileType(rawFile) {
      if (!this.isAcceptFileType(rawFile)) {
        this.$vs.notify({
          title: this.$t('$Components.$UploadFile.UploadAttemptTitle'),
          text: this.$t('$Components.$UploadFile.UploadExtensionsFailMsg', {
            acceptExtList: this.acceptExtList,
          }),
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning',
        });

        this.resetFileInput();
      } else {
        this.file = rawFile;
      }
    },
    isAcceptFileType(file) {
      const patter = new RegExp(`\\.(${this.acceptExtListPatter})$`);
      return patter.test(file.name);
    },
    removeFile(e) {
      if (e !== undefined) {
        e.stopPropagation();
      }
      this.file = null;
      this.resetFileInput();
    },
    resetFileInput() {
      this.$refs.fileInput.value = null; // fix can't select the same excel
    },
  },
};
</script>

<!--todo: move this style to assets-->
<style lang="scss" scoped>
  .d-theme-dark-bg.bg-drag-color, .d-theme-dark-light-bg.bg-drag-color {
    background-color: #dae1e7 !important;
  }

  .theme-dark .d-theme-dark-bg.bg-drag-color {
    background-color: #414561 !important;
  }
</style>
