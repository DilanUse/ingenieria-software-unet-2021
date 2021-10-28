const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = new Schema({
  url: {
    type: String,
    required: true,
  },
  bucketPath: {
    type: String,
    required: true,
  },
},
{
  _id: false,
});
