const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const { emailValidations } = require('../../../../http/schemas/base.validations');
const { userValidations } = require('../user.schema-validations');

const flagsUserMongoSchema = require('./flags-user.mongo-schema');
const avatarMongoSchema = require('./avatar.mongo-schema');

const { Schema } = mongoose;

const userMongoSchema = new Schema({
  name: {
    type: String,
    maxlength: userValidations.name.max,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    match: new RegExp(emailValidations.regex),
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    default: null,
  },
  avatar: avatarMongoSchema,
  role: {
    name: {
      type: String,
      enum: userValidations.role.name.arrayEnum,
      required: true,

    },
  },
  status: {
    type: String,
    enum: userValidations.status.arrayEnum,
    required: true,
  },
  securityToken: {
    type: String,
    unique: true,
    required: true,
  },
  securityCode: {
    type: Number,
    required: true,
  },
  codeRecoverAccount: {
    type: Number,
    required: true,
  },
  flags: flagsUserMongoSchema,
  markers: [String],
  tenant: {
    type: ObjectID,
    ref: 'tenant',
    default: null,
  },
  creator: {
    type: ObjectID,
    default: null,
  },
}, {
  useNestedStrict: true,
  timestamps: true,
});

userMongoSchema.set('toJSON', {
  virtuals: true,
});

userMongoSchema.set('toObject', {
  virtuals: true,
});

module.exports = userMongoSchema;
