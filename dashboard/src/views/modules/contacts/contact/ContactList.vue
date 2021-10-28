<template>
  <div>
    <import-excel-to-json
      :key="importComponentKey"
      v-if="showImportComponent"
      :target-headers="columnDefsToImport"
      :entity="entity"
      :on-save-import="onImport"
      :create-attributes="userHasPermissionTo($enums.Auth.Permissions.CAMPAIGNS)"
      :default-attributes="defaultAttributesToImportContacts"
      :import-confirm-is-valid="importOptInAgreement"
      @refresh="importComponentKey+=1"
      @attribute-created="onAttributeSaved"
      @imported="resetDataSourceAndSelection()"
      @close="showImportComponent=false">
      <template v-slot:default-attributes>
        <div
          class="vx-row">
          <div class="vx-col w-full md:w-1/2 mt-3 md:mt-0">
            <label class="vs-input--label">{{ $tc('$General.Tag', 2) }}</label>
            <tags-drop-down-filter
              :ag-grid-floating-filter="false"
              :selected-tags.sync="tagsToImportContacts">
            </tags-drop-down-filter>
          </div>
        </div>

        <div
          v-for="category in categoriesFromSelectedAudience"
          :key="category.id"
          class="mt-3">
          <label class="vs-input--label">{{ category.name }}</label>
          <div class="vx-row">
            <div
              v-for="item in category.items"
              :key="item.id"
              class="vx-col w-1/2 md:w-1/4 lg:w-1/6 pb-1">
              <div class="vs-component con-vs-checkbox vs-checkbox-primary vs-checkbox-default">
                <input
                  v-model="categoriesToImportContacts[category.id]"
                  :value="item"
                  type="checkbox"
                  class="vs-checkbox--input">
                <span
                  class="checkbox_x vs-checkbox"
                  style="border: 2px solid rgb(180, 180, 180);">
                    <span class="vs-checkbox--check">
                      <i class="vs-icon notranslate
                      icon-scale vs-checkbox--icon material-icons null">
                        check
                      </i>
                    </span>
                  </span>
                <span class="con-slot-label text-sm">{{ item.name | truncateEllipsis(18) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:additional-options>
        <div class="mt-base">
          <h5>
            {{ $t('$ContactModule.$ImportContacts.ContactsManagement') }}
          </h5>

          <ul class="mt-5">
            <li class="flex items-center my-3">
              <vs-switch
                v-model="importBlacklist"
                color="primary"
                class="d-inline-block"
              />
              <label class="d-inline-block ml-3">
                {{ $t('$ContactModule.$ImportContacts.BlacklistImportedContacts') }}
              </label>
              <vx-tooltip
                color="primary"
                :text="$t('$ContactModule.$ImportContacts.BlacklistImportedContactsMsg')"
                position="top"
                class="inline-block flex items-center">
                <feather-icon
                  class="ml-1"
                  icon="InfoIcon"
                  svgClasses="h-4 w-4 hover:text-primary cursor-pointer"/>
              </vx-tooltip>
            </li>
          </ul>
        </div>

        <div class="mt-base">
          <h5>
            {{ $t('$ContactModule.$ImportContacts.OptInAgreement') }}
          </h5>

          <div class="mt-5">
            <ul>
              <li>
                <vs-checkbox
                  color="success"
                  v-model="importOptInAgreement">
                  {{ $t('$ContactModule.$ImportContacts.OptInAgreementConditionsMsg') }}
                </vs-checkbox>
              </li>
            </ul>

            <ul
              class="mt-3 pl-12"
              style="list-style-type: disc">
              <li class="my-2">
                {{ $t('$ContactModule.$ImportContacts.OptInAgreementConditions1') }}
              </li>
              <li class="my-2">
                {{ $t('$ContactModule.$ImportContacts.OptInAgreementConditions2') }}
              </li>
              <li class="my-2">
                {{ $t('$ContactModule.$ImportContacts.OptInAgreementConditions3') }}
              </li>
            </ul>
          </div>

          <p class="mt-3">
            {{ $t('$ContactModule.$ImportContacts.OptInAgreementConditionsSuspendMsg') }}
          </p>
          <a
            href="https://help.sendinblue.com/hc/en-us/articles/213405965"
            target="_blank">
            {{ $t('$ContactModule.$ImportContacts.OptInAgreementLearnMore') }}
          </a>
        </div>
      </template>
    </import-excel-to-json>

    <div
      v-show="!showImportComponent"
      :class="[
        'vx-card',
        'py-6',
        !selectedFromCampaign ? 'px-6' : '',
        selectedFromCampaign ? 'no-shadow' : '',
        ]">
      <base-ag-grid-header
        :rows-selected-count="rowsSelectedCountWithAllSelection"
        :filters-count="filtersAppliedCount"
        :filters-match.sync="filtersMatch"
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
            @dnc="confirmCheckDNC"
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
            @click="newItem">
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
        closable
        icon-pack="feather"
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

      <contact-list-toolbar
        ref="contactListToolbar"
        v-if="!trash"
        :selected-segment.sync="selectedSegment"
        :filters="filtersModel"
        :contacts-match-count="count"
        :selected-from-campaign="selectedFromCampaign"
        @new-attribute="activeModalAttributeCreateOrEdit=true"
        @new-segment="showSegmentModalCreateOrEdit($enums.Operation.CREATE)"
        @edit-segment="showSegmentModalCreateOrEdit($enums.Operation.EDIT)"/>

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
        :applyColumnDefOrder="true"
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
        <contact-list-create-or-edit
          v-if="showCreateOrEditComponent"
          :entity="entity"
          :operation="operation"
          :model-payload="recordSelected"
          :actions="actionsOnCreateOrEdit"
          :all-contact-attributes="allContactAttributes"
          @action="onActionFromCreateOrEditForTrash"
          @model-was-changed="(val) => this.createOrEditModelWasChanged=val"
          @saved="savedItemOnAgGridTable"
          @close="activeModalCreateOrEdit=false">
        </contact-list-create-or-edit>
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
import {
  mapActions, mapGetters,
} from 'vuex';
import enums from '@/enums';

// Mixins
import commonTrashListCreateOrEditWithAgGrid from '@/views/modules/mixins/commonTrashListCreateOrEditWithAgGrid';

// Custom Components
import BaseAgGridHeader from '@/views/modules/components/BaseAgGridHeader.vue';
import ItemsPerPage from '@/views/modules/components/ItemsPerPage.vue';
import ExportJsonToExcel from '@/views/modules/components/ExportJsonToExcel.vue';
import ListActionDropDown from '@/views/modules/components/ListActionDropDown.vue';
import ContactListCreateOrEdit from '@/views/modules/contacts/contact/ContactListCreateOrEdit.vue';
import ExportAlertInfo from '@/views/modules/components/ExportAlertInfo.vue';
import AgGridSelectionHeader from '@/views/modules/components/AgGridSelectionHeader';
import ImportExcelToJson from '@/views/modules/components/ImportExcelToJson.vue';
import ContactListToolbar from '@/views/modules/contacts/contact/ContactListToolbar.vue';

// Cell Renderer
import CellRendererTags from '@/views/modules/contacts/contact/ContactListCellRendererTags.vue';
import CellRendererActions from '@/views/modules/contacts/contact/ContactListCellRendererActions.vue';
import CellRendererDate from '@/views/modules/components/cell-renderer/CellRendererDate.vue';
import CellRendererCategories from '@/views/modules/contacts/contact/ContactListCellRendererCategories.vue';
import CellRendererBooleans from '@/views/modules/contacts/contact/ContactListCellRendererBooleans.vue';
import CellRendererMarketingStatus from '@/views/modules/contacts/contact/ContactListCellRendererMarketingStatus.vue';

// Filters
import TagsDropDownFilter from '@/views/modules/contacts/contact/filters/TagsDropDownFilter';
import TagsFloatingFilter from '@/views/modules/contacts/contact/filters/TagsFloatingFilter';
import CategoriesDropDownFilter from '@/views/modules/contacts/contact/filters/CategoriesDropDownFilter';
import CategoriesFloatingFilter from '@/views/modules/contacts/contact/filters/CategoriesFloatingFilter';
import agGridBooleanFilter from '@/views/modules/components/filters/agGridBooleanFilter';
import agGridBooleanFloatingFilter from '@/views/modules/components/filters/agGridBooleanFloatingFilter';
import agGridStatusFilter from '@/views/modules/components/filters/agGridStatusFilter';
import agGridStatusFloatingFilter from '@/views/modules/components/filters/agGridStatusFloatingFilter';

export default {
  name: 'ContactList',
  components: {
    BaseAgGridHeader,
    ItemsPerPage,
    ListActionDropDown,
    ExportJsonToExcel,
    ContactListCreateOrEdit,
    ExportAlertInfo,
    ImportExcelToJson,
    TagsDropDownFilter,
    // eslint-disable-next-line vue/no-unused-components
    AgGridSelectionHeader,
    // Cell Renderer
    // eslint-disable-next-line vue/no-unused-components
    CellRendererActions,
    // eslint-disable-next-line vue/no-unused-components
    CellRendererTags,
    // eslint-disable-next-line vue/no-unused-components
    CellRendererCategories,
    // eslint-disable-next-line vue/no-unused-components
    CellRendererBooleans,
    // eslint-disable-next-line vue/no-unused-components
    CellRendererDate,
    // eslint-disable-next-line vue/no-unused-components
    CellRendererMarketingStatus,
    ContactListToolbar,
  },
  mixins: [commonTrashListCreateOrEditWithAgGrid],
  props: {
    selectedFromCampaign: {
      type: Boolean,
      required: false,
      default: false,
    },
    marketingStatusFilterOptions: {
      type: Array,
      required: false,
      validator(options) {
        return options.every(
          (option) => Object.values(enums.Contact.MarketingStatus).includes(option),
        );
      },
      default() {
        return Object.values(enums.Contact.MarketingStatus);
      },
    },
    marketingStatusFilterType: {
      type: String,
      required: false,
      validator(type) {
        return Object.values(enums.AppFilter.FilterType.Enum.Type).includes(type);
      },
      default: enums.AppFilter.FilterType.Enum.Type.ONE,
    },
  },
  data() {
    return {
      entity: this.$enums.Entity.CONTACT,
      dataSourceIsSet: false,
      insertedSelectedAudienceAttributes: false,
      selectedSegment: null,
      filtersChangedWithSegment: false,
      dontResetFiltersOnClearSegment: false,
      dontResetFiltersOnChangeFiltersMatch: false,
      filtersModel: null,
      allContactAttributes: [],

      // to import contacts
      tagsToImportContacts: [],
      categoriesToImportContacts: {},
      importBlacklist: false,
      importOptInAgreement: false,

      // modals
      activeModalAttributeCreateOrEdit: false,
      showCreateOrEditAttributeComponent: false,
      activeModalSegmentCreateOrEdit: false,
      showCreateOrEditSegmentComponent: false,
      titleModalAttribute: this.$t('$Modals.CreateModalTitle', {
        entity: this.$tc('$Entities.ContactAttribute', 1),
      }),
      titleModalSegment: '',
      segmentModalOperation: this.$enums.Operation.CREATE,

      baseColumnDefsCount: 8,
      columnDefs: [
        {
          colId: 'firstName',
          headerName: this.$t('$General.FirstName'),
          field: 'firstName',
          filter: 'agTextColumnFilter',
          minWidth: 100,
          maxWidth: 400,
          checkboxSelection: !this.selectedFromCampaign,
          headerComponentParams: { checkboxSelection: !this.selectedFromCampaign },
          requireOnImport: true,
        },
        {
          colId: 'lastName',
          headerName: this.$t('$General.LastName'),
          field: 'lastName',
          filter: 'agTextColumnFilter',
          minWidth: 100,
          maxWidth: 400,
        },
        {
          colId: 'email',
          headerName: this.$tc('$General.Email'),
          field: 'email',
          filter: 'agTextColumnFilter',
          minWidth: 100,
          maxWidth: 400,
          requireOnImportIfNull: 'phoneInternational',
        },
        {
          colId: 'phoneInternational',
          headerName: this.$tc('$General.Phone'),
          field: 'phoneInternational',
          filter: 'agTextColumnFilter',
          minWidth: 100,
          maxWidth: 400,
          validationOnImport: this.$enums.ImportCollections.Validations.PHONE,
          requireOnImportIfNull: 'email',
        },
        {
          colId: 'marketingStatus',
          headerName: this.$t('$General.MarketingStatus'),
          field: 'marketingStatus',
          filter: 'agGridStatusFilter',
          floatingFilterComponent: 'agGridStatusFloatingFilter',
          filterParams: {
            filterInner: 'value',
            statusOptions: this.marketingStatusFilterOptions.map((status) => ({
              name: this.$t(`$ContactModule.$MarketingStatus.${status}`),
              value: status,
            })),
            i18nPrefixStatus: '$ContactModule.$MarketingStatus.',
          },
          minWidth: 100,
          maxWidth: 600,
          cellRendererFramework: 'CellRendererMarketingStatus',
          ignoreOnImport: true,
        },
        {
          colId: 'tags',
          headerName: this.$tc('$General.Tag', 2),
          field: 'tags',
          minWidth: 400,
          maxWidth: 600,
          cellRendererFramework: 'CellRendererTags',
          sortable: false,
          unSortIcon: false,
          filter: 'TagsDropDownFilter',
          filterParams: {
            buttons: ['reset', 'apply'],
            closeOnApply: true,
            suppressAndOrCondition: true,
            alwaysShowBothConditions: false,
          },
          floatingFilterComponent: 'TagsFloatingFilter',
          ignoreOnImport: true,
        },
        {
          colId: 'dnc',
          headerName: this.$t('$General.DNCAbbreviation'),
          field: 'dnc',
          minWidth: 200,
          maxWidth: 400,
          cellRendererFramework: 'CellRendererBooleans',
          filter: 'agGridBooleanFilter',
          floatingFilterComponent: 'agGridBooleanFloatingFilter',
          ignoreOnImport: true,
          headerComponentParams: {
            tooltipText: this.$t('$General.DoNotCallRegister'),
            tooltipUrl: 'https://www.donotcall.gov.au/about/about-the-do-not-call-register/',
            tooltipIcon: 'InfoIcon',
            abbr: this.$t('$General.DoNotCallRegister'),
          },
        },
        {
          colId: 'dncDate',
          headerName: this.$t('$General.DNCRevisionDate'),
          field: 'dncDate',
          type: 'dateColumn',
          ignoreOnImport: true,
        },
      ],
      components: {
        CellRendererActions,
        CellRendererTags,
        CellRendererDate,
        CellRendererMarketingStatus,
      },
      frameworkComponents: {
        agColumnHeader: AgGridSelectionHeader,
        TagsFloatingFilter,
        TagsDropDownFilter,
        CategoriesDropDownFilter,
        CategoriesFloatingFilter,
        agGridBooleanFilter,
        agGridBooleanFloatingFilter,
        agGridStatusFilter,
        agGridStatusFloatingFilter,
      },
    };
  },
  computed: {
    ...mapGetters({
      userHasPermissionTo: 'auth/userHasPermissionTo',
    }),
    allMultipleActionOptions() {
      if (this.trash) {
        return [
          ...this.trashMultipleActionOptions,
          ...this.defaultMultipleActionOptions,
        ];
      }

      return [
        ...this.trashMultipleActionOptions,
        ...this.defaultMultipleActionOptions,
        {
          label: this.$t('$ContactModule.CheckDNCAction'),
          event: 'dnc',
          icon: 'SearchIcon',
        },
      ];
    },
    categoriesFromSelectedAudience() {
      return this.allContactAttributes.filter(
        (attr) => attr.type === this.$enums.Attributes.Type.CATEGORY,
      );
    },
    defaultAttributesToImportContacts() {
      const attributes = [
        {
          headerName: this.$tc('$Entities.Tag', 2),
          field: 'tags',
          value: this.tagsToImportContacts.map((t) => t.id),
        },
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(this.categoriesToImportContacts)) {
        const category = this.categoriesFromSelectedAudience.find((c) => c.id === key);

        if (category) {
          attributes.push({
            headerName: category.name,
            field: category.id,
            value,
          });
        }
      }

      return attributes;
    },
  },
  watch: {
    activeModalAttributeCreateOrEdit(val) {
      if (!val) {
        setTimeout(() => {
          this.showCreateOrEditAttributeComponent = false;
        }, 500);
      } else {
        this.showCreateOrEditAttributeComponent = true;
      }
    },
    activeModalSegmentCreateOrEdit(val) {
      if (!val) {
        setTimeout(() => {
          this.showCreateOrEditSegmentComponent = false;
        }, 500);
      } else {
        this.showCreateOrEditSegmentComponent = true;
      }
    },
    selectedSegment(val) {
      if (val && val.filters && typeof val.filters === 'object') {
        const { filters, filtersMatch } = val;

        this.filtersMatch = filtersMatch;
        this.applyFilters(filters);
        this.filtersChangedWithSegment = false;
        this.dontResetFiltersOnChangeFiltersMatch = true;
      } else if (!this.dontResetFiltersOnClearSegment) {
        const model = this.gridApi.getFilterModel();
        if (model && typeof model === 'object' && Object.keys(model).length > 0) {
          this.resetFilters();
        }
      } else {
        this.dontResetFiltersOnClearSegment = false;
      }
    },
    filtersMatch() {
      if (!this.dontResetFiltersOnChangeFiltersMatch) {
        this.selectedSegment = null;
        this.filtersChangedWithSegment = false;
        this.dontResetFiltersOnClearSegment = true;
      } else {
        this.dontResetFiltersOnChangeFiltersMatch = false;
      }
    },
    categoriesFromSelectedAudience(categories) {
      categories.forEach((attr) => {
        const value = this.categoriesToImportContacts[attr.id] || undefined;
        this.$set(this.categoriesToImportContacts, attr.id, value !== undefined ? value : []);
      });
    },
  },
  created() {

  },
  methods: {
    ...mapActions({
      fetchAllContacts: 'contact/fetchAllContacts',
      fetchAllContactsFromTrash: 'contact/fetchAllContactsFromTrash',
      fetchAllAttributes: 'attribute/fetchAllAttributes',

      importContactsFromFile: 'contact/importFromFile',
      exportContacts: 'contact/exportFile',

      checkDncCost: 'contact/checkDncCost',
      checkDncContacts: 'contact/checkDncContacts',

      removeItem: 'contact/removeContact',
      removeItems: 'contact/removeContacts',
      restoreItem: 'contact/restoreContact',
      restoreItems: 'contact/restoreContacts',
      updatePageTitle: 'updatePageTitle',
    }),
    async setAgGridDataSource() {
      await this.fetchAudienceAttributes();

      if (!this.insertedSelectedAudienceAttributes) {
        this.insertAttributesColumns(this.allContactAttributes);
      }

      this.gridApi.setDatasource(this.dataSource);
      this.dataSourceIsSet = true;
    },
    async fetchAgGridData(params) {
      const populate = [
        { path: 'tags', select: 'id name' },
      ];

      if (this.trash) {
        return this.fetchAllContactsFromTrash({
          ...params,
          populate,
        });
      }

      const filters = {
        ...params.filters,
      };

      if (!filters.marketingStatus) {
        filters.marketingStatus = {
          filterInner: 'value',
          filterType: this.$enums.AppFilterType.ENUM,
          type: this.marketingStatusFilterType,
          filter: this.marketingStatusFilterOptions,
        };
      }

      return this.fetchAllContacts({
        ...params,
        filters,
        populate,
      });
    },
    async fetchAudienceAttributes() {
      const resp = await this.fetchAllAttributes({});
      this.allContactAttributes = resp.data;
    },
    insertAttributesColumns(attributes = []) {
      if (attributes.length === 0) return;

      const agGridAttributeColumns = attributes.map((attr) => {
        let colDef = {
          colId: attr.id,
          headerName: attr.name,
          field: attr.id,
        };

        if (attr.type === this.$enums.Attributes.Type.DATE) {
          colDef = {
            ...colDef,
            type: 'dateColumn',
          };
        } else {
          colDef = {
            ...colDef,
            minWidth: this.getAgGridWidthFromAttributeType(attr.type, true),
            maxWidth: this.getAgGridWidthFromAttributeType(attr.type, false),
            filter: this.getAgGridFilterFromAttributeType(attr.type),
            floatingFilterComponent: this.getAgGridFloatingFilterFromAttributeType(attr.type),
            cellRendererFramework: this.getAgGridCellRendererFromAttributeType(attr.type),
          };

          if (attr.type === this.$enums.Attributes.Type.CATEGORY) {
            colDef = {
              ...colDef,
              sortable: false,
              unSortIcon: false,
              ignoreOnImport: true,
            };
          }
        }

        return colDef;
      });

      this.columnDefs = [
        ...this.columnDefs.slice(0, this.baseColumnDefsCount),
        ...agGridAttributeColumns,
        ...this.commonColumnDefs,
      ];
      this.insertedSelectedAudienceAttributes = true;
    },
    deleteAttributesColumns(attributes = 0) {
      this.columnDefs.splice(this.baseColumnDefsCount, attributes);
    },
    getAgGridFilterFromAttributeType(type = '') {
      switch (type) {
        case this.$enums.Attributes.Type.TEXT:
          return 'agTextColumnFilter';
        case this.$enums.Attributes.Type.NUMBER:
          return 'agNumberColumnFilter';
        case this.$enums.Attributes.Type.DATE:
          return 'agDateColumnFilter';
        case this.$enums.Attributes.Type.BOOL:
          return 'agGridBooleanFilter';
        case this.$enums.Attributes.Type.CATEGORY:
          return 'CategoriesDropDownFilter';

        default:
          return '';
      }
    },
    getAgGridFloatingFilterFromAttributeType(type = '') {
      switch (type) {
        case this.$enums.Attributes.Type.BOOL:
          return 'agGridBooleanFloatingFilter';
        case this.$enums.Attributes.Type.CATEGORY:
          return 'CategoriesFloatingFilter';
        default:
          return '';
      }
    },
    getAgGridCellRendererFromAttributeType(type = '') {
      switch (type) {
        case this.$enums.Attributes.Type.CATEGORY:
          return 'CellRendererCategories';
        case this.$enums.Attributes.Type.BOOL:
          return 'CellRendererBooleans';

        default:
          return '';
      }
    },
    getAgGridWidthFromAttributeType(type = '', min = true) {
      switch (type) {
        case this.$enums.Attributes.Type.TEXT:
          return min ? 200 : 400;
        case this.$enums.Attributes.Type.NUMBER:
          return min ? 100 : 200;
        case this.$enums.Attributes.Type.DATE:
          return min ? 260 : 260;
        case this.$enums.Attributes.Type.CATEGORY:
          return min ? 400 : 600;
        case this.$enums.Attributes.Type.BOOL:
          return min ? 200 : 400;

        default:
          return min ? 100 : 150;
      }
    },
    onFilterChanged() {
      if (this.setFiltersBulkOperation) {
        this.setFiltersBulkOperationCount += 1;
      }

      if (!this.setFiltersBulkOperation
        || this.setFiltersBulkOperationCount === this.setFiltersBulkOperationAmount) {
        const model = this.gridApi.getFilterModel();
        this.filtersAppliedCount = Object.keys(model).length;

        if (this.filtersAppliedCount > 0) {
          this.filtersModel = model;

          if (this.filtersChangedWithSegment) {
            this.selectedSegment = null;
            this.filtersChangedWithSegment = false;
            this.dontResetFiltersOnClearSegment = true;
          }

          if (this.selectedSegment && !this.filtersChangedWithSegment) {
            this.filtersChangedWithSegment = true;
          }
        } else {
          this.filtersModel = null;
          this.selectedSegment = null;
          this.filtersChangedWithSegment = false;
        }

        this.setSelectedRowsNone();

        if (this.setFiltersBulkOperation) {
          this.setFiltersBulkOperationCount = 0;
        }

        this.$emit('update:initial-filters', this.getMappedFilterModel());
      }
    },
    showSegmentModalCreateOrEdit(operation = this.$enums.Operation.CREATE) {
      if (operation !== this.$enums.Operation.CREATE
        && operation !== this.$enums.Operation.EDIT) return;

      this.titleModalSegment = `${operation} ${this.$tc('$Entities.Segment')}`;
      this.titleModalSegment = operation === this.$enums.Operation.CREATE
        ? this.$t('$Modals.CreateModalTitle', {
          entity: this.$tc('$Entities.Segment'),
        })
        : this.$t('$Modals.EditModalTitle', {
          entity: this.$tc('$Entities.Segment'),
          name: this.selectedSegment.name,
        });

      this.segmentModalOperation = operation;
      this.activeModalSegmentCreateOrEdit = true;
    },
    onAttributeSaved(attr) {
      if (!attr) return;

      const agGridAttributeColumn = {
        headerName: attr.name,
        field: attr.id,
        minWidth: this.getAgGridWidthFromAttributeType(attr.type, true),
        maxWidth: this.getAgGridWidthFromAttributeType(attr.type, false),
        filter: this.getAgGridFilterFromAttributeType(attr.type),
        floatingFilterComponent: this.getAgGridFloatingFilterFromAttributeType(attr.type),
        cellRendererFramework: this.getAgGridCellRendererFromAttributeType(attr.type),
      };

      this.columnDefs.splice(
        this.columnDefs.length - this.commonColumnDefs.length,
        0,
        agGridAttributeColumn,
      );
      this.gridApi.setColumnDefs(this.columnDefs);
      this.activeModalAttributeCreateOrEdit = false;
    },
    onSegmentSaved(segment) {
      if (this.segmentModalOperation === this.$enums.Operation.CREATE) {
        this.$refs.contactListToolbar.updateSelectSegments();
      }

      this.selectedSegment = segment;
      this.dontResetFiltersOnChangeFiltersMatch = true;
      this.activeModalSegmentCreateOrEdit = false;
    },
    async confirmCheckDNC() {
      if (this.isAnyRowsSelected) {
        this.$vs.loading({ type: 'radius' });
        const checkDncCostInfo = await this.checkDncCost({
          rowsSelectedCount: this.selectedAllRows ? this.count : this.rowsSelectedCount,
          data: !this.selectedAllRows || this.rowsSelectedAreReallyAll ? this.rowsSelected : null,
          filters: this.getMappedFilterModel(),
        });
        this.$vs.loading.close();

        if (checkDncCostInfo.quantity > 0) {
          if (checkDncCostInfo.paid) {
            this.$vs.dialog({
              type: 'confirm',
              color: 'primary',
              title: this.$t('$ContactModule.ConfirmCheckDNCTitle'),
              text: this.$t('$ContactModule.ConfirmCheckDNCMsg', {
                contacts: checkDncCostInfo.quantity,
                cost: this.$options.filters.dollar(checkDncCostInfo.cost),
              }),
              accept: () => this.checkDNCContacts(),
            });
          } else {
            this.$vs.notify({
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-dollar-sign',
              title: this.$t('$ContactModule.CheckDNCNotifyTitle'),
              text: this.$t(`$ContactModule.$ErrorCheckDNC.${checkDncCostInfo.paidError}`),
              fixed: true,
            });
          }
        } else {
          this.$vs.notify({
            color: 'warning',
            title: this.$t('$ContactModule.CheckDNCNotifyTitle'),
            text: this.$t('$ContactModule.CheckDNCNotifyNoSelectedAuContactsMsg'),
            time: 5000,
          });
        }
      } else {
        this.showNoSelectedRowsMessage();
      }
    },
    async checkDNCContacts() {
      if (this.isAnyRowsSelected > 0) {
        this.$vs.notify({
          title: this.$t('$ContactModule.CheckDNCNotifyTitle'),
          text: this.$t('$ContactModule.CheckDNCVerificationNotifyTitle'),
          iconPack: 'feather',
          icon: 'icon-clock',
          color: 'primary',
          time: 10000,
        });

        const checkDncResult = await this.checkDncContacts({
          rowsSelectedCount: this.selectedAllRows ? this.count : this.rowsSelectedCount,
          data: !this.selectedAllRows || this.rowsSelectedAreReallyAll ? this.rowsSelected : null,
          filters: this.getMappedFilterModel(),
        });

        const notifyCollections = document.querySelectorAll('div.vs-component.vs-notifications.vs-noti-bottom-right.vs-noti-primary.activeNoti h3');

        const notifyFiltered = Array.from(notifyCollections).filter(($el) => $el.innerText === this.$t('$ContactModule.CheckDNCNotifyTitle'));
        notifyFiltered[0].click();

        this.$vs.notify({
          title: this.$t('$ContactModule.CheckDNCNotifyTitle'),
          text: this.$t('$ContactModule.CheckDNCVerificationSuccessNotifyTitle', {
            contacts: checkDncResult.quantity,
            cost: this.$options.filters.dollar(checkDncResult.cost),
          }),
          iconPack: 'feather',
          icon: 'icon-check',
          color: 'success',
          time: 5000,
        });

        this.resetDataSourceAndSelection();
      } else {
        this.showNoSelectedRowsMessage();
      }
    },
    async onImport(contacts) {
      return this.importContactsFromFile({
        payload: contacts,
        blacklist: this.importBlacklist,
      });
    },
  },
};

</script>
