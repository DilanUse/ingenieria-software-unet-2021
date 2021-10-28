const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = new Schema({
  acceptTermsAndConditions: {
    type: Boolean,
    default: false,
  },
  acceptReceiveNewsAndUpdates: {
    type: Boolean,
    default: false,
  },
  welcomeTourSkipped: {
    type: Boolean,
    default: false,
  },
  hasPassword: {
    type: Boolean,
    default: false,
  },
},
{
  _id: false,
});
