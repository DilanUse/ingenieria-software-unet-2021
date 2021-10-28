
export default {
  computed: {
    formWasChanged() {
      const fields = this.validationFields;
      return Object.values(fields).some((field) => field.changed);
    },
  },
  watch: {
    formWasChanged(val) {
      this.$emit('form-was-changed', val);
    },
  },
};
