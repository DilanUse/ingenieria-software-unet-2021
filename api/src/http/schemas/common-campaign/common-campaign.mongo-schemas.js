const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const { campaignsValidations } = require('./common-campaign.schema-validations');

const { Schema } = mongoose;

const detailSchema = new Schema({
  contact: {
    type: ObjectID,
    ref: 'contact',
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: campaignsValidations.details.status.arrayEnum,
    required: true,
  },
  reasonForFailure: {
    type: String,
  },
  deliveryTime: {
    type: String,
  },
  carrier: {
    type: String,
  },
});

const filterSchema = new Schema({
}, {
  _id: false,
  strict: false,
});

const sharedFieldsAllCampaigns = {
  name: {
    type: String,
    maxlength: campaignsValidations.name.max,
    required: true,
  },
  step: {
    type: Number,
    min: campaignsValidations.step.min,
    required: true,
  },
  deliveryType: {
    type: String,
    enum: campaignsValidations.deliveryType.arrayEnum,
    required: true,
  },
  timeZone: {
    type: String,
  },
  contacts: [{ type: ObjectID, ref: 'contact' }],
  status: {
    type: String,
    enum: campaignsValidations.status.arrayEnum,
    required: true,
  },
  contactsNumber: {
    type: Number,
    min: campaignsValidations.contactsNumber.min,
    required: true,
  },
  localStartDate: {
    type: String,
  },
  outbound: {
    type: Number,
    min: campaignsValidations.outbound.min,
    default: 0,

  },
  bounced: {
    type: Number,
    min: campaignsValidations.bounced.min,
    default: 0,
  },
  details: [detailSchema],
  filters: filterSchema,
  filtersMatch: {
    type: String,
    enum: ['all', 'any'],
    default: 'all',
  },
  quickAudience: {
    type: ObjectID,
    ref: 'audience',
  },
};

const sharedFieldsCampaignsSmsMms = {
  ...sharedFieldsAllCampaigns,
  message: {
    type: String,
    required() { return this.status !== 'draft'; },
  },

};

module.exports = {
  sharedFieldsAllCampaigns,
  sharedFieldsCampaignsSmsMms,
};
