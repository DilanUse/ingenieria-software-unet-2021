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
          {{ $t("$UserModule.InviteUsers") }}
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
      <user-list-invite-or-edit
        v-if="showCreateOrEditComponent"
        :entity="entity"
        :operation="operation"
        :model-payload="recordSelected"
        :actions="actionsOnCreateOrEdit"
        @action="onActionFromCreateOrEdit"
        @model-was-changed="(val) => this.createOrEditModelWasChanged=val"
        @saved="savedItemOnAgGridTable"
        @close="activeModalCreateOrEdit=false">
      </user-list-invite-or-edit>
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
</template>

<script>
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss';
import { mapActions, mapState } from 'vuex';

// Custom components
import BaseAgGridHeader from '@/views/modules/components/BaseAgGridHeader.vue';
import ItemsPerPage from '@/views/modules/components/ItemsPerPage.vue';
import ExportJsonToExcel from '@/views/modules/components/ExportJsonToExcel.vue';
import ListActionDropDown from '@/views/modules/components/ListActionDropDown.vue';
import UserListInviteOrEdit from '@/views/modules/user/UserListInviteOrEdit.vue';
import AgGridSelectionHeader from '@/views/modules/components/AgGridSelectionHeader';
import ExportAlertInfo from '@/views/modules/components/ExportAlertInfo.vue';

// Cell Renderer
import UserListCellRendererLink from '@/views/modules/user/UserListCellRendererLink.vue';
import UserListCellRendererStatus from '@/views/modules/user/UserListCellRendererStatus.vue';
import UserListCellRendererRole from '@/views/modules/user/UserListCellRendererRole.vue';
import CellRendererActions from '@/views/modules/user/UserListInviteCellRendererActions.vue';

// Mixins
import commonListCreateOrEditWithAgGrid from '@/views/modules/mixins/commonListCreateOrEditWithAgGrid';

export default {
  components: {
    BaseAgGridHeader,
    UserListInviteOrEdit,
    ItemsPerPage,
    ListActionDropDown,
    ExportJsonToExcel,
    ExportAlertInfo,
    // eslint-disable-next-line vue/no-unused-components
    UserListCellRendererLink,
    // eslint-disable-next-line vue/no-unused-components
    CellRendererActions,
    // eslint-disable-next-line vue/no-unused-components
    UserListCellRendererStatus,
    // eslint-disable-next-line vue/no-unused-components
    UserListCellRendererRole,
  },
  mixins: [commonListCreateOrEditWithAgGrid],
  data() {
    return {
      entity: this.$enums.Entity.USER,
      cloneDisabled: true,
      exportCollectionFunction: this.exportUsers,
      deleteRecordFunction: this.removeUser,
      deleteRecordsFunction: this.removeUsers,
      columnDefs: [
        {
          colId: 'email',
          headerName: this.$tc('$General.Email'),
          field: 'email',
          filter: true,
          minWidth: 350,
          maxWidth: 500,
          cellRendererFramework: 'UserListCellRendererLink',
          checkboxSelection: true,
          headerComponentParams: { checkboxSelection: true },
        },
        {
          colId: 'name',
          headerName: this.$t('$General.Name'),
          field: 'name',
          filter: true,
          minWidth: 200,
          maxWidth: 300,
        },
        {
          colId: 'role',
          headerName: this.$tc('$General.Type'),
          field: 'role.name',
          filter: true,
          minWidth: 150,
          maxWidth: 200,
          cellRendererFramework: 'UserListCellRendererRole',
        },
        {
          colId: 'status',
          headerName: this.$t('$General.Status'),
          field: 'status',
          filter: true,
          minWidth: 150,
          maxWidth: 200,
          cellRendererFramework: 'UserListCellRendererStatus',
        },
      ],
      components: {
        UserListCellRendererLink,
        CellRendererActions,
        UserListCellRendererStatus,
        UserListCellRendererRole,
      },
      frameworkComponents: {
        agColumnHeader: AgGridSelectionHeader,
      },
    };
  },
  computed: {
    ...mapState({
      authUser: (state) => state.auth.info.user,
    }),
    titleModalName() {
      return this.recordSelected && this.recordSelected.name && this.recordSelected.email
        ? `${this.recordSelected.name}(${this.recordSelected.email})` : '';
    },
  },
  methods: {
    ...mapActions({
      fetchAllUsers: 'user/fetchAllUsers',
      exportUsers: 'user/exportFile',
      removeUser: 'user/removeUser',
      removeUsers: 'user/removeUsers',
    }),
    async fetchAgGridData(params) {
      return this.fetchAllUsers(params);
    },
  },
};
</script>
