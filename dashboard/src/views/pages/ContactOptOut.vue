<template>
  <div class="h-screen flex w-full vx-row no-gutter justify-center items-center">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-2/5 m-4">
      <vx-card v-if="optOutInfo.optOut === isOptOut">
        <div class="vx-card__title mb-6">
          <h2 class="text-center flex justify-center items-center">
            <feather-icon
              icon="CheckCircleIcon"
              svgClasses="h-8 w-8 mr-1 text-success" />
            <span>
              {{ $t('$Pages.$ContactOptOut.OptOutSuccessfulTitle', {
              opt: this.$options.filters.capitalize(this.OptMsg),
            }) }}
            </span>
          </h2>
        </div>

        <div class="subscription text-center">
          <span>
            {{ $t(`$Pages.$ContactOptOut.${this.OptKey}SuccessfulMsg`, {
            company: this.optOutInfo.company,
          }) }}
          </span>
        </div>

        <vs-divider position="center">
          {{ this.OptMsg | lowercase }}
        </vs-divider>

        <div>
          <small>
            {{ $t(`$Pages.$ContactOptOut.${this.OptKey}SuccessfulOptInMsg`, {
            company: this.optOutInfo.company,
          }) }}
          </small>
        </div>

        <vx-input-group class="mb-base">
          <vs-input v-model="optReverseUrl" />

          <template slot="append">
            <div class="append-text btn-addon">
              <vs-button
                type="border"
                :title="$t('$General.Copy') | lowercase"
                v-clipboard:copy="optReverseUrl"
                v-clipboard:success="onCopy"
                v-clipboard:error="onCopyError"
                icon-pack="feather"
                icon="icon-copy">
              </vs-button>
              <vs-button
                :title="$t('$General.Visit') | lowercase"
                icon-pack="feather"
                icon="icon-external-link"
                type="border"
                :href="optReverseUrl">
              </vs-button>
            </div>
          </template>
        </vx-input-group>
      </vx-card>
      <vx-card v-else>
        <div class="vx-card__title mb-6">
          <h2 class="text-center">
            {{ $t('$Pages.$ContactOptOut.Title', {
            company: this.optOutInfo.company,
            opt: this.$options.filters.lowercase(this.OptMsg),
          }) }}
          </h2>
        </div>

        <vs-divider position="center">
          {{ this.OptMsg | lowercase }}
        </vs-divider>

        <div class="subscription text-center">

          <span>{{ $t('$Pages.$ContactOptOut.Msg', {
            opt: this.$options.filters.lowercase(this.OptMsg),
          }) }}</span>
          <vs-button
            class="w-full mt-4"
            @click="contactOptOut">
            {{ $t('$Pages.$ContactOptOut.ConfirmButtonText', {
            opt: this.$options.filters.lowercase(this.OptMsg),
            }) }}
          </vs-button>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import contactService from '@/api/modules/contacts/contact.service';

export default {
  props: {
    isOptOut: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      contactId: '',
      optOutToken: '',
      optOutInfo: {
        company: '',
        optOut: false,
      },
      serviceName: '',
      optReverseUrl: '',
    };
  },
  computed: {
    OptKey() {
      return this.isOptOut ? 'OptOut' : 'OptIn';
    },
    OptMsg() {
      return this.$t(`$Pages.$ContactOptOut.${this.OptKey}`);
    },
  },
  created() {
    if (this.isOptOut) {
      this.optReverseUrl = window.location.href.replace('opt-out', 'opt-in');
    } else {
      this.optReverseUrl = window.location.href.replace('opt-in', 'opt-out');
    }
    this.fetchData();
  },
  methods: {
    async fetchData() {
      if (this.$route.params.contactId && this.$route.params.optOutToken) {
        this.contactId = this.$route.params.contactId;
        this.optOutToken = this.$route.params.optOutToken;
        this.serviceName = this.$route.params.serviceName;

        try {
          const resp = await contactService.optOutInfo({
            contactId: this.contactId,
            optOutToken: this.optOutToken,
          });

          this.optOutInfo = resp.data;
        } catch (e) {
          await this.$router.push({ name: 'not-authorized' });
        }
      }
    },
    async contactOptOut() {
      try {
        const resp = await contactService.optOut({
          contactId: this.contactId,
          optOutToken: this.optOutToken,
          service: this.serviceName,
        });

        this.optOutInfo.optOut = resp.data;
      } catch (e) {
        await this.$router.push({ name: 'not-authorized' });
      }
    },
    onCopy() {
      this.$vs.notify({
        title: this.$t('$General.Copy'),
        text: this.$t('$Pages.$ContactOptOut.LinkCopiedSuccessfully'),
        color: 'success',
        iconPack: 'feather',
        icon: 'icon-check-circle',
      });
    },
    onCopyError() {
      this.$vs.notify({
        title: this.$t('$General.Copy'),
        text: this.$t('$Pages.$ContactOptOut.ErrorCopyingLink'),
        color: 'danger',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
      });
    },
  },
};
</script>
