const mongoose = require('mongoose');

const { historyContactMongoSchema } = require('./history-contacts.schema');

const historyContactModel = mongoose.model('historyContact', historyContactMongoSchema);

module.exports = historyContactModel;
