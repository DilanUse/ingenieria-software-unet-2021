const mongoose = require('mongoose');

const {
  sharedIdentityMongoSchema,
} = require('../../http/schemas/base.schema');

const { Schema } = mongoose;

const exportSchemaMongo = new Schema({
  path: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  ...sharedIdentityMongoSchema,

}, {
  timestamps: true,
});

exportSchemaMongo.set('toJSON', {
  virtuals: true,
});

exportSchemaMongo.set('toObject', {
  virtuals: true,
});

module.exports = {
  exportSchemaMongo,
};
