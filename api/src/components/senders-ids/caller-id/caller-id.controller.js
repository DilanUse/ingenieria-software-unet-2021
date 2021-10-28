const BaseController = require('../../../http/controllers/base.controller');
const service = require('./caller-id.service');

class CallerIdController extends BaseController {
  constructor() {
    super({
      service,
      selectFilter: '-codeValidation',
      fieldsDelete: [
        { firstProperty: 'codeValidation' },
      ],
    });
    this.service = service;
    this.selectFilter = '-codeValidation';
    this.fieldsDelete = [{ firstProperty: 'codeValidation' }];
  }

  async generateCodeForVerificationHandler(req) {
    const { id, tenantIdPayloadToken: tenantId } = req.params;

    return this.service.generateCodeForVerification({ id, tenantId });
  }

  async checkCodeVerificationHandler(req) {
    const { codeVerification, id } = req.params;

    return this.service.checkCodeVerification({ codeVerification, id });
  }
}

const singletonInstance = new CallerIdController();

module.exports = singletonInstance;
