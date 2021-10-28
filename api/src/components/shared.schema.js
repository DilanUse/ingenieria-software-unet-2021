const joi = require('@hapi/joi');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const { Schema } = mongoose;

const sharedMongoSchemaValidations = {
  idsMongo: {
    regex: '/^[0-9a-fA-F]{24}$/',
  },
};

const usersPrivateAccessValidation = {
  usersPrivateAccess: {
    permission: {
      arrayEnum: ['view', 'modify', 'all'],
    },
  },
};

const idMongoSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const idReferenceArrayJoiSchema = joi.array().items(idMongoSchema);
const isPublicJoiSchema = joi.boolean();

const usersPrivateAccessJoiSchema = joi.array().items(joi.object({
  user: idMongoSchema,
  permission: joi.any().allow(
    usersPrivateAccessValidation.usersPrivateAccess.permission.arrayEnum[0],
    usersPrivateAccessValidation.usersPrivateAccess.permission.arrayEnum[1],
    usersPrivateAccessValidation.usersPrivateAccess.permission.arrayEnum[2],
  ),
}));

const configTemplatesPrivacyJoiSchema = joi.object({
  isPublic: joi.boolean().required(),
  usersPrivateAccess: usersPrivateAccessJoiSchema,
});

const sharedIdentityMongoSchema = {
  tenant: {
    type: ObjectID,
    ref: 'tenant',
    required: true,
  },
  creator: {
    type: ObjectID,
    ref: 'user',
    required: true,
  },
};

const usersPrivateAccessMongoSchema = new Schema({
  user: {
    type: ObjectID,
    ref: 'user',
    required: true,
  },
  permission: {
    type: String,
    enum: usersPrivateAccessValidation.usersPrivateAccess.permission.arrayEnum,
    required: true,
  },
}, {
  _id: false,
});

const sharedTemplatesMongoSchema = {
  isPublic: {
    type: Boolean,
    // required: true,
    default: false,
  },
  usersPrivateAccess: [usersPrivateAccessMongoSchema],
};


const sharedDeleteRestoreManySchema = joi.object({
  data: joi.array().items(idMongoSchema).allow(null).required(),
  filters: joi.object({}).unknown([true]).required(),
  filtersMatch: joi.string(),
});

module.exports = {
  idMongoSchema,
  sharedMongoSchemaValidations,
  sharedTemplatesMongoSchema,
  sharedIdentityMongoSchema,
  usersPrivateAccessValidation,
  usersPrivateAccessJoiSchema,
  configTemplatesPrivacyJoiSchema,
  isPublicJoiSchema,
  idReferenceArrayJoiSchema,
  sharedDeleteRestoreManySchema,
};
