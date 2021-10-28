const mongoose = require('mongoose');
const BaseRepository = require('../../../http/repositories/base.repository');
const model = require('./history-contacts.model');

class HistoryContactsRepository extends BaseRepository {
  constructor() {
    super({ model });
    this.model = model;
  }

  getAnalyticsLines({
    dateFormat, dateStart, dateEnd, tenantId,
  }) {
    const objectTenantId = mongoose.Types.ObjectId(tenantId);
    return this.model.aggregate([
      {
        $match: {
          date: { $gte: dateStart, $lt: dateEnd },
          tenant: objectTenantId,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$date' } },
          // numberContactsCreated: { $sum: '$numberContactsCreated' },
          numberContacts: { $avg: '$numberContacts' },
          // numberContactsOptOut: { $sum: '$numberContactsOptOut' },
        },
      },
    ]);
  }
}

const singletonInstance = new HistoryContactsRepository();

module.exports = singletonInstance;
