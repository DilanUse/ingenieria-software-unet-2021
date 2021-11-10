const mongoose = require('mongoose');

const { Schema } = mongoose;

const uniqueValidator = require('mongoose-unique-validator');

const { sharedIdentityMongoSchema } = require('../../../../http/schemas/base.schema');
const {
  sharedFieldsCampaignsSmsMms,
} = require('../../../../http/schemas/common-campaign/common-campaign.mongo-schemas');

const smsCampaignSchemaMongo = new Schema({
  ...sharedFieldsCampaignsSmsMms,
  optOut: {
    type: Number,
    min: 0,
    default: 0,
  },
  messageType: {
    type: String,
  },
  segment: {
    type: String,
  },
  senderType: {
    type: String,
    enum: ['shared', 'private', 'virtual'],
  },
  senderId: {
    type: Schema.Types.Mixed,
    ref: 'callerId',
    required() { return (this.status !== 'draft' && this.senderType !== 'shared'); },
  },
  ...sharedIdentityMongoSchema,

}, { timestamps: true, useNestedStrict: true });

smsCampaignSchemaMongo.set('toJSON', {
  virtuals: true,
});

smsCampaignSchemaMongo.set('toObject', {
  virtuals: true,
});

smsCampaignSchemaMongo.plugin(uniqueValidator);

module.exports = {
  smsCampaignSchemaMongo,
};
