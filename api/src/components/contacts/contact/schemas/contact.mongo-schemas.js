const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseDelete = require('mongoose-delete');
const { sharedIdentityMongoSchema } = require('../../../../http/schemas/base.schema');
const { contactsValidations } = require('./contact.schema-validations');
const { MARKETING_STATUS } = require('../contact.constants');

const { Schema } = mongoose;

const marketingStatusSchema = new Schema({
  value: {
    type: String,
    enum: contactsValidations.marketingStatus.arrayEnum,
    default: MARKETING_STATUS.SUBSCRIBED,
  },
  date: {
    type: Date,
    default: null,
  },
  token: {
    type: String,
  },
  urlSms: {
    type: String,
    default: '',
  },
  origin: {
    type: String,
    default: '',
  },
}, {
  _id: false,
});

const contactMongoSchema = new Schema({
  firstName: {
    type: String,
    maxlength: contactsValidations.firstName.max,
    required: true,
  },
  lastName: {
    type: String,
    maxlength: contactsValidations.lastName.max,
  },
  email: {
    type: String,
    match: new RegExp(contactsValidations.email.regex),
    trim: true,
    required() { return this.phoneInternational === ''; },
  },
  phoneInternational: {
    type: String,
    required() { return this.email === ''; },
  },
  phoneNational: {
    type: String,
    required() { return this.email === ''; },
  },
  phoneSignificant: {
    type: String,
    required() { return this.email === ''; },
  },
  dialCode: {
    type: Number,
    required() { return this.email === ''; },
  },
  codeCountry: {
    type: String,
    maxlength: contactsValidations.codeCountry.max,
    required() { return this.email === ''; },
  },
  country: {
    type: String,
    required() { return this.email === ''; },
  },
  marketingStatus: marketingStatusSchema,
  importIndex: {
    type: Number,
    default: null,
  },
  unregistered: {
    type: Boolean,
    default: false,
  },
  ...sharedIdentityMongoSchema,
}, {
  timestamps: true,
  strict: false,
});

contactMongoSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

contactMongoSchema.set('toJSON', {
  virtuals: true,
});

contactMongoSchema.set('toObject', {
  virtuals: true,
});

contactMongoSchema.plugin(uniqueValidator);
contactMongoSchema.plugin(mongooseDelete, { overrideMethods: true, deletedAt: true });

module.exports = {
  contactMongoSchema,
};
