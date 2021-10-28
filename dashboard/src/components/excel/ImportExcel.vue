<template>
  <div class="excel-import" id="div-with-loading">
    <upload-file
    :accept-ext="['.xlsx', '.xls', '.csv']"
    @file="uploadFile"/>
  </div>
</template>

<script>
import XLSX from 'xlsx';

import UploadFile from '@/views/modules/components/UploadFile.vue';

export default {
  components: {
    UploadFile,
  },
  props: {
    // onSuccess: {
    //   type: Function,
    //   required: true,
    // },
  },
  data() {
    return {
      excelData: {
        header: null,
        results: null,
        meta: null,
        fileName: '',
      },
    };
  },
  methods: {
    generateData({ header, results, meta }) {
      this.excelData.header = header;
      this.excelData.results = results;
      this.excelData.meta = meta;
      this.$emit('loaded', this.excelData);
      this.$vs.loading.close('#div-with-loading > .con-vs-loading');
      // this.onSuccess && this.onSuccess(this.excelData);
    },
    getHeaderRow(sheet) {
      const headers = [];
      const range = XLSX.utils.decode_range(sheet['!ref']);
      let C;
      const R = range.s.r;
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
        /* find the cell in the first row */
        let hdr = `UNKNOWN ${C}`; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    },
    readerData(rawFile) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const header = this.getHeaderRow(worksheet);
          const results = XLSX.utils.sheet_to_json(worksheet);
          const meta = { sheetName: firstSheetName };
          this.generateData({ header, results, meta });
          resolve();
        };
        reader.readAsArrayBuffer(rawFile);
      });
    },
    uploadFile(file) {
      if (file) {
        this.$vs.loading({
          container: '#div-with-loading',
          type: 'border',
        });

        this.excelData.fileName = file.name || '';

        setTimeout(() => {
          this.readerData(file);
        }, 100);
      } else {
        this.excelData = {
          header: null,
          results: null,
          meta: null,
        };
        this.$emit('reset');
      }
    },
  },
};
</script>
