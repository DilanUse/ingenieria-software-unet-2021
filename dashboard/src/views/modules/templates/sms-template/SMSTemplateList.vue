<template>
  <div>
    <import-excel-to-json
      :key="importComponentKey"
      v-if="showImportComponent"
      :target-headers="columnDefsToImport"
      :entity="entity"
      :on-save-import="importSMSTemplatesFromFile"
      @refresh="importComponentKey+=1"
      @imported="resetDataSourceAndSelection()"
      @close="showImportComponent=false"/>

    <div
      v-show="!showImportComponent"
      class="vx-card  p-6">
      <base-ag-grid-header
        :rows-selected-count="rowsSelectedCountWithAllSelection"
        :filters-count="filtersAppliedCount"
        @reset-selection="setSelectedRowsNone()"
        @reset-filters="resetFilters()">
        <template v-slot:header-left>
          <items-per-page
            :count="count"
            :currentPage="currentPage"
            :paginationPageSize="paginationPageSize"
            @changed-page-size="paginationSetPageSize">
          </items-per-page>

          <list-action-drop-down
            v-if="isAnyRowsSelected"
            :options="allMultipleActionOptions"
            class="ml-3"
            @export="exportData()"
            @delete="confirmDeleteRecords()"
            @restore="confirmRestoreRecordsForTrashWithAgGrid()">
          </list-action-drop-down>
        </template>

        <template v-slot:header-right>
          <vs-button
            v-if="!trash"
            color="primary"
            type="border"
            :size="headerButtonsSizeByResolution"
            icon-pack="feather"
            icon="icon-plus"
            class="mr-3"
            @click="newItem()">
            {{ $t("$General.AddNew") }}
          </vs-button>

          <vs-button
            v-if="!trash"
            color="primary"
            :size="headerButtonsSizeByResolution"
            icon-pack="feather"
            icon="icon-upload"
            @click="showImportComponent=true">
            {{ $t("$General.Import") }}
          </vs-button>
        </template>
      </base-ag-grid-header>

      <vs-alert
        :active.sync="selectionPageAlert"
        class="text-center"
        color="grey-dark"
        closable icon-pack="feather"
        close-icon="icon-x">
        {{ $t('$SharedByManyModules.SelectedAllPageInListMsg', {
        count: rowsSelectedCount,
        entity: $tc(`$Entities.${entity}`, rowsSelectedCount) }) }}
        <a
        href="#"
        @click.prevent="setSelectedRowsAll()">
          {{ $t('$SharedByManyModules.SelectAllInListMsg', {
          count: count,
          entity: $tc(`$Entities.${entity}`, count) }) }}
        </a>
      </vs-alert>

      <export-alert-info
        :entity="$tc(`$Entities.${entity}`, 2)"
        :exporting.sync="exportingList"
        :exported.sync="exportedList"
        :fileUrl="urlFileExported"/>

      <ag-grid-vue
        :key="agGridKey"
        ref="agGridTable"
        :domLayout="domLayout"
        :style="gridStyle"
        :components="components"
        :frameworkComponents="frameworkComponents"
        :gridOptions="gridOptions"
        class="ag-theme-material w-100 ag-grid-table"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :column-types="columnTypes"
        :getRowNodeId="getRowNodeId"
        :autoParamsRefresh="true"
        rowSelection="multiple"
        :animateRows="true"
        :suppressRowClickSelection="true"
        rowModelType="infinite"
        :pagination="hasPagination"
        :paginationPageSize="paginationPageSize"
        :suppressPaginationPanel="suppressPaginationPanel"
        :overlayLoadingTemplate="overlayLoadingTemplate"
        :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests"
        :cacheBlockSize="cacheBlockSize"
        :maxBlocksInCache="maxBlocksInCache"
        @selection-changed="onSelectionChanged"
        @grid-ready="onGridReady"
        @model-updated="onModelUpdate"
        @grid-size-changed="onGridSizeChanged"
        @first-data-rendered="onFirstDataRendered"
        @row-clicked="onRowClicked"
        @row-double-clicked="onRowDoubleClicked"
        @filter-changed="onFilterChanged">
      </ag-grid-vue>

      <vs-popup
        :title="titleModal"
        :active.sync="activeModalCreateOrEdit">
        <s-m-s-template-list-create-or-edit
          v-if="showCreateOrEditComponent"
          ref="createOrEdit"
          :entity="entity"
          :operation="operation"
          :model-payload="recordSelected"
          :actions="actionsOnCreateOrEdit"
          @action="onActionFromCreateOrEditForTemplate"
          @model-was-changed="(val) => this.createOrEditModelWasChanged=val"
          @saved="savedItemOnAgGridTable"
          @close="activeModalCreateOrEdit=false">
        </s-m-s-template-list-create-or-edit>
      </vs-popup>

      <vs-popup
        :title="exportModalTitle"
        :active.sync="activeModalToExport">
        <export-json-to-excel
          v-if="showExportComponent"
          :columns="getColumnsToExport"
          :data="rowsSelected"
          @close="activeModalToExport=false"
          @export="onExport">
        </export-json-to-excel>
      </vs-popup>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss';
import { mapActions, mapMutations } from 'vuex';

// Mixins
import commonTemplateListCreateOrEdit from '@/views/modules/templates/mixins/commonTemplateListCreateOrEdit';

// Cell Renderer
import CellRendererActions from '@/views/modules/templates/TemplateCellRendererActions.vue';

// Custom Components
import ImportExcelToJson from '@/views/modules/components/ImportExcelToJson.vue';
import BaseAgGridHeader from '@/views/modules/components/BaseAgGridHeader.vue';
import ItemsPerPage from '@/views/modules/components/ItemsPerPage.vue';
import ExportJsonToExcel from '@/views/modules/components/ExportJsonToExcel.vue';
import ListActionDropDown from '@/views/modules/components/ListActionDropDown.vue';
import SMSTemplateListCreateOrEdit from '@/views/modules/templates/sms-template/SMSTemplateListCreateOrEdit.vue';
import AgGridSelectionHeader from '@/views/modules/components/AgGridSelectionHeader';
import ExportAlertInfo from '@/views/modules/components/ExportAlertInfo.vue';

export default {
  name: 'SMSTemplateList',
  components: {
    BaseAgGridHeader,
    ExportJsonToExcel,
    ExportAlertInfo,
    ImportExcelToJson,
    ItemsPerPage,
    ListActionDropDown,
    SMSTemplateListCreateOrEdit,
    // eslint-disable-next-line vue/no-unused-components
    CellRendererActions,
  },
  mixins: [commonTemplateListCreateOrEdit],
  data() {
    return {
      entity: this.$enums.Entity.SMS_TEMPLATE,
      exportCollectionFunction: this.exportSMSTemplates,
      fetchAllCollectionFunction: this.fetchAllSMSTemplates,
      fetchAllCollectionTrashFunction: this.fetchAllSMSTemplatesFromTrash,
      deleteRecordFunction: this.removeSMSTemplate,
      deleteRecordsFunction: this.removeSMSTemplates,
      restoreItemFunction: this.restoreSMSTemplate,
      restoreItemsFunction: this.restoreSMSTemplates,
      sendCampaignFromTemplateFunction: this.sendSMSCampaignFromTemplate,
      columnDefs: [
        {
          colId: 'name',
          headerName: this.$t('$General.Name'),
          field: 'name',
          filter: 'agTextColumnFilter',
          minWidth: 200,
          maxWidth: 500,
          checkboxSelection: true,
          headerComponentParams: { checkboxSelection: true },
          requireOnImport: true,
        },
        {
          colId: 'message',
          headerName: this.$tc('$General.Message'),
          field: 'message',
          filter: 'agTextColumnFilter',
          minWidth: 300,
          maxWidth: 700,
          requireOnImport: true,
        },
      ],
      components: {
        CellRendererActions,
      },
      frameworkComponents: {
        agColumnHeader: AgGridSelectionHeader,
      },
    };
  },
  methods: {
    ...mapActions({
      fetchAllSMSTemplates: 'smsTemplate/fetchAllSMSTemplates',
      fetchAllSMSTemplatesFromTrash: 'smsTemplate/fetchAllSMSTemplatesFromTrash',
      importSMSTemplatesFromFile: 'smsTemplate/importFromFile',
      exportSMSTemplates: 'smsTemplate/exportFile',
      removeSMSTemplate: 'smsTemplate/removeSMSTemplate',
      removeSMSTemplates: 'smsTemplate/removeSMSTemplates',
      restoreSMSTemplate: 'smsTemplate/restoreSMSTemplate',
      restoreSMSTemplates: 'smsTemplate/restoreSMSTemplates',
    }),
    ...mapMutations({
      setTemplateToCampaign: 'smsCampaign/SET_FROM_SMS_TEMPLATE',
    }),
    async fetchAgGridData(params) {
      return this.fetchCollection(params);
    },
    sendSMSCampaignFromTemplate(smsTemplate) {
      this.setTemplateToCampaign(smsTemplate);
      this.$router.push({ name: 'sms-campaigns-create' });
    },
  },
};
</script>
