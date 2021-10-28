const BaseService = require('./base.service');
const contactService = require('../../components/contacts/contact/contact.service');
const contactRepository = require('../../components/contacts/contact/contact.repository');
const userService = require('../../components/user/user.service');
const { paramsToGetAnalytics, fillDataWithDatesEmpties } = require('../functions/base.functions');
const { STATUS } = require('../constants/common-campaign.constants');

const sharedFunctions = require('../../components/shared.functions');

class CommonCampaignService extends BaseService {
  constructor({ repository, Constructor }) {
    super({ repository, Constructor });
    this.repository = repository;
    this.Constructor = Constructor;
    this.userService = userService;
    this.contactRepository = contactRepository;
  }

  async getAllDetails({
    queryFind, fieldSort, skip, limit, id, populate,
  }) {
    const objectMatchDetails = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(queryFind)) {
      objectMatchDetails[`details.${key}`] = value;
    }

    const details = await this.repository.getAllDetails({
      objectMatchDetails,
      skip,
      limit,
      id,
      populate: populate.map((item) => ({ path: `details.${item.path}`, select: item.select })),
    });

    const [{ count }] = await this.repository.getCountAllDetails({
      objectMatchDetails,
      id,
    });

    return {
      data: details.map((detail) => detail.details),
      count,
    };
  }

  async getAnalytics({ dateStart = null, dateEnd = null, tenantId }) {
    const {
      dateFormat,
      dateStartMoment,
      dateEndMoment,
      groupedBy,
    } = paramsToGetAnalytics({
      dateStart,
      dateEnd,
    });

    const data = await this.repository.getCampaignAnalytics({
      dateFormat,
      dateStart: dateStartMoment,
      dateEnd: dateEndMoment,
      tenantId,
    });

    console.log(`esta es la data en voice ${JSON.stringify(data)}`);

    let dataFill = [];

    if (data.length > 0) {
      dataFill = fillDataWithDatesEmpties({
        result: data,
        groupedBy,
        fieldsToFill: {
          bounced: 0,
          outbound: 0,
        },
        dateStart: dateStartMoment,
        dateEnd: dateEndMoment,
      });
    }

    console.log(`Esta es la data en dataFill ${JSON.stringify(dataFill)}`);

    return {
      groupedBy,
      data: dataFill,
    };
  }

  async updateDetails({ arrayContacts, status, idCampaign }) {
    const queryFind = {
      _id: idCampaign,
      details: { $elemMatch: { status: 'pending', contact: { $in: arrayContacts } } },
    };

    const objectUpdate = {
      $set: {
        'details.$.status': status,
      },
    };

    return this.repository.updateWithoutSet({ queryFind, queryUpdate: objectUpdate });
  }

  async getResourceWithPermissions({
    userId, userRole, tenantId, id,
  }) {
    const queryFind = sharedFunctions.getQueryFindForPrivateResources(
      {
        tenantId,
        userRole,
        userId,
        idResource: id,
      },
    );

    return this.repository.getOne(queryFind);
  }

  async getResourcesForDelete({ tenantId, userId, userRole }) {
    const queryFind = sharedFunctions.getQueryFindForPrivateResources({
      tenantId, userRole, userId,
    });

    return this.repository.get({ queryFind });
  }

  // eslint-disable-next-line class-methods-use-this
  async getCampaignContacts(queryFind) {
    const contactsMongoose = await contactService.getAll({ queryFind });
    return contactsMongoose.map((contactMongoose) => contactMongoose.toObject());
  }

  async getContactsGroupedByCountryWithMessageCount({ queryFind, messageCount = 1 }) {
    return this.contactRepository.getContactsGroupedByCountry({
      queryFind,
      sumBase: messageCount,
      sumKey: 'messagesCount',
    });
  }

  async getContactsGroupedByCountry(queryFind) {
    return this.contactRepository.getContactsGroupedByCountry({
      queryFind,
    });
  }

  async deleteOne(id) {
    return this.repository.deleteOne({
      _id: id,
      $or: [
        { status: STATUS.DRAFT },
        { status: STATUS.PENDING },
      ],
    });
  }

  async deleteMany({ ids, queryFind }) {
    if (ids && Array.isArray(ids)) {
      // eslint-disable-next-line no-param-reassign
      queryFind = { _id: { $in: ids } };
    }

    queryFind.$or = [
      { status: STATUS.DRAFT },
      { status: STATUS.PENDING },
    ];

    return this.repository.deleteMany(queryFind);
  }

  async getCountTypes(userId) {
    const data = await this.repository.getCountTypes(userId);

    const response = data[0];

    if (!response.sent) response.sent = 0;
    if (!response.draft) response.draft = 0;
    if (!response.scheduled) response.scheduled = 0;

    return response;
  }
}

module.exports = CommonCampaignService;
