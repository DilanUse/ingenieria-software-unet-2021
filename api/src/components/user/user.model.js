const mongoose = require('mongoose');
const userSchemaMongo = require('./schemas/mongo-schemas');

const UserModel = mongoose.model('user', userSchemaMongo);

module.exports = UserModel;
