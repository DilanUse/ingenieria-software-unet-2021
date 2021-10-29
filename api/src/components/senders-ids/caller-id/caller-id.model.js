const mongoose = require('mongoose');
const { callerIdMongoSchema } = require('./caller-id.schema');

const CallerIdModel = mongoose.model('callerId', callerIdMongoSchema);

module.exports = CallerIdModel;
