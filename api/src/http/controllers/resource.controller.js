const BaseController = require('./base.controller');
const sharedFunctions = require('../../components/shared.functions');
const { getQueryFindForSharedResources } = require('../functions/resource.functions');

class ResourceController extends BaseController {
  constructor({ service, selectFilter = '', fieldsDelete = [] }) {
    super({ service, selectFilter, fieldsDelete });
    this.service = service;
    this.selectFilter = selectFilter;
    this.fieldsDelete = fieldsDelete;
  }

  async getAllHandler({ req, trash = false }) {
    const {
      tenantIdPayloadToken: tenantId,
      userRolePayloadToken: userRole,
      userIdPayloadToken: userId,
    } = req.params;

    const {
      limit, skip, filters, sortBy, populate, filtersMatch,
    } = req.query;

    const queryFind = getQueryFindForSharedResources({
      userRole,
      userId,
      tenantId,
      filters,
      filtersMatch,
    });

    const fieldSort = sharedFunctions.getFieldSort(sortBy);

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

  async updatePrivacyHandler(req) {
    return this.service.updatePrivacy({
      payload: req.body,
      id: req.params.id,
    });
  }

  async restoreOneHandler(req) {
    return this.service.restoreOne(req.params.id);
  }

  async deleteOneHandler(req) {
    return this.service.deleteOne({
      id: req.params.id,
      userId: req.params.userIdPayloadToken,
      tenantId: req.params.tenantIdPayloadToken,
      userRole: req.params.userRolePayloadToken,
    });
  }

  async deleteManyHandler(req) {
    const {
      tenantIdPayloadToken: tenantId,
      userRolePayloadToken: userRole,
      userIdPayloadToken: userId,
    } = req.params;

    const { data, filters, filtersMatch } = req.body;

    const ids = data;
    const queryFind = data === null
      ? getQueryFindForSharedResources({
        userRole,
        userId,
        tenantId,
        filters,
        filtersMatch,
      })
      : null;

    return this.service.deleteMany({
      ids,
      queryFind,
      userId,
      tenantId: req.params.tenantIdPayloadToken,
      userRole: req.params.userRolePayloadToken,
    });
  }

  async restoreManyHandler(req) {
    const {
      tenantIdPayloadToken: tenantId,
      userRolePayloadToken: userRole,
      userIdPayloadToken: userId,
    } = req.params;

    const { data, filters, filtersMatch } = req.body;

    const ids = data;
    const queryFind = data === null
      ? getQueryFindForSharedResources({
        userRole,
        userId,
        tenantId,
        filters,
        filtersMatch,
      })
      : null;

    return this.service.restoreMany({
      ids,
      queryFind,
    });
  }

  async exportIntoFileHandler(req) {
    const {
      columns, name, format, data, filters, filtersMatch, sortBy, separator, sendEmail, entity,
    } = req.body;

    const {
      tenantIdPayloadToken: tenantId,
      userRolePayloadToken: userRole,
      userIdPayloadToken: userId,
    } = req.params;

    const fieldSort = sharedFunctions.getFieldSort(sortBy);
    const queryFind = data !== null
      ? { _id: { $in: data } }
      : getQueryFindForSharedResources({
        userRole,
        userId,
        tenantId,
        filters,
        filtersMatch,
      });

    return this.service.exportIntoFile({
      queryFind,
      fieldSort,
      userNameFile: name,
      entity,
      columns,
      format,
      userId,
      userRole,
      separator,
      sendEmail,
      tenantId,
    });
  }
}

module.exports = ResourceController;
