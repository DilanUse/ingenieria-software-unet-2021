const mongoose = require('mongoose');

const { Schema } = mongoose;

const historyContactMongoSchema = new Schema({
  tenant: {
    type: mongoose.Types.ObjectId,
    ref: 'tenant',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  numberContactsCreated: {
    type: Number,
    default: 0,
  },
  numberContacts: {
    type: Number,
    default: 0,
  },
  numberContactsOptOut: {
    type: Number,
    default: 0,
  },
});

historyContactMongoSchema.set('toJSON', {
  virtuals: true,
});

historyContactMongoSchema.set('toObject', {
  virtuals: true,
});

module.exports = { historyContactMongoSchema };
