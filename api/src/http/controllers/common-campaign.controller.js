const BaseController = require('./base.controller');
const objectSharedFunctions = require('../../components/shared.functions');
const campaignConstants = require('../constants/common-campaign.constants');
const { MARKETING_STATUS } = require('../../components/contacts/contact/contact.constants');

class CommonCampaignController extends BaseController {
  constructor({ service, selectFilter = '-details', fieldsDelete = [] }) {
    super({ service, selectFilter, fieldsDelete });
    this.service = service;
    this.selectFilter = selectFilter;
    this.fieldsDelete = fieldsDelete;
  }

  async getAllDetailsHandler(req) {
    const {
      limit, skip, filters, sortBy, populate, filtersMatch,
    } = req.query;

    const { id } = req.params;

    const queryFind = objectSharedFunctions.getFiltersForQueryFind({
      filters,
      filtersMatch,
    });
    const fieldSort = objectSharedFunctions.getFieldSort(sortBy);

    const { data, count } = await this.service.getAllDetails({
      queryFind,
      fieldSort,
      limit,
      skip,
      id,
      populate,
    });

    return { data, count };
  }

  async getAnalyticsHandler(req) {
    const { dateStart, dateEnd } = req.query;
    const { tenantIdPayloadToken: tenantId } = req.params;

    return this.service.getAnalytics({
      dateStart,
      dateEnd,
      tenantId,
    });
  }

  async getAllHandler(req) {
    const {
      tenantIdPayloadToken: tenantId,
      userIdPayloadToken: userId,
      userRolePayloadToken: userRole,
    } = req.params;

    const {
      limit, skip, filters, sortBy, populate, filtersMatch,
    } = req.query;

    const queryFind = objectSharedFunctions.getQueryFindForPrivateResources({
      tenantId,
      userRole,
      userId,
      filters,
      filtersMatch,
    });

    const fieldSort = objectSharedFunctions.getFieldSort(sortBy);

    const data = await this.service.getAll({
      queryFind, skip, limit, fieldSort,
    }).select(this.selectFilter).populate(populate);
    const count = await this.service.getCount(queryFind);

    return { data, count };
  }

  async deleteManyHandler(req) {
    const {
      tenantIdPayloadToken: tenantId,
      userIdPayloadToken: userId,
      userRolePayloadToken: userRole,
    } = req.params;

    const { data, filters, filtersMatch } = req.body;

    const ids = data;
    const queryFind = data === null
      ? objectSharedFunctions.getQueryFindForPrivateResources({
        tenantId,
        userRole,
        userId,
        filters,
        filtersMatch,
      })
      : null;

    return this.service.deleteMany({
      ids,
      queryFind,
    });
  }

  async createOneHandler(req) {
    const payload = req.body;
    const {
      tenantIdPayloadToken: tenant,
      userIdPayloadToken: creator,
    } = req.params;

    const queryFind = {
      ...objectSharedFunctions.getFiltersForQueryFind(
        {
          filters: payload.filters,
          filtersMatch: payload.filtersMatch,
        },
      ),
      tenant,
      unregistered: false,
    };

    if (payload.messageType === campaignConstants.MESSAGE_TYPE.MARKETING
      && payload.status !== campaignConstants.STATUS.DRAFT) {
      queryFind['marketingStatus.value'] = { $in: [MARKETING_STATUS.SUBSCRIBED] };
    }

    const documentCreatedMongoose = await this.service.createOne({
      payload,
      queryFind,
      tenant,
      creator,
    });

    const documentCreated = documentCreatedMongoose.toObject();

    this.fieldsDelete.forEach((field) => {
      if (field.firstProperty && !field.secondProperty && !field.thirdProperty) delete documentCreated[field.firstProperty];
      else if (field.firstProperty && field.secondProperty && !field.thirdProperty) delete documentCreated[field.firstProperty][field.secondProperty];
      else if (field.firstProperty && field.secondProperty && field.thirdProperty) delete documentCreated[field.firstProperty][field.secondProperty][field.thirdProperty];
    });

    return documentCreated;
  }

  async updateOneHandler(req) {
    const { filters, filtersMatch, ...payload } = req.body;

    const { id, tenantIdPayloadToken: tenant } = req.params;

    const queryFind = {
      ...objectSharedFunctions.getFiltersForQueryFind(
        {
          filters,
          filtersMatch,
        },
      ),
      tenant,
      unregistered: false,
    };

    if (payload.messageType === campaignConstants.MESSAGE_TYPE.MARKETING
      && payload.status !== campaignConstants.STATUS.DRAFT) {
      queryFind['marketingStatus.value'] = { $in: [MARKETING_STATUS.SUBSCRIBED] };
    }

    const updateDocumentMongoose = await this.service.updateOne({
      payload,
      queryFind,
      idCampaign: id,
    });

    const documentUpdated = updateDocumentMongoose.toObject();

    this.fieldsDelete.forEach((field) => {
      if (field.firstProperty && !field.secondProperty && !field.thirdProperty) delete documentUpdated[field.firstProperty];
      else if (field.firstProperty && field.secondProperty && !field.thirdProperty) delete documentUpdated[field.firstProperty][field.secondProperty];
      else if (field.firstProperty && field.secondProperty && field.thirdProperty) delete documentUpdated[field.firstProperty][field.secondProperty][field.thirdProperty];
    });

    return documentUpdated;
  }

  async getCountTypesHandler(req) {
    const { userIdPayloadToken: userId } = req.params;

    return this.service.getCountTypes(userId);
  }
}

module.exports = CommonCampaignController;
