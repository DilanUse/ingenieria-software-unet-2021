const axios = require('axios').default;
const { parsePhoneNumber } = require('libphonenumber-js');
const generator = require('generate-password');
const { Base64 } = require('js-base64');
const { config } = require('../../../config');
const prices = require('./prices');

const baseUrl = 'https://api.transmitsms.com';

const { ngrokUrl } = require('../../../utils/common/common');

class BurstSmsService {
  constructor({ apiKey = config.apiKeyBurstSms, apiSecret = config.apiSecretBurstSms }) {
    this.burstSMSAxiosClient = axios.create({
      baseURL: baseUrl,
    });
    const authorizationBase64String = Base64.encode(`${apiKey}:${apiSecret}`);

    console.log(`What is the authorizationBase64String ${authorizationBase64String}`);
    this.burstSMSAxiosClient.defaults.headers.common.Authorization = `Basic ${authorizationBase64String}`;
  }

  async sendSMS({
    from, to, message, dlrCallback, replyCallback,
  }) {
    const phoneNumber = parsePhoneNumber(to);

    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new Error('Phone number is invalid');
    }

    const phoneNumberToSend = `${phoneNumber.countryCallingCode}${phoneNumber.nationalNumber}`;

    let phoneNumberFromRequest = '';

    if (from !== '') {
      const phoneNumberFrom = parsePhoneNumber(from);

      if (!phoneNumberFrom || !phoneNumberFrom.isValid()) {
        throw new Error('Phone number is invalid');
      }

      phoneNumberFromRequest = `${phoneNumberFrom.countryCallingCode}${phoneNumberFrom.nationalNumber}`;
    }

    const params = {
      from: phoneNumberFromRequest,
      to: phoneNumberToSend,
      message: unescape(encodeURIComponent(message)),
      dlr_callback: dlrCallback,
      reply_callback: replyCallback,
    };

    return this.burstSMSAxiosClient.get('/send-sms.json', {
      params,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async getCostByCountries() {
    return prices;
  }

  // eslint-disable-next-line class-methods-use-this
  async getAvailableCountriesIso2() {
    return prices.map((price) => price.codeCountry);
  }

  // eslint-disable-next-line class-methods-use-this
  async getCostCountry({ codeCountry, currency }) {
    const price = prices.find((p) => p.codeCountry === codeCountry);

    if (price) {
      return price.costCountry;
    }

    return 0;
  }

  async createClient({
    name, contact, email, msisdn,
  }) {
    const password = generator.generate({
      length: 8,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
      exclude: ' ',
      strict: true,
    });

    const params = {
      name,
      contact,
      email,
      password,
      msisdn,
      client_pays: false,
    };

    const response = await this.burstSMSAxiosClient.get('/add-client.json', { params });
    return response.data.id;
  }

  // eslint-disable-next-line class-methods-use-this
  getQuantityMessages(message) {
    const unicodeCharactersRegex = /[^A-Za-z0-9 \r\n@£$¥èéùìòÇØøÅå\u0394_\u03A6\u0393\u039B\u03A9\u03A0\u03A8\u03A3\u0398\u039EÆæßÉ!"#¤%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\[~\]|€]/g;
    const specialCharactersRegex = /[\^{}\\[~\]|€]/g;
    const hasUnicodeCharacters = unicodeCharactersRegex.test(message);
    const specialCharactersArr = message.match(specialCharactersRegex);
    const specialCharactersCount = specialCharactersArr !== null ? specialCharactersArr.length : 0;
    const unicodeMessagesLimits = [268, 201, 134, 70];
    const gsmMessagesLimits = [612, 459, 306, 160];
    const messagesLimits = hasUnicodeCharacters ? unicodeMessagesLimits : gsmMessagesLimits;
    const messageLength = message.length + specialCharactersCount;
    let messageCount = 1;
    let foundLimit = false;

    messagesLimits.forEach((limit, index) => {
      if (messageLength > limit && !foundLimit) {
        messageCount = 5 - index;
        foundLimit = true;
      }
    });

    return messageCount;
  }

  async getClient(idClient) {
    let response;
    const params = {
      client_id: idClient,
    };

    try {
      response = await this.burstSMSAxiosClient.get('/get-client.json', { params });
    } catch (err) {
      console.log(err);
    }

    return response.data;
  }

  async getClientByEmail(email) {
    let resp = null;
    try {
      const respCont = await this.burstSMSAxiosClient.get('/get-clients.json');
      resp = await this.burstSMSAxiosClient.get('/get-clients.json', {
        params: {
          limit: respCont.data.clients_total,
        },
      });
    } catch (err) {
      return resp;
    }

    return resp.data.clients.find((client) => client.email === email);
  }

  async getVirtualNumbers({ filter = 'available', page, max }) {
    const params = {
      filter,
      page,
      max,
    };

    const response = await this.burstSMSAxiosClient.get('/get-numbers.json', { params });

    return response.data;
  }

  async buyVirtualNumber({ numberVirtual, tenant }) {
    const baseUrlWebhook = config.dev ? ngrokUrl : config.baseUrlApi;

    const params = {
      number: numberVirtual,
      forward_url: `${baseUrlWebhook}/virtual-numbers/inbound-message?tenant=${tenant}`,
    };

    const response = await this.burstSMSAxiosClient.post('/lease-number.json', { ...params });

    return response.data;
  }
}

module.exports = BurstSmsService;
