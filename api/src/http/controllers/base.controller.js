const sharedFunctions = require('../../components/shared.functions');

class BaseController {
  constructor({ service, selectFilter = '', fieldsDelete = [] }) {
    this.service = service;
    this.selectFilter = selectFilter;
    this.fieldsDelete = fieldsDelete;
  }

  async getAllHandler(req) {
    const {
      tenantIdPayloadToken: tenantId,
    } = req.params;

    const {
      limit, skip, filters, sortBy, populate, filtersMatch,
    } = req.query;

    const queryFind = sharedFunctions.getQueryFindForPublic({
      tenantId,
      filters,
      filtersMatch,
    });
    const fieldSort = sharedFunctions.getFieldSort(sortBy);

    const data = await this.service.getAll({
      queryFind, skip, limit, fieldSort,
    })
      .select(this.selectFilter).populate(populate);
    const count = await this.service.getCount(queryFind);

    return { data, count };
  }

  async getCountHandler({ req, params = {} }) {
    const { tenantIdPayloadToken: tenantId } = req.params;

    const queryFind = {
      tenant: tenantId,
      ...params,
    };

    return this.service.getCount(queryFind);
  }

  async getOneHandler(req) {
    const { populate } = req.query;
    return this.service.getOne(req.params.id).select(this.selectFilter).populate(populate);
  }

  async createOneHandler(req) {
    const payload = req.body;
    const {
      tenantIdPayloadToken: tenant,
      userIdPayloadToken: creator,
    } = req.params;

    const documentCreatedMongoose = await this.service.createOne({
      payload,
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

  async importFromFileHandler(req) {
    const payload = req.body;
    const {
      tenantIdPayloadToken: tenant,
      userIdPayloadToken: creator,
    } = req.params;

    return this.service.importFromFile({
      payload,
      tenant,
      creator,
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
      : sharedFunctions.getQueryFindForPublic({
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

  async updateOneHandler(req) {
    const updateDocumentMongoose = await this.service.updateOne({
      payload: req.body,
      id: req.params.id,
    });

    const documentUpdated = updateDocumentMongoose.toObject();

    this.fieldsDelete.forEach((field) => {
      if (field.firstProperty && !field.secondProperty && !field.thirdProperty) delete documentUpdated[field.firstProperty];
      else if (field.firstProperty && field.secondProperty && !field.thirdProperty) delete documentUpdated[field.firstProperty][field.secondProperty];
      else if (field.firstProperty && field.secondProperty && field.thirdProperty) delete documentUpdated[field.firstProperty][field.secondProperty][field.thirdProperty];
    });

    return documentUpdated;
  }

  async deleteOneHandler(req) {
    return this.service.deleteOne(req.params.id);
  }

  async deleteManyHandler(req) {
    const {
      tenantIdPayloadToken: tenantId,
    } = req.params;

    const { data, filters, filtersMatch } = req.body;

    const ids = data;
    const queryFind = data === null
      ? sharedFunctions.getQueryFindForPublic({
        tenantId,
        filters,
        filtersMatch,
      })
      : null;

    return this.service.deleteMany({
      ids,
      queryFind,
    });
  }
}

module.exports = BaseController;
