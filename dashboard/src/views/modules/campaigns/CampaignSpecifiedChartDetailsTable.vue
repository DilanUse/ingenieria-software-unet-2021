<template>
  <div>
    <ag-grid-vue
      :key="agGridKey"
      ref="agGridTable"
      :domLayout="$mq === 'mobile' ? 'normal' : 'autoHeight'"
      :style="{height: `${$mq === 'mobile' ? '400px' : '100%'} !important`}"
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
      :floatingFilter="$mq !== 'mobile'"
      :suppressRowClickSelection="true"
      :enableRtl="$vs.rtl"
      rowModelType="infinite"
      :pagination="$mq !== 'mobile'"
      :paginationPageSize="paginationPageSize"
      :suppressPaginationPanel="$mq === 'mobile'"
      :overlayLoadingTemplate="overlayLoadingTemplate"
      :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests"
      :cacheBlockSize="cacheBlockSize"
      :maxBlocksInCache="maxBlocksInCache"
      @selection-changed="onSelectionChanged"
      @grid-ready="onGridReady"
      @model-updated="onModelUpdate"
      @row-clicked="onRowClicked"
      @row-double-clicked="onRowDoubleClicked"
      @filter-changed="onFilterChanged">
    </ag-grid-vue>
  </div>
</template>

<script>

// Mixins
import commonAgGrid from '@/views/modules/mixins/commonAgGrid';

// Custom Components
import CellRendererStatus
  from '@/views/modules/campaigns/CampaignSpecifiedChartDetailsTableCellRendererStatus.vue';

export default {
  name: 'CampaignSpecifiedChartDetailsTable',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    CellRendererStatus,
  },
  mixins: [commonAgGrid],
  props: {
    fetchDetailsFunction: {
      type: Function,
      required: true,
    },
    campaignId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      count: 0,
      defaultPaginationPageSize: 5,
      columnDefs: [
        {
          colId: 'name',
          headerName: this.$t('$General.Name'),
          field: 'contact.name',
          filter: false,
          sortable: false,
          minWidth: 200,
          maxWidth: 500,
        },
        {
          coldId: 'phone',
          headerName: this.$tc('$General.Phone'),
          field: 'to',
          filter: false,
          sortable: false,
          minWidth: 100,
          maxWidth: 400,
          valueFormatter: (params) => this.$options.filters.phone(params.value),
        },
        {
          colId: 'status',
          headerName: this.$t('$General.Status'),
          headerClass: 'center-herder-ag-grid',
          field: 'status',
          filter: false,
          sortable: false,
          minWidth: 100,
          maxWidth: 300,
          cellRendererFramework: 'CellRendererStatus',
        },
        {
          colId: 'createdAt',
          headerName: 'Delivery time',
          field: 'deliveryTime',
          sort: 'desc',
          type: 'dateColumn',
          filter: false,
        },
      ],
      components: {
        CellRendererStatus,
      },
      frameworkComponents: {},
    };
  },
  methods: {
    async fetchAgGridData(params) {
      const resp = await this.fetchDetailsFunction({
        id: this.campaignId,
        params: {
          ...params,
          populate: [{
            path: 'contact',
            select: 'id firstName lastName name',
          }],
        },
      });

      if (resp.count) {
        this.count = resp.count;
      }

      return resp;
    },
  },
};
</script>

<style scoped>

</style>
