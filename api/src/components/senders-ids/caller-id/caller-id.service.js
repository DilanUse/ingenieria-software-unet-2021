const BaseService = require('../../../http/services/base.service');
const repository = require('./caller-id.repository');
const Constructor = require('./caller-id.constructor');
const tenantService = require('../../tenant/tenant.service');
const SmsService = require('../../../http/services/sms.service');

class CallerIdService extends BaseService {
  constructor() {
    super({ repository, Constructor });
    this.repository = repository;
    this.Constructor = Constructor;
  }

  async generateCodeForVerification({ id, tenantId }) {
    const tenantMongoose = await tenantService.getOne(tenantId);
    const tenant = tenantMongoose.toObject();

    const callerId = await this.getOne(id);
    const code = Math.floor(1000 + Math.random() * 9000);
    const smsService = new SmsService({});
    const clientSms = await smsService.getClient(tenant.burstSMSClientId);
    const smsServiceTenant = new SmsService({
      apiKeyBurstSMS: clientSms.apikey,
      apiSecretBurstSMS: clientSms.apisecret,
    });
    console.log(`This is the code ${code}`);
    /*
    await smsServiceTenant.sendSMS({
      from: '', // todo: define from to transactional sms
      to: callerId.phoneInternational,
      message: `Your GrapeSend code to verify this number as Caller ID is ${code}`,
    });*/

    await this.updateOne({ payload: { codeValidation: code }, id });
    return 'Code Generated';
  }

  async checkCodeVerification({ codeVerification, id }) {
    const callerId = await this.getOne(id);

    const { codeValidation } = callerId;

    if (codeVerification !== codeValidation) {
      throw new Error('Error code verified');
    }

    await this.updateOne({ payload: { status: 'verified' }, id });

    return 'Code Verified';
  }
}

const singletonInstance = new CallerIdService();

module.exports = singletonInstance;
