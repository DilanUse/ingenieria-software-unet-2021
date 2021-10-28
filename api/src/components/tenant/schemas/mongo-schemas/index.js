const mongoose = require('mongoose');

const { Schema } = mongoose;

const flagsMongoSchema = require('./flags.mongo-schema');

const tenantMongoSchema = new Schema({
  burstSMSClientId: {
    type: String,
    required: true,
  },
  flags: flagsMongoSchema,
}, {
  timestamps: true,
});

tenantMongoSchema.set('toJSON', {
  virtuals: true,
});

tenantMongoSchema.set('toObject', {
  virtuals: true,
});

module.exports = tenantMongoSchema;
