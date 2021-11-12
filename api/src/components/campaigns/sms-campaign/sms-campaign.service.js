const schedule = require('node-schedule');
const moment = require('moment-timezone');
const CampaignDependentService = require('../../../http/services/common-campaign.service');
const repository = require('./sms-campaign.repository');
const Constructor = require('./sms-campaign.constructor');
const contactService = require('../../contacts/contact/contact.service');
const userService = require('../../user/user.service');
const tenantService = require('../../tenant/tenant.service');
const callerIdService = require('../../senders-ids/caller-id/caller-id.service');

const { referencesTaskSmsCampaigns, ngrokUrl } = require('../../../utils/common/common');
const objectSharedFunctions = require('../../shared.functions');
const campaignFunctions = require('../../../http/functions/common-campaign.functions');
const baseFunctions = require('../../../http/functions/base.functions');
const campaignConstants = require('../../../http/constants/common-campaign.constants');
const SmsService = require('../../../http/services/sms.service');

const { config } = require('../../../config');


const smsService = new SmsService({});

class SmsCampaignService extends CampaignDependentService {
  constructor() {
    super({ repository, Constructor });
    this.repository = repository;
    this.Constructor = Constructor;
  }

  async getAnalytics({ dateStart = null, dateEnd = null, tenantId }) {
    const {
      dateFormat,
      dateStartMoment,
      dateEndMoment,
      groupedBy,
    } = baseFunctions.paramsToGetAnalytics({
      dateStart,
      dateEnd,
    });
    const data = await this.repository.getCampaignAnalytics({
      dateFormat,
      dateStart: dateStartMoment,
      dateEnd: dateEndMoment,
      fields: ['inbound'],
      tenantId,
    });

    let dataFill = [];

    if (data.length > 0) {
      dataFill = baseFunctions.fillDataWithDatesEmpties({
        result: data,
        groupedBy,
        fieldsToFill: {
          bounced: 0,
          outbound: 0,
          inbound: 0,
        },
        dateStart: dateStartMoment,
        dateEnd: dateEndMoment,
      });
    }

    // console.log(`ESTA ES LA DATAFILL ${JSON.stringify(dataFill)}`);

    return {
      groupedBy,
      data: dataFill,
    };
  }

  async updateDetail({ detail, idCampaign }) {
    const queryFind = {
      _id: idCampaign,
      details: { $elemMatch: { contact: detail.contact } },
    };

    const queryUpdate = {
      $set: {
        'details.$.reasonForFailure': detail.reasonForFailure,
        'details.$.status': detail.status,
        'details.$.deliveryTime': detail.deliveryTime,
        'details.$.carrier': detail.carrier,
      },
    };

    return this.repository.updateWithoutSet({ queryFind, queryUpdate });
  }

  // eslint-disable-next-line class-methods-use-this
  async dlrCallback({
    status, mobile, datetime, userId, idCampaign, message_id, idContact,
  }) {
    const phoneInformation = {
      contact: idContact,
      to: mobile,
      reasonForFailure: '',
      deliveryTime: datetime,
      carrier: '',
    };

    const operationInc = {
      $inc: {
      },
    };

    if (status === 'delivered') {
      // phoneInformation.status = 'delivered';
      // operationInc.$inc.delivered = 1;
      phoneInformation.status = 'outbound';
    } else if (status === 'soft-bounce' || status === 'hard-bounce') {
      phoneInformation.status = 'bounced';
      operationInc.$inc.bounced = 1;
    }

    await this.updateDetail({ detail: phoneInformation, idCampaign });
    await this.repository.updateWithoutSet({
      queryFind: { _id: idCampaign }, queryUpdate: operationInc,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  setNumberMessagesInContacts(contacts) {
    return contacts.map((contact) => ({
      ...contact,
      numberMessagesSend: smsService.getQuantityMessages(contact.messageToSend),
    }));
  }

  async createScheduleCampaignSms({ idCampaign, dateStart }) {
    schedule.scheduleJob(new Date(dateStart), (async (idCamp) => {
      const smsCampaign = await this.getOne(idCamp);

      // let queryFindContacts = smsCampaign.queryFind;

      // console.log('Llego antes queryFind');

      let queryFindContacts = {
        ...objectSharedFunctions.getFiltersForQueryFind({
          filters: (smsCampaign.filters).toObject(),
          filtersMatch: smsCampaign.filtersMatch,
        }),
        tenant: smsCampaign.tenant,
        unregistered: false,
        phoneInternational: { $ne: '' },
      };

      // console.log('llego luego queryFind');

      if (parseFloat(smsCampaign.quickContacts.length) > 0) {
        queryFindContacts = await this.getQueryFindInformationContactsForQuickMessages({
          informationContacts: smsCampaign.quickContacts,
          tenant: smsCampaign.tenant,
          creator: smsCampaign.creator,
        });
      }

      const contactsCampaign = await contactService.getAll({
        queryFind: queryFindContacts,
      });
      const contactsNumber = contactsCampaign.length;
      const details = campaignFunctions.getDetailContacts(contactsCampaign);
      const updateSmsCampaign = await this.repository.updateOne(
        {
          id: idCamp,
          payload:
            {
              details,
              contacts: contactsCampaign.map((contactItem) => contactItem._id),
              contactsNumber,
            },
        },
      );
        this.sendSmsCampaignBasedOnCountries({
          tenantId: smsCampaign.tenant,
          creator: smsCampaign.creator,
          idCampaign: idCamp,
          contactsCampaign,
          senderId: smsCampaign.senderId,
          senderType: smsCampaign.senderType,
        });

    }).bind(null, idCampaign));
  }

  // eslint-disable-next-line class-methods-use-this
  getArgumentsSendSms({
    numberContact, message, idCampaign, idContact, numberSender, senderType,
  }) {
    const baseUrl = config.dev ? ngrokUrl : config.baseUrlApi;
    const argumentsSendSms = {
      to: numberContact,
      message,
      dlrCallback: `${baseUrl}/sms-campaigns/dlr-callback?idCampaign=${idCampaign}&idContact=${idContact}`,
    };

    if (senderType === 'shared') {
      // console.log('Esta entrando en numero compartido y va a colocar el replyCallback');
      argumentsSendSms.from = '';
      argumentsSendSms.replyCallback = `${baseUrl}/sms-campaigns/reply-callback?idContact=${idContact}&idCampaign=${idCampaign}`;
      // console.log(`Este es el reply callback ${argumentsSendSms.replyCallback}`);
    } else {
      argumentsSendSms.from = numberSender;
    }

    return argumentsSendSms;
  }

  async sendSmsCampaignBasedOnCountries({
    tenantId, creator, idCampaign, contactsCampaign, senderId, senderType,
  }) {

    const tenantMongoose = await tenantService.getOne(tenantId);
    const tenant = tenantMongoose.toObject();
    const clientSms = await smsService.getClient(tenant.burstSMSClientId);
    const smsServiceTenant = new SmsService({
      apiKeyBurstSMS: clientSms.apikey,
      apiSecretBurstSMS: clientSms.apisecret,
    });
    let sender;

    if (senderType !== 'shared') {
      sender = await callerIdService.getOne(senderId);
    } else {
      sender = '';
    }

    const arrayContactsFailed = [];
    const arrayContactsSend = [];

    let costToUsers = 0;
    let costOfSuppliers = 0;

    let indexContactSend = 0;

    let costMessagesSend = 0;

    const promisesContactsCountry = contactsCampaign.map(async (contact, index) => {
      try {
        const argumentsSendSms = this.getArgumentsSendSms({
          numberContact: contact.phoneInternational,
          message: contact.message,
          idCampaign,
          numberSender: sender.phoneInternational,
          senderType,
          idContact: contact._id,
        });

        // await smsServiceTenant.sendSMS(argumentsSendSms);
        indexContactSend = index;
        arrayContactsSend.push(contact._id);
      } catch (err) {
        arrayContactsFailed.push(contact._id);
        console.log(err);
      }
    });

    await Promise.all(promisesContactsCountry);


    await this.updateDetails({
      arrayContacts: arrayContactsSend,
      status: campaignConstants.CONTACTS_DETAILS.STATUS.OUTBOUND,
      idCampaign,
    });
    await this.updateDetails({
      arrayContacts: arrayContactsFailed,
      status: campaignConstants.CONTACTS_DETAILS.STATUS.BOUNCED,
      idCampaign,
    });

    const smsCampaign = await this.repository.updateOne(
      {
        id: idCampaign,
        payload: {
          status: campaignConstants.STATUS.COMPLETED,
          outbound: arrayContactsSend.length,
          bounced: arrayContactsFailed.length,
        },
      },
    );
  }

  async createOne({
    payload, queryFind, tenant, creator,
  }) {
    queryFind.phoneInternational = { $ne: '' };

    if (payload.status !== campaignConstants.STATUS.DRAFT
      && payload.deliveryType === campaignConstants.DELIVERY_TYPE.IMMEDIATELY) {
      const contactsCampaign = await contactService.getAll({ queryFind });
      const contactsNumber = contactsCampaign.length;

      const details = campaignFunctions.getDetailContacts(contactsCampaign);
      const newRecord = new this.Constructor({
        ...payload,
        // eslint-disable-next-line no-underscore-dangle
        contacts: contactsCampaign.map((contactItem) => contactItem._id),
        details,
        delivered: 0,
        contactsNumber,
        tenant,
        creator,
      });

      const campaignCreated = await this.repository.createOne(newRecord);

      await userService.updateOne({
        id: creator,
        payload: {
          'campaignsDrafts.sms': null,
        },
      });

        this.sendSmsCampaignBasedOnCountries({
          tenantId: tenant,
          creator,
          // eslint-disable-next-line no-underscore-dangle
          idCampaign: campaignCreated._id,
          contactsCampaign,
          senderId: payload.senderId,
          senderType: payload.senderType,
        });

        return campaignCreated;
    }
    // console.log('Esta llegando hasta aqui');

    const newRecord = new this.Constructor({
      ...payload,
      contacts: [],
      details: [],
      delivered: 0,
      contactsNumber: 0,
      tenant,
      creator,
    });

    const campaignCreated = await this.repository.createOne(newRecord);
    if (payload.deliveryType === campaignConstants.DELIVERY_TYPE.LATER) {
      const momentTime = moment.tz(payload.localStartDate, payload.timeZone);
      const utcStartDate = momentTime.clone().tz('Atlantic/Reykjavik');

      await this.createScheduleCampaignSms({
        // eslint-disable-next-line no-underscore-dangle
        idCampaign: campaignCreated._id,
        dateStart: utcStartDate.format(),
      });

      await userService.updateOne({
        id: creator,
        payload: {
          'campaignsDrafts.sms': null,
        },
      });
    }

    return campaignCreated;
  }

  async updateOne({ payload, queryFind, idCampaign }) {
    queryFind.phoneInternational = { $ne: '' };
    if (payload.status !== campaignConstants.STATUS.DRAFT
      && payload.deliveryType === campaignConstants.DELIVERY_TYPE.IMMEDIATELY) {
      const contactsCampaign = await contactService.getAll({ queryFind });
      const contactsNumber = contactsCampaign.length;
      const details = campaignFunctions.getDetailContacts(contactsCampaign);

      const campaignUpdated = await this.repository.updateOne({
        payload: {
          ...payload,
          details,
          contactsNumber,
        },
        id: idCampaign,
      });

      await userService.updateOne({
        id: campaignUpdated.creator,
        payload: {
          'campaignsDrafts.sms': null,
        },
      });

        this.sendSmsCampaignBasedOnCountries({
          tenantId: campaignUpdated.tenant,
          creator: campaignUpdated.creator,
          // eslint-disable-next-line no-underscore-dangle
          idCampaign: campaignUpdated._id,
          contactsCampaign,
          senderId: payload.senderId,
          senderType: payload.senderType,
        });

        return campaignUpdated;

    }

    const campaignUpdated = await this.repository.updateOne({
      payload: {
        ...payload,
        // queryFind: (payload.deliveryType === campaignConstants.DELIVERY_TYPE.LATER) ? queryFind : {},
      },
      id: idCampaign,
    });

    if (payload.deliveryType === campaignConstants.DELIVERY_TYPE.LATER) {
      await userService.updateOne({
        id: campaignUpdated.creator,
        payload: {
          'campaignsDrafts.sms': null,
        },
      });

      const momentTime = moment.tz(payload.localStartDate, payload.timeZone);
      const utcStartDate = momentTime.clone().tz('Atlantic/Reykjavik');

      await this.createScheduleCampaignSms({
        // eslint-disable-next-line no-underscore-dangle
        idCampaign: campaignUpdated._id,
        dateStart: utcStartDate.format(),
      });
    }

    return campaignUpdated;
  }
}

const singletonInstance = new SmsCampaignService();

module.exports = singletonInstance;
