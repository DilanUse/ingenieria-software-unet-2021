const mongoose = require('mongoose');
const tenantMongoSchema = require('./schemas/mongo-schemas');

const TenantModel = mongoose.model('tenant', tenantMongoSchema);

module.exports = TenantModel;
