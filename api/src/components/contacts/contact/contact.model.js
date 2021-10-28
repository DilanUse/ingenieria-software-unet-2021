const mongoose = require('mongoose');

const { contactMongoSchema } = require('./schemas/contact.mongo-schemas');

const ContactModel = mongoose.model('contact', contactMongoSchema);

module.exports = ContactModel;
