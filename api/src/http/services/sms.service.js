const BurstSMSService = require('./burst-sms/burst-sms.service');
const { config } = require('../../config');

const SMS_PROVIDERS = {
  BURST_SMS: 'burst-sms',
};

class SmsService {
  constructor({
    apiKeyBurstSMS = config.apiKeyBurstSms,
    apiSecretBurstSMS = config.apiSecretBurstSms,
  }) {
    this.activeProvider = SMS_PROVIDERS.BURST_SMS;
    this.MAX_NUMBER_MESSAGE_PER_TRANSACTION = 4;

    if (this.activeProvider === SMS_PROVIDERS.BURST_SMS) {
      this.burstSMSService = new BurstSMSService(
        { apiKey: apiKeyBurstSMS, apiSecret: apiSecretBurstSMS },
      );
    }
  }

  async sendSMS({
    from, to, message, dlrCallback, replyCallback,
  }) {
    switch (this.activeProvider) {
      case SMS_PROVIDERS.BURST_SMS:
        return this.burstSMSService.sendSMS({
          from, to, message, dlrCallback, replyCallback,
        });

      default:
        return this.burstSMSService.sendSMS({
          from, to, message, dlrCallback, replyCallback,
        });
    }
  }

  async getAvailableCountriesIso2() {
    switch (this.activeProvider) {
      case SMS_PROVIDERS.BURST_SMS:
        return this.burstSMSService.getAvailableCountriesIso2();

      default:
        return this.burstSMSService.getAvailableCountriesIso2();
    }
  }

  async getCostCountry({ codeCountry, currency = 'AUD' }) {
    switch (this.activeProvider) {
      case SMS_PROVIDERS.BURST_SMS:
        return this.burstSMSService.getCostCountry({ codeCountry, currency });

      default:
        return this.burstSMSService.getCostCountry({ codeCountry, currency });
    }
  }

  async getCostByCountries() {
    switch (this.activeProvider) {
      case SMS_PROVIDERS.BURST_SMS:
        return this.burstSMSService.getCostByCountries();

      default:
        return this.burstSMSService.getCostByCountries();
    }
  }

  async getProviderCost() {
    return this.getCostByCountries();
  }

  async createClient({
    name, contact, email, msisdn,
  }) {
    switch (this.activeProvider) {
      case SMS_PROVIDERS.BURST_SMS:
        return this.burstSMSService.createClient({
          name, contact, email, msisdn,
        });

      default:
        return this.burstSMSService.createClient({
          name, contact, email, msisdn,
        });
    }
  }

  getQuantityMessages(message) {
    switch (this.activeProvider) {
      case SMS_PROVIDERS.BURST_SMS:
        return this.burstSMSService.getQuantityMessages(message);

      default:
        return this.burstSMSService.getQuantityMessages(message);
    }
  }

  async getClient(idClient) {
    switch (this.activeProvider) {
      case SMS_PROVIDERS.BURST_SMS:
        return this.burstSMSService.getClient(idClient);

      default:
        return this.burstSMSService.getClient(idClient);
    }
  }

  async getVirtualNumbers({ skip, limit }) {
    switch (this.activeProvider) {
      case SMS_PROVIDERS.BURST_SMS:
        return this.burstSMSService.getVirtualNumbers({ skip, limit });
      default:
        return this.burstSMSService.getVirtualNumbers({ skip, limit });
    }
  }

  async buyVirtualNumber({ numberVirtual, tenant }) {
    switch (this.activeProvider) {
      case SMS_PROVIDERS.BURST_SMS:
        return this.burstSMSService.buyVirtualNumber({
          numberVirtual,
          tenant,
        });

      default:
        return this.burstSMSService.buyVirtualNumber({
          numberVirtual,
          tenant,
        });
    }
  }
}

module.exports = SmsService;
