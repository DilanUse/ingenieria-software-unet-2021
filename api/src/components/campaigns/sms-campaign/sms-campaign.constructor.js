const BaseConstructor = require('../../../http/constructors/base.constructor');

class SmsCampaignConstructor extends BaseConstructor {
  constructor({
    name, step, deliveryType, timeZone, contacts, contactsNumber, status,
    senderId, localStartDate, message,
    tenant, creator, details, messageType, segment, senderType, filters, filtersMatch = 'all',
  }) {
    super({ tenant, creator });
    this.name = name;
    this.step = step;
    this.deliveryType = deliveryType;
    this.timeZone = timeZone;
    this.contacts = contacts;
    this.contactsNumber = contactsNumber;
    this.status = status;
    this.senderId = senderId;
    this.localStartDate = localStartDate;
    this.message = message;
    this.details = details;
    this.messageType = messageType;
    this.segment = segment;
    this.senderType = senderType;
    this.filters = filters;
    this.filtersMatch = filtersMatch;
  }
}

module.exports = SmsCampaignConstructor;
