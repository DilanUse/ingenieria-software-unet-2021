const mongoose = require('mongoose');
const BaseRepository = require('./base.repository');
const { STATUS, DELIVERY_TYPE } = require('../constants/common-campaign.constants');

class CommonCampaignRepository extends BaseRepository {
  constructor({ model }) {
    super({ model });
    this.model = model;
  }

  async getAllDetails({
    objectMatchDetails, skip = 0, limit = 0, id, populate,
  }) {
    const aggregationInstructions = [
      {
        $match: { _id: mongoose.Types.ObjectId(id) },
      },
      {
        $unwind: '$details',
      },
      {
        $match: objectMatchDetails,
      },
      {
        $project: { details: 1, _id: 0 },
      },
      /* aqui viene el sort {

     } */
    ];

    if (skip && skip > 0) {
      aggregationInstructions.push({
        $skip: skip,
      });
    }
    if (limit && limit > 0) {
      aggregationInstructions.push({
        $limit: limit,
      });
    }

    const result = await this.model.aggregate(aggregationInstructions);
    return this.model.populate(result, populate);
  }

  getCountAllDetails({ objectMatchDetails, id }) {
    const aggregationInstructions = [
      {
        $match: { _id: mongoose.Types.ObjectId(id) },
      },
      {
        $unwind: '$details',
      },
      {
        $match: objectMatchDetails,
      },
      {
        $project: { details: 1 },
      },
      {
        $count: 'count',
      },
    ];

    return this.model.aggregate(aggregationInstructions);
  }

  getCampaignAnalytics({
    dateFormat, dateStart, dateEnd, fields = [], tenantId,
  }) {
    const objectTenantId = mongoose.Types.ObjectId(tenantId);

    const groupStage = {
      _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
      bounced: { $sum: '$bounced' },
      outbound: { $sum: '$outbound' },
    };

    fields.forEach((field) => {
      groupStage[field] = { $sum: `$${field}` };
    });

    return this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: dateStart, $lt: dateEnd },
          status: STATUS.COMPLETED,
          tenant: objectTenantId,
        },
      },
      {
        $group: groupStage,
      },
      { $sort: { _id: 1 } },
    ]);
  }

  getCountTypes(userId) {
    const objectUserId = mongoose.Types.ObjectId(userId);

    return this.model.aggregate([
      {
        $facet: {
          sent: [
            {
              $match:
                {
                  creator: objectUserId,
                  $or: [{ status: STATUS.COMPLETED }, { status: STATUS.RUNNING }],
                },
            },
            { $count: 'sent' },
          ],
          draft: [
            { $match: { creator: objectUserId, status: STATUS.DRAFT } },
            { $count: 'draft' },
          ],
          scheduled: [
            { $match: { creator: objectUserId, deliveryType: DELIVERY_TYPE.LATER } },
            { $count: 'scheduled' },
          ],
        },
      },
      {
        $project: {
          sent: { $arrayElemAt: ['$sent.sent', 0] },
          draft: { $arrayElemAt: ['$draft.draft', 0] },
          scheduled: { $arrayElemAt: ['$scheduled.scheduled', 0] },
        },
      },
    ]);
  }
}

module.exports = CommonCampaignRepository;
