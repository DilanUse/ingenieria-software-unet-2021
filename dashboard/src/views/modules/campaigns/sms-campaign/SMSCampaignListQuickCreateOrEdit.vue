<template>
  <vx-card class="mb-base">
    <campaign-message
      ref="campaignMessage"
      :message.sync="model.message"
      :has-interpolations.sync="model.hasInterpolations"
      :interpolations.sync="model.interpolations"
      :message-type="model.messageType"
      :sender-type="model.senderType"
      :sender-id="model.senderId"
      @validate="(val) => (campaignMessageIsValid = val)"
      @test="onTest"
    >
      <template v-slot:before-msg>
        <campaign-information
          ref="campaignInfo"
          class="mb-6"
          :campaign-type="$enums.Campaign.Type.SMS"
          :operation="operation"
          :name.sync="model.name"
          :message-type.sync="model.messageType"
          :sender-id.sync="model.senderId"
          :sender-type.sync="model.senderType"
          compact-design
          @validate="(val) => (campaignInfoIsValid = val)"
        />

        <vs-divider class="my-base block md:hidden" />
      </template>
      <template v-slot:after-msg>
        <vs-divider class="my-base block md:hidden" />

        <div class="mt-6">
          <div class="flex items-center county-select-box">
            <label class="vs-input--label required">
              {{ $tc("$Entities.Contact", 2) }}
            </label>
            <div class="mr-1 county-select-list">
              <vue-country-code
                enabled-country-code
                disabled-fetching-country
                defaultCountry="AU"
                @onSelect="selectedDefaultCountry"
              >
              </vue-country-code>
            </div>
            <div class="w-full phone-input-box">
              <label class="vs-input--label required">
                {{ $tc("$Entities.Contact", 2) }}
              </label>
              <v-select-server
                :key="vSelectServerContactsKey"
                v-model="model.quickContacts"
                :class="{ 'border-danger': errors.has($tc('$Entities.Contact', 2)) }"
                :fetch-function="fetchAllContacts"
                :filter-params="filterParamsToFetchContacts"
                multiple
                taggable
                placeholder="Select contacts or enter phone numbers"
                manage-route="contacts"
                manage-text="Manage contacts"
                :permission-to-manage="$enums.Auth.Permissions.CAMPAIGNS"
                option-emphasis="phoneInternational"
                :selectable="contactOptionSelectable"
                :create-option="contactCreateOption"
                @create="activeModalCreateOrEditContact = true"
                @input="validateContacts"
              />
              <div>
                <a href="#" @click.prevent="activeModalCreateOrEditContact = true">
                  create a new contact
                </a>
              </div>

              <vs-input
                :value="model.quickContacts.length || ''"
                type="hidden"
                :name="$tc('$Entities.Contact', 2)"
                v-validate="'required'"
                data-vv-validate-on="blur|input|change"
              />
            </div>
          </div>
        </div>

        <vs-divider class="my-base block md:hidden" />

        <campaign-settings
          ref="campaignSettings"
          class="mt-6"
          :campaign-type="$enums.Campaign.Type.SMS"
          :operation="operation"
          :delivery-type.sync="model.deliveryType"
          :local-start-date.sync="model.localStartDate"
          :time-zone.sync="model.timeZone"
          compact-design
          @validate="(val) => (campaignSettingsIsValid = val)"
        >
        </campaign-settings>

        <div class="w-full mt-base flex justify-end">
          <vs-button :disabled="!validateForm" @click="confirmSendQuickCampaign">Send</vs-button>
        </div>
      </template>
    </campaign-message>

    <vs-popup
      :title="$t('$Modals.CreateModalTitle', { entity: this.$tc('$Entities.Contact') })"
      :active.sync="activeModalCreateOrEditContact"
    >
      <contact-list-create-or-edit
        v-if="showCreateOrEditContactComponent"
        :entity="this.$tc('$Entities.Contact')"
        :operation="$enums.Operation.CREATE"
        :all-contact-attributes="attributesFromSelectedAudience"
        @saved="contactCreated"
        @close="activeModalCreateOrEditContact = false"
      >
      </contact-list-create-or-edit>
    </vs-popup>

  </vx-card>
</template>

<script>
import { mapActions } from "vuex";
import SmsCampaignConstructor from "@/views/modules/campaigns/sms-campaign/sms-campaign.constructor";

// Components
import SMSCampaignListCreateOrEditMessage from "@/views/modules/campaigns/sms-campaign/SMSCampaignListCreateOrEditMessage.vue";

// Mixins
import singleCreateOrEdit from "@/views/modules/mixins/singleCreateOrEdit";
import quickCampaign from "@/views/modules/mixins/campaigns/quick-campaign";

export default {
  name: "SMSCampaignListQuickCreateOrEdit",
  components: {
    campaignMessage: SMSCampaignListCreateOrEditMessage,
  },
  mixins: [singleCreateOrEdit, quickCampaign],
  data() {
    return {
      campaignBaseRoute: "/sms-campaigns",
    };
  },
  created() {
    this.model = new SmsCampaignConstructor(this.operation, this.modelPayload, false, true);
    this.model.messageType = this.$enums.Campaign.MessageType.TRANSACTIONAL;
  },
  methods: {
    ...mapActions({
      fetchCostQuickCampaign: "smsCampaign/fetchCostSMSQuickCampaign",
      addItem: "smsCampaign/addSMSQuickCampaign",
      getTestCostSMSCampaign: "smsCampaign/fetchTestCostSMSCampaign",
      testCampaign: "smsCampaign/testSMSCampaign",
    }),
    async onTest(phoneNumber) {
      const resp = await this.getTestCostSMSCampaign({
        ...this.model.toTestPayload(),
        sender: phoneNumber,
      });

      if (resp.canPaid) {
        this.confirmTestCampaign({
          campaignType: this.$tc("$General.SMS"),
          senderId: phoneNumber,
          cost: resp.cost,
        });
      } else {
        this.$vs.dialog({
          type: "confirm",
          color: "warning",
          title: "Test SMS Campaign message",
          text: "You do not have enough balance to send this test SMS",
          accept: () => {
            this.showCheckout = true;
          },
          acceptText: this.$t("$General.Recharge"),
        });
      }
    },
  },
};
</script>

<style lang="scss">
.county-select-box {
  > .vs-input--label {
    display: none;
  }

  .vue-country-select {
    border-color: rgba(0, 0, 0, 0.2);

    .dropdown {
      padding: 0.7em;
    }
    .dropdown-list {
      background-color: rgba(var(--vs-white), 1);
      z-index: 10 !important;
    }
  }
}

/*
@media (max-width: 450px) {
  .county-select-box {
    flex-wrap: wrap;
  > .vs-input--label {
    display: block;
    width: 100%;
  }
  .w-full {
    margin-top: 0px;
  }
  .w-full .vs-input--label {
    display: none;
  }
  .w-full {
  margin-top: 4px;
}
    > div {
      width: 100%;
    }

  .vue-country-select {
    width: 100%;

    .dropdown-list {
      max-width: 100%;

      .dropdown-item:not(.dropdown-item:nth-child(1)) {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        padding: 8px;
      }
    }
   }
  }
}
*/

@media (max-width: 450px) {
  .county-select-box {
    flex-wrap: wrap;
    > .vs-input--label {
      display: block;
      width: 100%;
    }
    .w-full {
      margin-top: 0px;
    }
    .w-full .vs-input--label {
      display: none;
    }
    .w-full {
      margin-top: 4px;
    }

    .county-select-list {
      width: 70px;
      margin-top: -13px;
      margin-right: 0px !important;
    }

    .phone-input-box {
      width: calc(100% - 70px) !important;
      .v-select {
        .vs__dropdown-toggle {
          border-left: 0px;
          border-radius: 0px 4px 4px 0px;
          .vs__search {
            padding-left: 0px;
            padding-right: 0px;
          }
        }
      }
    }

    .vue-country-select {
      width: 100%;
      border-right: 0px;
      border-radius: 4px 0px 0px 4px;

      .dropdown-list {
        min-width: 270px;
        max-width: 320px;

        .dropdown-item:not(.dropdown-item:nth-child(1)) {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          padding: 8px;
        }
      }
    }
  }
}

@media (max-width: 380px) {
  .county-select-box {
    .vue-country-select {
      .dropdown-list {
        min-width: 250px;
        max-width: 260px;
      }
    }
  }
}

@media (max-width: 320px) {
  .county-select-box {
    .vue-country-select {
      .dropdown-list {
        min-width: 220px;
        max-width: 240px;
      }
    }
  }
}

@media (max-width: 294px) {
  .county-select-box {
    .county-select-list {
      margin-top: -34px;
    }

    .vue-country-select {
      .dropdown-list {
        min-width: 200px;
        max-width: 220px;
      }
    }
  }
}

</style>
