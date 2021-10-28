const joi = require('@hapi/joi');
const { ObjectID } = require('mongodb');

const sharedMongoSchemaValidations = {
  idsMongo: {
    regex: '/^[0-9a-fA-F]{24}$/',
  },
};

const idMongoSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const idReferenceArrayJoiSchema = joi.array().items(idMongoSchema);
const countryIso2JoiSchema = joi.string().regex(/^[a-zA-Z]{2}$/);
const emailJoiSchema = joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }); // todo: fix this to be more flexible

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

const sharedDeleteRestoreManySchema = joi.object({
  data: joi.array().items(idMongoSchema).allow(null).required(),
  filters: joi.object({}).unknown([true]).required(),
});

module.exports = {
  idMongoSchema,
  sharedMongoSchemaValidations,
  sharedIdentityMongoSchema,
  idReferenceArrayJoiSchema,
  sharedDeleteRestoreManySchema,
  countryIso2JoiSchema,
  emailJoiSchema,
};
