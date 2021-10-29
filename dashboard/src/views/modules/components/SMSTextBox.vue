<template>
  <form>
    <vue-context
      ref="menu"
      closeOnClick>
      <li
        v-for="(option, index) in contextMenuOptions"
        :key="index">
        <a
          href="#"
          class="flex"
          @click.prevent="$emit(option.event)">
          <feather-icon
            :icon="option.icon"
            svgClasses="w-5 h-4" />
          <span class="ml-2">{{ option.name }}</span>
        </a>
      </li>

      <li>
        <a
          href="#"
          class="flex"
          @click.prevent="insertReviewLink">
          <feather-icon
            icon="StarIcon"
            svgClasses="w-5 h-4"/>
          <span class="ml-2">{{ $t('$Components.$SMSTextBox.InsertReviewLink') }}</span>
        </a>
      </li>

      <li class="v-context__sub">
        <a class="flex">
          <feather-icon
            icon="UserPlusIcon"
            svgClasses="w-5 h-4" />
          <span class="ml-2">{{ $t('$Components.$SMSTextBox.InsertCustomFields') }}</span>
        </a>
        <ul class="v-context">
          <li
            v-for="(attr, index) in allContactAttrs"
            :key="index">
            <a
              class="flex"
              href="#"
              @keyup.enter="insertShorthand(attr)"
              @click.prevent="insertShorthand(attr)">
              {{ attr.name }}
            </a>
          </li>
        </ul>
      </li>
      <li>
        <a
          href="#"
          class="flex"
          @click.prevent="focusTextArea">
          <feather-icon
            icon="XIcon"
            svgClasses="w-5 h-4" />
          <span class="ml-2">{{ $t('$General.Close') }}</span>
        </a>
      </li>
    </vue-context>

    <div class="flex justify-between counter-controls-top">
      <span :class="{'text-sm': true, 'text-danger': isMessageExceededLimit}">
        {{ $t('$Components.$SMSTextBox.CharactersMessageCountMsg', {
        charactersCount: this.charactersCount,
        unicode: this.hasUnicodeCharacters
          ? this.$options.filters.lowercase(`(${this.$t('$General.Unicode')})`) : '',
        messagesCount: this.messagesCount,
        }) }}
      </span>
    </div>

    <div
      class="text-wrapper"
      style="position: relative">
      <vs-dropdown
        v-if="!disabled"
        vs-custom-content
        vs-trigger-click
        class="cursor-pointer emoji-button">
        <a
          class="flex items-center">
          <feather-icon
            icon="SmileIcon"
            svgClasses="h-5 w-5" />
        </a>
        <vs-dropdown-menu class="dropdown-login emojis">
          <VEmojiPicker @select="selectEmoji" />
        </vs-dropdown-menu>
      </vs-dropdown>

      <vs-textarea
        ref="smsTextArea"
        :id="textAreaId"
        v-model="localMessage"
        :class="{'opacity-75': disabled}"
        :label="`${$tc('$General.Message')}*`"
        :name="$tc('$General.Message')"
        :placeholder="placeholder"
        :disabled="disabled"
        v-validate="'required'"
        data-vv-validate-on="blur|input"
        @keyup.ctrl.73="showContextMenu"
        @contextmenu.prevent="$refs.menu.open"
        @input="updateValue"/>
      <span
        v-show="errors.has($tc('$General.Message'))"
        class="text-danger text-sm">
      {{ errors.first($tc('$General.Message')) }}
      </span>
      <span
        v-show="interpolationsErrors.length > 0"
        class="text-danger text-sm">
        {{ $t('$Components.$SMSTextBox.InvalidContactAttributesTitle') }}
        <span
          v-for="(error, index) in interpolationsErrors"
          :key="index">
          {{ isLastInterpolationError(index) ? error : `${error}, `}}
        </span>
      </span>
    </div>
  </form>
</template>

<script>
import { VueContext } from 'vue-context';
import 'vue-context/src/sass/vue-context.scss';
import { mapActions, mapState } from 'vuex';
import { getRandomString } from '@/util';

// Mixins
import formValidationExtensions from '@/views/modules/mixins/formValidationExtensions';


export default {
  name: 'SMSTextBox',
  components: {
    VueContext,
  },
  mixins: [formValidationExtensions],
  props: {
    value: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    attributesFromContacts: {
      type: Array,
      required: false,
    },
    hasInterpolations: {
      type: Boolean,
      required: false,
      default: false,
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
    contextMenuOptions: {
      type: Array,
      required: false,
      default() {
        return [];
      },
      validator(options) {
        return options.every((option) => typeof option === 'object'
          && option !== null
          && 'name' in option
          && typeof option.name === 'string'
          && 'icon' in option
          && typeof option.icon === 'string'
          && 'event' in option
          && typeof option.event === 'string');
      },
    },
    messageLengthOffset: {
      type: Number,
      required: false,
      default: 0,
    },
    minHeight: {
      type: String,
      default: '10rem',
    },
  },
  data() {
    return {
      localMessage: this.value,
      interpolationsErrors: [],
      localHasInterpolations: this.hasInterpolations,
      localInterpolations: this.interpolations,
      textAreaId: `sms_text_box_text_area${getRandomString()}`,
      defaultContactAttrs: [
        {
          name: this.$t('$General.FullName'),
          shorthand: '{{ name }}',
          attr: 'name',
          type: 'default',
        },
        {
          name: this.$t('$General.FirstName'),
          shorthand: '{{ firstName }}',
          attr: 'firstName',
          type: 'default',
        },
        {
          name: this.$t('$General.LastName'),
          shorthand: '{{ lastName }}',
          attr: 'lastName',
          type: 'default',
        },
        {
          name: this.$tc('$General.Email'),
          shorthand: '{{ email }}',
          attr: 'email',
          type: 'default',
        },
        {
          name: this.$tc('$General.Phone'),
          shorthand: '{{ phone }}',
          alias: 'phone',
          attr: 'phoneSignificant',
          type: 'default',
        },
      ],
      attributesFromContactsLocal: [],
    };
  },
  computed: {
    isValid() {
      return this.errors.items.length === 0
        && !this.isMessageExceededLimit
        && this.interpolationsErrors.length === 0
        && this.localMessage.length > 0;
    },
    hasUnicodeCharacters() {
      return /[^A-Za-z0-9 \r\n@£$¥èéùìòÇØøÅå\u0394_\u03A6\u0393\u039B\u03A9\u03A0\u03A8\u03A3\u0398\u039EÆæßÉ!"#¤%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\[~\]|€]/g.test(this.localMessage);
    },
    specialCharactersCount() {
      const result = this.localMessage.match(/[\^{}\\[~\]|€]/g);
      return result !== null ? result.length : 0;
    },
    charactersCount() {
      return this.localMessage.length + this.specialCharactersCount + this.messageLengthOffset;
    },
    gsmMessagesCount() {
      let count = 1;
      let found = false;

      [459, 306, 160].forEach((limit, index) => {
        if (this.charactersCount > limit && !found) {
          count = 4 - index;
          found = true;
        }
      });

      return count;
    },
    unicodeMessagesCount() {
      let count = 1;
      let found = false;

      [201, 134, 70].forEach((limit, index) => {
        if (this.charactersCount > limit && !found) {
          count = 4 - index;
          found = true;
        }
      });

      return count;
    },
    messagesCount() {
      return this.hasUnicodeCharacters
        ? this.unicodeMessagesCount
        : this.gsmMessagesCount;
    },
    messageMaxLength() {
      return this.hasUnicodeCharacters ? 268 : 612;
    },
    isMessageExceededLimit() {
      return this.charactersCount > this.messageMaxLength;
    },
    allContactAttrs() {
      const aliases = [];
      return [
        ...this.defaultContactAttrs,
        ...this.attributesFromContactsLocal.map((attr) => {
          let alias = this.$options.filters.camelize(attr.name.toLowerCase());
          alias = alias.replace(/ /g, '');
          const aliasCount = aliases.filter((a) => a === alias).length;
          alias = aliasCount > 0 ? `${alias}${aliasCount + 1}` : alias;
          aliases.push(attr.name.toLowerCase());

          return {
            name: attr.name,
            shorthand: `{{ ${alias} }}`,
            alias,
            attr: attr.id,
            type: attr.type,
          };
        }),
      ];
    },
  },
  watch: {
    allContactAttrs() {
      this.validateInterpolations();
    },
    attributesFromContacts() {
      this.attributesFromContactsLocal = this.attributesFromContacts;
    },
    localHasInterpolations() {
      this.$emit('update:has-interpolations', this.localHasInterpolations);
    },
    localInterpolations() {
      this.$emit('update:interpolations', this.localInterpolations);
    },
    value() {
      this.localMessage = this.value;
      this.focusTextArea();
    },
    isValid: {
      immediate: true,
      handler(value) {
        this.$emit('state-change', value);
      },
    },
  },
  created() {
    this.initComponent();
  },
  mounted() {
    const $textArea = this.$el.querySelector(`#${this.textAreaId}`);
    $textArea.setAttribute('style', `min-height: ${this.minHeight} !important;`);
    document.addEventListener('selectionchange', this.handleSelectionOnTextArea);
  },
  methods: {
    ...mapActions({
      fetchAllAttributes: 'attribute/fetchAllAttributes',
    }),
    async initComponent() {
      if (!this.attributesFromContacts) {
        await this.fetchContactsAttributes();
      } else {
        this.attributesFromContactsLocal = this.attributesFromContacts;
      }

      this.validateInterpolations();
    },
    async fetchContactsAttributes() {
      const resp = await this.fetchAllAttributes({});
      this.attributesFromContactsLocal = resp.data;
    },
    updateValue() {
      this.$emit('input', this.localMessage);
      this.validateInterpolations();
    },
    validateInterpolations() {
      const tokens = this.localMessage.match(/{{([^}]*)}}/g);
      let messageIsValid = true;
      const interpolations = [];
      const interpolationsErrors = [];

      if (tokens !== null) {
        tokens.forEach((token) => {
          const attrList = this.allContactAttrs.map(
            (attr) => (attr.alias ? attr.alias : attr.attr),
          ).toString().replace(/,/g, '|');
          const regex = new RegExp(`^({{)\\s*(${attrList})\\s*(}})$`);
          const tokenIsValid = regex.test(token);

          if (messageIsValid && tokenIsValid) {
            const attr = token.match(/\w+/)[0];
            const contactAttr = this.allContactAttrs.find(
              (a) => (a.alias && a.alias === attr) || (a.attr === attr),
            );

            interpolations.push({
              shorthand: token,
              attribute: contactAttr.attr,
              type: contactAttr.type,
              name: contactAttr.name,
            });
          } else if (!tokenIsValid) {
            const specialAttr = token.match(/\w+/)[0];

            if (specialAttr === this.$enums.Campaign.EspecialPlaceholders.REVIEW_LINK) {
              interpolations.push({
                shorthand: token,
                attribute: specialAttr,
                type: 'special',
                name: 'Review Link',
              });
            } else {
              interpolationsErrors.push(token);

              if (messageIsValid) {
                messageIsValid = false;
              }
            }
          }
        });

        if (messageIsValid) {
          this.localHasInterpolations = true;
          this.localInterpolations = interpolations;
          this.interpolationsErrors = [];
        } else {
          this.localHasInterpolations = false;
          this.localInterpolations = interpolations;
          this.interpolationsErrors = interpolationsErrors;
        }
      } else {
        this.localHasInterpolations = false;
        this.localInterpolations = [];
        this.interpolationsErrors = [];
      }
    },
    insertShorthand(attr) {
      this.insertText(attr.shorthand);
    },
    insertReviewLink() {
      this.insertText(`{{ ${this.$enums.Campaign.EspecialPlaceholders.REVIEW_LINK} }}`);
    },
    insertText(text) {
      const $textArea = document.getElementById(this.textAreaId);
      const startIndex = $textArea.selectionStart;
      const endIndex = $textArea.selectionEnd;
      const beforeMsg = this.localMessage.substring(0, startIndex);
      const afterMsg = this.localMessage.substring(endIndex);
      this.localMessage = `${beforeMsg}${text}${afterMsg}`;
      this.updateValue();
      this.focusTextArea();
    },
    showContextMenu() {
      const $textArea = this.$el.querySelector(`#${this.textAreaId}`);
      const rect = $textArea.getBoundingClientRect();
      const $event = $textArea.ownerDocument.createEvent('MouseEvents');

      $event.initMouseEvent('contextmenu', true, true,
        $textArea.ownerDocument.defaultView, 1, rect.left, rect.top, rect.left, rect.top, false,
        false, false, false, 2, null);

      $textArea.dispatchEvent($event);
    },
    focusTextArea() {
      const $textArea = document.getElementById(this.textAreaId);
      $textArea.focus();
    },
    selectEmoji(emoji) {
      this.localMessage += emoji.data;
      this.updateValue();
    },
    isLastInterpolationError(index) {
      return index === this.interpolationsErrors.length - 1;
    },
    handleSelectionOnTextArea() {
      const { activeElement } = document;

      if (activeElement
        && activeElement.id === this.textAreaId
        && this.localHasInterpolations) {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;

        const textSelected = this.localMessage.substring(start, end).trim();
        const interpolation = this.localInterpolations.find(
          (i) => i.attribute === textSelected,
        );

        if (interpolation) {
          const regex = new RegExp(`{{ *${interpolation.attribute} *}}`, 'g');
          const matches = this.localMessage.match(regex);
          console.log(matches);

          let searchIndex = 0;
          const matchesMapped = matches.map((match) => {
            const textSearch = this.localMessage.substring(searchIndex);
            const findIndex = searchIndex + textSearch.indexOf(match);
            searchIndex = findIndex + match.length;

            return {
              token: match,
              start: findIndex,
              closeness: Math.abs(start - findIndex),
            };
          });

          matchesMapped.sort((a, b) => a.closeness - b.closeness);

          if (matchesMapped.length > 0 && matchesMapped[0]) {
            activeElement.selectionStart = matchesMapped[0].start;
            activeElement.selectionEnd = matchesMapped[0].start + matchesMapped[0].token.length;
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.con-vs-dropdown--menu {
  z-index: 54000 !important;
}

.emoji-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 50 !important;
}

.counter-controls-top {
  flex-wrap: wrap;
  span.text-sm {
    padding-left: 2px;
  }
}

</style>
