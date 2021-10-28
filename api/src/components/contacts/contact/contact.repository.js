const mongoose = require('mongoose');
const ResourceRepository = require('../../../http/repositories/resource.repository');
const model = require('./contact.model');
const { MARKETING_STATUS } = require('./contact.constants');

class ContactRepository extends ResourceRepository {
  constructor() {
    super({ model });
    this.model = model;
  }

  getAnalyticsPie({ tenantId }) {
    const tenantObjectId = mongoose.Types.ObjectId(tenantId);

    return this.model.aggregate([
      {
        $facet: {
          contactsSubscribed: [
            { $match: { 'marketingStatus.value': MARKETING_STATUS.SUBSCRIBED, tenant: tenantObjectId, unregistered: false } },
            { $count: 'contactsSubscribed' },
          ],
          contactsUnsubscribed: [
            { $match: { 'marketingStatus.value': MARKETING_STATUS.UNSUBSCRIBED, tenant: tenantObjectId, unregistered: false } },
            { $count: 'contactsUnsubscribed' },
          ],
        },
      },
      {
        $project: {
          contactsSubscribed: { $arrayElemAt: ['$contactsSubscribed.contactsSubscribed', 0] },
          contactsUnsubscribed: { $arrayElemAt: ['$contactsUnsubscribed.contactsUnsubscribed', 0] },
        },
      },
    ]);
  }

  getCountContactsInDay() {
    return this.model.aggregate([
      {
        $group: {
          _id: '$tenant',
          countContactsOrganization: { $sum: 1 },
          docs: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $project: {
          _id: 1,
          countContactsOrganization: 1,
          contactsCreatedInDay: {
            $filter: {
              input: '$docs',
              as: 'doc',
              cond: {
                $gt: ['$$doc.createdAt', new Date(Date.now() - 24 * 60 * 60 * 1000)],
              },
            },
          },
          optOutInDay: {
            $filter: {
              input: '$docs',
              as: 'doc',
              cond: {
                $gte: ['$$doc.optOutDate', new Date(Date.now() - 24 * 60 * 60 * 1000)],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          countContactsOrganization: 1,
          contactsCreatedInDay: {
            $size: '$contactsCreatedInDay',
          },
          optOutInDay: {
            $size: '$optOutInDay',
          },
        },
      },
    ]);
  }

  deleteOne(id) {
    return this.model.findOneWithDeleted({ _id: id }, (err, payload) => {
      if (payload.deleted === true) {
        payload.remove();
      } else {
        payload.delete();
      }
    });
  }

  deleteMany(ids) {
    return this.model.findWithDeleted(
      { _id: { $in: ids } },
      (err, payload) => {
        payload.forEach((p) => {
          if (p.deleted === true) {
            p.remove();
          } else {
            p.delete();
          }
        });
      },
    );
  }

  getContactsGroupedByCountry({ queryFind, sumBase = 1, sumKey = '' }) {
    if (queryFind.tenant) queryFind.tenant = mongoose.Types.ObjectId(queryFind.tenant);
    if (queryFind._id && queryFind._id.$in) queryFind._id.$in = queryFind._id.$in.map((idItem) => mongoose.Types.ObjectId(idItem));

    const $group = {
      _id: '$codeCountry',
      contacts: { $push: '$$ROOT' },
    };

    const $project = {
      _id: 0,
      codeCountry: '$_id',
      contacts: 1,
    };

    if (sumKey) {
      $group[sumKey] = { $sum: sumBase };
      $project[sumKey] = 1;
    }

    return this.model.aggregate([
      { $match: queryFind },
      { $group },
      { $project },
    ]);
  }
}

const singletonInstance = new ContactRepository();

module.exports = singletonInstance;
