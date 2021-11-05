<template>
  <div>
    <div>
      <label class="vs-input--label">
        {{ $t('$SMSCampaignModule.InsertSMSTemplate') }}
      </label>
    </div>

    <div class="flex input-sms-template-insert">
      <v-select-server
        v-model="selectedTemplateToInsert"
        :fetch-function="fetchAllSMSTemplates"
        closeOnSelect
        :clearable="false"
        manage-route-name="sms-templates"
        :manage-text="$t('$SMSCampaignModule.ManageSMSTemplates')"
        :placeholder="$t('$SMSCampaignModule.SelectSMSTemplatePlaceholder')"
        :permission-to-manage="$enums.Auth.Permissions.CAMPAIGNS"/>

      <div
        class="dropdown-button-container ml-5">
        <vs-button
          :disabled="!selectedTemplateToInsert"
          class="btnx"
          type="filled"
          @click="insertTemplate()">
          {{ $t('$SMSCampaignModule.InsertSMSTemplateButton') }}
        </vs-button>
        <vs-dropdown
          vs-trigger-click
          class="cursor-pointer">
          <vs-button
            :disabled="!selectedTemplateToInsert"
            class="btn-drop"
            type="filled"
            icon="expand_more"/>
          <vs-dropdown-menu>
            <vs-dropdown-item
              @click="activeModalViewTemplate=true">
              {{ $t('$General.View') }}
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
    </div>

    <vs-popup
      :title="viewSmsTemplateTitle"
      :active.sync="activeModalViewTemplate">
      {{ selectedTemplateToInsertMessage }}
    </vs-popup>
  </div>
</template>

<script>
import VSelectServer from '@/views/modules/components/VSelectServer.vue';
import { mapActions } from 'vuex';


export default {
  name: 'SMSCampaignListCreateOrEditMessageInsertTemplate',
  components: {
    VSelectServer,
  },
  data() {
    return {
      selectedTemplateToInsert: null,
      activeModalViewTemplate: false,
    };
  },
  computed: {
    viewSmsTemplateTitle() {
      return `${this.$tc('$Entities.SMSTemplate')} - ${this.selectedTemplateToInsertName}`;
    },
    selectedTemplateToInsertName() {
      return this.selectedTemplateToInsert
        ? this.selectedTemplateToInsert.name
        : '';
    },
    selectedTemplateToInsertMessage() {
      return this.selectedTemplateToInsert
        ? this.selectedTemplateToInsert.message
        : '';
    },
  },
  methods: {
    ...mapActions({
      fetchAllSMSTemplates: 'smsTemplate/fetchAllSMSTemplates',
    }),
    insertTemplate() {
      if (this.selectedTemplateToInsert) {
        this.$emit('insert', this.selectedTemplateToInsertMessage);
      }

      this.selectedTemplateToInsert = null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/vuexy/pages/dropdown.scss';

.dropdown-button-container .vs-button {
  padding: 0.715rem 1.5rem !important;
  max-height: 38px;
}

.input-sms-template-insert .vs-button:not(.input-sms-template-insert .vs-con-dropdown .vs-button) {
  width: 170px;
}

@media (max-width: 500px) {
  .input-sms-template-insert {
    flex-wrap: wrap;

    .dropdown-button-container {
      margin-left: 0px !important;
      margin-top: 0.5rem !important;
      width: 100%;
      > .vs-button {
        width: 100% !important;
      }
    }
  }
}

</style>
