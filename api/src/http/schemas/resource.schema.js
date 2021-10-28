const joi = require('@hapi/joi');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const { idMongoSchema } = require('./base.schema');

const { Schema } = mongoose;

const usersPrivateAccessValidation = {
  usersPrivateAccess: {
    permission: {
      arrayEnum: ['view', 'modify', 'all'],
    },
  },
};

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


module.exports = {
  sharedTemplatesMongoSchema,
  usersPrivateAccessValidation,
  usersPrivateAccessJoiSchema,
  configTemplatesPrivacyJoiSchema,
  isPublicJoiSchema,
};
