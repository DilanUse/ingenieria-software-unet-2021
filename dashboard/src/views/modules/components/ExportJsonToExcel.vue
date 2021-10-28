<template>
  <div>
    <vx-card
      class="mb-5"
      :subtitle="$t('$Components.$ExportJsonToExcel.ColumnsToExport')"
      noShadow
      cardBorder
      collapseAction>
        <vs-table
          v-model="columnsToExports"
          :data="columns"
          multiple>
          <template slot="thead">
            <vs-th>{{ $t('$General.Column') }}</vs-th>
            <vs-th>{{ $t('$General.NumberAbbreviation') }}</vs-th>
          </template>

          <template slot-scope="{data}">
              <vs-tr
                v-for="(tr, index) in data"
                :key="index"
                :data="tr">
                <vs-td>{{ data[index].title }}</vs-td>
                <vs-td>{{ index + 1 }}</vs-td>
              </vs-tr>
          </template>
        </vs-table>
    </vx-card>

    <vx-card
      noShadow
      cardBorder>
      <vs-input
        v-model="fileName"
        :placeholder="`${$t('$Components.$ExportJsonToExcel.EnterFileName')}..`"
        class="w-full" />

      <div class="vx-row my-4">
        <div
          class="vx-col"
          :class="[separatorsByFormat.length > 0 ? 'w-1/2' : 'w-full']">
          <label class="vs-input--label">{{ $tc('$General.Format', 1) }}</label>
          <v-select
            v-model="selectedFormat"
            :options="formats"
            :clearable="false"/>
        </div>
        <div
          class="vx-col w-1/2"
          v-show="separatorsByFormat.length > 0">
          <label class="vs-input--label">{{ $tc('$General.Separator', 1) }}</label>
          <v-select
            v-model="selectedSeparator"
            :options="separatorsByFormat"
            label="text"
            :clearable="false"/>
          </div>
      </div>

      <div class="flex">
        <span class="mr-4">
          {{ $t('$Components.$ExportJsonToExcel.SendMeByEmail') }}:
        </span>
        <vs-switch v-model="sendByEmail">
          {{ $t('$Components.$ExportJsonToExcel.SendMeByEmail') }}
        </vs-switch>
      </div>

      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button
              class="ml-auto mt-2"
              :disabled="!isExportValid"
              @click="exportToExcel">{{ $t('$General.Export')}} </vs-button>

            <vs-button
              class="ml-4 mt-2"
              type="border"
              color="warning"
              @click="$emit('close')">{{ $t('$General.Cancel') }}</vs-button>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from 'vue-select';


export default {
  name: 'ExportJsonToExcel',
  components: {
    vSelect,
  },
  props: {
    columns: {
      type: Array,
      required: true,
      validator(columns) {
        return columns.every((c) => 'title' in c && 'field' in c);
      },
    },
    data: {
      type: Array,
      required: true,
    },
    defaultFileName: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      fileName: this.defaultFileName,
      formats: ['xlsx', 'csv', 'txt'],
      selectedFormat: 'xlsx',
      selectedSeparator: {
        text: 'Comma(,)',
        value: ',',
      },
      sendByEmail: false,
      columnsToExports: this.columns,
    };
  },
  computed: {
    separatorsByFormat() {
      const separators = [];

      if (this.selectedFormat === 'csv' || this.selectedFormat === 'txt') {
        separators.splice(separators.length, 0, ...[
          {
            text: 'Comma(,)',
            value: ',',
          },
          {
            text: 'Semicolon(;)',
            value: ';',
          },
        ]);
      }

      if (this.selectedFormat === 'txt') {
        separators.splice(separators.length, 0, ...[
          {
            text: 'Pipe(|)',
            value: '|',
          },
          {
            text: 'Space',
            value: '\t',
          },
        ]);
      }

      return separators;
    },
    isExportValid() {
      return this.columnsToExports.length > 0 && this.fileName
        && (this.separatorsByFormat.length === 0 || this.selectedSeparator);
    },
    columnsTitles() {
      return this.columnsToExports.map((c) => c.title);
    },
    columnsFields() {
      return this.columnsToExports.map((c) => c.field);
    },
  },
  methods: {
    exportToExcel() {
      this.$emit('export', {
        columns: this.columnsToExports,
        name: this.fileName,
        format: this.selectedFormat,
        separator: this.selectedSeparator.value,
        sendEmail: this.sendByEmail,
      });
    },
  },
};
</script>
