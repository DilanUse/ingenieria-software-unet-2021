const mongoose = require('mongoose');

const {
  sharedIdentityMongoSchema,
} = require('../../shared.schema');

const { Schema } = mongoose;

const { STATUS } = require('../../../http/constants/sender-id.constants');

const callerIdsValidations = {
  name: {
    max: 100,
  },
  status: {
    arrayEnum: Object.values(STATUS),
  },
};
// -------------- Schema Mongoose -------------------

const callerIdMongoSchema = new Schema({
  name: {
    type: String,
    maxlength: callerIdsValidations.name.max,
    required: true,
  },
  phoneInternational: {
    type: String,
    required: true,
  },
  phoneNational: {
    type: String,
    required: true,
  },
  phoneSignificant: {
    type: String,
    required: true,
  },
  dialCode: {
    type: Number,
    required: true,
  },
  codeCountry: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: callerIdsValidations.status.arrayEnum,
    required: true,
  },
  codeValidation: {
    type: String,
    required: false,
    default: null,
  },
  ...sharedIdentityMongoSchema,
}, {
  timestamps: true,
});

callerIdMongoSchema.set('toJSON', {
  virtuals: true,
});

callerIdMongoSchema.set('toObject', {
  virtuals: true,
});

module.exports = {
  callerIdMongoSchema,
};
