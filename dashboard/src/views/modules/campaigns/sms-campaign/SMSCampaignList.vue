<template>
  <div class="vx-card p-6">
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
          :options="campaignMultipleActionOptions"
          class="ml-3"
          @export="exportData()"
          @delete="confirmDeleteCampaign()">
        </list-action-drop-down>
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

    <vs-popup
      fullscreen
      :title="$t('$CampaignsModules.DetailCampaignTitle')"
      :active.sync="activeModalView">
      <campaign-specified-chart
        v-if="showCreateOrEditComponent"
        :entity="entity"
        :campaign-type="$enums.Campaign.Type.SMS"
        :fetch-function="fetchSMSCampaign"
        :fetch-details-function="fetchSMSCampaignDetails"
        :model-payload="recordSelected"/>
    </vs-popup>
  </div>
</template>

<script>
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss';
import {
  mapActions, mapMutations, mapState,
} from 'vuex';

// mixins
import campaignListWithAgGrid from '@/views/modules/mixins/campaigns/campaignListWithAgGrid';

// Custom Components
import BaseAgGridHeader from '@/views/modules/components/BaseAgGridHeader.vue';
import ItemsPerPage from '@/views/modules/components/ItemsPerPage.vue';
import ExportAlertInfo from '@/views/modules/components/ExportAlertInfo.vue';
import AgGridSelectionHeader from '@/views/modules/components/AgGridSelectionHeader';
import ExportJsonToExcel from '@/views/modules/components/ExportJsonToExcel.vue';
import ListActionDropDown from '@/views/modules/components/ListActionDropDown.vue';

// Cell Renderer
import CellRendererActions from '@/views/modules/campaigns/CampaignCellRenderActions.vue';
import CellRendererStatus from '@/views/modules/campaigns/CampaignCellRendererStatus.vue';

export default {
  name: 'SMSCampaignList',
  components: {
    BaseAgGridHeader,
    ItemsPerPage,
    ListActionDropDown,
    ExportJsonToExcel,
    ExportAlertInfo,
    // eslint-disable-next-line vue/no-unused-components
    AgGridSelectionHeader,
    // eslint-disable-next-line vue/no-unused-components
    CellRendererActions,
    // eslint-disable-next-line vue/no-unused-components
    CellRendererStatus,
  },
  mixins: [campaignListWithAgGrid],
  props: {
    actionsMinWidth: {
      type: Number,
      required: false,
      default: 50,
    },
  },
  data() {
    return {
      entity: this.$enums.Entity.SMS_CAMPAIGN,
      exportCollectionFunction: this.exportSMSCampaigns,
      deleteRecordFunction: this.removeSMSCampaign,
      deleteRecordsFunction: this.removeSMSCampaigns,
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
        },
        {
          colId: 'message',
          headerName: this.$tc('$General.Message'),
          field: 'message',
          filter: 'agTextColumnFilter',
          minWidth: 350,
          maxWidth: 450,
        },
        {
          colId: 'bounced',
          headerName: this.$t('$General.Bounced'),
          field: 'bounced',
          filter: false,
          minWidth: 150,
          maxWidth: 200,
        },
        {
          colId: 'outbound',
          headerName: this.$t('$General.Outbound'),
          field: 'outbound',
          filter: false,
          minWidth: 150,
          maxWidth: 200,
        },
        {
          colId: 'status',
          headerName: this.$t('$General.Status'),
          headerClass: 'center-herder-ag-grid',
          field: 'status',
          filter: false,
          minWidth: 150,
          maxWidth: 200,
          cellRendererFramework: 'CellRendererStatus',
        },
      ],
      components: {
        CellRendererActions,
        CellRendererStatus,
      },
      frameworkComponents: {
        agColumnHeader: AgGridSelectionHeader,
      },
    };
  },
  computed: {
    ...mapState({
      draftCampaign: (state) => state.smsCampaign.draftCampaign,
    }),
  },
  watch: {
    activeModalCreateOrEdit(val) {
      if (val) {
        switch (this.operation) {
          case this.$enums.Operation.CREATE:
            this.showCreateOrEditComponent = false;
            this.$router.push('/sms-campaigns/create');
            break;

          case this.$enums.Operation.EDIT:
            this.showCreateOrEditComponent = false;
            this.setCampaignPayload(this.recordSelected);
            this.$router.push('/sms-campaigns/edit');
            break;

          case this.$enums.Operation.CLONE:
            this.showCreateOrEditComponent = false;
            this.$router.push('/sms-campaigns/clone'); // todo: implement cloning campaign
            break;

          case this.$enums.Operation.VIEW:
            this.activeModalView = true;
            break;

          default:
        }
      }
    },
    activeModalView(val) {
      if (!val) {
        this.activeModalCreateOrEdit = false;
      }
    },
  },
  methods: {
    ...mapActions({
      fetchAllSMSCampaigns: 'smsCampaign/fetchAllSMSCampaigns',
      fetchSMSCampaign: 'smsCampaign/fetchSMSCampaign',
      fetchSMSCampaignDetails: 'smsCampaign/fetchSMSCampaignDetails',
      exportSMSCampaigns: 'smsCampaign/exportFile',
      removeSMSCampaign: 'smsCampaign/removeSMSCampaign',
      removeSMSCampaigns: 'smsCampaign/removeSMSCampaigns',
    }),
    ...mapMutations({
      setCampaignPayload: 'smsCampaign/SET_SMS_CAMPAIGN_PAYLOAD',
    }),
    async fetchAgGridData(params) {
      if (this.statusFilter) {
        // eslint-disable-next-line no-param-reassign
        params.filters = params.filter || {};
        // eslint-disable-next-line no-param-reassign
        params.filters = {
          status: this.statusFilter,
        };
      }

      return this.fetchAllSMSCampaigns({
        ...params,
        populate: [
          { path: 'senderId', select: 'id dialCode phoneSignificant name' },
        ],
      });
    },
  },
};
</script>
