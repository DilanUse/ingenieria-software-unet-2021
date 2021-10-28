import enums from '@/enums';
import formValidationExtensions from '@/views/modules/mixins/formValidationExtensions';


export default {
  mixins: [formValidationExtensions],
  props: {
    operation: {
      type: String,
      required: true,
      validator(value) {
        return [
          enums.Operation.VIEW,
          enums.Operation.CREATE,
          enums.Operation.EDIT,
          enums.Operation.CLONE].indexOf(value) !== -1;
      },
    },
    modelPayload: {
      type: Object,
      required: false,
    },
    entity: {
      type: String,
      required: true,
    },
    actions: {
      type: Array,
      required: false,
      validator(actions) {
        return actions.every(
          (a) => 'name' in a && 'color' in a
            && 'text' in a && 'position' in a && 'icon' in a
            && 'active' in a,
        );
      },
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      model: null,
      loadComplete: false,
      fetchItemFunction: null,
      addItemFunction: null,
      editItemFunction: null,
    };
  },
  computed: {
    verifyProperties() {
      return true;
    },
    validateForm() {
      return !this.errors.any() && this.verifyProperties;
    },
    isView() {
      return this.operation === this.$enums.Operation.VIEW;
    },
    isEdition() {
      return this.operation === this.$enums.Operation.EDIT;
    },
    isCreation() {
      return this.operation === this.$enums.Operation.CREATE;
    },
    isCloning() {
      return this.operation === this.$enums.Operation.CLONE;
    },
    operationTitle() {
      return this.isCreation || this.isCloning ? 'Creation' : 'Edition';
    },
    operationText() {
      return this.isCreation || this.isCloning ? 'created' : 'edited';
    },
    mappedActions() {
      return this.actions.filter((action) => action.active);
    },
    additionalModelWasChanged() {
      return false;
    },
    modelWasChanged() {
      return this.formWasChanged || this.additionalModelWasChanged;
    },
  },
  watch: {
    operation(val) {
      this.model.operation = val;
    },
    modelWasChanged(val) {
      this.$emit('model-was-changed', val);
    },
  },
  methods: {
    async getItem() {
      this.model = await this.fetchItemFunction(this.modelPayload.id);
    },
    async additionalValidateFormToSave() {
      return true;
    },
    async validateFormToSave() {
      const formIsValid = await this.$validator.validate();
      const additionalValidation = await this.additionalValidateFormToSave();

      if (!formIsValid) {
        const $el = this.$el.querySelector(`[name='${this.$validator.errors.items[0].field}']`);

        if ($el instanceof HTMLInputElement) {
          $el.focus();
        } else {
          $el.scrollIntoView(false);
        }
      }

      return formIsValid && additionalValidation && this.verifyProperties;
    },
    async save(payload = null) {
      const formIsValid = await this.validateFormToSave();

      if (!formIsValid) {
        return;
      }

      let itemSaved = null;

      this.$vs.loading({ type: 'radius' });
      if (this.isEdition) {
        itemSaved = await this.editItemFunction(payload || this.model);
      } else {
        itemSaved = await this.addItemFunction(payload || this.model);
      }

      this.$vs.loading.close();
      this.$emit('saved', itemSaved);

      this.$vs.notify({
        title: this.$t(`$Notifications.${this.operationTitle}Title`, {
          entity: this.$tc(`$Entities.${this.entity}`),
        }),
        text: this.$t(`$Notifications.${this.operationTitle}Msg`, {
          entity: this.$tc(`$Entities.${this.entity}`),
        }),
        iconPack: 'feather',
        icon: 'icon-check',
        color: 'success',
      });
    },
    onAction(action) {
      this.$emit('action', action);
    },
  },
};
