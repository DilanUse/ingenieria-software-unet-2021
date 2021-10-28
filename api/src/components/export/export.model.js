const mongoose = require('mongoose');

const { exportSchemaMongo } = require('./export.schema');

const exportModel = mongoose.model('export', exportSchemaMongo);

module.exports = exportModel;
