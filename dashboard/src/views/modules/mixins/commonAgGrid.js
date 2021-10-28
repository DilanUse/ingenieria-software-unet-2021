import { AgGridVue } from 'ag-grid-vue';


export default {
  components: {
    AgGridVue,
  },
  props: {
    agGridOverlayId: {
      type: String,
      required: false,
      default() {
        const random = Math.random().toString(36).substring(7);
        return `agGridOverlay-${random}`;
      },
    },
    hideActionsColumn: {
      type: Boolean,
      default: false,
    },
    hideTimestampsColumns: {
      type: Boolean,
      default: false,
    },
    hideCreatedAtColumn: {
      type: Boolean,
      default: false,
    },
    hideUpdatedAtColumn: {
      type: Boolean,
      default: false,
    },
    createdAtHeaderName: {
      type: String,
      default: '$General.CreatedAt',
    },
    updatedAtHeaderName: {
      type: String,
      default: '$General.UpdatedAt',
    },
    initialFilters: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    actionsMinWidth: {
      type: Number,
      required: false,
      default: 150,
    },
    actionsMaxWidth: {
      type: Number,
      required: false,
      default: 400,
    },
  },
  data() {
    return {
      dataModel: this.$enums.DataModel.SERVER,
      count: 0,
      agGridKey: 0,
      afterOnModelUpdateFunction: null,
      selectionPageAlert: false,
      firstGetRows: true,
      filtersAppliedCount: 0,
      maxConcurrentDatasourceRequests: 1,
      cacheBlockSize: 100,
      maxBlocksInCache: 1,
      defaultPaginationPageSize: 10,
      filtersMatch: this.$enums.AppFilter.FilterMathType.ALL,
      overlayLoadingTemplate: `<div class="ag-overlay-loading-center"
          style="box-shadow: none; background: transparent; width: 100px; height: 100px">
          <div id="${this.agGridOverlayId}"
            class="vs-con-loading__container"
            style="background: transparent; width: 100%; height: 100%">
          </div>
        </div>`,
      dataSource: {
        async getRows(params) {
          const { componentParent } = params.context;
          const overlayId = `#${componentParent.agGridOverlayId}`;
          const filters = { ...params.filterModel };

          if (componentParent.setFiltersBulkOperation) {
            componentParent.setFiltersBulkOperationCount += 1;
          }

          if (componentParent.setFiltersBulkOperation
            && componentParent.setFiltersBulkOperationCount
            < componentParent.setFiltersBulkOperationAmount) {
            return;
          }

          if (componentParent.setFiltersBulkOperation) {
            componentParent.setFiltersBulkOperation = false;
            componentParent.setFiltersBulkOperationCount = 0;
            componentParent.setFiltersBulkOperationAmount = 0;
          }

          componentParent.gridApi.showLoadingOverlay();
          componentParent.$vs.loading({
            container: overlayId,
            scale: 0.6,
          });

          Object.keys(params.filterModel).forEach((key) => {
            if (key === 'tags' || filters[key].filterType === 'categories') {
              filters[key].filter = filters[key].filter.map((t) => t.id);
            }
          });

          const data = await componentParent.fetchAgGridData({
            sortBy: params.sortModel,
            filters,
            filtersMatch: componentParent.filtersMatch,
            skip: params.startRow,
            limit: componentParent.cacheBlockSize,
          });

          const rowsThisPage = data.data;
          let lastRow = -1;
          componentParent.count = data.count || 0;

          if (data.count) {
            if (data.count <= params.endRow) {
              lastRow = data.count;
            }
          } else if (rowsThisPage.length < componentParent.cacheBlockSize) {
            lastRow = params.endRow - componentParent.cacheBlockSize + rowsThisPage.length;
          }

          params.successCallback(rowsThisPage, lastRow);
          componentParent.$vs.loading.close(`${overlayId} > .con-vs-loading`);
          componentParent.gridApi.hideOverlay();

          if (componentParent.lastSavedId || componentParent.lastSavedIds.length > 0) {
            const nodes = [];

            if (componentParent.lastSavedId) {
              nodes.push(componentParent.gridApi.getRowNode(componentParent.lastSavedId));
            } else {
              componentParent.gridApi.forEachNode((node) => {
                if (componentParent.lastSavedIds.includes(node.id)) {
                  nodes.push(node);
                }
              });
            }

            componentParent.gridApi.flashCells({
              rowNodes: nodes,
              flashDelay: 3000,
              fadeDelay: 2000,
            });

            componentParent.lastSavedId = null;
            componentParent.lastSavedIds = [];
          }
        },
      },
      setFiltersBulkOperation: false,
      setFiltersBulkOperationAmount: 0,
      setFiltersBulkOperationCount: 0,
      columnDefs: [],
      rowsSelected: [],
      selectedAllRows: false,
      getRowNodeId: null,
      searchQuery: '',
      gridApi: null,
      gridColumnApi: null,
      gridOptions: {
        context: {
          componentParent: this,
        },
      },
      columnTypes: {
        dateColumn: {
          minWidth: 260,
          maxWidth: 300,
          filter: 'agDateColumnFilter',
          filterParams: {
            suppressAndOrCondition: true,
            alwaysShowBothConditions: false,
          },
          valueFormatter: (params) => this.$options.filters.date(params.value),
        },
      },
      defaultColDef: {
        floatingFilter: true,
        sortable: true,
        resizable: true,
        suppressMenu: true,
        unSortIcon: true,
        filterParams: {
          buttons: ['reset', 'apply'],
          closeOnApply: true,
          alwaysShowBothConditions: true,
        },
      },
      commonColumnDefs: [
        {
          colId: 'creator',
          headerName: 'Creator',
          field: 'creator.id',
          filter: false,
          width: 0,
          hide: true,
        },
        {
          colId: 'createdAt',
          headerName: this.$t(this.createdAtHeaderName),
          field: 'createdAt',
          sort: 'desc',
          type: 'dateColumn',
        },
        {
          colId: 'updatedAt',
          headerName: this.$t(this.updatedAtHeaderName),
          field: 'updatedAt',
          type: 'dateColumn',
        },
        {
          colId: 'actions',
          minWidth: this.actionsMinWidth,
          maxWidth: this.actionsMaxWidth,
          sortable: false,
          filter: false,
          pinned: 'right',
          cellRendererFramework: 'CellRendererActions',
        },
      ],
      lastSavedId: null,
      lastSavedIds: [],
      showOnlyFirstColumnOnMobile: true,
    };
  },
  computed: {
    paginationPageSize() {
      if (this.gridApi) return this.gridApi.paginationGetPageSize();
      return this.defaultPaginationPageSize;
    },
    totalPages() {
      if (this.gridApi) return this.gridApi.paginationGetTotalPages();
      return 0;
    },
    currentPage: {
      get() {
        if (this.gridApi) return this.gridApi.paginationGetCurrentPage() + 1;
        return 1;
      },
      set(val) {
        this.gridApi.paginationGoToPage(val - 1);
      },
    },
    domLayout() {
      return 'normal';
      // return this.$mq === this.$enums.mqBreakpoints.MOBILE ? 'normal' : 'autoHeight';
    },
    gridStyle() {
      let height = '80vh';
      let minHeight = '400px';

      if (this.$mq === this.$enums.mqBreakpoints.MOBILE) {
        height = '60vh';
      } else if (this.count <= 1) {
        height = '40vh';
        minHeight = '250px';
      } else if (this.count <= 2) {
        height = '48vh';
        minHeight = '300px';
      } else if (this.count <= 3) {
        height = '56vh';
        minHeight = '300px';
      } else if (this.count <= 4) {
        height = '64vh';
        minHeight = '350px';
      } else if (this.count <= 5) {
        height = '72vh';
      }

      return { height, minHeight };
    },
    hasPagination() {
      return this.$mq !== this.$enums.mqBreakpoints.MOBILE;
    },
    suppressPaginationPanel() {
      return this.$mq === this.$enums.mqBreakpoints.MOBILE;
    },
    suppressColumnVirtualisation() {
      return this.$mq === this.$enums.mqBreakpoints.MOBILE;
    },
    getColumnsToExport() {
      return this.columnDefs.filter(
        (c) => !c.colId || ['creator', 'actions'].indexOf(c.colId) === -1,
      ).map((c) => ({
        title: c.headerName,
        field: c.field,
      }));
    },
    columnDefsToImport() {
      return this.columnDefs.slice(
        0, this.columnDefs.length - this.commonColumnDefs.length,
      ).filter((value) => !value.ignoreOnImport).map((value) => ({
        headerName: value.headerName,
        field: value.field,
        required: value.requireOnImport || false,
        requireIfNull: value.requireOnImportIfNull || null,
        validation: value.validationOnImport || null,
      }));
    },
    rowsSelectedCount() {
      return this.rowsSelected.length;
    },
    rowsSelectedCountWithAllSelection() {
      return this.selectedAllRows ? this.count : this.rowsSelectedCount;
    },
    isAnyRowsSelected() {
      return this.rowsSelectedCount > 0;
    },
    isAnyRowsSelectedOrAll() {
      return this.isAnyRowsSelected || this.selectedAllRows;
    },
    rowsSelectedAreReallyAll() {
      return this.rowsSelectedCount === this.count;
    },
    rowsSelectedWithAllSelectionOrNull() {
      return !this.selectedAllRows || this.rowsSelectedAreReallyAll
        ? this.rowsSelected : null;
    },
  },
  watch: {
    $mq(newVal, oldVal) {
      if ((newVal === this.$enums.mqBreakpoints.MOBILE
        || oldVal === this.$enums.mqBreakpoints.MOBILE)
        && newVal !== oldVal) {
        this.setSelectedRowsNone();
        this.agGridKey += 1;
        this.rowsSelected = [];
      }
    },
    filtersMatch() {
      this.resetDataSourceAndSelection();
    },
  },
  beforeMount() {
    this.getRowNodeId = (data) => data.id;
    if (this.hideActionsColumn) {
      this.deleteCommonColumnDef('actions');
    }

    if (this.hideCreatedAtColumn || this.hideTimestampsColumns) {
      this.deleteCommonColumnDef('createdAt');
    }

    if (this.hideUpdatedAtColumn || this.hideTimestampsColumns) {
      this.deleteCommonColumnDef('updatedAt');
    }

    this.columnDefs = [...this.columnDefs, ...this.commonColumnDefs];
  },
  beforeDestroy() {
    this.gridApi.destroy();
  },
  methods: {
    onGridReady(params) {
      this.loadGridApi();

      if (typeof this.initialFilters === 'object' && Object.keys(this.initialFilters).length > 0) {
        this.applyFilters(this.initialFilters);
      }

      if (this.dataModel === this.$enums.DataModel.SERVER) {
        const overlayId = `#${this.agGridOverlayId}`;
        this.gridApi.showLoadingOverlay();
        this.$vs.loading({
          container: overlayId,
          scale: 0.6,
        });

        this.setAgGridDataSource();
      }
    },
    onModelUpdate(e) {
      this.fitColumnsOnChanges();

      if (this.selectedAllRows) {
        this.setSelectedRowsCurrentPage();
      }

      if (typeof this.afterOnModelUpdateFunction === 'function') {
        this.afterOnModelUpdateFunction();
      }
    },
    onFilterChanged() {
      this.filtersAppliedCount = Object.keys(this.gridApi.getFilterModel()).length;
      this.setSelectedRowsNone();
      this.$emit('update:initial-filters', this.getMappedFilterModel());
    },
    onFirstDataRendered(params) {
      this.fitColumnsOnChanges();
    },
    onGridSizeChanged(params) {
      this.fitColumnsOnChanges();
    },
    setAgGridDataSource() {
      this.gridApi.setDatasource(this.dataSource);
    },
    updateSearchQuery(val) {
      this.gridApi.setQuickFilter(val);
    },
    onSelectionChanged() {
      this.rowsSelected = this.gridApi.getSelectedRows();
      this.afterOnSelectionChanged();

      if (!this.currentPageIsSelected()) {
        this.selectionPageAlert = false;
      }
    },
    afterOnSelectionChanged() {},
    loadGridApi() {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;

      if (this.$vs.rtl) {
        const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container');
        header.style.left = `-${String(Number(header.style.transform.slice(11, -3)) + 9)}px`;
      }
    },
    async fetchAgGridData() {
      return {
        data: [],
        count: 0,
      };
    },
    fitColumnsOnChanges() {
      if (this.$mq === this.$enums.mqBreakpoints.LAPTOP
          || this.$mq === this.$enums.mqBreakpoints.DESKTOP) {
        this.columnDefs.forEach((col) => {
          this.gridColumnApi.setColumnVisible(col.colId, !col.hide && col.colId !== 'actions');
        });
        this.autoSizeOrFitColumnsByViewport();
        this.gridColumnApi.setColumnVisible('actions', true);
        this.gridColumnApi.autoSizeColumn('actions', true);
      } else if (this.$mq === this.$enums.mqBreakpoints.TABLET) {
        this.columnDefs.forEach((col) => {
          this.gridColumnApi.setColumnVisible(col.colId, !col.hide && col.colId !== 'actions');
        });
        this.autoSizeOrFitColumnsByViewport();
      } else {
        this.columnDefs.forEach((col, index) => {
          this.gridColumnApi.setColumnVisible(
            col.colId,
            index === 0 || !this.showOnlyFirstColumnOnMobile,
          );
        });
        this.gridApi.sizeColumnsToFit();
      }
    },
    remainsSpaceInViewport() {
      const $viewport = this.$el.getElementsByClassName('ag-header-viewport').item(0);
      const $container = this.$el.getElementsByClassName('ag-header-container').item(0);

      if ($viewport && $container) {
        return $container.offsetWidth < $viewport.offsetWidth;
      }

      return null;
    },
    autoSizeOrFitColumnsByViewport() {
      this.autoSizeColumns();

      if (this.remainsSpaceInViewport()) {
        this.gridApi.sizeColumnsToFit();
      }
    },
    autoSizeColumns() {
      const allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach((column) => {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, false);
    },
    rowDataUpdated() {
      this.fitColumnsOnChanges();
    },
    resetDataSourceAndSelection() {
      if (this.dataModel === this.$enums.DataModel.SERVER) {
        this.setAgGridDataSource();
        this.setSelectedRowsNone();
      }
    },
    getMappedFilterModel() {
      const filters = { ...this.gridApi.getFilterModel() };

      Object.keys(filters).forEach((key) => {
        if (key === 'tags' || filters[key].filterType === 'categories') {
          filters[key].filter = filters[key].filter.map((t) => t.id);
        }
      });

      return filters;
    },
    getSortModel() {
      const colState = this.gridColumnApi.getColumnState();
      return colState.filter((s) => s.sort != null).map((s) => ({
        colId: s.colId,
        sort: s.sort,
      }));
    },
    applyFilters(filters) {
      if (filters && typeof filters === 'object') {
        const filtersToApply = Object.keys(filters).filter((key) => key !== '_id'
          && key !== 'id' && typeof filters[key] === 'object').reduce((obj, key) => {
          // eslint-disable-next-line no-param-reassign
          obj[key] = filters[key];
          return obj;
        }, {});

        const filtersCount = this.getFiltersBulkOperationAmount(filtersToApply);

        if (filtersCount > 1) {
          this.setFiltersBulkOperation = true;
          this.setFiltersBulkOperationAmount = filtersCount;
          this.setFiltersBulkOperationCount = 0;
        }

        this.gridApi.setFilterModel(filtersToApply);
      }
    },
    resetFilters() {
      const model = this.gridApi.getFilterModel();

      if (model && typeof model === 'object' && Object.keys(model).length > 0) {
        const filtersCount = this.getFiltersBulkOperationAmount(model);
        if (filtersCount > 1) {
          this.setFiltersBulkOperation = true;
          this.setFiltersBulkOperationAmount = filtersCount;
          this.setFiltersBulkOperationCount = 0;
        }
      }

      this.gridApi.setFilterModel(null);
    },
    getFiltersBulkOperationAmount(filters) {
      let count = 1;
      // eslint-disable-next-line no-restricted-syntax
      for (const value of Object.values(filters)) {
        // eslint-disable-next-line no-restricted-globals
        if (typeof value === 'object'
          && [
            this.$enums.AppFilterType.TAGS,
            this.$enums.AppFilterType.BOOLEAN,
            this.$enums.AppFilterType.CATEGORIES,
          ].indexOf(value.filterType) !== -1) {
          count += 1;
        }
      }

      return count;
    },
    paginationSetPageSize(size) {
      this.gridApi.paginationSetPageSize(size);
      this.selectionPageAlert = false;
    },
    setSelectedRowsAll() {
      this.selectedAllRows = true;
      this.gridApi.forEachNode((node) => {
        node.setSelected(true);
      });
    },
    setSelectedRowsCurrentPage() {
      const currentPage = this.currentPage - 1;
      const startRow = currentPage * this.paginationPageSize;
      const endRow = startRow + this.paginationPageSize;

      this.gridApi.forEachNode((node) => {
        if (node.rowIndex >= startRow && node.rowIndex < endRow) {
          node.setSelected(true);
        } else {
          node.setSelected(false);
        }
      });
    },
    currentPageIsSelected() {
      const currentPage = this.currentPage - 1;
      const startRow = currentPage * this.paginationPageSize;
      const endRow = startRow + this.paginationPageSize;
      let currentPageIsSelected = true;

      this.gridApi.forEachNode((node) => {
        if (node.rowIndex >= startRow && node.rowIndex < endRow) {
          if (!node.isSelected()) {
            currentPageIsSelected = false;
          }
        } else if (node.isSelected()) {
          currentPageIsSelected = false;
        }
      });

      return currentPageIsSelected;
    },
    setSelectedRowsNone() {
      this.selectedAllRows = false;
      this.gridApi.deselectAll();
    },
    selectFromHeader(selection, fromCheckbox = false) {
      switch (selection) {
        case 'all':
          this.setSelectedRowsAll();
          break;
        case 'none':
          this.setSelectedRowsNone();
          break;
        case 'page':
          this.selectedAllRows = false;
          this.gridApi.deselectAll();
          this.setSelectedRowsCurrentPage();
          this.selectionPageAlert = fromCheckbox && this.count > this.paginationPageSize;
          break;

        default:
      }
    },
    deleteCommonColumnDef(coldId = '') {
      const index = this.commonColumnDefs.findIndex((col) => col.colId === coldId);

      if (index !== -1) {
        this.commonColumnDefs.splice(index, 1);
      }
    },
  },
};
