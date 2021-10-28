const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseDelete = require('mongoose-delete');
const {
  sharedIdentityMongoSchema,
} = require('../../../http/schemas/base.schema');

const {
  sharedTemplatesMongoSchema,
} = require('../../../http/schemas/resource.schema');

const { Schema } = mongoose;

const smsTemplatesValidations = {
  name: {
    max: 100,
  },
  message: {
    max: 612,
  },
};
// -----------------Schema Mongoose-------------------
const smsTemplateMongoSchema = new Schema({
  name: {
    type: String,
    maxlength: smsTemplatesValidations.name.max,
    required: true,
  },
  message: {
    type: String,
    maxlength: smsTemplatesValidations.message.max,
    required: true,
  },
  transactionalToken: {
    type: String,
    default: '',
  },
  ...sharedTemplatesMongoSchema,
  ...sharedIdentityMongoSchema,
}, {
  timestamps: true,
});

smsTemplateMongoSchema.set('toJSON', {
  virtuals: true,
});

smsTemplateMongoSchema.set('toObject', {
  virtuals: true,
});

smsTemplateMongoSchema.plugin(uniqueValidator);
smsTemplateMongoSchema.plugin(mongooseDelete, { overrideMethods: true, deletedAt: true });

module.exports = {
  smsTemplateMongoSchema,
};
