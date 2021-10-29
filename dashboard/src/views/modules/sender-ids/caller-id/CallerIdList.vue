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
          :options="defaultMultipleActionOptions"
          class="ml-3"
          @export="exportData()"
          @delete="confirmDeleteRecords()">
        </list-action-drop-down>
      </template>

      <template v-slot:header-right>
        <vs-button
          color="primary"
          type="border"
          :size="headerButtonsSizeByResolution"
          icon-pack="feather"
          icon="icon-plus"
          class="mr-3"
          @click="newItem">
          {{ $t("$General.AddNew") }}
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
      <caller-id-list-create-or-edit
        v-if="showCreateOrEditComponent"
        :entity="entity"
        :operation="operation"
        :model-payload="recordSelected"
        :actions="actionsOnCreateOrEdit"
        @action="onActionFromCreateOrEditForSender"
        @model-was-changed="(val) => this.createOrEditModelWasChanged=val"
        @saved="savedItemOnAgGridTable"
        @close="activeModalCreateOrEdit=false">
      </caller-id-list-create-or-edit>
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

    <vs-popup
      :title="$t('$SenderIdsModules.VerificationModalTitle', {
        entity: this.$tc(`$Entities.${this.entity}`),
        name: this.recordToVerify ? this.recordToVerify.name : '',
        value: this.recordToVerify ? this.recordToVerify.phoneInternational: ''
      })"
      :active.sync="activeModalVerify">
      <sender-id-verification
        v-if="activeModalVerify"
        :model-payload="recordToVerify"
        :message="$t('$CallerIdModule.VerifyPhoneMsg')"
        :entity="entity"
        :send-code="sendVerificationCode"
        @close="activeModalVerify=false"
        @verified="afterVerifySenderId()">
      </sender-id-verification>
    </vs-popup>
  </div>
</template>

<script>
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss';
import { mapActions, mapState } from 'vuex';

// Mixins
import commonListSenderId from '@/views/modules/sender-ids/mixins/commonListSenderId';

// Cell Renderer
import SenderIdCellRendererStatus from '@/views/modules/sender-ids/SenderIdCellRendererStatus.vue';
import CellRendererActions from '@/views/modules/sender-ids/SenderIdCellRendererActions.vue';

// Custom Components
import CallerIdListCreateOrEdit from '@/views/modules/sender-ids/caller-id/CallerIdListCreateOrEdit.vue';
import SenderIdVerification from '@/views/modules/sender-ids/SenderIdVerification.vue';
import BaseAgGridHeader from '@/views/modules/components/BaseAgGridHeader.vue';
import ItemsPerPage from '@/views/modules/components/ItemsPerPage.vue';
import ExportJsonToExcel from '@/views/modules/components/ExportJsonToExcel.vue';
import ListActionDropDown from '@/views/modules/components/ListActionDropDown.vue';
import AgGridSelectionHeader from '@/views/modules/components/AgGridSelectionHeader';
import ExportAlertInfo from '@/views/modules/components/ExportAlertInfo.vue';


export default {
  name: 'CallerIdList',
  components: {
    BaseAgGridHeader,
    ExportJsonToExcel,
    ItemsPerPage,
    ListActionDropDown,
    CallerIdListCreateOrEdit,
    SenderIdVerification,
    ExportAlertInfo,
    // eslint-disable-next-line vue/no-unused-components
    CellRendererActions,
    // eslint-disable-next-line vue/no-unused-components
    SenderIdCellRendererStatus,
  },
  mixins: [commonListSenderId],
  data() {
    return {
      entity: this.$enums.Entity.CALLER_ID,
      exportCollectionFunction: this.exportCallerIds,
      deleteRecordFunction: this.removeCallerId,
      deleteRecordsFunction: this.removeCallerIds,
      columnDefs: [
        {
          colId: 'name',
          headerName: this.$t('$General.Name'),
          field: 'name',
          filter: true,
          minWidth: 100,
          maxWidth: 500,
          checkboxSelection: true,
          headerComponentParams: { checkboxSelection: true },
        },
        {
          colId: 'phoneInternational',
          headerName: this.$tc('$General.Phone'),
          field: 'phoneInternational',
          filter: true,
          minWidth: 100,
          maxWidth: 500,
        },
        {
          colId: 'status',
          headerName: this.$t('$General.Status'),
          headerClass: 'center-herder-ag-grid',
          field: 'status',
          filter: false,
          minWidth: 100,
          maxWidth: 300,
          cellRendererFramework: 'SenderIdCellRendererStatus',
        },
      ],
      components: {
        CellRendererActions,
        SenderIdCellRendererStatus,
      },
      frameworkComponents: {
        agColumnHeader: AgGridSelectionHeader,
      },
    };
  },
  computed: {
    ...mapState({
      lastCreated: (state) => state.callerId.lastCreated, // review is this is necessary or no
    }),
  },
  methods: {
    ...mapActions({
      fetchAllCallerIds: 'callerId/fetchAllCallerIds',
      exportCallerIds: 'callerId/exportFile',
      removeCallerId: 'callerId/removeCallerId',
      removeCallerIds: 'callerId/removeCallerIds',
    }),
    async fetchAgGridData(params) {
      return this.fetchAllCallerIds(params);
    },
  },
};
</script>
