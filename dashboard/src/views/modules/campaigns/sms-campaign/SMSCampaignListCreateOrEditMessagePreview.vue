<template>
  <phone-preview>
    <div class="text-center py-5 bg-grey-light">
      {{ senderIdLocal }}
    </div>
    <div
      v-show="messagePreviewHtml.length > 0
          || messageType === $enums.Campaign.MessageType.MARKETING"
      v-html="messagePreviewHtml"
      class="message-preview">
    </div>

    <div
      style="position: absolute; bottom: 0; border-top: 1px solid grey"
      class="flex justify-between items-center py-2 px-2">
      <div>
        <vue-tel-input
          v-model="testPhoneNumber"
          :class="{ 'border-danger': invalidPhoneNumber}"
          :disabledFetchingCountry="true"
          :dynamicPlaceholder="false"
          :enabledCountryCode="true"
          :validCharactersOnly="true"
          :preferredCountries="['AU', 'CO']"
          :defaultCountry="'AU'"
          @validate="(payload) => (this.testPhoneNumberValidate = payload)">
        </vue-tel-input>
      </div>

      <vs-button
        size="small"
        class="ml-2"
        :disabled="invalidPhoneNumber"
        @click="$emit('test', testPhoneNumberValidate.number.international)">TEST</vs-button>
    </div>
  </phone-preview>
</template>

<script>
import PhonePreview from '@/views/modules/components/PhonePreview.vue';
import { VueTelInput } from 'vue-tel-input';
import { mapActions } from 'vuex';
import enums from '@/enums';


export default {
  name: 'SMSCampaignListCreateOrEditMessagePreview',
  components: {
    VueTelInput,
    PhonePreview,
  },
  props: {
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      required: true,
      validator(type) {
        return Object.values(enums.Campaign.MessageType).includes(type);
      },
    },
    interpolations: {
      type: Array,
      required: false,
      default() {
        return [];
      },
      validator(interpolations) {
        return interpolations.every((interpolation) => typeof interpolation === 'object'
          && interpolation !== null
          && 'shorthand' in interpolation
          && typeof interpolation.shorthand === 'string'
          && 'attribute' in interpolation
          && typeof interpolation.attribute === 'string');
      },
    },
    attributesFromContacts: {
      type: Array,
      required: true,
    },
    senderType: {
      type: String,
      required: true,
      validator(type) {
        return Object.values(enums.Sender.Type).includes(type);
      },
    },
    senderId: {
      type: [Object, String],
      required: true,
    },
  },
  data() {
    return {
      contactToInterpolate: null,
      optOutText: '\nOpt-out',
      testPhoneNumber: '',
      testPhoneNumberValidate: null,
    };
  },
  computed: {
    messageLocalInterpolated() {
      let messageInterpolated = this.message;

      this.interpolations.forEach((interpolation) => {
        if (this.contactToInterpolate && this.contactToInterpolate[interpolation.attribute]
          && (interpolation.type !== this.$enums.Attributes.Type.CATEGORY
            || this.contactToInterpolate[interpolation.attribute].length > 0)
        ) {
          let placeholder = this.contactToInterpolate[interpolation.attribute];

          if (interpolation.type === this.$enums.Attributes.Type.CATEGORY) {
            placeholder = placeholder.map((item) => item.name).toString().replace(/,/g, ', ');
          }

          messageInterpolated = messageInterpolated.replace(
            interpolation.shorthand, placeholder,
          );
        } else {
          messageInterpolated = messageInterpolated.replace(
            interpolation.shorthand, this.getInterpolationPlaceholder(interpolation),
          );
        }
      });

      return messageInterpolated;
    },
    messagePreviewHtml() {
      const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;
      const message = this.messageLocalInterpolated + this.optOutMessage;
      const urls = message.match(urlRegex) || [];
      let messageHtml = message.replace('\n', '<br>');

      urls.forEach((value) => {
        messageHtml = messageHtml.replace(value, `
          <a
            href="${value}"
            target="_blank">
            ${value.replace(/https?:\/\/(www\.)?/gi, '')}
          </a>`);
      });

      return messageHtml;
    },
    optOutMessage() {
      if (this.messageType === this.$enums.Campaign.MessageType.MARKETING) {
        return this.senderType === this.$enums.Sender.Type.PRIVATE
          ? `${this.optOutText} ${this.optOutUrl}`
          : `${this.optOutText} reply STOP`;
      }

      return '';
    },
    optOutUrl() {
      return this.contactToInterpolate && this.contactToInterpolate.optOutUrl
        ? this.contactToInterpolate.optOutUrl : 'https://cdpt.in/XXXXXXXX';
    },
    invalidPhoneNumber() {
      return this.testPhoneNumber
        && this.testPhoneNumberValidate
        && !this.testPhoneNumberValidate.isValid;
    },
    senderIdLocal() {
      switch (this.senderType) {
        case this.$enums.Sender.Type.SHARED:
          return this.$options.filters.uppercaseDash(this.$t('$General.SharedNumber'));
        case this.$enums.Sender.Type.PRIVATE:
        case this.$enums.Sender.Type.VIRTUAL:
          return this.senderId.phoneNational;

        default:
          return this.$options.filters.uppercaseDash(this.$t('$General.ReplyNumber'));
      }
    },
  },
  watch: {
    optOutMessage(val) {
      this.$emit('opt-out-message-length', val.length);
    },
  },
  created() {
    this.fetchContactToInterpolate();
  },
  methods: {
    ...mapActions({
      fetchAllContacts: 'contact/fetchAllContacts',
    }),
    getInterpolationPlaceholder(interpolation) {
      return interpolation.type === 'default'
        ? this.getInterpolationPlaceholderByDefaults(interpolation)
        : this.getInterpolationPlaceholderByType(interpolation);
    },
    getInterpolationPlaceholderByDefaults(interpolation) {
      switch (interpolation.attribute) {
        case 'name':
          return 'Jhon Doe';

        case 'firstName':
          return 'Jhon';

        case 'lastName':
          return 'Doe';

        case 'phoneSignificant':
          return '444 44 44';

        case 'email':
          return 'name@email.com';

        default:
          return interpolation.shorthand;
      }
    },
    getInterpolationPlaceholderByType(interpolation) {
      switch (interpolation.type) {
        case this.$enums.Attributes.Type.TEXT:
          return interpolation.name;

        case this.$enums.Attributes.Type.BOOL:
          return 'Yes/No';

        case this.$enums.Attributes.Type.DATE:
          return 'DD/MM/YYYY';

        case this.$enums.Attributes.Type.NUMBER:
          return ' 0000';

        case this.$enums.Attributes.Type.CATEGORY:
          // eslint-disable-next-line no-underscore-dangle,no-case-declarations
          const attr = this.attributesFromContacts.find((a) => a._id === interpolation.attribute);

          if (attr) {
            return attr.items.map((item) => item.name).toString().replace(/,/g, ', ');
          }
          return interpolation.shorthand;

        case 'special':
          return 'https://cdpt.in/XXXXXXXX';

        default:
          return interpolation.shorthand;
      }
    },
    async fetchContactToInterpolate() {
      const contacts = await this.fetchAllContacts({
        limit: 1,
      });

      this.contactToInterpolate = contacts && contacts.data && Array.isArray(contacts.data)
        ? contacts.data[0] : null;
    },
  },
};
</script>

<style lang="scss" scoped>
.message-preview {
  background: rgba(var(--vs-grey-light), 0.5) !important;
  margin: 20px 20px 40px 30px;
  padding: 1rem;
  border-radius: 10px;
}
</style>
