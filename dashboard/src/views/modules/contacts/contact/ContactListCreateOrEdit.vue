<template>
  <form>
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2">
        <vs-input
          v-model="model.firstName"
          class="w-full"
          :class="{required: !isView}"
          :disabled="isView"
          :label="$t('$General.FirstName')"
          :name="$t('$General.FirstName')"
          v-validate="'required|max:50'"
          data-vv-validate-on="blur|input"
          :danger="errors.has($t('$General.FirstName'))"
          :danger-text="errors.first($t('$General.FirstName'))"
          val-icon-danger="clear"/>
      </div>

      <div class="vx-col w-full md:w-1/2 mt-6 md:mt-0">
        <vs-input
          v-model="model.lastName"
          class="w-full"
          :disabled="isView"
          :label="`${$t('$General.LastName')}`"
          :name="$t('$General.LastName')"
          v-validate="'max:50'"
          data-vv-validate-on="blur|input"
          :danger="errors.has($t('$General.LastName'))"
          :danger-text="errors.first($t('$General.LastName'))"
          val-icon-danger="clear"/>
      </div>
    </div>

    <div class="vx-row mt-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="model.email"
          type="email"
          class="w-full"
          :class="{required: !isView && !model.phoneNational}"
          :disabled="isView"
          :label="$tc('$General.Email')"
          :name="$tc('$General.Email')"
          v-validate="{ rules: { required: !model.phoneNational, email: true } }"
          data-vv-validate-on="blur|input"
          :danger="errors.has($tc('$General.Email'))"
          :danger-text="errors.first($tc('$General.Email'))"
          val-icon-danger="clear"/>
      </div>
    </div>

    <p class="text-center mt-3">{{ $t('$General.Or') | lowercase }}</p>

    <div class="vx-row">
      <div class="vx-col w-full">
        <label
          class="vs-input--label"
          :class="{ required: !isView && !model.email }">
          {{ $tc('$General.Phone') }}
        </label>
        <vue-tel-input
          v-model="model.phoneNational"
          :disabled="isView"
          :disabledFetchingCountry="true"
          :dynamicPlaceholder="false"
          :enabledCountryCode="true"
          :validCharactersOnly="true"
          :preferredCountries="['AU', 'CO']"
          :defaultCountry="model.codeCountry ? model.codeCountry : 'AU'"
          @validate="(payload) => (this.model.phoneValidate = payload)"
          @input="() => (this.phoneInput = true)">
        </vue-tel-input>
        <span
          v-show="invalidPhoneNumber"
          class="text-danger text-xs">
          {{ $t('$ContactModule.InvalidPhoneNumberMsg') }}
        </span>
        <span
          v-show="requiredPhoneNumber"
          class="text-danger text-xs">
          {{ $t('$ContactModule.PhoneNumberRequiredMsg') }}
        </span>
      </div>
    </div>

    <div class="vx-row mt-6">
      <div
        v-if="loadComplete"
        class="vx-col w-full">
        <label class="vs-input--label">{{ $tc('$General.Tag', 2) }}</label>
        <tags-drop-down-filter
          :ag-grid-floating-filter="false"
          :selected-tags.sync="model.tags"
          @redirect="$emit('close')">
        </tags-drop-down-filter>
      </div>
    </div>

    <template v-if="this.loadComplete">
      <div class="vx-row mt-6"
           v-for="attribute in allContactAttributes"
           :key="attribute.id">
        <div :class="['vx-col', 'w-full']">

          <template v-if="attributeIsInput(attribute.type)">
            <vs-input
              v-if="attribute.type === $enums.Attributes.Type.NUMBER"
              v-model.number="model[attribute.id]"
              class="w-full"
              :disabled="isView"
              :label="attribute.name"
              :name="attribute.name"
              :type="attribute.type"/>
            <vs-input
              v-else
              v-model="model[attribute.id]"
              class="w-full"
              :disabled="isView"
              :label="attribute.name"
              :name="attribute.name"
              :type="attribute.type"/>
          </template>

          <template v-if="attribute.type === $enums.Attributes.Type.BOOL">
            <label class="vs-input--label">{{ attribute.name }}</label>
            <vs-select
              v-model="model[attribute.id]"
              class="w-full select-large"
              :name="attribute.name">
              <vs-select-item
                :value="null"
                :text="$t('$General.Select')"
                class="w-full" />
              <vs-select-item
                :value="true"
                :text="$t('$General.Yes')"
                class="w-full" />
              <vs-select-item
                :value="false"
                :text="$t('$General.No')"
                class="w-full" />
            </vs-select>
          </template>

          <template v-if="attribute.type === $enums.Attributes.Type.CATEGORY">
            <label class="vs-input--label">
              {{ attribute.name }}
            </label>
            <v-select
              v-if="attribute.items.length > 12"
              v-model="model[attribute.id]"
              :disabled="isView"
              class="w-full"
              label="name"
              :multiple="true"
              :close-on-select="false"
              :placeholder="$t('$ContactModule.$CreateOrEdit.SelectCategoryPlaceholder')"
              :options="attribute.items"
              :clearable="true">
            </v-select>
            <div
              v-else
              class="vx-row">
              <div
                v-for="item in attribute.items"
                :key="item.id"
                class="vx-col w-1/2 md:w-1/3 pb-1">
                <div class="vs-component con-vs-checkbox vs-checkbox-primary vs-checkbox-default">
                  <input
                    v-model="model[attribute.id]"
                    :value="item"
                    :disabled="isView"
                    type="checkbox"
                    class="vs-checkbox--input">
                  <span
                    class="checkbox_x vs-checkbox"
                    style="border: 2px solid rgb(180, 180, 180);">
                    <span class="vs-checkbox--check">
                      <i class="vs-icon notranslate
                      icon-scale vs-checkbox--icon material-icons null">
                        check
                      </i>
                    </span>
                  </span>
                  <span class="con-slot-label text-sm">{{ item.name | truncateEllipsis(18) }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>

    <base-form-footer-action-buttons
      :hide-save="isView"
      :actions="mappedActions"
      @action="onAction"
      @save="save(model.toSavePayload())"
      @cancel="$emit('close')">
      <template
        v-if="isView"
        v-slot:cancel>
        {{ $t("$General.Close") }}
      </template>
    </base-form-footer-action-buttons>
  </form>
</template>

<script>
import moment from 'moment';
import { VueTelInput } from 'vue-tel-input';
import vSelect from 'vue-select';
import { mapActions } from 'vuex';

// Constructor
import ContactConstructor from '@/views/modules/contacts/contact/contact.constructor';

// Custom Components
import BaseFormFooterActionButtons from '@/views/modules/components/BaseFormFooterActionButtons.vue';
import TagsDropDownFilter from '@/views/modules/contacts/contact/filters/TagsDropDownFilter';

// Mixins
import singleCreateOrEdit from '@/views/modules/mixins/singleCreateOrEdit';


export default {
  name: 'ContactListCreateOrEdit',
  components: {
    VueTelInput,
    TagsDropDownFilter,
    BaseFormFooterActionButtons,
    vSelect,
  },
  mixins: [singleCreateOrEdit],
  props: {
    allContactAttributes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      phoneInput: false,
      addItemFunction: this.addContact,
      editItemFunction: this.editContact,
    };
  },
  computed: {
    verifyProperties() {
      return this.model.firstName !== '' && (this.model.email !== ''
        || (this.model.phoneNational !== '' && this.model.phoneValidate.isValid));
    },
    invalidPhoneNumber() {
      return this.phoneInput && !this.model.phoneValidate.isValid && this.model.phoneNational !== '';
    },
    requiredPhoneNumber() {
      return this.phoneInput && !this.model.phoneValidate.isValid && this.model.phoneNational === '' && this.model.email === '';
    },
  },
  created() {
    this.model = new ContactConstructor(
      this.allContactAttributes,
      this.operation,
      this.modelPayload,
    );

    this.insertContactAttributes();

    this.loadComplete = true;
  },
  methods: {
    ...mapActions({
      addContact: 'contact/addContact',
      editContact: 'contact/editContact',
    }),
    attributeIsInput(type) {
      return type === this.$enums.Attributes.Type.TEXT
        || type === this.$enums.Attributes.Type.DATE
        || type === this.$enums.Attributes.Type.NUMBER;
    },
    insertContactAttributes() {
      this.allContactAttributes.forEach((attr) => {
        let value;

        if (this.isCreation) {
          value = this.model[attr.id] || undefined;
          debugger;
        } else {
          debugger;
          value = this.modelPayload[attr.id] || undefined;
          debugger;
        }

        switch (attr.type) {
          case this.$enums.Attributes.Type.TEXT:
            this.$set(this.model, attr.id, value !== undefined ? value : '');
            break;
          case this.$enums.Attributes.Type.DATE:
            this.$set(this.model, attr.id, value !== undefined ? moment.utc(value).format('YYYY-MM-DD') : '');
            break;

          case this.$enums.Attributes.Type.NUMBER:
          case this.$enums.Attributes.Type.BOOL:
            this.$set(this.model, attr.id, value !== undefined ? value : null);
            break;

          case this.$enums.Attributes.Type.CATEGORY:
            debugger;
            this.$set(this.model, attr.id, value !== undefined ? value : []);
            debugger;
            break;

          default:
            this.$set(this.model, attr.id, value !== undefined ? value : '');
        }
      });
    },
  },
};

</script>
