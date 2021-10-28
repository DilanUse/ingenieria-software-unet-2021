<template>
  <div>
    <div class="mt-8 flex flex-wrap items-center justify-between">
      <h2 class="text-gray">{{ $t('$Components.$ImportExcelToJson.FileImportTitle') }}</h2>
      <vs-button
        class="ml-4 mt-2"
        type="border"
        color="warning"
        @click="$emit('close')">
        {{ $t('$General.Cancel') }}
      </vs-button>
    </div>

    <vs-divider></vs-divider>

    <vx-card
      ref="card1"
      :collapse-action="!completed"
      class="mt-3"
      @toggle-collapse="(collapse) => !collapse ? backToStep(1) : null">
      <template v-slot:header>
        <h4
          id="import-excel-to-json-card-1-title"
          :class="['flex', 'items-center', step1 ? 'text-gray-light' : '']">
          <vs-icon
            :icon="step1 ? 'check_box' : 'looks_one'"
            :color="step1 ? 'success' : ''"
            size="1.5rem"/>
          <span>
            {{ $t('$Components.$ImportExcelToJson.$Step1.CardTitle') }}
          </span>
        </h4>
        <h6 class="text-gray-light">
          {{ $t('$Components.$ImportExcelToJson.$Step1.CardSubTitle', {
            entity: $options.filters.lowercase($tc(`$Entities.${entity}`, 2))
          }) }}
        </h6>
      </template>
      <import-excel
        @loaded="loadDataInTable"
        @reset="resetFileLoaded"/>

      <div
        v-if="mappedFileData.length && fileHeaders.length"
        class="mt-3">
        <h5>
          {{ $t('$Components.$ImportExcelToJson.$Step1.PreviewTitle') }}
        </h5>
        <p>
          {{ $t('$Components.$ImportExcelToJson.$Step1.PreviewSubTitle', {
            fileName,
            rows: mappedFileData.length,
            columns: fileHeaders.length,
          }) }}
        </p>

        <vs-table
          stripe
          pagination
          :max-items="10"
          search
          :data="mappedFileData">
          <template slot="header">
            <h4>{{ sheetName }}</h4>
          </template>

          <template slot="thead">
            <vs-th
              v-for="heading in fileHeaders"
              :key="heading"
              :sort-key="heading" >
              {{ heading }}
            </vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr
              v-for="(tr, indexTr) in data"
              :key="indexTr"
              :data="tr">
              <vs-td
                v-for="(valueCol, keyCol) in data[indexTr]"
                :key="keyCol + indexTr"
                :data="valueCol" >
                {{ valueCol }}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>

      <div
        v-if="mappedFileData.length && fileHeaders.length"
        class="flex justify-center">
        <vs-button
          v-scroll-to="{ el: '#import-excel-to-json-card-1-title', offset: -100 }"
          class="ml-4 mt-2"
          color="primary"
          @click="confirmStep1">
          {{ $t('$Components.$ImportExcelToJson.$Step1.ConfirmButtonText') }}
        </vs-button>
      </div>
    </vx-card>

    <vx-card
      ref="card2"
      title=""
      subtitle=""
      collapsed
      :collapse-action="step1 && !completed"
      :class="{'mt-3': true, 'opacity-50': !step1}"
      @toggle-collapse="(collapse) => !collapse ? backToStep(2) : null">
      <template v-slot:header>
        <h4
          id="import-excel-to-json-card-2-title"
          :class="['flex', 'items-center', step2 ? 'text-gray-light' : '']">
          <vs-icon
            :icon="step2 ? 'check_box' : 'looks_two'"
            :color="step2 ? 'success' : ''"
            size="1.5rem"/>
          <span>
            {{ $t('$Components.$ImportExcelToJson.$Step2.CardTitle') }}
          </span>
        </h4>
        <h6 class="text-gray-light">
          {{ $t('$Components.$ImportExcelToJson.$Step2.CardSubTitle') }}
        </h6>
      </template>

      <div class="table-mapping">
        <div class="vx-row mt-3 cols-table-mapping desktop-table-mapping">
          <div class="vx-col w-1/3 pr-0">
            <h5 class="mb-2">
              {{ $t('$Components.$ImportExcelToJson.$Step2.MappingFileHeader') }}
            </h5>

            <draggable
              :list="fileHeaders"
              class="cursor-move">
              <div
                v-for="(item, index) in fileHeaders"
                :key="index"
                :title="item">
                <div class="list-draggable-item-import pr-6">
                  <feather-icon
                    icon="MoreVerticalIcon"
                    svgClasses="h-7 w-7 hover:text-primary cursor-pointer"/>
                  <p>{{ item }}</p>
                </div>
                <vs-divider class="m-0"></vs-divider>
              </div>
            </draggable>
          </div>

          <div class="vx-col w-1/3 px-0">
            <h5 class="mb-2">
              {{ $t('$Components.$ImportExcelToJson.$Step2.MappingDataHeader') }}
            </h5>

            <div
              v-for="(item, index1) in fileHeaders"
              :key="index1"
              :title="item">
              <div class="list-draggable-item-import pr-6">
                <div>
                  <p
                    v-for="(item2, index2) in getSliceItemFromHeader(item, 3)"
                    :key="index2">
                    {{ item2 }}
                  </p>
                </div>
              </div>
              <vs-divider class="m-0"></vs-divider>
            </div>
          </div>

          <div class="vx-col w-1/3 pl-0">
            <h5 class="mb-2" style="white-space: nowrap">
              {{ $t('$Components.$ImportExcelToJson.$Step2.MappingEntityHeader', {
                entity: $tc(`$Entities.${entity}`)
              }) }}
            </h5>

            <draggable
              :list="targetHeadersLocal"
              class="cursor-move">
              <div
                v-for="(item, index) in targetHeadersLocal"
                :key="index">
                <div class="list-draggable-item-import" style="overflow-y: visible !important">
                  <div class="flex w-full">
                    <feather-icon
                      icon="MoreVerticalIcon"
                      svgClasses="h-7 w-7 hover:text-primary cursor-pointer"/>
                    <div class="w-full">
                      <p
                        v-if="item.required"
                        :class="{'text-danger': index >= fileHeaders.length}">
                        {{ `${item.headerName}*` }}
                      </p>
                      <v-select
                        v-else
                        v-model="targetHeadersLocal[index]"
                        class="w-full"
                        :class="{'border-danger':  item.requireIfNull
                        && index >= fileHeaders.length && item.field !== null
                        && getHeaderNameByFieldFromTargetHeaders(item.requireIfNull)
                        && !isFieldMapped(item.requireIfNull)}"
                        label="headerName"
                        :multiple="false"
                        :closeOnSelect="true"
                        :clearable="false"
                        :options="optionsToSelection"
                        :selectable="isSelectableOption">
                        <template #selected-option="{ headerName, field }">
                          <div
                            v-if="field === null"
                            class="text-center text-danger">
                            <strong>{{ headerName }}</strong>
                          </div>
                          <div v-else>
                            {{ headerName }} -
                            <small class="text-gray">
                              {{ $tc(`$Entities.${entity}`) }}
                            </small>
                          </div>
                        </template>
                        <template #option="{ headerName, field }">
                          <div
                            v-if="field === null"
                            class="text-center">
                            <strong>{{ headerName }}</strong>
                          </div>
                          <div v-else>
                            {{ headerName }} -
                            <small class="text-gray">
                              {{ $tc(`$Entities.${entity}`) }}
                            </small>
                          </div>
                        </template>
                        <template
                          v-if="createAttributes"
                          #list-footer>
                          <vs-divider class="my-1"/>
                          <div class="text-center">
                            <a href="#" @click.prevent="onAddAttribute(index)">
                              {{ $t('$Components.$ImportExcelToJson.$Step2.AddAttributeMsg') }}
                            </a>
                          </div>
                        </template>
                      </v-select>

                      <div
                        v-if="item && item.validation
                        && item.validation === $enums.ImportCollections.Validations.PHONE"
                        class="mt-2">
                        <v-select
                          v-model="targetHeadersLocal[index].payload"
                          class="w-full"
                          :class="{'border-danger':  index < fileHeaders.length
                            && !targetHeadersLocal[index].payload}"
                          label="name"
                          :placeholder="$t('$Components.$ImportExcelToJson.' +
                           '$Step2.SelectCountryOnPhonePlaceholder')"
                          :multiple="false"
                          :closeOnSelect="true"
                          :clearable="false"
                          :options="countries">
                          <template #selected-option="{ name, dialCode }">
                            <div>
                              {{ name }} :
                              <small class="text-gray">
                                +{{ dialCode }}
                              </small>
                            </div>
                          </template>
                          <template #option="{ name, dialCode }">
                            <div>
                              {{ name }} :
                              <small class="text-gray">
                                +{{ dialCode }}
                              </small>
                            </div>
                          </template>
                        </v-select>
                      </div>

                      <div
                        v-if="index < fileHeaders.length
                        && item.validation === $enums.ImportCollections.Validations.PHONE
                        && !targetHeadersLocal[index].payload"
                        class="flex items-center mt-1">
                        <vx-tooltip
                          color="primary"
                          :text="$t('$Components.$ImportExcelToJson.' +
                           '$Step2.SelectCountryOnPhoneHelp')"
                          position="top"
                          class="inline-block cursor-pointer">
                          <feather-icon
                            icon="HelpCircleIcon"
                            svgClasses="h-4 w-4 text-gray-dark"/>
                        </vx-tooltip>

                        <small
                          class="text-danger ml-2">
                          {{
                            $t('$Components.$ImportExcelToJson.$Step2.SelectCountryOnPhoneErrorMsg')
                          }}
                        </small>
                      </div>

                      <template v-if="item.required">
                        <small
                          v-if="index >= fileHeaders.length"
                          class="text-danger">
                          {{ $t('$Components.$ImportExcelToJson.$Step2.AttributeRequiredMsg') }}
                        </small>
                      </template>
                      <template v-else>
                        <template v-if="item.requireIfNull">
                          <small
                            v-if="index >= fileHeaders.length && item.field !== null
                            && getHeaderNameByFieldFromTargetHeaders(item.requireIfNull)
                            && !isFieldMapped(item.requireIfNull)"
                            class="text-danger">
                            {{ item.headerName }} is required if not mapping
                            {{ getHeaderNameByFieldFromTargetHeaders(item.requireIfNull) }}
                          </small>
                          <template v-else>
                            <small
                              v-if="index >= fileHeaders.length && item.field !== null"
                              class="text-warning">
                              {{ $t('$Components.$ImportExcelToJson.$Step2.IgnoredAttributeMsg') }}
                            </small>
                          </template>
                        </template>
                        <template v-else>
                          <small
                            v-if="index >= fileHeaders.length && item.field !== null"
                            class="text-warning">
                            {{ $t('$Components.$ImportExcelToJson.$Step2.IgnoredAttributeMsg') }}
                          </small>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
                <vs-divider class="m-0"></vs-divider>
              </div>
            </draggable>
          </div>
        </div>

        <div class="cols-table-mapping mobile-table-mapping">
          <div
            v-for="(item, index) in fileHeaders"
            :key="index"
            :title="item"
            class="vx-row pr-0">

            <div
              class="vx-col w-full pr-0"
              style="display:flex; flex-direction: column; align-items: center">

              <div class="import-mobile-step2-row-main mobile-step2-mapping-header">
                <div class="import-mobile-step2-title">
                  {{ $t('$Components.$ImportExcelToJson.$Step2.MappingFileHeader') }} :
                </div>
                <div class="import-mobile-step2-contents">
                  <p class="mb-4"><b>{{ item }}</b></p>
                </div>
              </div>

              <div class="import-mobile-step2-row-main mobile-step2-mapping-data">
                <div class="import-mobile-step2-title">
                  {{ $t('$Components.$ImportExcelToJson.$Step2.MappingDataHeader') }} :
                </div>
                <div class="import-mobile-step2-contents">
                  <p
                    v-for="(item2, index2) in getSliceItemFromHeader(item, 3)"
                    :key="index2">
                    {{ item2 }}
                  </p>
                </div>
              </div>

              <div class="w-full import-mobile-step2-row-main mobile-step2-mapping-entity">
                <div class="import-mobile-step2-title">
                  {{ $t('$Components.$ImportExcelToJson.$Step2.MappingEntityHeader', {entity: $tc(`$Entities.${entity}`)}) }} :
                </div>
                <div class="import-mobile-step2-contents">

                  <p
                    v-if="item.required"
                    :class="{'text-danger': index >= fileHeaders.length}">
                    {{ `${item.headerName}*` }}
                  </p>
                  <v-select
                    v-else
                    v-model="targetHeadersLocal[index]"
                    class="w-full mt-4"
                    :class="{'border-danger':  item.requireIfNull
                    && index >= fileHeaders.length && item.field !== null
                    && getHeaderNameByFieldFromTargetHeaders(item.requireIfNull)
                    && !isFieldMapped(item.requireIfNull)}"
                    label="headerName"
                    :multiple="false"
                    :closeOnSelect="true"
                    :clearable="false"
                    :options="optionsToSelection"
                    :selectable="isSelectableOption">
                    <template #selected-option="{ headerName, field }">
                      <div
                        v-if="field === null"
                        class="text-center text-danger">
                        <strong>{{ headerName }}</strong>
                      </div>
                      <div v-else>
                        {{ headerName }} -
                        <small class="text-gray">
                          {{ $tc(`$Entities.${entity}`) }}
                        </small>
                      </div>
                    </template>
                    <template #option="{ headerName, field }">
                      <div
                        v-if="field === null"
                        class="text-center">
                        <strong>{{ headerName }}</strong>
                      </div>
                      <div v-else>
                        {{ headerName }} -
                        <small class="text-gray">
                          {{ $tc(`$Entities.${entity}`) }}
                        </small>
                      </div>
                    </template>
                    <template
                      v-if="createAttributes"
                      #list-footer>
                      <vs-divider class="my-1"/>
                      <div class="text-center">
                        <a href="#" @click.prevent="onAddAttribute(index)">
                          {{ $t('$Components.$ImportExcelToJson.$Step2.AddAttributeMsg') }}
                        </a>
                      </div>
                    </template>
                  </v-select>
                </div>
              </div>

            </div>
            <vs-divider class="mt-5 mb-5"></vs-divider>
          </div>

        </div>

        <vs-alert
          :active="!mapStepIsValid"
          color="danger"
          class="text-center my-6">
          Fix the mapping errors to continue with the next step of the import process
        </vs-alert>

        <div
          class="mapping-options-message-step2 flex justify-center content-center mt-3">
          <div>
            <p v-html="$t('$Components.$ImportExcelToJson.$Step2.ColumnsToImportCount', {
              count: countImportedHeader
            })">
            </p>
            <p v-html="$t('$Components.$ImportExcelToJson.$Step2.ColumnsToIgnoreCount', {
              count: countIgnoredHeader
            })"></p>
          </div>
          <vs-button
            v-scroll-to="{ el: '#import-excel-to-json-card-2-title', offset: -100 }"
            class="ml-5"
            color="primary"
            :disabled="fileHeadersAreInsufficient || !mapStepIsValid"
            @click="confirmStep2">
            {{ $t('$Components.$ImportExcelToJson.$Step2.ConfirmButtonText') }}
          </vs-button>
        </div>
      </div>
    </vx-card>

    <vx-card
      ref="card3"
      collapsed
      :collapse-action="step2 && !completed"
      :class="{'mt-3': true, 'opacity-50': !step2}">

      <template v-slot:header>
        <h4 :class="['flex', 'items-center', step3 ? 'text-gray-light' : '']">
          <vs-icon
            :icon="step3 ? 'check_box' : 'looks_3'"
            :color="step3 ? 'success' : ''"
            size="1.5rem"/>
          <span>
            {{ $t('$Components.$ImportExcelToJson.$Step3.CardTitle') }}
          </span>
        </h4>
        <h6 class="text-gray-light">
          {{ $t('$Components.$ImportExcelToJson.$Step3.CardSubTitle') }}
        </h6>
      </template>

      <div>
        <vs-table
          stripe
          pagination
          :max-items="10"
          search
          :data="mappedImportData">
          <template slot="header">
            <div>
              <h5>
                {{ $t('$Components.$ImportExcelToJson.$Step3.PreviewTitle') }}
              </h5>
              <p v-html="$t('$Components.$ImportExcelToJson.$Step3.PreviewSubTitle', {
                columns: countImportedHeader,
                rows: mappedImportData.length,
              })">
              </p>
            </div>
          </template>

          <template slot="thead">
            <vs-th
              v-for="header in mappedImportHeaders"
              :key="header.field"
              :sort-key="header.field" >
              {{ header.headerName }}
            </vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr
              v-for="(tr, indextr) in data"
              :key="indextr"
              :data="tr">
              <vs-td
                v-for="(col, indexcol) in data[indextr]"
                :key="indexcol + col"
                :data="col" >
                {{ col }}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>

        <div
          v-if="defaultAttributes.length > 0"
          class="my-6">
          <div>
            <h5>
              {{ $t('$Components.$ImportExcelToJson.$Step3.DefaultAttributesTitle') }}
            </h5>
            <p v-html="$t('$Components.$ImportExcelToJson.$Step3.DefaultAttributesSubTitle', {
                attributes: this.defaultAttributes.map(
                  (attr) => attr.headerName
                  ).toString().replace(/,/g, ', '),
                })">
            </p>
          </div>

          <div class="mt-5">
            <slot name="default-attributes"></slot>
          </div>
        </div>

        <div>
          <slot name="additional-options"></slot>
        </div>

        <div
          class="flex justify-center">
          <vs-button
            :disabled="!importConfirmIsValid"
            class="ml-4 mt-2"
            color="primary"
            @click="confirmStep3">
            {{ $t('$Components.$ImportExcelToJson.$Step3.ConfirmButtonText') }}
          </vs-button>
        </div>
      </div>
    </vx-card>

    <vx-card
      ref="card4"
      collapsed
      :collapse-action="step3 && !completed"
      :class="{'mt-3': true, 'opacity-50': !step3}">

      <template v-slot:header>
        <h4 :class="['flex', 'items-center', completed ? 'text-gray-light' : '']">
          <vs-icon
            :icon="completed ? 'check_box' : 'looks_4'"
            :color="completed ? 'success' : ''"
            size="1.5rem"/>
          <span>
            {{ $t('$Components.$ImportExcelToJson.$Step4.CardTitle') }}
          </span>
        </h4>
        <h6 class="text-gray-light">
          {{ $t('$Components.$ImportExcelToJson.$Step4.CardSubTitle') }}
        </h6>
      </template>

      <div
        v-if="importResult !== null"
        class="vx-row">
        <div class="vx-col w-full md:w-1/3">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="UploadIcon"
            icon-right
            :statistic="mappedImportDataWithImportIndex.length"
            :statisticTitle="$t('$Components.$ImportExcelToJson.$Step4.ToImportCardText', {
              entity: $tc(`$Entities.${entity}`, 2),
            })"/>
        </div>

        <div class="vx-col w-full md:w-1/3">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="CheckCircleIcon"
            icon-right
            color="success"
            :statistic="importResult.numberSaved"
            :statisticTitle="$t('$Components.$ImportExcelToJson.$Step4.ImportedCardText', {
              entity: $tc(`$Entities.${entity}`, 2),
            })" />
        </div>

        <div class="vx-col w-full md:w-1/3">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="XCircleIcon"
            icon-right
            color="warning"
            :statistic="importResult.numberFailed"
            :statisticTitle="$t('$Components.$ImportExcelToJson.$Step4.NotImportedCardText', {
              entity: $tc(`$Entities.${entity}`, 2),
            })" />
        </div>
      </div>

      <div>
        <vs-table
          v-if="notImportedItems.length > 0"
          stripe
          pagination
          :max-items="10"
          search
          :data="notImportedItems">

          <template slot="header">
            <h5>
              {{ $t('$Components.$ImportExcelToJson.$Step4.NotImportedDataTitle') }}
            </h5>
          </template>

          <template slot="thead">
            <vs-th
              v-for="header in mappedImportHeaders"
              :key="header.field"
              :sort-key="header.field">
              {{ header.headerName }}
            </vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr
              v-for="(tr, indextr) in data"
              :key="indextr"
              :data="tr">
              <vs-td
                v-for="(col, indexcol) in data[indextr]"
                :key="indexcol + indextr"
                :data="col" >
                {{ col }}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>

        <div
          class="flex justify-center mt-2">
          <vs-button
            color="primary"
            @click="$emit('close')">
            {{ $t('$Components.$ImportExcelToJson.$Step4.BackButtonText') }}
          </vs-button>

          <vs-button
            class="ml-2"
            color="primary"
            @click="$emit('refresh')">
            {{ $t('$Components.$ImportExcelToJson.$Step4.NewImportButtonText') }}
          </vs-button>
        </div>
      </div>
    </vx-card>

  </div>
</template>

<script>
import vSelect from 'vue-select';
import draggable from 'vuedraggable';
import parsePhoneNumber from 'libphonenumber-js';
import countries from '@/assets/utils/all-countries';

// Custom components
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue';
import ImportExcel from '@/components/excel/ImportExcel.vue';

export default {
  name: 'ImportExcelToJson',
  components: {
    vSelect,
    draggable,
    ImportExcel,
    StatisticsCardLine,
  },
  props: {
    targetHeaders: {
      type: Array,
      required: true,
      validator(columns) {
        return columns.every((h) => h !== null
          && typeof h === 'object'
          && 'headerName' in h
          && 'field' in h
          && 'required' in h);
      },
    },
    entity: {
      type: String,
      required: true,
    },
    createAttributes: {
      type: Boolean,
      required: false,
      default: false,
    },
    defaultAttributes: {
      type: Array,
      required: false,
      validator(attributes) {
        return attributes.every((attr) => attr !== null
          && typeof attr === 'object'
          && 'headerName' in attr
          && 'field' in attr
          && 'value' in attr);
      },
      default() {
        return [];
      },
    },
    onSaveImport: {
      type: Function,
      required: true,
    },
    importConfirmIsValid: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      targetHeadersLocal: [...this.targetHeaders],
      fileData: [],
      fileHeaders: [],
      fileName: '',
      sheetName: '',
      step1: false,
      step2: false,
      step3: false,
      completed: false,
      importResult: null,
      targetHeaderLocalIndexToAddAttribute: null,
      activeModalAttributeCreateOrEdit: false,
      showCreateOrEditAttributeComponent: false,
      titleModalAttribute: this.$t('$Modals.CreateModalTitle', {
        entity: this.$tc('ContactAttribute', 1),
      }),
      doNotImportOption: {
        headerName: this.$t('$Components.$ImportExcelToJson.DoNotImportOption'),
        field: null,
        required: false,
        requireIfNull: null,
        validation: null,
      },
    };
  },
  computed: {
    countries() {
      return countries;
    },
    optionsToSelection() {
      const optionalHeaders = this.targetHeaders.filter(
        (val) => val !== null && val.field !== null && !val.required,
      );

      return [
        { ...this.doNotImportOption },
        ...optionalHeaders,
      ];
    },
    requiredTargetHeaders() {
      return this.targetHeaders.filter(
        (val) => val !== null && val.field !== null && val.required,
      );
    },
    fileHeadersAreInsufficient() {
      return this.fileHeaders.length < this.requiredTargetHeaders.length;
    },
    countImportedHeader() {
      let count = 0;

      this.fileHeaders.forEach((h, index) => {
        if (this.targetHeadersLocal[index].field !== null) {
          count += 1;
        }
      });

      return count;
    },
    countIgnoredHeader() {
      let count = 0;

      this.fileHeaders.forEach((h, index) => {
        if (this.targetHeadersLocal[index].field === null) {
          count += 1;
        }
      });

      return count;
    },
    mappedFileData() {
      return this.fileData.map((row) => {
        const rowMapped = row;
        this.fileHeaders.forEach((header) => {
          rowMapped[header] = rowMapped[header] || null;
        });
        return rowMapped;
      });
    },
    mappedImportHeaders() {
      return this.targetHeadersLocal.filter(
        (h, index) => h.field !== null && index < this.fileHeaders.length,
      );
    },
    mappedImportHeadersWithDefaultAttributes() {
      return [
        ...this.mappedImportHeaders,
        ...this.defaultAttributes.map((attr) => ({
          headerName: attr.headerName,
          field: attr.field,
        })),
      ];
    },
    mappedImportData() {
      const headers = this.mappedImportHeaders.map((h) => {
        const targetIndex = this.targetHeadersLocal.findIndex((th) => th.field === h.field);
        const fileHeader = this.fileHeaders[targetIndex];
        return {
          field: h.field,
          fileHeader,
          validation: h.validation || null,
          payload: h.payload || null,
        };
      });

      return this.mappedFileData.map((item) => {
        const itemToReturn = {};
        headers.forEach((header) => {
          if (header.validation
            && header.validation === this.$enums.ImportCollections.Validations.PHONE
            && header.payload && header.payload.iso2 && item[header.fileHeader]) {
            try {
              const phoneNumber = parsePhoneNumber(
                item[header.fileHeader].toString(), header.payload.iso2,
              );

              if (phoneNumber) {
                itemToReturn[header.field] = phoneNumber.formatInternational();
              } else {
                itemToReturn[header.field] = item[header.fileHeader];
              }
            } catch (e) {
              itemToReturn[header.field] = item[header.fileHeader];
            }
          } else {
            itemToReturn[header.field] = item[header.fileHeader];
          }
        });

        return itemToReturn;
      });
    },
    mappedImportDataWithDefaultAttributes() {
      return this.mappedImportData.map((item) => {
        const data = { ...item };

        this.defaultAttributes.forEach((attr) => {
          data[attr.field] = attr.value;
        });

        return data;
      });
    },
    mappedImportDataWithImportIndex() {
      return this.mappedImportDataWithDefaultAttributes.map((item, index) => ({
        ...item,
        importIndex: index,
      }));
    },
    mappedImportDataWithImportIndexWithoutDefaultAttributes() {
      return this.mappedImportData.map((item, index) => ({
        ...item,
        importIndex: index,
      }));
    },
    notImportedItems() {
      if (this.importResult === null
        || this.importResult.numberSaved
        === this.mappedImportDataWithImportIndexWithoutDefaultAttributes.length) {
        return [];
      }

      return this.mappedImportDataWithImportIndexWithoutDefaultAttributes.filter(
        (source) => this.importResult.indicesFailed.includes(source.importIndex),
      ).map((item) => {
        const { importIndex, ...itemWithoutImportIndex } = item;
        return itemWithoutImportIndex;
      });
    },
    mapStepIsValid() {
      return this.targetHeadersLocal.every((h, index) => {
        if (h.required && index >= this.fileHeaders.length) {
          return false;
        }

        if (h.requireIfNull && this.getHeaderNameByFieldFromTargetHeaders(h.requireIfNull)
          && !this.isFieldMapped(h.requireIfNull) && index >= this.fileHeaders.length) {
          return false;
        }

        if (h.validation && h.validation === this.$enums.ImportCollections.Validations.PHONE
          && index < this.fileHeaders.length && !h.payload) {
          return false;
        }

        return true;
      });
    },
  },
  watch: {
    fileHeaders(newHeaders) {
      if (newHeaders.length > this.targetHeadersLocal.length) {
        const offset = newHeaders.length - this.targetHeadersLocal.length;
        for (let i = 0; i < offset; i += 1) {
          this.targetHeadersLocal.push({
            headerName: this.$t('$Components.$ImportExcelToJson.DoNotImportOption'),
            field: null,
            required: false,
          });
        }
      }
    },
    activeModalAttributeCreateOrEdit(val) {
      if (!val) {
        setTimeout(() => {
          this.showCreateOrEditAttributeComponent = false;
        }, 500);
      } else {
        this.showCreateOrEditAttributeComponent = true;
      }
    },
  },
  methods: {
    loadDataInTable({
      results, header, meta, fileName,
    }) {
      this.fileHeaders = header;
      this.fileData = results;
      this.sheetName = meta.sheetName;
      this.fileName = fileName;
    },
    resetFileLoaded() {
      this.$emit('refresh');
    },
    confirmStep1() {
      this.step1 = true;
      this.$refs.card1.toggleContent();

      if (this.$refs.card2.isContentCollapsed) {
        this.$refs.card2.toggleContent();
      }
    },
    confirmStep2() {
      this.step2 = true;
      this.$refs.card2.toggleContent();

      if (this.$refs.card3.isContentCollapsed) {
        this.$refs.card3.toggleContent();
      }
    },
    async confirmStep3() {
      this.$vs.loading({ type: 'radius' });
      this.importResult = await this.onSaveImport(this.mappedImportDataWithImportIndex);
      this.$vs.loading.close();

      this.$vs.notify({
        title: this.$t('$Components.$ImportExcelToJson.ImportedNotifyTitle', {
          entity: this.$tc(`$Entities.${this.entity}`),
        }),
        text: this.$t('$Components.$ImportExcelToJson.ImportedNotifyMsg', {
          entity: this.$tc(`$Entities.${this.entity}`),
        }),
        iconPack: 'feather',
        icon: 'icon-check',
        color: 'success',
      });

      this.step3 = true;
      this.completed = true;
      this.$refs.card3.toggleContent();
      this.$refs.card4.toggleContent();
      this.$emit('imported');
    },
    getSliceItemFromHeader(header, count) {
      if (this.mappedFileData.length > 0) {
        const end = count <= this.mappedFileData.length ? count : this.mappedFileData.length;
        return this.mappedFileData.slice(0, end).map((value) => value[header]);
      }

      return [];
    },
    backToStep(step) {
      switch (step) {
        case 1:
          this.step1 = false;
          this.step2 = false;
          this.step3 = false;

          if (!this.$refs.card2.isContentCollapsed) {
            this.$refs.card2.toggleContent();
          }

          if (!this.$refs.card3.isContentCollapsed) {
            this.$refs.card3.toggleContent();
          }

          break;
        case 2:
          this.step2 = false;
          this.step3 = false;

          if (!this.$refs.card3.isContentCollapsed) {
            this.$refs.card3.toggleContent();
          }
          break;

        default:
      }
    },
    getHeaderNameByFieldFromTargetHeaders(field) {
      const header = this.targetHeaders.find((h) => h.field === field);
      return header ? header.headerName : null;
    },
    isFieldMapped(field) {
      return this.targetHeadersLocal.some(
        (h, index) => h.field === field && index < this.fileHeaders.length,
      );
    },
    isSelectableOption(option) {
      return option.field === null
        || !this.targetHeadersLocal.some(
          (h) => h.headerName === option.headerName,
        );
    },
    onAddAttribute(targetHeaderLocalIndex) {
      if (typeof targetHeaderLocalIndex === 'number'
        && targetHeaderLocalIndex < this.targetHeadersLocal.length) {
        this.targetHeaderLocalIndexToAddAttribute = targetHeaderLocalIndex;
      }
      this.activeModalAttributeCreateOrEdit = true;
    },
    onAttributeSaved(attr) {
      if (!attr) return;
      this.activeModalAttributeCreateOrEdit = false;
      this.$emit('attribute-created', attr);
      this.targetHeadersLocal.push({ ...this.doNotImportOption });

      if (typeof this.targetHeaderLocalIndexToAddAttribute === 'number'
        && this.targetHeaderLocalIndexToAddAttribute < this.targetHeadersLocal.length) {
        this.targetHeadersLocal[this.targetHeaderLocalIndexToAddAttribute] = {
          headerName: attr.name,
          field: attr.id,
        };
      }

      this.targetHeaderLocalIndexToAddAttribute = null;
    },
  },
};
</script>

<style lang="scss">
.list-draggable-item-import {
  height: 8rem;
  overflow-y: auto;
  display: flex;
  align-items: center;
}

 .mobile-table-mapping {
    display: none;
  }

@media only screen and (max-width: 650px) {

  .desktop-table-mapping {
    display: none;
  }

  .mobile-table-mapping {
    display: block;
  }

  .import-mobile-step2-row-main {
    width: 100%;
    display: flex;
  }

  .import-mobile-step2-row-main .import-mobile-step2-title{
    width: 95px;
    font-weight: bold;
    text-align: right;
    margin-right: 20px;
  }

.mobile-step2-mapping-entity {
    flex-wrap: wrap;
  }

  .mobile-step2-mapping-entity .import-mobile-step2-title {
    width: 100%;
    margin: 10px 0px -10px 0px;
    display: none !important;
  }

  .mobile-step2-mapping-entity .import-mobile-step2-contents {
    width: 100%;
    padding-right: 1rem !important;
  }

}


@media only screen and (max-width: 550px) {

  .mapping-options-message-step2 {
    display: block !important;
    text-align: center;
    div {
      width: 100%;
      padding-bottom: 1rem;

      p:nth-child(2) strong {
        color: rgba(var(--vs-danger), 1) !important;
      }
    }
  }
}

</style>
