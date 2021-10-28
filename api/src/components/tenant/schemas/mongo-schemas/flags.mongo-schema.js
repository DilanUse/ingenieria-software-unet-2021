const mongoose = require('mongoose');

const { Schema } = mongoose;
module.exports = new Schema({
  completedAccountDetails: {
    type: Boolean,
    default: false,
  },
  completedReviewsSettings: {
    type: Boolean,
    default: false,
  },
},
{
  _id: false,
});
