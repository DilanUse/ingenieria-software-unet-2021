<template>
  <div
    class="vx-card contact-list-toolbar text-content px-2"
    :class="[selectedSegmentLocal ? 'bg-grey-light' : 'bg-theme-background',
      someContactMatchOnSegmentOrFilter || selectedFromCampaign ? 'h-32 md:h-16' : 'h-16']">
    <div
      class="vx-row justify-between items-center options-buttons"
      :class="someContactMatchOnSegmentOrFilter || selectedFromCampaign
      ? 'h-16 md:h-full' : 'h-full'">
      <div
        class="vx-col flex items-center h-full py-1 pr-0 md:pr-4 options-new-view-segment"
        :class="segmentBoxClasses">
        <div
          class="view-segment-button h-full flex items-center border-0 border-r border-solid box"
          :class="[selectedSegmentLocal
          ? 'w-full border-theme-background'
          : 'w-8/12 border-grey-light']">
          <v-select-server
            ref="vSelectServer"
            v-model="selectedSegmentLocal"
            class="contact-list-toolbar-select"
            :fetch-function="fetchAllSegments"
            :placeholder="selectSegmentPlaceholder"
            close-on-select
            :permission-to-manage="$enums.Auth.Permissions.CAMPAIGNS"
            manage-route-name="segments"
            :manage-text="$t('$ContactModule.ManageSegments') | lowercase"
          />
        </div>
        <div
          v-if="!selectedSegmentLocal"
          :class="['new-segment-button w-4/12 h-full flex items-center justify-center',
          'border-0 border-r border-solid border-grey-light box ']">
          <a
            href="#"
            class="whitespace-no-wrap text-content"
            @click.prevent="$emit('new-segment')">
            <strong>{{ $t('$ContactModule.NewSegment') }}</strong>
          </a>
        </div>
      </div>

      <div
        class="vx-col hidden md:flex"
        :class="contactsInfoBoxClasses">
        <div v-if="someSegmentOrFilter">
          <strong class="text-content">
          {{ contactsInfoMsg }}
          </strong>
          <a
            v-if="selectedSegmentLocal"
            href="#"
            class="ml-3"
            @click.prevent="$emit('edit-segment')">
            <strong>{{ $t('$ContactModule.EditSegment') | lowercase }}</strong>
          </a>
        </div>
        <template v-else>
          <div v-if="selectedFromCampaign">
            <strong class="text-content">
              {{ this.$t('$Components.$ContactListToolbar.CampaignSentAllContactsMsg') }}
            </strong>
          </div>
        </template>
      </div>

      <div
        class="more-options-button vx-col flex h-full py-1"
        :class="moreOptionsBoxClasses">
        <div
          v-if="someContactMatchOnSegmentOrFilter"
          class="w-9/12 h-full items-center justify-center border-0 border-l border-solid box"
          :class="[selectedSegmentLocal ? 'border-theme-background' : 'border-grey-light',
            selectedFromCampaign ? 'hidden' : 'hidden md:flex']">
          <vs-dropdown
            class="cursor-pointer"
            vs-trigger-click>
            <a class="flex items-center text-content" href.prevent>
              <strong>{{ $t('$Components.$ContactListToolbar.SendCampaign') }}</strong>
              <i class="material-icons"> expand_more </i>
            </a>

            <vs-dropdown-menu>
              <vs-dropdown-item>
                {{ $tc('$Entities.SMSCampaign') }}
              </vs-dropdown-item>
              <vs-dropdown-item>
                {{ $tc('$Entities.VoiceCampaign') }}
              </vs-dropdown-item>
              <vs-dropdown-item>
                {{ $tc('$Entities.EmailCampaign') }}
              </vs-dropdown-item>
            </vs-dropdown-menu>

          </vs-dropdown>
        </div>
        <div
          class="h-full flex items-center justify-center border-0 md:border-l md:border-solid box"
          :class="moreOptionsClasses">
          <vx-tooltip
            :text="$t('$General.More')"
            position="top"
            class="inline-block">
            <vs-dropdown
              class="cursor-pointer"
              vs-trigger-click>
              <a class="flex items-center text-content" href.prevent>
                <feather-icon icon="MoreVerticalIcon" svgClasses="h-7 w-7" />
              </a>

              <vs-dropdown-menu>
                <vs-dropdown-item @click.prevent="$emit('new-attribute')">
                  {{ $t('$ContactModule.AddAttribute') }}
                </vs-dropdown-item>
                <vs-dropdown-item @click.prevent="$router.push({ name: 'custom-fields' })">
                  {{ $t('$ContactModule.ManageAttributes') | lowercase }}
                </vs-dropdown-item>

                <vs-dropdown-group
                  v-if="someContactMatchOnSegmentOrFilter && !selectedFromCampaign"
                  class="block md:hidden"
                  :vs-label="$t('$Components.$ContactListToolbar.SendCampaign')">
                  <vs-dropdown-item>
                    {{ $tc('$Entities.SMSCampaign') }}
                  </vs-dropdown-item>
                  <vs-dropdown-item>
                    {{ $tc('$Entities.VoiceCampaign') }}
                  </vs-dropdown-item>
                  <vs-dropdown-item>
                    {{ $tc('$Entities.EmailCampaign') }}
                  </vs-dropdown-item>
                </vs-dropdown-group>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vx-tooltip>
        </div>
      </div>
    </div>

    <div
      class="vx-row h-16 md:hidden">
      <div
        class="vx-col w-full h-full">
        <div
          v-if="someSegmentOrFilter"
          class="flex items-center w-full h-full justify-around border-0 border-t border-solid"
          :class="[selectedSegmentLocal
          ? 'border-theme-background'
          : 'border-grey-light']">
          <strong class="text-content">
            {{ contactsInfoMsg }}
          </strong>
          <a
            v-if="selectedSegmentLocal"
            href="#"
            @click.prevent="$emit('edit-segment')">
            <strong>{{ $t('$ContactModule.EditSegment') | lowercase }}</strong>
          </a>
        </div>
        <template v-else>
          <div
            v-if="selectedFromCampaign"
            class="flex items-center w-full h-full justify-around
            border-0 border-t border-solid border-grey-light">
            <strong class="text-content">
              {{ this.$t('$Components.$ContactListToolbar.CampaignSentAllContactsMsg') }}
            </strong>
          </div>
        </template>
      </div>
    </div>
    </div>
</template>

<script>
import VSelectServer from '@/views/modules/components/VSelectServer.vue';
import { mapActions } from 'vuex';


export default {
  name: 'ContactListToolbar',
  components: {
    VSelectServer,
  },
  props: {
    selectedSegment: {
      required: true,
    },
    contactsMatchCount: {
      type: Number,
      required: true,
      default: 0,
    },
    filters: {
      type: Object,
      required: false,
    },
    selectedFromCampaign: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      selectedSegmentLocal: this.selectedSegment,
    };
  },
  computed: {
    selectSegmentPlaceholder() {
      if (this.selectedFromCampaign) {
        return this.$t('$Components.$ContactListToolbar.AllContactSelectedSelectPlaceholder');
      }

      return this.$t('$ContactModule.ViewSegment');
    },
    contactsInfoMsg() {
      const msg = this.selectedFromCampaign
        ? 'ContactsMatchToSendCampaign'
        : 'ContactsMatchYourConditions';

      return this.$tc(`$Components.$ContactListToolbar.${msg}`,
        this.contactsMatchCount, {
          count: this.contactsMatchCount,
        });
    },
    someContactMatch() {
      return this.contactsMatchCount > 0;
    },
    someSegmentOrFilter() {
      return !!this.selectedSegmentLocal || !!this.filters;
    },
    filtersWithoutSegment() {
      return !!this.filters && !this.selectedSegmentLocal;
    },
    someContactMatchOnSegmentOrFilter() {
      return this.someContactMatch && this.someSegmentOrFilter;
    },
    selectSegmentWithContacts() {
      return !!this.selectedSegmentLocal && this.someContactMatchOnSegmentOrFilter;
    },
    selectSegmentWithoutContacts() {
      return !!this.selectedSegmentLocal && !this.someContactMatchOnSegmentOrFilter;
    },
    segmentBoxClasses() {
      if (this.selectedSegmentLocal) {
        return 'w-11/12 md:w-4/12';
      }

      return 'w-11/12 md:w-5/12';
    },
    contactsInfoBoxClasses() {
      if (this.filtersWithoutSegment) {
        if (this.someContactMatchOnSegmentOrFilter) {
          return this.selectedFromCampaign ? 'w-6/12' : 'w-4/12';
        }

        return 'w-6/12';
      }

      if (this.selectSegmentWithContacts) {
        return this.selectedFromCampaign ? 'w-7/12' : 'w-5/12';
      }

      if (this.selectSegmentWithoutContacts) {
        return 'w-7/12';
      }

      return 'w-6/12';
    },
    moreOptionsBoxClasses() {
      if (this.someContactMatchOnSegmentOrFilter) {
        const mdWidth = this.selectedFromCampaign ? 1 : 3;
        return `w-1/12 md:w-${mdWidth}/12 pl-3 md:pl-4`;
      }

      return 'w-1/12 pl-2 md:pl-4';
    },
    moreOptionsClasses() {
      const width = this.selectedFromCampaign ? 'full' : '3/12';

      if (this.filtersWithoutSegment) {
        if (this.someContactMatchOnSegmentOrFilter) {
          return `border-grey-light w-${width}`;
        }

        return 'border-grey-light w-full';
      }

      if (this.selectSegmentWithContacts) {
        return `border-theme-background w-${width}`;
      }

      if (this.selectSegmentWithoutContacts) {
        return 'border-theme-background w-full';
      }

      return 'border-grey-light w-full';
    },
  },
  watch: {
    selectedSegmentLocal(val) {
      this.$emit('update:selected-segment', val);
    },
    selectedSegment(val) {
      this.selectedSegmentLocal = val;
      this.updateSelectSegments();
    },
  },
  methods: {
    ...mapActions({
      fetchAllSegments: 'segment/fetchAllSegments',
    }),
    updateSelectSegments() {
      this.$refs.vSelectServer.fetchData();
    },
  },
};
</script>

<style lang="scss">
.contact-list-toolbar {
  .box:hover {
    background: rgba(var(--vs-grey-light), 0.1);
  }

  .contact-list-toolbar-select.v-select {
    min-width: 80px;
    background-color: inherit !important;

    .vs__dropdown-toggle {
      border: none;
      border-radius: initial;

      .vs__selected {
        color: rgba(var(--vs-content), 1);
        font-weight: bold;
      }
    }
  }
}

.viewd-segment-button {
  z-index: 10;
}

.new-segment-button {
  a {
    padding: 20px 10px;
  }
}

@media (max-width: 1100px) {
  .contact-list-toolbar {
    .options-new-view-segment {

      .view-segment-button {
        width: 50% !important;
      }

      .new-segment-button {
        width: 50% !important;
      }

  }


  }
}

@media (max-width: 800px) {
  .contact-list-toolbar {
    .options-new-view-segment {

      .view-segment-button {
        width: 55% !important;
      }

      .new-segment-button {
        width: 45% !important;
      }

  }


  }
}

@media (max-width: 470px) {
  .contact-list-toolbar {
    margin-top: 20px;
    height: 8rem !important;

    .options-buttons {
      .options-new-view-segment {
        flex-wrap: wrap !important;
        width: 85% !important;

        .view-segment-button {
          width: 100% !important;
          max-height: 4rem !important;
          border-bottom: 1px solid rgba(218, 225, 231, var(--border-opacity)) !important;

          .vs__search {
            text-align: center;
            padding-left: 20px;
          }
        }

        .new-segment-button {
          width: 100% !important;
          max-height: 4rem !important;
        }
      }
    }
  }

  .more-options-button {
    width: 15% !important;

    .con-vs-tooltip {
      height: 100% !important;

      .vs-con-dropdown {
        height: 100% !important;
      }
    }
  }
}

</style>
