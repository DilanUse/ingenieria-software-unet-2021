const BaseController = require('../../../http/controllers/base.controller');
const service = require('./contact.service');
const sharedFunctions = require('../../shared.functions');
const contactsFunctions = require('./contact.functions');

class ContactController extends BaseController {
  constructor() {
    super({
      service,
      selectFilter: '-marketingStatus.token -marketingStatus.urlSms',
      fieldsDelete: [
        { firstProperty: 'marketingStatus', secondProperty: 'token' },
        { firstProperty: 'marketingStatus', secondProperty: 'urlSms' },
      ],
    });
    this.service = service;
    this.selectFilter = '-marketingStatus.token -marketingStatus.urlSms';
    this.fieldsDelete = [
      { firstProperty: 'marketingStatus', secondProperty: 'token' },
      { firstProperty: 'marketingStatus', secondProperty: 'urlSms' },
    ];
  }

  async getAnalyticsPieHandler(req) {
    const { tenantIdPayloadToken: tenantId } = req.params;
    return this.service.getAnalyticsPie(tenantId);
  }

  async getAllHandler({
    req, trash = false, contactGroups = false,
  }) {
    const {
      tenantIdPayloadToken: tenantId,
      id: idContactGroup,
    } = req.params;

    const {
      limit, skip, filters, sortBy, populate, filtersMatch,
    } = req.query;

    const queryFind = sharedFunctions.getQueryFindForPublic({ tenantId, filters, filtersMatch });

    const fieldSort = sharedFunctions.getFieldSort(sortBy);

    if (contactGroups === true) {
      queryFind.contactsGroups = idContactGroup;
    }

    queryFind.unregistered = false;

    if (trash) {
      const data = await this.service.getAllInTrash({
        queryFind, skip, limit, fieldSort,
      }).select(this.selectFilter).populate(populate);
      const count = await this.service.getCountInTrash(queryFind);

      return { data, count };
    }

    const data = await this.service.getAll({
      queryFind, skip, limit, fieldSort,
    }).select(this.selectFilter).populate(populate);
    const count = await this.service.getCount(queryFind);

    return { data, count };
  }

  async importFromFileHandler(req) {
    const { payload, blacklist } = req.body;
    const {
      tenantIdPayloadToken: tenant,
      userIdPayloadToken: creator,
    } = req.params;

    return this.service.importFromFile({
      payload,
      blacklist,
      tenant,
      creator,
    });
  }

  async deleteManyHandler(req) {
    const {
      tenantIdPayloadToken: tenantId,
      userRolePayloadToken: userRole,
      userIdPayloadToken: userId,
    } = req.params;

    const { data, filters, filtersMatch } = req.body;

    const queryFind = contactsFunctions.getQueryFindForModifyContacts({
      userRole,
      userId,
      tenantId,
      filters,
      filtersMatch,
    });

    if (data !== null) {
      // eslint-disable-next-line no-underscore-dangle
      queryFind._id = { $in: data };
    }

    queryFind.unregistered = false;

    return this.service.deleteMany({
      queryFind,
    });
  }

  async restoreManyHandler(req) {
    const {
      tenantIdPayloadToken: tenantId,
      userRolePayloadToken: userRole,
      userIdPayloadToken: userId,
    } = req.params;

    const { data, filters, filtersMatch } = req.body;

    const queryFind = contactsFunctions.getQueryFindForModifyContacts({
      userRole,
      userId,
      tenantId,
      filters,
      filtersMatch,
    });

    if (data !== null) {
      // eslint-disable-next-line no-underscore-dangle
      queryFind._id = { $in: data };
    }

    queryFind.unregistered = false;

    return this.service.restoreMany({
      queryFind,
    });
  }

  async setOptOutHandler(req) {
    const { id, optToken, nameService } = req.params;

    return this.service.setOptOut({ id, optToken, service: nameService });
  }

  async restoreOneHandler(req) {
    return this.service.restoreOne(req.params.id);
  }

  async optOutInfoHandler(req) {
    const { id, optOutToken } = req.params;

    return this.service.optOutInfoHandler({
      id,
      optOutToken,
    });
  }
}

const singletonInstance = new ContactController();

module.exports = singletonInstance;
