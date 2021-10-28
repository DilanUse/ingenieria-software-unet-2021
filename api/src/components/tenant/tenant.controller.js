const BaseController = require('../../http/controllers/base.controller');
const service = require('./tenant.service');

class TenantController extends BaseController {
  constructor() {
    super({ service });
    this.service = service;
  }

  async getFlagsInformationHandler(req) {
    const { tenantIdPayloadToken: tenantId } = req.params;
    const tenantOrganization = await this.service.getOne(tenantId);

    return tenantOrganization.flags;
  }

  async getTenantOrganization(req) {
    const { tenantIdPayloadToken: tenantId } = req.params;
    const tenantOrganization = await this.service.getOne(tenantId);

    return tenantOrganization;
  }
}

const singletonInstance = new TenantController();

module.exports = singletonInstance;
